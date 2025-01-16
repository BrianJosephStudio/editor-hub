import { Box, Stack, Typography } from "@mui/material"
import { ClipBrowser } from "../../pages/clip-tagger/components/clip-browser/ClipBrowser"
import { ClipViewer } from "../../pages/clip-tagger/components/clip-viewer/ClipViewer"
import { TagsManager } from "../../pages/clip-tagger/components/tags-manager/TagsManager"
import { TagsDisplay } from "../../pages/clip-tagger/components/tags-display/TagsDisplay"
import { useAppContext } from "../../context/AppContext"
import { useKeybind } from "../../context/KeyBindContext"
import { useClipViewer } from "../../context/ClipViewerContext"
import { useTags } from "../../context/TagsContext"
import { useFolderNavigation } from "../../context/FolderNavigationContext"
import { Settings } from "./components/settings/Settings"

export const ClipTagger = () => {
  const { AppRoot } = useAppContext()

  const { getActiveItem, focusNextItem, focusPreviousItem, handleBackNavigation } = useFolderNavigation()
  const { videoPlayer, skipTime, targetClipName } = useClipViewer()
  const { setBlockGroupLevelListeners } = useKeybind();
  const { removeLastAddedTag } = useTags()

  return (
    <Box
      component={"div"}
      data-testid={"page:clip-tagger:root"}
      ref={AppRoot}
      tabIndex={0}
      sx={{
        display: "flex",
        width: "100vw",
        minHeight: 0,
        flexGrow: 1,
        outline: "none",
      }}

      onKeyDown={(event) => {
        const { key, altKey } = event
        if ((altKey && (key === "j" || event.key === '∆')) || key === 'ArrowDown') {
          event.stopPropagation()
          focusNextItem();
        }
        if ((altKey && (key === "k" || event.key === '˚')) || key === 'ArrouwUp') {
          event.stopPropagation()
          focusPreviousItem();
        }
        if (altKey && (key === "h" || event.key === '∫')) {
          if (!videoPlayer.current) return;
          event.stopPropagation()
          const newTime = videoPlayer.current.currentTime - (skipTime / 1000);
          videoPlayer.current.currentTime = newTime
        }
        if (altKey && (key === "l" || event.key === 'ç')) {
          if (!videoPlayer.current) return;
          event.stopPropagation()
          const newTime = videoPlayer.current.currentTime + (skipTime / 1000);
          videoPlayer.current.currentTime = newTime
        }
        if (altKey && (key === "u" || event.key === '¨')) {
          event.stopPropagation()
          removeLastAddedTag()
        }
        if (key === "Backspace") {
          event.stopPropagation()
          handleBackNavigation(1);
        }
        if (key === " ") {
          videoPlayer.current?.paused
            ? videoPlayer.current?.play()
            : videoPlayer.current?.pause();
        }
        if (key === "Escape") setBlockGroupLevelListeners(false);
        if (key === "Enter") {
          const activeItem = getActiveItem()
          if (!activeItem) return;
          activeItem.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            charCode: 13,
            bubbles: true,
            cancelable: true,
          }))
        }
      }}
    >
      <ClipBrowser></ClipBrowser>
      <Box
        sx={{
          display: "flex",
          flexDirection: 'column',
          minWidth: "0",
          flexGrow: 1
        }}
      >
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography flexGrow={'1'}>{targetClipName}</Typography>
          <Settings></Settings>
        </Stack>
        <ClipViewer></ClipViewer>
        <TagsManager></TagsManager>
      </Box>
      <TagsDisplay></TagsDisplay>
    </Box>
  )
}