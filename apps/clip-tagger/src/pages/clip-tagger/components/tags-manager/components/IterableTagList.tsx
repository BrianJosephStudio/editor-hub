import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAppContext } from "../../../../../context/AppContext.tsx";
import { useKeybind } from "../../../../../context/KeyBindContext.tsx";
import { AgentTags, IterableTagListId, MapTags } from "@editor-hub/tag-system";

export const IterableTagList = ({
  gridColumn,
  gridRow,
  iterableTagListId,
}: {
  gridColumn: string;
  gridRow: string;
  iterableTagListId: IterableTagListId;
}) => {
  const [scrollPosition, setScrollPosition] = useState<number>(-3);
  const [listContainerheight, setListContainerHeight] = useState<number>(0);
  const [listItemheight, setListItemHeight] = useState<number>(0);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const { AppRoot } = useAppContext();
  const { targetIterableTagList, iterableTagListModifier } = useKeybind();
  const visibleItemsCount = 7;

  const setPreviousIterableTag = useRef((event: KeyboardEvent) => {
    if (event.key === "k") {
      setScrollPosition((currentPosition) => {
        const nextValue = currentPosition - 1;
        if (nextValue < -6) return 16;
        return nextValue;
      });
    }
  });

  const setNextIterableTag = useRef((event: KeyboardEvent) => {
    const tagList = iterableTagListId === "agent" ? AgentTags : MapTags;
    if (event.key === "j") {
      setScrollPosition((currentPosition) => {
        const nextValue = currentPosition + 1;
        if (nextValue > tagList.length - 1) return 0;
        return nextValue;
      });
    }
  });

  const calculateItemTopPosition = (index: number) => {
    const tagList = iterableTagListId === "agent" ? AgentTags : MapTags;
    let adjustment = listItemheight * tagList.length;
    const currentPosition =
      listItemheight * index + listItemheight * -scrollPosition;
    if (currentPosition < 0) {
      return currentPosition + adjustment;
    }
    if (currentPosition >= listItemheight * visibleItemsCount) {
      return currentPosition - adjustment;
    }
    return currentPosition;
  };

  const isVisible = (index: number): boolean => {
    const topPosition = calculateItemTopPosition(index)
    return topPosition >= 0 - 20 && topPosition < listContainerheight
  }

  useEffect(() => {
    if (!AppRoot || !AppRoot.current) return;

    if (
      targetIterableTagList === iterableTagListId &&
      iterableTagListModifier
    ) {
      AppRoot.current.addEventListener(
        "keydown",
        setPreviousIterableTag.current
      );

      AppRoot.current.addEventListener("keydown", setNextIterableTag.current);
    } else {
      AppRoot.current.removeEventListener(
        "keydown",
        setPreviousIterableTag.current
      );

      AppRoot.current.removeEventListener(
        "keydown",
        setNextIterableTag.current
      );
    }
  }, [targetIterableTagList, iterableTagListModifier]);

  useEffect(() => {
    if (!listContainerRef || !listContainerRef.current) return;
    setListContainerHeight(listContainerRef.current.clientHeight);
  });

  useEffect(() => {
    if (!listContainerRef || !listContainerRef.current) return;
    setListItemHeight(listContainerheight / visibleItemsCount);
  }, [listContainerheight]);

  return (
    <Box
      ref={listContainerRef}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gridColumn: gridColumn,
        gridRow: gridRow,
        backgroundColor: "hsl(0,0%,20%)",
        overflow: "hidden",
      }}
    >
      {(iterableTagListId === "agent" ? AgentTags : MapTags).map(
        (agentTag, index) => (
          <Box
            sx={{
              position: "absolute",
              left: "0",
              top: `${calculateItemTopPosition(index)}px`,
              width: "100%",
              alignSelf: "center",
              minHeight: "6rem",
              placeContent: "center",
              height: `${listContainerheight / visibleItemsCount}px`,
              opacity: isVisible(index) ? '1' : '0',
              transition: 'top 0.1s, opacity 0s'
            }}
          >
            <Typography fontSize={"1.2rem"} fontWeight={"600"}>
              {agentTag.displayName}
            </Typography>
          </Box>
        )
      )}
      <Box
        sx={{
          position: "absolute",
          height: `${listItemheight}px`,
          width: "100%",
          border: "solid hsl(0, 0%, 40%) 2px",
          borderRadius: "1rem",
          top: `${listItemheight * 3}px`,
        }}
      ></Box>
      {iterableTagListId === targetIterableTagList && (
        <Box
          sx={{
            position: "absolute",
            height: `${listItemheight}px`,
            width: "100%",
            border: "solid hsl(0, 0%, 90%) 2px",
            borderRadius: "1rem",
            top: `${listItemheight * 3}px`,
          }}
        ></Box>
      )}
    </Box>
  );
};
