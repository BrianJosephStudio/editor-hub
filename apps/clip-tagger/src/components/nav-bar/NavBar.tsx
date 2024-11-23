import { Box, Typography } from "@mui/material";
import clipTaggerLogo from "../../../public/editor-hub-clip-tagger-logo.svg";
import { SignOutButton, useUser } from "@clerk/clerk-react";

export const NavBar = () => {
  const { user } = useUser();

  const userName = user?.firstName ?? "";
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 12fr 1fr",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "4vh",
        placeItems: "center",
        backgroundColor: "hsl(0, 0%, 20%)",
      }}
    >
      <Typography>{userName}</Typography>
      <Box
        component={"img"}
        src={clipTaggerLogo}
        sx={{
          maxHeight: "2.6rem",
          gridColumn: "2/3",
        }}
      />
      <SignOutButton></SignOutButton>
    </Box>
  );
};
