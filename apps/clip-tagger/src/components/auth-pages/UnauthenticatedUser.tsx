import { SignInButton } from "@clerk/clerk-react"
import { Box, Button, Typography } from "@mui/material"
import clipTaggerLogo from "../../../public/editor-hub-clip-tagger-logo.svg";

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
          }}
        >
          <Box
            component={"img"}
            src={clipTaggerLogo}
            sx={{
              maxHeight: "3rem",
            }}
          />
          <Typography variant="h4">Welcome to the Clip Tagger!</Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "200",
            }}
          >
            You must be signed in to proceed
          </Typography>
          <SignInButton>
            <Button variant="contained" size="large" sx={{outline: 'none !important'}}> Sign In</Button>
          </SignInButton>
        </Box>
    )
}