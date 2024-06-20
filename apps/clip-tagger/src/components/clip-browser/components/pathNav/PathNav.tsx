import { useEffect, useState } from "react";
import "./PathNav.css";
import backArrowIcon from "../../../../assets/double-arrow-up.svg";
import { useFolderNavigation } from "../../../../context/FolderNavigationContext";

export const PathNav = ({ path }: { path: string }) => {
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
      <div className="segmentsContainer">
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
            <>
              <div className="segment"> / </div>
              <div
                className="segment pathSegment"
                onClick={() => {
                  handleBackNavigation(pathSegments.length - index - 1);
                }}
              >
                {pathSegment}
              </div>
            </>
          ))
        ) : (
          <div className="segment"> / </div>
        )}
      </div>
    </div>
  );
};
