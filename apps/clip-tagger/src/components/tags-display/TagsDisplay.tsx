import { Box, Typography } from "@mui/material";
import { useTags } from "../../context/TagsContext";
import { TagObject } from "../../types/tags";
import { AgentTags, GenericTags, MapTags } from "../../resources/TagSystem";
import { useEffect, useState } from "react";
import { useClipViewer } from "../../context/ClipViewerContext";
import { TagDisplayItem } from "./components/TagDisplayItem";

export const TagsDisplay = () => {
  const { tagReferenceMaster, tagDisplayList } =
    useTags();
  const { videoPlayer } = useClipViewer();
  const [exclusiveTags, setExclusiveTags] = useState<
    { tagObject: TagObject; time?: number }[]
  >([]);
  const [genericTags, setGenericTags] = useState<
    { tagObject: TagObject; time?: number }[]
  >([]);
  const [currentTimePercentage, setCurrentTimePercentage] = useState<number>(0);

  function getPlaybackPercentage(currentTime: number, duration: number) {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }

  useEffect(
    () => console.log("change", tagReferenceMaster),
    [tagReferenceMaster]
  );

  useEffect(() => {
    const newExclusiveTags: { tagObject: TagObject; time?: number }[] = [];
    const newGenericTags: { tagObject: TagObject; time?: number }[] = [];

    Object.keys(tagReferenceMaster).forEach((tagId) => {
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
          const timeArray = tagReferenceMaster[tagId];
          if (timeArray.length > 0) {
            timeArray.forEach((time) =>
              newGenericTags.push({
                tagObject: matchingTagObject,
                time,
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
  }, [tagReferenceMaster]);

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
          // backgroundColor: "red",
          width: "100%",
          // paddingBottom: '10rem',
          // flexGrow: "1",
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
              tagObject={genericTag.tagObject}
              time={genericTag.time!}
            ></TagDisplayItem>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
