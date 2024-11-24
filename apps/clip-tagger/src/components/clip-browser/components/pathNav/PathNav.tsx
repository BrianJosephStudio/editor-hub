import { useEffect, useRef } from "react";
import "./PathNav.css";
import backArrowIcon from "../../../../assets/double-arrow-up.svg";
import { useFolderNavigation } from "../../../../context/FolderNavigationContext";
import { Box } from "@mui/material";
import { ArrowBackIos, ArrowBackIosNew } from "@mui/icons-material";

export const PathNav = ({ path }: { path: string }) => {
  const pathContainer = useRef<HTMLDivElement>();
  const {
    handleBackNavigation,
    pathSegments,
    setPathSegments,
    setCurrentFolder,
  } = useFolderNavigation();

  useEffect(() => {
    const segmentedPaths = path
      .split("/")
      .filter((folderName) => folderName !== "");
    setPathSegments(segmentedPaths);
  }, [path]);

  useEffect(() => {
    if (!pathContainer.current) return;
    const lastSegment = [...pathContainer.current.children].pop();
    lastSegment?.scrollIntoView();
  }, [pathSegments]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        alignItems: "center",
        justifyContent: "start",
        width: "100%",
        height: "3rem",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          cursor: "pointer",
          margin: "0",
          height: "100%",
          '&:hover': {
            backgroundColor: 'hsl(0, 0%, 40%)',
          }
        }}
        onClick={() => handleBackNavigation(1)}
      >
        <ArrowBackIosNew sx={{ maxHeight: "1.3rem" }} />
      </Box>
      <Box ref={pathContainer} className="segmentsContainer">
        <Box
          className="segment pathSegment"
          onClick={() => {
            setCurrentFolder("/");
            setPathSegments([]);
          }}
        >
          Clips
        </Box>
        {pathSegments.length > 0 ? (
          pathSegments.map((pathSegment, index) => (
            <Box style={{ display: "flex" }} key={index}>
              <Box className="segment"> / </Box>
              <Box
                className="segment pathSegment"
                onClick={() => {
                  handleBackNavigation(pathSegments.length - index - 1);
                }}
              >
                {pathSegment}
              </Box>
            </Box>
          ))
        ) : (
          <Box className="segment"> / </Box>
        )}
      </Box>
    </Box>
  );
};
