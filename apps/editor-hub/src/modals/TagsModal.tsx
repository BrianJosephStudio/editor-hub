import { Box, Dialog, DialogContent, DialogTitle, IconButton, SxProps, Typography, useMediaQuery } from "@mui/material"
import { useTagsContext } from "../contexts/Tags.context";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Close } from "@mui/icons-material";
import { Theme } from "@emotion/react";
import './TagsModal.css'
import { GenericTags, TagGroup, TagObject } from "@editor-hub/tag-system";

export const TagsDialog = ({ open, closeTagsModal }: { open: boolean, closeTagsModal: () => void }) => {
  const { activeTags } = useSelector((state: RootState) => state.tags)
  const { tagLevel, activeTagGroup, exitTagGroup, removeTag } = useTagsContext()

  const isWideEnough = useMediaQuery('(max-width:40rem),(max-height:32rem)')

  return (
    <Dialog
      fullScreen={isWideEnough}
      onClose={() => closeTagsModal()}
      fullWidth={true}
      maxWidth={"md"}
      open={open}
      sx={{
        height: '100%',
        flexGrow: '1',
      }}
      onClick={() => exitTagGroup()}
    >
      <DialogTitle sx={{
        display: 'grid',
        placeItems: 'center',
        gridTemplateColumns: '1fr 6fr 1fr',
        backgroundColor: 'hsl(0, 0%, 12%)',
        textAlign: 'center',
        color: 'white',
        padding: '0rem'
      }}>
        <Typography sx={{gridColumn: '2/3'}}> Tags Menu</Typography>
        <IconButton onClick={() => closeTagsModal()} sx={{ '&:focus': { outline: 'none' } }}>
          <Close color={"primary"}></Close>
        </IconButton>
      </DialogTitle>

      <DialogContent dividers={true} sx={{
        backgroundColor: 'hsl(0, 0%, 12%)',
        minHeight: '5rem'
      }}
        className="scroll-bar"
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            placeContent: 'center',
            gap: '0.3rem',
          }}
          component={'div'}
        >
          {activeTags.length === 0 &&
            <Typography color={'hsl(0, 0%, 60%)'}>No tags selected</Typography>
          }
          {
            activeTags.map((tag) => (
              <TagObjectItem tagObject={tag} onClick={() => removeTag(tag)} sx={{
                backgroundColor: 'hsl(213, 60%, 50%)'
              }}></TagObjectItem>
            ))
          }
        </Box>
      </DialogContent>

      <DialogContent dividers={true} sx={{
        display: 'flex',
        backgroundColor: 'hsl(0, 0%, 12%)',
        placeContent: 'center',
        padding: '0',
      }}>
        {!tagLevel &&
          <TagGroupsContainer
          ></TagGroupsContainer>
        }
        {tagLevel && activeTagGroup &&
          <TagsContainer
            tagGroup={activeTagGroup}
          ></TagsContainer>
        }
      </DialogContent>
    </Dialog>)
}

export const TagGroupsContainer = () => {
  
  return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          flexGrow: '1',
        }}
      >
        {Object.values(GenericTags).map((tagGroup, index) => (
          <TagGroupItem tagGroup={tagGroup} keyValue={index}></TagGroupItem>
        ))}
    </Box>
  )
}

export const TagGroupItem = ({ tagGroup, keyValue }: { tagGroup: TagGroup, keyValue: number }) => {
  const { enterTagGroup } = useTagsContext()

  return (
    <Box
      key={keyValue}
      component={'div'}
      onClick={(event) => {
        event.stopPropagation()
        enterTagGroup(tagGroup)
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        placeItems: 'center',
        placeContent: 'center',
        gridColumn: keyValue < 2 ? 'span 3' : 'span 2',
        flexGrow: '1',
        border: 'solid',
        borderWidth: '1px',
        borderColor: 'hsl(0, 0%, 12%)',
        backgroundColor: 'hsl(213, 0%, 25%)',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'hsl(213, 0%, 30%)',
        }
      }}
    >
      <Typography color={'white'} fontSize={'1.4rem'} fontWeight={'600'}>{tagGroup.keybindGroup.toUpperCase()}</Typography>
      <Typography color={'white'} fontSize={'0.6rem'}>{tagGroup.groupName}</Typography>
    </Box>
  )
}

export const TagsContainer = ({ tagGroup }: { tagGroup: TagGroup }) => {
  const { activateTag } = useTagsContext()

  return (
    <Box sx={{
      display: 'flex',
      placeItems: 'center',
      placeContent: 'center',
      gap: '0.3rem',
      flexWrap: 'wrap',
      flexGrow: '1',
      maxWidth: '60rem',
      padding: '1rem',
    }}>
      {tagGroup.tags.map((tagObject) => (
        <TagObjectItem tagObject={tagObject} sx={{backgroundColor: 'hsl(213, 0%, 25%)'}} onClick={() => { activateTag(tagObject) }}></TagObjectItem>
      ))}
    </Box>
  )
}

const TagObjectItem = ({ tagObject, sx, onClick }: { tagObject: TagObject, sx?: SxProps<Theme>, onClick: () => void }) => {

  return (
    <Box
      component={'div'}
      sx={{
        ...sx,
        display: 'flex',
        minWidth: '4rem',
        flexDirection: 'column',
        placeItems: 'center',
        padding: '0.4rem',
        borderRadius: '0.4rem',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'hsl(213, 0%, 30%)',
        }
      }}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <Typography color={'white'} fontSize={'1.4rem'} fontWeight={'600'}>{tagObject.keybind.toUpperCase()}</Typography>
      <Typography color={'white'} fontSize={'0.6rem'}>{tagObject.displayName}</Typography>
    </Box>
  )
}