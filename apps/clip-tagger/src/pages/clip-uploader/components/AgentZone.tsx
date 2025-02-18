import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { MapZone } from "./MapZone"
import { Add, Close } from "@mui/icons-material"
import { MapTags } from "@editor-hub/tag-system"

export const AgentZone = ({
  agentZone,
  parentFolder,
  onDelete
}: {
  agentZone: string
  parentFolder: string
  onDelete: (agentZone: string) => void
}) => {
  const [mapZones, setMapZones] = useState<string[]>([])
  const currentFolder = `${parentFolder}/${agentZone}`
  const [mapsDialogOpen, setMapsDialogOpen] = useState<boolean>(false)

  const onAdd = (selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    setMapZones(currentMaps => {
      const validated = selected.filter(selection => currentMaps.every(agent => agent !== selection))
      return [
        ...validated,
        ...currentMaps,
      ]
    })
    setSelected([])
  }

  const onMapDelete = (map: string) => {
    setMapZones(currentMaps => {
      return currentMaps.filter(currentMap => currentMap !== map)
    })

  }

  return (
    <>
      <MapDialog open={mapsDialogOpen} agent={agentZone} onAdd={onAdd} onClose={() => setMapsDialogOpen(false)}></MapDialog>
      <Stack
        direction={'column'}
        sx={{
          backgroundColor: 'hsl(223, 25.30%, 38.80%)',
          // flexGrow: 1,
          placeItems: 'center',
          gap: '1rem',
          minWidth: '32rem',
          borderRadius: '0.6rem',
          padding: '1rem'
        }}
      >
        <Stack direction={'row'}
          sx={{
            minHeight: '4rem',
            placeItems: 'center'
          }}
        >
          <Button sx={{ padding: '0' }} onClick={() => onDelete(agentZone)}><Close sx={{ padding: '0' }}></Close></Button>
          <Typography>
            {agentZone}
          </Typography>
        </Stack>
        <Stack direction={'column'} gap={'1rem'} sx={{
          width: '100%',
        }}>
          <Button variant="outlined" sx={{ flexGrow: '1' }} onClick={() => setMapsDialogOpen(true)}><Add />Add Map</Button>
          {mapZones.map(mapZone => (
            <MapZone parentFolder={currentFolder} onDelete={onMapDelete} mapZone={mapZone}></MapZone>
          ))}
        </Stack>
      </Stack>
    </>
  )
}

const MapDialog = ({
  open,
  agent,
  onAdd,
  onClose
}: {
  open: boolean,
  agent: string,
  onAdd: (selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => void
  onClose: () => void
}) => {
  const [mapItems, setMapItems] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => setMapItems(MapTags.map(mapTag => mapTag.displayName)), [])


  const addToSelection = (selection: string) => setSelected(currentList => [...currentList, selection])
  const removeFromSelection = (selection: string) => setSelected(currentList => currentList.filter(agent => agent !== selection))
  const onClick = (
    displayName: string,
    setActive: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (selected.find(selected => selected === displayName)) {
      setActive(false)
      removeFromSelection(displayName);
      return
    }
    setActive(true)
    addToSelection(displayName)
  }

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>{agent}</DialogTitle>
      <DialogContent>
        <List
          sx={{
            cursor: 'pointer',
          }}
        >
          {mapItems.map(map => (
            <MapDialogItem displayName={map} onClick={onClick} />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button onClick={() => { onAdd(selected, setSelected); onClose() }}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}

const MapDialogItem = ({
  displayName,
  onClick
}: {
  displayName: string;
  onClick: (
    displayName: string,
    setActive: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
}
) => {
  const [active, setActive] = useState<boolean>(false)

  return (
    <ListItem
      onClick={() => onClick(displayName, setActive)}
      sx={{
        backgroundColor: active ? 'hsl(0, 0.00%, 76.10%)' : 'transparent',
        cursor: 'pointer',
        padding: '0.4rem 1rem',
        '&:hover': {
          backgroundColor: 'hsl(0, 0.00%, 87.80%)'
        }
      }}
    >
      {displayName}
    </ListItem>
  )
}