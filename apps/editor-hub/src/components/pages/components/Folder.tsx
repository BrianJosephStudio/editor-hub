import { Box, Typography } from "@mui/material";
import { FileTreeNode } from "../../../types/app";
import { useState } from "react";
import { Folder as Foldericon } from "@mui/icons-material";
import { File } from "./File";

export const Folder = ({
  fileTreeNode,
  nodeKey,
}: {
  fileTreeNode: FileTreeNode;
  nodeKey: number;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Box
      component={"li"}
      key={nodeKey}
      sx={{
        display: "flex",
        flexDirection: "column",
        // placeItems: "flex-start",
        // paddingLeft: "1rem",
        cursor: "pointer",
      }}
    >
      <Box
        onClick={() => {
          console.log(isOpen, !isOpen);
          setIsOpen(!isOpen);
        }}
        sx={{
          display: "flex",
          flexGrow: "1",
          paddingY: "0.3rem",
          paddingLeft: "0.4rem",
          gap: "0.3rem",
          "&:hover": {
            backgroundColor: "hsla(0, 0%, 100%, 0.2)",
          },
        }}
      >
        <Foldericon></Foldericon>
        <Typography>{fileTreeNode.name}</Typography>
      </Box>
      <Box
        component={"ul"}
        sx={{
          flexGrow: "1",
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          paddingLeft: "1rem",
        }}
      >
        {fileTreeNode.children &&
          fileTreeNode.children.length > 0 &&
          fileTreeNode.children.map((childTreeNode, index) => (
            <>
              {childTreeNode.tag === "folder" && (
                <Folder fileTreeNode={childTreeNode} nodeKey={index}></Folder>
              )}
              {childTreeNode.tag === "file" && (
                <File fileTreeNode={childTreeNode} nodeKey={index}></File>
              )}
            </>
          ))}
      </Box>
    </Box>
  );
};
