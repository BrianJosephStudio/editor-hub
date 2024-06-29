import { useEffect, useRef } from "react";
import "./PathNav.css";
import backArrowIcon from "../../../../assets/double-arrow-up.svg";
import { useFolderNavigation } from "../../../../context/FolderNavigationContext";
import { Box } from "@mui/material";

export const PathNav = ({ path }: { path: string }) => {
  const pathContainer = useRef<HTMLDivElement>()
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
    if(!pathContainer.current) return 
    const lastSegment = [...pathContainer.current.children].pop()
    lastSegment?.scrollIntoView()
  }, [pathSegments])

  return (
    <div className="pathNavContainer">
      <div className="backButton" onClick={() => handleBackNavigation(1)}>
        <img
          style={{
            maxWidth: "35%",
          }}
          src={backArrowIcon}
          alt=""
        />
      </div>
      <Box ref={pathContainer} className="segmentsContainer">
        <div
          className="segment pathSegment"
          onClick={() => {
            setCurrentFolder("/");
            setPathSegments([]);
          }}
        >
          Clips
        </div>
        {pathSegments.length > 0 ? (
          pathSegments.map((pathSegment, index) => (
            <div style={{display: 'flex'}} key={index}>
              <div className="segment"> / </div>
              <div
                className="segment pathSegment"
                onClick={() => {
                  handleBackNavigation(pathSegments.length - index - 1);
                }}
              >
                {pathSegment}
              </div>
            </div>
          ))
        ) : (
          <div className="segment"> / </div>
        )}
      </Box>
    </div>
  );
};
