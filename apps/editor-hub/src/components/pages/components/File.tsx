import { Box, Typography } from "@mui/material";
import { FileTreeNode } from "../../../types/app";
import { Theaters } from "@mui/icons-material";

export const File = ({ fileTreeNode, nodeKey }: { fileTreeNode: FileTreeNode, nodeKey: number }) => {
  return <Box
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
      console.log("Clicked file!");
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
    <Theaters></Theaters>
    <Typography>{fileTreeNode.name}</Typography>
  </Box>
</Box>;
};
