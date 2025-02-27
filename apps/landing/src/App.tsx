import './App.css'
import { Box, Link, Stack, Typography } from '@mui/material'
import editorHubLogo from '../public/editor-hub-logo.svg'
import clipTaggerLogo from '../public/editor-hub-clip-tagger-logo.svg'
import projectManagerLogo from '../public/editor-hub-project-manager-logo.svg'

function App() {
  const apps = [
    {
      href: '/editor-hub',
      src: editorHubLogo,
      alt: 'Editor Hub',
      maxHeight: '1.1rem'
    },
    {
      href: '/clip-tagger',
      src: clipTaggerLogo,
      alt: 'Clip Tagger',
      maxHeight: '1.3rem'
    },
    {
      href: '/project-manager',
      src: projectManagerLogo,
      alt: 'Project Manager',
      maxHeight: '1.6rem'
    },
  ]


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      // backgroundColor: 'hsl(212, 53.70%, 39.80%)',
      border: 'solid',
      borderWidth: '1px',
      borderColor: 'hsl(0, 0.00%, 21.60%)',
      backgroundColor: 'hsl(0, 0.00%, 11.40%)',
      borderRadius: '1rem',
      gap: '1rem',
      placeItems: 'center',
      overflow: 'hidden',
    }}>
      <Stack sx={{
        padding: '2rem',
      }}>
        <Typography variant='h6'>Welcome to the Editor Hub suite</Typography>
        <Typography fontWeight={300}>Where would you like to go?</Typography>
      </Stack>

      <Box sx={{
        border: 'solid 1px',
        borderColor: 'hsl(212, 79.60%, 57.60%)',
        width: '90%'
      }}/>

      <Stack sx={{
        width: '100%'
      }}>
        {apps.map(app => (
          <Link href={app.href} sx={{
            display: 'flex',
            placeContent: 'center',
            paddingY: '1rem',
            '&:hover': {
              backgroundColor: 'hsla(0, 0%, 100%, 0.1)',
            }
          }}>
            <Box
              component='img'
              src={app.src}
              alt={app.alt}
              sx={{
                maxHeight: app.maxHeight
              }}
            />
          </Link>
        ))}
      </Stack>
    </Box>
  )
}

export default App
