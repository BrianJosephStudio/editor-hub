import { Box, Button, Typography } from "@mui/material";
import clipTaggerLogo from "../../../public/editor-hub-clip-tagger-logo.svg";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { AccountCircle } from "@mui/icons-material";
import packageJson from "../../../package.json";

export const NavBar = () => {
  const { user } = useUser();

  const userName = user?.firstName ?? "";
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "2fr 12fr 2fr",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "4vh",
        placeItems: "center",
        backgroundColor: "hsl(0, 0%, 20%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "0.6rem",
        }}
      >
        <AccountCircle />
        <Typography>{userName}</Typography>
      </Box>
      <Box
        component={"img"}
        src={clipTaggerLogo}
        sx={{
          maxHeight: "2.6rem",
          gridColumn: "2/3",
        }}
      />
      <Box
        sx={{
          display: "flex",
          placeItems: "center",
          gap: '1rem',
        }}
      >
        <Typography fontSize={"0.8rem"}>v -{packageJson.version}</Typography>
        <SignOutButton>
          <Button sx={{ outline: "none !important" }} size="small">
            Sign Out
          </Button>
        </SignOutButton>
      </Box>
    </Box>
  );
};
