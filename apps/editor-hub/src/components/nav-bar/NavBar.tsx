import { Box, Button, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, useMediaQuery } from "@mui/material";
import clipTaggerLogo from "../../../public/editor-hub-logo.svg";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { AccountCircle, AddAPhoto, Headset, Logout, Menu as MenuIcon, Movie } from "@mui/icons-material";
import packageJson from "../../../package.json";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuthorization } from "../../contexts/Authorization.context";
import { CSInterfaceWrapper } from "../../business-logic/premire-api/CSInterface.wrapper";

const csInterface = new CSInterfaceWrapper()

export const NavBar = () => {
  const { isAuthorized } = useAuthorization()
  const navigate = useNavigate()
  const location = useLocation();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const isWiderThan10Rem = useMediaQuery('(min-width:18rem')

  const pages = [
    {
      title: "Video Gallery",
      path: "video-gallery",
      listItemIcon: <Movie sx={{ fill: 'hsl(213, 98%, 68%)' }} />
    },
    {
      title: "Audio Gallery",
      path: "audio-gallery",
      listItemIcon: <Headset sx={{ fill: 'hsl(213, 98%, 68%)' }} />
    }
  ]

  const userName = user?.firstName ?? user?.primaryEmailAddress?.emailAddress.split("@")[0] ?? "Anonym";
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
        <Button
        onClick={() => console.log(csInterface.hostEnvironment)}
        >Test</Button>
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
              <Box sx={{ position: 'relative' }}>
                <Box
                  component={'img'} src={user?.imageUrl}
                  sx={{
                    maxHeight: '3rem'
                  }}
                >
                </Box>
                <Box
                  component={'div'}
                  title="Change Avatar"
                  sx={{
                    display: 'flex',
                    placeContent: 'center',
                    placeItems: 'center',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '3rem',
                    cursor: 'pointer',
                    height: '3rem',
                    backgroundColor: 'black',
                    opacity: '0',
                    '&:hover': {
                      opacity: '0.5'
                    }
                  }}
                  onClick={() => alert("This feature will be available soon!")}
                >
                  <AddAPhoto sx={{ maxHeight: '1.3rem' }}></AddAPhoto>
                </Box>
              </Box>
            </ListItemAvatar>
            <ListItemText
              id={`nava-bar:account-info:user-name`}
              data-testid={`nava-bar:account-info:user-name`}
              sx={{
                overflow: 'hidden',
                width: isWiderThan10Rem ? 'auto' : '1rem',
              }}
            >
              {userName}
            </ListItemText>

            <SignOutButton>
              <ListItemButton>
                <Logout fontSize="small" color='error'></Logout>
              </ListItemButton>
            </SignOutButton>
          </ListItem>

          {isAuthorized && pages.map(({ title, path, listItemIcon }) => (
            <ListItem disablePadding onClick={() => navigate(path)}
              sx={{
                backgroundColor: location.pathname.includes(path) ? "hsl(213, 0%, 40%)" : null
              }}
            >
              <ListItemButton>
                <ListItemIcon>{listItemIcon}</ListItemIcon>
                <ListItemText>{title}</ListItemText>
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
