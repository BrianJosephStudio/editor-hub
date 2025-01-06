import { Box, Typography } from "@mui/material";
import { NoAccounts } from "@mui/icons-material";
import { Navigate } from "react-router";
import { useAuthorization } from "../../../../context/Authorization.context";
import { ReactNode } from "react";

export const UnauthorizedUser = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "2rem",
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
          It seems that you don't have permission to use this app. Don't worry, it usually means you haven't been assigned any authorized roles yet.
          Contact the app's manager so that they can assign the correct role for you.
        </Typography>
      </Box>
    </Box>
  );
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthorized } = useAuthorization()

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export const IsAuthorized = ({ children }: { children: ReactNode }) => {
  const { isAuthorized } = useAuthorization()

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return children;
};
