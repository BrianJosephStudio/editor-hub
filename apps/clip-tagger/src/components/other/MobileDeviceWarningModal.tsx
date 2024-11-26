import { ErrorOutline } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import clipTaggerLogo from "../../../public/editor-hub-clip-tagger-logo.svg";

export const MobileDeviceWarningModal = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        placeContent: "center",
        placeItems: 'center',
        height: "100%",
        width: "100%",
        gap: '2rem',
        backgroundColor: 'hsl(0, 0%, 12%)'
      }}
    >
        
      <Box
        component={"img"}
        src={clipTaggerLogo}
        sx={{
          maxHeight: "2.6rem",
          gridColumn: "2/3",
        }}
      />
      <ErrorOutline fontSize={"large"} sx={{fill: 'hsl(349, 100%, 67%)'}}/>
      <Typography color={'white'} variant="h5">
        This application is designed to work with desktop devices. Devices
        without a mouse or keyboard won't be able to make use of it.
      </Typography>
    </Box>
  );
};
