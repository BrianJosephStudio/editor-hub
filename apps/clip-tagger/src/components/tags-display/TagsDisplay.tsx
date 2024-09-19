import { Box, Button, Input, Typography } from "@mui/material";
import { useTags } from "../../context/TagsContext";
import { TagObject } from "../../types/tags";
import { AgentTags, GenericTags, MapTags } from "../../resources/TagSystem";
import { useEffect, useState } from "react";
import { useClipViewer } from "../../context/ClipViewerContext";
import { TagDisplayItem } from "./components/TagDisplayItem";
import { labelTagReference } from "../../util/tagInstanceId";
import { ApiClient } from "../../api/ApiClient";
import Cookies from "js-cookie";

export const TagsDisplay = () => {
  const {
    tagReferenceMaster,
    tagDisplayList,
    tagReferenceLabeled,
    setTagReferenceLabeled,
    setTagReferenceMaster,
    tagOffset,
    setTagOffset,
    removeTag
  } = useTags();
  const { videoPlayer, pauseOnInput, setPauseOnInput, targetClip } =
    useClipViewer();
  const [exclusiveTags, setExclusiveTags] = useState<
    { tagObject: TagObject; time?: number }[]
  >([]);
  const [genericTags, setGenericTags] = useState<
    { tagObject: TagObject; time?: number; instanceId: string }[]
  >([]);
  const [currentTimePercentage, setCurrentTimePercentage] = useState<number>(0);
  const [hoverHeightPercentage, setHoverHeightPercentage] = useState<number>(0);
  const [playheadHoverVisible, setPlayheadHoverVisible] =
  useState<boolean>(false);

  function getPlaybackPercentage(currentTime: number, duration: number) {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }

  useEffect(() => {
    console.log("haciendo labels en master")
    const newLabeledTagReference = labelTagReference(tagReferenceMaster);
    setTagReferenceLabeled(newLabeledTagReference);
  }, [tagReferenceMaster]);

  useEffect(() => {
    console.log("labels changed!")
    const newExclusiveTags: { tagObject: TagObject; time?: number }[] = [];
    const newGenericTags: {
      tagObject: TagObject;
      time?: number;
      instanceId: string;
    }[] = [];

    Object.keys(tagReferenceLabeled).forEach((tagId) => {
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
          const timeArray = tagReferenceLabeled[tagId];
          if (timeArray.length > 0) {
            timeArray.forEach((timeEntry) =>
              newGenericTags.push({
                tagObject: matchingTagObject,
                time: timeEntry.time,
                instanceId: timeEntry.instanceId,
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
    setExclusiveTags(newExclusiveTags);
    setGenericTags(newGenericTags);
  }, [tagReferenceLabeled]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!videoPlayer.current) return;
      const currentTime = videoPlayer.current.currentTime;
      const duration = videoPlayer.current.duration;
      setCurrentTimePercentage(getPlaybackPercentage(currentTime, duration));
    };

    if (videoPlayer.current) {
      videoPlayer.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoPlayer.current) {
        videoPlayer.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  useEffect(() => {
    Cookies.set("pauseOnInput", pauseOnInput.toString());
  }, [pauseOnInput]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          backgroundColor: "hsl(0, 0%, 40%)",
          display: "flex",
          gap: "0.2rem",
          padding: "0.3rem",
          flexWrap: "wrap",
          placeContent: "center",
          minHeight: '6rem'
        }}
      >
        {exclusiveTags.map((exclusiveTag) => (
          <Box
            sx={{
              display: "flex",
              placeContent: "center",
              cursor: exclusiveTag.tagObject.protected ? "default" : "pointer",
              backgroundColor: "black",
              minWidth: "0",
              padding: "0.3rem 0.8rem",
              borderRadius: "1rem",
            }}
            onClick={async (event) => {
              event.stopPropagation();
              if (exclusiveTag.tagObject.protected) return;

              removeTag(exclusiveTag.tagObject)
            }}
          >
            <Typography>{exclusiveTag.tagObject.displayName}</Typography>
          </Box>
        ))}
      </Box>
      <Box
        component={"div"}
        sx={{
          position: "relative",
          width: "100%",
          flexGrow: "1",
          // height: '90%',
          // cursor: "pointer",
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
        <Box ref={tagDisplayList}>
          {genericTags.map((genericTag, index) => (
            <TagDisplayItem
              index={index}
              instanceId={genericTag.instanceId}
              tagObject={genericTag.tagObject}
              time={genericTag.time!}
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
            ></TagDisplayItem>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "hsl(0, 0%, 30%)",
          display: "flex",
          justifyContent: "space-evenly",
          height: "4rem",
          gap: '3rem'
        }}
      >
        <Button
          sx={{
            flexGrow: 1,
            stroke: "none",
            "&:focus": {
              outline: "none",
            },
            "&:active": {
              outline: "none",
            },
          }}
          variant={"contained"}
          color={pauseOnInput ? "success" : "primary"}
          onClick={() => {
            setPauseOnInput((currentValue) => !currentValue);
          }}
        >
          Pause on Input
        </Button>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Typography>Tag Offset ms</Typography>
          <Input type="number"
          sx={{
            color: 'white',
            textAlign: 'center',
          }}
          value={tagOffset}
          onChange={(event) => {
            const inputValue = event.target.value
            const inputValueNumber = parseInt(inputValue)
            if(isNaN(inputValueNumber)) throw new Error("Input is NaN")
            setTagOffset(Math.max(0, inputValueNumber))
          }}
          />
        </Box>
      </Box>
    </Box>
  );
};
