import { SignInButton } from "@clerk/clerk-react"
import { Box, Button, Typography } from "@mui/material"
import clipTaggerLogo from "../../../../../public/editor-hub-clip-tagger-logo.svg";

export const UnauthenticatedUser = () => {
    return (
        <Box
          component={"div"}
          id="signout-root"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            placeItems: 'center',
          }}
        >
          <Box
            component={"img"}
            src={clipTaggerLogo}
            sx={{
              maxHeight: "2rem",
            }}
          />
          {/* <Typography variant="h5">Welcome to the Editor Hub!</Typography> */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "200",
              fontSize: '1rem'
            }}
          >
            You must be signed in to proceed
          </Typography>
          <SignInButton>
            <Button variant="contained" size="medium" sx={{outline: 'none !important'}}> Sign In</Button>
          </SignInButton>
        </Box>
    )
}