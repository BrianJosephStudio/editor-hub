import { Box } from "@mui/material";
import { usePageViewer } from "../../contexts/PageViewer.context";
import { ReactElement, useState } from "react";
import { SvgIconComponent } from "@mui/icons-material";

interface TabbedPageProps {
  pageId: number;
  children: ReactElement<{
    tabName: string;
    tabIcon: SvgIconComponent;
    proportion: number
  }>[];
}

export const TabbedPage = ({ children, pageId }: TabbedPageProps) => {
  const { activePage } = usePageViewer();
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      {pageId === activePage && (
        <Box
          component={"div"}
          id={`page:video-gallery:container`}
          data-test-id={`page:video-gallery:container`}
          sx={{
            display: "grid",
            gridTemplateColumns: "2.3rem auto",
            overflow: 'hidden'
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
                title={child.props.tabName}
                onClick={() => setActiveTab(index)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: child.props.proportion,
                  placeContent: "center",
                  placeItems: "center",
                  cursor: "pointer",
                  '&:hover': {
                    backgroundColor: 'hsla(0, 0%, 100%, 0.1)'
                  }
                }}
              >
                {/* <Typography>{child.props.tabName}</Typography> */}
                <child.props.tabIcon />
              </Box>
            ))}
          </Box>
          {children[activeTab]}
        </Box>
      )}
    </>
  );
};
