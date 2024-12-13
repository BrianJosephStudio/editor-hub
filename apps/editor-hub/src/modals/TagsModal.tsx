import { Box, Dialog, DialogContent, DialogTitle, IconButton, SxProps, Typography } from "@mui/material"
import { TagGroup, TagObject } from "../types/tags";
import { GenericTags } from "../resources/TagSystem";
import { useTagsContext } from "../contexts/Tags.context";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Sell } from "@mui/icons-material";
import { Theme } from "@emotion/react";

export const TagsDialog = ({ open, closeTagsModal }: { open: boolean, closeTagsModal: () => void }) => {
  const { activeTags } = useSelector((state: RootState) => state.tags)
  const { tagLevel, activeTagGroup, exitTagGroup } = useTagsContext()
  const { removeTag } = useTagsContext()

  return (
    <Dialog fullScreen
      onClose={() => closeTagsModal()}
      fullWidth
      maxWidth={"xl"}
      open={open}
      sx={{
        height: '100%',
        flexGrow: '1',
      }}
      onClick={() => exitTagGroup()}
    >
      <DialogTitle sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 6fr 1fr',
        backgroundColor: 'hsl(0, 0%, 12%)',
        textAlign: 'center',
        color: 'white',
        padding: '0.3rem'
      }}>
        <IconButton onClick={() => closeTagsModal()} sx={{ '&:focus': { outline: 'none' } }}>
          <Sell color={"primary"}></Sell>
        </IconButton>
        <Typography> Tags Menu</Typography>
      </DialogTitle>

      <DialogContent dividers={true} sx={{
        backgroundColor: 'hsl(0, 0%, 12%)',
        paddingY: '2.6rem',
      }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            placeContent: 'center',
            gap: '0.6rem',
          }}
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
        flexGrow: '1',
        height: '100%',
      }}>
        {!tagLevel &&
          <TagGroupsContainer
            tagGroups={Object.values(GenericTags)}
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

export const TagGroupsContainer = ({ tagGroups }: { tagGroups: TagGroup[] }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: '1',
    }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          flexGrow: '1',
          // gridGap: '0.3rem',
        }}
      >
        {Object.values(GenericTags).map((tagGroup, index) => (
          <TagGroupItem tagGroup={tagGroup} keyValue={index}></TagGroupItem>
        ))}
      </Box>
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
        // paddingY: '0.4rem',
        flexGrow: '1',
        // borderRadius: '0.4rem',
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
      maxWidth: '700px',
      // overflow: 'auto'
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