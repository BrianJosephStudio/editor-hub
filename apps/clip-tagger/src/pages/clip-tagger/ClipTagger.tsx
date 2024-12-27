import { Box } from "@mui/material"
import { ClipBrowser } from "../../pages/clip-tagger/components/clip-browser/ClipBrowser"
import { ClipViewer } from "../../pages/clip-tagger/components/clip-viewer/ClipViewer"
import { TagsManager } from "../../pages/clip-tagger/components/tags-manager/TagsManager"
import { TagsDisplay } from "../../pages/clip-tagger/components/tags-display/TagsDisplay"
import { useAppContext } from "../../context/AppContext"
import { KeybindProvider } from "../../context/KeyBindContext"
import { ClipViewerProvider } from "../../context/ClipViewerContext"
import { TagsProvider } from "../../context/TagsContext"
import { FolderNavigationProvider } from "../../context/FolderNavigationContext"
export const ClipTagger = () => {
	const { AppRoot } = useAppContext()
	const urlParams = new URLSearchParams(window.location.search);
	const currentPath = urlParams.get("path");

	return (
		<KeybindProvider>
			<ClipViewerProvider>
				<TagsProvider>
					<FolderNavigationProvider currentPath={currentPath ?? ""}>
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
								height: "96vh",
								outline: "none",
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
							<TagsDisplay></TagsDisplay>
						</Box>
					</FolderNavigationProvider>
				</TagsProvider>
			</ClipViewerProvider>
		</KeybindProvider>
	)
}