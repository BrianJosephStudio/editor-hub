import { Box } from "@mui/material";
import { GenericTags } from "../../resources/TagSystem.ts";
import { useEffect, useRef } from "react";
import { TagsGroup } from "./components/TagsGroup";
import { IterableTagList } from "./components/IterableTagList.tsx";
import { useKeybind } from "../../context/KeyBindContext.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { useClipViewer } from "../../context/ClipViewerContext.tsx";
import { ApiClient } from "../../api/ApiClient.ts";
import { useTags } from "../../context/TagsContext.tsx";

export const TagsManager = () => {
  const { AppRoot } = useAppContext();
  const { targetClip } = useClipViewer();
  const {
    blockGroupLevelListeners,
    setTargetIterableTagList,
    setIterableTagListModifier,
  } = useKeybind();

  const {
    tagReferenceMaster,
    setTagReferenceMaster,
  } = useTags();

  const switchIterableTagList = () =>
    setTargetIterableTagList((targetIterableTagList) =>
      targetIterableTagList === "agent" ? "map" : "agent"
    );

  const switchIterableTagListEventListener = useRef((event: KeyboardEvent) => {
    if (event.key === "m") {
      console.log("switching!");
      switchIterableTagList();
    }
  });

  const modifierKeyDownEventListener = (event: KeyboardEvent) => {
    if (event.key === "v" && !blockGroupLevelListeners) {
      console.log("modifier in");
      setIterableTagListModifier(true);
      addSwitchIterableTagListEventListener();
    }
  };
  const modifierKeyUpEventListener = (event: KeyboardEvent) => {
    if (event.key === "v" && !blockGroupLevelListeners) {
      console.log("modifier out");
      setIterableTagListModifier(false);
      removeSwitchIterableTagListEventListener();
    }
  };

  const addSwitchIterableTagListEventListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.addEventListener(
      "keydown",
      switchIterableTagListEventListener.current
    );
  };

  const removeSwitchIterableTagListEventListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.removeEventListener(
      "keydown",
      switchIterableTagListEventListener.current
    );
  };

  const addModifierEventListeners = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.addEventListener("keydown", modifierKeyDownEventListener);
    AppRoot.current.addEventListener("keyup", modifierKeyUpEventListener);
  };

  useEffect(() => {
    addModifierEventListeners();
  }, []);

  useEffect(() => {
    const getMetadata = async () => {
      const apiClient = new ApiClient();
      const updatedTagReference = await apiClient.getMetadata(targetClip);
      setTagReferenceMaster(updatedTagReference)
    };
    getMetadata();
  }, [targetClip]);

  return (
    <>
      <Box
        sx={{
          display: blockGroupLevelListeners ? "flex" : "grid",
          gridGap: " 0.6rem",
          gridTemplateRows: "repeat(2, 1fr)",
          gridTemplateColumns: "repeat(6, 1fr)",
          padding: "0.6rem",
        }}
      >
        {Object.keys(GenericTags).map((groupName, index) => (
          <TagsGroup
            tagsGroup={GenericTags[groupName]}
            groupName={groupName}
            key={index}
          ></TagsGroup>
        ))}
      </Box>

      {/* <IterableTagList
        gridColumn="4/5"
        gridRow="1/2"
        iterableTagListId={"agent"}
      ></IterableTagList>

      <IterableTagList
        gridColumn="5/6"
        gridRow="1/2"
        iterableTagListId={"map"}
      ></IterableTagList> */}
    </>
  );
};
