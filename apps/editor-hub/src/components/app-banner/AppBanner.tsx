import { Box, Button, Divider, Drawer, IconButton, List, ListItem, Menu, MenuItem, Typography } from "@mui/material";
import clipTaggerLogo from "../../../public/editor-hub-logo.svg";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import packageJson from "../../../package.json";
import { useState } from "react";

export const AppBanner = () => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const userName = user?.firstName ?? "";
  return (
    <>
      <Box
        component={"div"}
        id={`app-banner:container`}
        data-testid={`app-banner:container`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          placeItems: "center",
          backgroundColor: "hsl(0, 0%, 20%)",
          padding: '0'
        }}
      >
        <Box
          component={"img"}
          id={`app-banner:app-logo`}
          data-testid={`app-banner:app-logo`}
          src={clipTaggerLogo}
          sx={{
            maxHeight: "1.1rem",
            // gridColumn: "2/3",
            padding: '0.6rem',
          }}
        />
        <IconButton
          onClick={() => setMenuOpen(true)}
          sx={{ marginLeft: 'auto', '&:focus': { outline: 'none' } }}
        >
          <MenuIcon color="primary"></MenuIcon>
        </IconButton>
      </Box>

      <Drawer open={menuOpen} anchor="right" onClose={() => setMenuOpen(false)}>
        <Box sx={{
          height: '100%',
          paddingX: '1rem',
          backgroundColor: "hsl(0, 0%, 20%)",
          color: 'white'
        }}>
          <MenuItem sx={{ gap: '1rem' }}>
            <AccountCircle fontSize="medium" />
            <Typography
              id={`app-banner:account-info:user-name`}
              data-testid={`app-banner:account-info:user-name`}
              fontSize={"1rem"}
            >
              {userName}
            </Typography>
          </MenuItem>

          <SignOutButton>
            <MenuItem sx={{ gap: '1rem', fontSize: '0.8rem' }}>
              Sign Out
            </MenuItem>
          </SignOutButton>

          <Typography
            id={`app-banner:app-version`}
            data-testid={`app-banner:app-version`}
            fontSize={"0.8rem"}
            color={'hsl(213, 60%, 50%)'}
          >
            app version - {packageJson.version}
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};
