import './App.css'
import { Box } from '@mui/material'
import { NavBar } from './components/nav-bar/NavBar'
import { AppBanner } from './components/app-banner/AppBanner'
import { TabbedPage } from './components/pages/TabbedPage'
import { PlayCircleFilled, Settings } from '@mui/icons-material'
import { VideoGallery } from './components/pages/VideoGallery'

function App() {
  return (
    <>
      <Box
        component={'div'}
        id='editor-hub-container'
        data-test-id={"editor-hub-container"}
        sx={{
          display: 'grid',
          gridTemplateRows: ' 2.4rem 3rem auto',
          height: '100vh',
          width: '100vw',
        }}
      >
      <AppBanner></AppBanner>
      <NavBar></NavBar>
          <TabbedPage pageId={0}>
            <VideoGallery tabName='In-game' tabIcon={PlayCircleFilled} proportion={4}></VideoGallery>
            <VideoGallery tabName='Settings' tabIcon={Settings} proportion={1}></VideoGallery>
          </TabbedPage>
      </Box>
    </>
  )
}

export default App
