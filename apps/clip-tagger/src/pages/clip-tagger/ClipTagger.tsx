import { Box } from "@mui/material"
import { ClipBrowser } from "../../pages/clip-tagger/components/clip-browser/ClipBrowser"
import { ClipViewer } from "../../pages/clip-tagger/components/clip-viewer/ClipViewer"
import { TagsManager } from "../../pages/clip-tagger/components/tags-manager/TagsManager"
import { TagsDisplay } from "../../pages/clip-tagger/components/tags-display/TagsDisplay"
import { useAppContext } from "../../context/AppContext"
import { useKeybind } from "../../context/KeyBindContext"
import { useClipViewer } from "../../context/ClipViewerContext"
import { TagsProvider } from "../../context/TagsContext"
import { useFolderNavigation } from "../../context/FolderNavigationContext"
import { Settings } from "./components/settings/Settings"
export const ClipTagger = () => {
	const { AppRoot } = useAppContext()

	const { focusNextItem, focusPreviousItem, handleBackNavigation } = useFolderNavigation()
	const { videoPlayer, skipTime } = useClipViewer()
	const { setBlockGroupLevelListeners } = useKeybind();

	return (
		<TagsProvider>
			<Box
				component={"div"}
				ref={AppRoot}
				tabIndex={0}
				sx={{
					margin: "0",
					padding: "0",
					display: "grid",
					gridTemplateColumns: "2fr 8fr 3fr",
					width: "100vw",
					// height: "96vh",
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
					if (key === "Backspace") {
						event.stopPropagation()
						handleBackNavigation(1);
					}
					if (key === " ") {
						videoPlayer.current?.paused
							? videoPlayer.current?.play()
							: videoPlayer.current?.pause();
					}
					if (key === "Escape") {
						setBlockGroupLevelListeners(false)
					}
				}}
			>
				<ClipBrowser></ClipBrowser>
				<Box
					sx={{
						display: "grid",
						gridTemplateRows: "6fr 3fr",
						gridTemplateColumns: "100%",
						minHeight: "0",
						minWidth: "0",
					}}
				>
					<ClipViewer></ClipViewer>
					<TagsManager></TagsManager>
				</Box>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column'
				}}>
					<TagsDisplay></TagsDisplay>
					<Settings></Settings>
				</Box>
			</Box>
		</TagsProvider>
	)
}