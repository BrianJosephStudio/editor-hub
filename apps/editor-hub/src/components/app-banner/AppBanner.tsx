import { Box, Button, Typography } from "@mui/material";
import clipTaggerLogo from "../../../public/editor-hub-clip-tagger-logo.svg";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { AccountCircle } from "@mui/icons-material";
import packageJson from "../../../package.json";

export const AppBanner = () => {
  const { user } = useUser();

  const userName = user?.firstName ?? "";
  return (
    <Box
      component={"div"}
      id={`app-banner:container`}
      data-testid={`app-banner:container`}
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        placeItems: "center",
        backgroundColor: "hsl(0, 0%, 20%)",
      }}
    >
      <Box
        component={"div"}
        id={`app-banner:account-info:container`}
        data-testid={`app-banner:account-info:container`}
        sx={{
          display: "flex",
          gap: "0.6rem",
        }}
      >
        <AccountCircle fontSize="small" />
        <Typography
          id={`app-banner:account-info:user-name`}
          data-testid={`app-banner:account-info:user-name`}
          fontSize={"0.8rem"}
        >
          {userName}
        </Typography>
      </Box>
      <Box
        component={"img"}
        id={`app-banner:app-logo`}
        data-testid={`app-banner:app-logo`}
        src={clipTaggerLogo}
        sx={{
          maxHeight: "1.8rem",
          gridColumn: "2/3",
        }}
      />
      <Box
        sx={{
          display: "flex",
          placeItems: "center",
          gap: "1rem",
        }}
      >
        <Typography
          id={`app-banner:app-version`}
          data-testid={`app-banner:app-version`}
          fontSize={"0.6rem"}
        >
          v -{packageJson.version}
        </Typography>
        <SignOutButton>
          <Button
            id={`app-banner:sign-out-button`}
            data-testid={`app-banner:sign-out-button`}
            sx={{ outline: "none !important", fontSize: "0.6rem" }}
            size="small"
          >
            Sign Out
          </Button>
        </SignOutButton>
      </Box>
    </Box>
  );
};
