import { Box, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Select, SelectChangeEvent, Stack, Typography, useMediaQuery } from "@mui/material";
import clipTaggerLogo from "../../../public/editor-hub-logo.svg";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { AddAPhoto, Headset, Logout, Menu as MenuIcon, Movie, Settings } from "@mui/icons-material";
import packageJson from "../../../package.json";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuthorization } from "../../contexts/Authorization.context";
import { useAppEnvironment } from "../../contexts/AppEnvironment.context";
import { AppEnvironment } from "../../types/app";

export const NavBar = () => {
  const { isAuthorized } = useAuthorization()
  const navigate = useNavigate()
  const location = useLocation();
  const { appEnvironment, setNewAppEnvironment } = useAppEnvironment()
  const { user } = useUser();
  const { isAdmin } = useAuthorization()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [pageName, setPageName] = useState<string>("")

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
    },
    {
      title: "Settings",
      path: "settings",
      listItemIcon: <Settings sx={{ fill: 'hsl(213, 98%, 68%)' }} />
    }
  ]

  const userName = user?.firstName ?? user?.primaryEmailAddress?.emailAddress.split("@")[0] ?? "Anonym";

  useEffect(() => {
    pages.forEach(page => {
      if(location.pathname.includes(page.path)) setPageName(page.title)
    })
  },[location])
  return (
    <>
      <Box
        component={"div"}
        id={`nava-bar:container`}
        data-testid={`nava-bar:container`}
        sx={{
          display: "grid",
          gridTemplateColumns: 'repeat(3, 1fr)',
          width: "100%",
          alignItems: 'center',
          backgroundColor: "hsl(0, 0%, 20%)",
          padding: '0'
        }}
      >
        <Stack direction={'row'} alignItems={'center'}>
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
          {appEnvironment !== 'production' && <Typography color={'hsl(178, 98%, 50%)'} fontSize={'0.8rem'}>{appEnvironment}</Typography>}
        </Stack>
        <Typography>
          {pageName}
        </Typography>
        <IconButton
          onClick={() => setMenuOpen(true)}
          sx={{ justifySelf: 'flex-end', '&:focus': { outline: 'none' } }}
        >
          <MenuIcon color="primary"></MenuIcon>
        </IconButton>
      </Box>

      <Drawer open={menuOpen} anchor="right" onClose={() => setMenuOpen(false)}>
        <List sx={{ backgroundColor: 'hsl(0, 0%, 20%)', flexGrow: 1, color: 'hsl(0, 0.00%, 90%)' }}>
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
            <ListItem key={title} disablePadding onClick={() => navigate(path)}
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


        </List>
        <Stack sx={{ backgroundColor: 'hsl(0, 0%, 20%)', paddingY: '1rem' }}>
          <FormControl sx={{ right: '-30 !important' }} size="medium">
            <InputLabel sx={{ color: 'white' }} id="app-version">version</InputLabel>
            <Select
              labelId="app-version"
              // autoWidth
              sx={{
                color: 'white'
              }}
              value={appEnvironment as string}
              onChange={(event: SelectChangeEvent) => {
                setNewAppEnvironment(event.target.value as AppEnvironment);
              }}
            >
              <MenuItem value={'production'}>Production</MenuItem>
              <MenuItem value={'qa'}>QA</MenuItem>
              {(isAdmin || appEnvironment === 'dev') && <MenuItem value={'dev'}>Dev</MenuItem>}
              {(isAdmin || appEnvironment === 'localhost') && <MenuItem value={'localhost'}>Localhost</MenuItem>}
              {(isAdmin || appEnvironment === 'staging') && <MenuItem value={'staging'}>Staging</MenuItem>}
            </Select>
          </FormControl>
          <Typography
            id={`nava-bar:app-version`}
            data-testid={`nava-bar:app-version`}
            color={'hsl(0, 0%, 75%)'}
            fontSize={13}
            sx={{
              display: 'flex',
              placeContent: 'center'
            }}
          >
            app version - {packageJson.version}
          </Typography>
        </Stack>
      </Drawer>
    </>
  );
};
