import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import { TagGroup, TagObject } from "../types/tags";
import { GenericTags } from "../resources/TagSystem";
import { useTagsContext } from "../contexts/Tags.context";

export const TagsDialog = () => {
  const { tagLevel, activeTagGroup } = useTagsContext()
  
  return (
    <Dialog fullWidth maxWidth={"xl"} open={true}>
      <DialogTitle sx={{
        backgroundColor: 'hsl(0, 0%, 12%)',
        textAlign: 'center',
        color: 'white',
        padding: '0.3rem'
      }}>Edit Active Tags</DialogTitle>
      <DialogContent dividers={true} sx={{
        backgroundColor: 'hsl(0, 0%, 12%)'
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
      gap: '0.3rem'
    }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridGap: '0.3rem',
        }}
      >
        {tagGroups.map((tagGroup) => (
          <>
            {tagGroup.iterable &&
              <TagGroupItem tagGroup={tagGroup}></TagGroupItem>
            }
          </>
        ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gridGap: '0.3rem',
        }}
      >
        {Object.values(GenericTags).map((tagGroup) => (
          <>
            {!tagGroup.iterable &&
              <TagGroupItem tagGroup={tagGroup}></TagGroupItem>
            }
          </>
        ))}
      </Box>
    </Box>
  )
}

export const TagGroupItem = ({ tagGroup }: { tagGroup: TagGroup }) => {
  const { enterTagGroup } = useTagsContext()

  return (
    <Box
      component={'div'}
      onClick={() => {
        enterTagGroup(tagGroup)
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        placeItems: 'center',
        paddingY: '1rem',
        borderRadius: '0.4rem',
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
  return (
    <Box sx={{
      display: 'flex',
      placeItems: 'center',
      placeContent: 'center',
      gap: '0.3rem',
      flexWrap: 'wrap',
      // overflow: 'auto'
    }}>
        {tagGroup.tags.map((tagObject) => (
          <TagObjectItem tagObject={tagObject}></TagObjectItem>
        ))}
    </Box>
  )
}

const TagObjectItem = ({tagObject}: { tagObject: TagObject }) => {
  return(
    <Box
      sx={{
        display: 'flex',
        minWidth: '4rem',
        flexDirection: 'column',
        placeItems: 'center',
        padding: '0.4rem',
        borderRadius: '0.4rem',
        backgroundColor: 'hsl(213, 0%, 25%)',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'hsl(213, 0%, 30%)',
        }
      }}
    >
      <Typography color={'white'} fontSize={'1.4rem'} fontWeight={'600'}>{tagObject.keybind.toUpperCase()}</Typography>
      <Typography color={'white'} fontSize={'0.6rem'}>{tagObject.displayName}</Typography>
    </Box>
  )
}