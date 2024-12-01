import { Box, Typography } from "@mui/material";
import { usePageViewer } from "../../../contexts/PageViewer.context";

export const Tab = ({ page, tabName }: { page: number; tabName: string }) => {
  const {setActivePage} = usePageViewer()
  
  return (
    <Box
      key={page}
      component={"div"}
      id={`nav-tab:${tabName.toLowerCase()}-`}
      data-test-id={`nav-tab:${tabName.toLowerCase()}-`}
      onClick={() => {
        setActivePage(page);
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        placeContent: 'center',
        flexGrow: '1',
        cursor: 'pointer',
        backgroundColor: 'hsla(0, 0% , 100%, 0)',
        '&:hover': {
          backgroundColor: 'hsla(0, 0% , 100%, 0.2)',
        }
      }}
    >
      <Typography fontSize={'0.8rem'}>{tabName}</Typography>
    </Box>
  );
};
