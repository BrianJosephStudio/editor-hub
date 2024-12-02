import { Box } from "@mui/material";
import { usePageViewer } from "../../contexts/PageViewer.context";
import { ReactElement, useEffect, useState } from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { useVideoGallery } from "../../contexts/VideoGallery.context";

interface TabbedPageProps {
  pageId: number;
  children: ReactElement<{
    tabName: string;
    tabIcon: SvgIconComponent;
    proportion: number;
  }>[];
}

export const TabbedPage = ({ children, pageId }: TabbedPageProps) => {
  const { activePage } = usePageViewer();
  const { videoPlayer } = useVideoGallery();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    videoPlayer.current?.pause();
  }, [activePage]);
  return (
    <Box
      component={"div"}
      id={`page:video-gallery:container`}
      data-testid={`page:video-gallery:container`}
      sx={{
        visibility: activePage === pageId ? "visible" : "hidden",
        display: "grid",
        gridTemplateColumns: "2.3rem auto",
        overflow: "hidden",
      }}
    >
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {children.map((child, index) => (
          <Box
            key={index}
            component={"div"}
            id={`tabbed-page:tab:container:${child.props.tabName.toLowerCase()}`}
            data-testid={`tabbed-page:tab:container:${child.props.tabName.toLowerCase()}`}
            title={child.props.tabName}
            onClick={() => setActiveTab(index)}
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: child.props.proportion,
              placeContent: "center",
              placeItems: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "hsla(0, 0%, 100%, 0.1)",
              },
            }}
          >
            {/* <Typography>{child.props.tabName}</Typography> */}
            <child.props.tabIcon />
          </Box>
        ))}
      </Box>
      {children[activeTab]}
    </Box>
  );
};
