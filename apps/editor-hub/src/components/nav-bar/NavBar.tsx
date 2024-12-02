import { Box } from "@mui/material";
import { Tab } from "./components/Tab";

export const NavBar = () => {
  const pages: { pageName: string }[] = [
    {
      pageName: "Video Gallery",
    },
    {
      pageName: "Audio Tools",
    },
    {
      pageName: "Info",
    },
  ];

  return (
    <Box
      component={"div"}
      id="nav-bar"
      data-testid={"nav-bar-container"}
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      {pages.map(({ pageName }, index) => (
        <Tab page={index} tabName={pageName}></Tab>
      ))}
    </Box>
  );
};
