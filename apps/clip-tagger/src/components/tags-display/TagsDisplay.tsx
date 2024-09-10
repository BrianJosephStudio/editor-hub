import { Box, Typography } from "@mui/material";
import { useTags } from "../../context/TagsContext";
import { TagObject, TagReference } from "../../types/tags";
import { AgentTags, GenericTags, MapTags } from "../../resources/TagSystem";
import { useEffect, useState } from "react";
import { useClipViewer } from "../../context/ClipViewerContext";

export const TagsDisplay = () => {
  const { tagReferenceMaster, setTagReferenceMaster } = useTags();
  const { videoPlayer } = useClipViewer();
  const [exclusiveTags, setExclusiveTags] = useState<
    { tagObject: TagObject; timeData: number[] }[]
  >([]);
  const [genericTags, setGenericTags] = useState<
    { tagObject: TagObject; timeData: number[] }[]
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
    console.log(videoPlayer.current!.duration);
    console.log(videoPlayer.current!.currentTime);
    const newExclusiveTags: { tagObject: TagObject; timeData: number[] }[] = [];
    const newGenericTags: { tagObject: TagObject; timeData: number[] }[] = [];

    Object.keys(tagReferenceMaster).forEach((tagId) => {
      const mapTagObject = MapTags.find((mapTag) => mapTag.id === tagId);
      if (mapTagObject)
        return newExclusiveTags.push({
          tagObject: mapTagObject,
          timeData: tagReferenceMaster[tagId],
        });

      const agentTagObject = AgentTags.find(
        (agentTag) => agentTag.id === tagId
      );
      if (agentTagObject)
        return newExclusiveTags.push({
          tagObject: agentTagObject,
          timeData: tagReferenceMaster[tagId],
        });

      Object.values(GenericTags).find((tagGroup) => {
        const matchingTagObject = tagGroup.tags.find(
          (genericTag) => genericTag.id === tagId
        );

        if (matchingTagObject) {
          newGenericTags.push({
            tagObject: matchingTagObject,
            timeData: tagReferenceMaster[tagId],
          });
          return true;
        }
        return false;
      });
    });

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
        sx={{
          position: "relative",
          // backgroundColor: "red",
          width: "100%",
          flexGrow: "1",
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
        {genericTags.map((genericTag) =>
          genericTag.timeData.map((time) => (
            <Box sx={{ position: "absolute", top: `${getPlaybackPercentage(time, videoPlayer.current!.duration)}%`, left: `${getPlaybackPercentage(time, videoPlayer.current!.duration)}%` }}>
              <Typography>{genericTag.tagObject.displayName}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
