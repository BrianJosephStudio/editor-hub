import { Box, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import clipTaggerLogo from "../../../public/editor-hub-logo.svg";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { AccountCircle, Logout, Menu as MenuIcon } from "@mui/icons-material";
import packageJson from "../../../package.json";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const pages = [
    {
      title: "Video Gallery",
      path: "video-gallery"
    },
    {
      title: "Audio Gallery",
      path: "audio-gallery"
    }
  ]

  const userName = user?.firstName ?? "";
  return (
    <>
      <Box
        component={"div"}
        id={`nava-bar:container`}
        data-testid={`nava-bar:container`}
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
          id={`nava-bar:app-logo`}
          data-testid={`nava-bar:app-logo`}
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
        <List sx={{ backgroundColor: 'hsl(0, 0%, 20%)', height: '100%', color: 'hsl(0, 0.00%, 90%)' }}>
          <ListItem sx={{ display: 'flex', gap: '0.6rem', placeItems: 'center', width: '100%' }}>
            <ListItemAvatar>
              <AccountCircle fontSize="large" />
            </ListItemAvatar>
            <ListItemText
              id={`nava-bar:account-info:user-name`}
              data-testid={`nava-bar:account-info:user-name`}
            >
              {userName}
            </ListItemText>

            <SignOutButton>
              <ListItemButton>
                <Logout fontSize="small" color='error'></Logout>
              </ListItemButton>
            </SignOutButton>
          </ListItem>

          {pages.map((page) => (
            <ListItem disablePadding onClick={() => navigate(page.path)}
              sx={{
                backgroundColor: location.pathname.includes(page.path) ? "hsl(213, 60%, 50%)" : null
              }}
            >
              <ListItemButton>
                <ListItemText>{page.title}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem>
            <ListItemText
              id={`nava-bar:app-version`}
              data-testid={`nava-bar:app-version`}
              color={'white'}
            >
              app version - {packageJson.version}
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
