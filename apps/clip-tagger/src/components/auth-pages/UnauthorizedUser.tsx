import { Box, Typography } from "@mui/material";
import { NoAccounts } from "@mui/icons-material";

export const UnauthorizedUser = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "2rem",
        // placeContent: "center",
        paddingTop: "2rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          placeSelf: "center",
          backgroundColor: "hsl(0, 0%,18%)",
          maxWidth: "60rem",
          padding: "2rem 1rem",
          gap: "1rem",
        }}
      >
        <NoAccounts
          sx={{ fontSize: "4rem", fill: "hsl(349, 100%, 67%)" }}
        ></NoAccounts>
        <Typography
          variant="h6"
          color={"hsl(349, 100%, 67%)"}
          fontWeight={"600"}
        >
          UNAUTHORIZED USER
        </Typography>
        <Typography variant="h6" fontWeight={"300"}>
          It seems that you don't have permission to use this app yet! But worry
          not! Contact the app's manager so that they can grant you permission!
        </Typography>
      </Box>
    </Box>
  );
};
