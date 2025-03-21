import { Box, Button, Dialog, DialogActions, DialogTitle, Typography } from "@mui/material";
import { useTags } from "../../../../context/TagsContext";
import { useEffect, useRef, useState } from "react";
import { useClipViewer } from "../../../../context/ClipViewerContext";
import { TagDisplayItem } from "./components/TagDisplayItem";
import Cookies from "js-cookie";
import { AgentTags, ExclusiveTags, GenericTag, GenericTags, MapTags } from "@editor-hub/tag-system";

export const TagsDisplay = () => {
  const {
    tagDisplayList,
    labeledTagReference,
    setLabeledTagReference,
    tagOffset,
    removeTag,
    resetTags,
    setStarterTags
  } = useTags();
  const { videoPlayer, pauseOnInput, targetClip } = useClipViewer();
  const [exclusiveTags, setExclusiveTags] = useState<ExclusiveTags[]>([]);
  const [genericTags, setGenericTags] = useState<GenericTag[]>([]);
  const [currentTimePercentage, setCurrentTimePercentage] = useState<number>(0);
  const [hoverHeightPercentage, setHoverHeightPercentage] = useState<number>(0);
  const [playheadHoverVisible, setPlayheadHoverVisible] = useState<boolean>(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const genericTagsContainer = useRef<HTMLDivElement | null>(null);

  function getPlaybackPercentage(currentTime: number, duration: number) {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }

  const resetAllTagsHandler = async () => {
    setDialogOpen(false)
    setLabeledTagReference({})
    await resetTags(targetClip)
    await setStarterTags()
  }

  const resetBaseTagsHandler = async () => {
    setDialogOpen(false)
    await setStarterTags()
  }

  useEffect(() => setIsVideoReady(false), [targetClip])

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!videoPlayer.current) return;
      const currentTime = videoPlayer.current.currentTime;
      const duration = videoPlayer.current.duration;
      setCurrentTimePercentage(getPlaybackPercentage(currentTime, duration));
    };

    const handleLoadedMetadata = () => {
      setIsVideoReady(true);
    };

    if (videoPlayer.current) {
      videoPlayer.current.addEventListener("timeupdate", handleTimeUpdate);
      videoPlayer.current.addEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    }

    return () => {
      if (videoPlayer.current) {
        videoPlayer.current.removeEventListener("timeupdate", handleTimeUpdate);
        videoPlayer.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!isVideoReady) return;
    const newExclusiveTags: ExclusiveTags[] = [];
    const newGenericTags: GenericTag[] = [];

    Object.keys(labeledTagReference).forEach((tagId) => {
      const mapTagObject = MapTags.find((mapTag) => mapTag.id === tagId);
      if (mapTagObject)
        return newExclusiveTags.push({
          tagObject: mapTagObject,
        });

      const agentTagObject = AgentTags.find(
        (agentTag) => agentTag.id === tagId
      );
      if (agentTagObject)
        return newExclusiveTags.push({
          tagObject: agentTagObject,
        });

      Object.values(GenericTags).find((tagGroup) => {
        const matchingTagObject = tagGroup.tags.find(
          (genericTag) => genericTag.id === tagId
        );
        if (matchingTagObject) {
          const timeArray = labeledTagReference[tagId];
          if (timeArray.length > 0) {
            timeArray.forEach((timeEntry) =>
              newGenericTags.push({
                tagObject: matchingTagObject,
                time: timeEntry.time,
                instanceId: timeEntry.instanceId,
                top: 0,
                left: 6,
              })
            );
          } else {
            newExclusiveTags.push({
              tagObject: matchingTagObject,
            });
          }
          return true;
        }
        return false;
      });
    });

    newGenericTags.sort((a, b) => a.time! - b.time!);

    newGenericTags.forEach((genericTag, index) => {
      if (!videoPlayer.current) return;
      if (!genericTagsContainer.current) throw new Error("State not allowed");
      if (genericTag.time === null || genericTag.time === undefined)
        throw new Error("Missing mandatory property 'time' in genericTag");

      const currentVideoDuration = videoPlayer.current.duration;
      const multiplier = genericTag.time / currentVideoDuration;

      const genericTagsContainerRect =
        genericTagsContainer.current?.getBoundingClientRect();
      const containerHeight = genericTagsContainerRect.height;

      const top = containerHeight * multiplier;
      genericTag.top = Number.parseInt(top.toFixed(0));

      const previousEntry = newGenericTags[index - 1];

      if (previousEntry) {
        const intersectionThreslhold = 30;
        if (top < previousEntry.top + intersectionThreslhold) {
          genericTag.left =
            previousEntry.left +
            32 +
            10 * previousEntry.tagObject.displayName.length;
        }
      }
    });

    setExclusiveTags(newExclusiveTags);
    setGenericTags(newGenericTags);
  }, [labeledTagReference, isVideoReady]);

  useEffect(() => {
    Cookies.set("pauseOnInput", pauseOnInput.toString());
  }, [pauseOnInput]);

  useEffect(() => {
    Cookies.set("tagOffset", tagOffset as string);
  }, [tagOffset]);

  return (
    <>
      <Dialog open={dialogOpen}>
        <DialogTitle>Are you sure you want to reset tags for this clip?</DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={resetAllTagsHandler}>Reset All</Button>
          <Button variant="contained" onClick={resetBaseTagsHandler}>Reset Base Tags Only</Button>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: '24rem'
        }}
      >
        <Box
          component={"div"}
          id="exclusive-tags-container"
          sx={{
            backgroundColor: "hsl(0, 0%, 40%)",
            display: "flex",
            gap: "0.2rem",
            padding: "0.3rem",
            flexWrap: "wrap",
            placeContent: "center",
            minHeight: "6rem",
          }}
        >
          {exclusiveTags.map((exclusiveTag, index) => (
            <Box
              key={index}
              component={"div"}
              title="remove"
              sx={{
                display: "flex",
                placeContent: "center",
                cursor: exclusiveTag.tagObject.protected ? "default" : "pointer",
                backgroundColor: "black",
                minWidth: "0",
                padding: "0.3rem 0.8rem",
                borderRadius: "1rem",
                "&:hover": {
                  backgroundColor: exclusiveTag.tagObject.protected
                    ? "black"
                    : "#a33643",
                },
              }}
              onClick={async (event) => {
                event.stopPropagation();
                if (exclusiveTag.tagObject.protected) return;

                removeTag(exclusiveTag.tagObject);
              }}
            >
              <Typography>{exclusiveTag.tagObject.displayName}</Typography>
            </Box>
          ))}
        </Box>
        <Box
          component={"div"}
          id="generic-tags-container"
          ref={genericTagsContainer}
          sx={{
            position: "relative",
            width: "100%",
            flexGrow: "1",
          }}
          onMouseMove={(event) => {
            const divElement = event.currentTarget;
            const { top, height } = divElement.getBoundingClientRect();
            const mouseY = event.clientY;

            setHoverHeightPercentage(((mouseY - top) / height) * 100);
          }}
          onMouseEnter={() => setPlayheadHoverVisible(true)}
          onMouseLeave={() => setPlayheadHoverVisible(false)}
          onClick={(event) => {
            const divElement = event.currentTarget;
            const { top, height } = divElement.getBoundingClientRect();
            const clickY = event.clientY;

            const clickPositionPercentage = ((clickY - top) / height) * 100;

            const videoElement = videoPlayer.current;

            if (videoElement && videoElement.duration) {
              const newTime =
                (clickPositionPercentage / 100) * videoElement.duration;
              videoElement.currentTime = newTime;

              console.log(
                `Playhead set to ${newTime.toFixed(2)} seconds of the video.`
              );
            }
          }}
        >
          <Box
            id="playhead"
            component={"div"}
            sx={{
              position: "absolute",
              backgroundColor: "hsl(180, 0%, 30%)",
              width: "100%",
              height: `${currentTimePercentage}%`,
            }}
          ></Box>
          <Box
            id="playhead-hover"
            component={"div"}
            sx={{
              opacity: !!playheadHoverVisible ? 0.5 : 0,
              position: "absolute",
              backgroundColor: "hsl(180, 0%, 40%)",
              width: "100%",
              height: `${hoverHeightPercentage}%`,
            }}
          ></Box>
          <Box
            component={"div"}
            id="tag-display-list"
            ref={tagDisplayList}
            height={"100%"}
          >
            {genericTags.map((genericTag, index) => (
              <TagDisplayItem
                key={index}
                index={index}
                instanceId={genericTag.instanceId}
                tagObject={genericTag.tagObject}
                time={genericTag.time!}
                top={genericTag.top}
                left={genericTag.left}
                mouseEnterCallback={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setPlayheadHoverVisible(false);
                }}
                mouseLeaveCallback={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setPlayheadHoverVisible(true);
                }}
              />
            ))}
          </Box>
        </Box>
        <Button onClick={() => setDialogOpen(true)}>Reset Tags</Button>
      </Box>
    </>
  );
};
