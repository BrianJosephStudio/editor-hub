import { Box, Typography } from "@mui/material";
import { useTags } from "../../context/TagsContext";
import { TagObject } from "../../types/tags";
import { AgentTags, GenericTags, MapTags } from "../../resources/TagSystem";
import { useEffect, useState } from "react";
import { useClipViewer } from "../../context/ClipViewerContext";
import { TagDisplayItem } from "./components/TagDisplayItem";
import { labelTagReference } from "../../util/tagInstanceId";

export const TagsDisplay = () => {
  const { tagReferenceMaster, tagDisplayList, tagReferenceLabeled, setTagReferenceLabeled } =
    useTags();
  const { videoPlayer } = useClipViewer();
  const [exclusiveTags, setExclusiveTags] = useState<
    { tagObject: TagObject; time?: number }[]
  >([]);
  const [genericTags, setGenericTags] = useState<
    { tagObject: TagObject; time?: number, instanceId: string }[]
  >([]);
  const [currentTimePercentage, setCurrentTimePercentage] = useState<number>(0);

  function getPlaybackPercentage(currentTime: number, duration: number) {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }

  useEffect(() => {
    const newLabeledTagReference = labelTagReference(tagReferenceMaster)
    setTagReferenceLabeled(newLabeledTagReference)
  },
    [tagReferenceMaster]
  );

  useEffect(() => {
    const newExclusiveTags: { tagObject: TagObject; time?: number }[] = [];
    const newGenericTags: { tagObject: TagObject; time?: number, instanceId: string }[] = [];

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
                instanceId: timeEntry.instanceId
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ backgroundColor: "blue" }}>
        {exclusiveTags.map((exclusiveTag) => (
          <Box>
            <Typography>{exclusiveTag.tagObject.displayName}</Typography>
          </Box>
        ))}
      </Box>
      <Box
        component={"div"}
        sx={{
          position: "relative",
          width: "100%",
          height: '90%',
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
        <Box ref={tagDisplayList}>
          {genericTags.map((genericTag, index) => (
            <TagDisplayItem
              index={index}
              instanceId={genericTag.instanceId}
              tagObject={genericTag.tagObject}
              time={genericTag.time!}
            ></TagDisplayItem>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
