import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useClipUpload } from "../../../context/ClipUploadContext"
import { AgentZone } from "./AgentZone"
import { Add } from "@mui/icons-material"
import { AgentTags } from "@editor-hub/tag-system"

export const PatchZone = ({ parentFolder }: { parentFolder: string }) => {
    const { selectedPatch } = useClipUpload()
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [agentZones, setAgentZones] = useState<string[]>([])
    const [currentFolder, setCurrentFolder] = useState('')


    useEffect(() => setCurrentFolder(`${parentFolder}/${selectedPatch?.name}`), [selectedPatch])

    const onClose = () => setDialogOpen(false)

    const onAdd = (selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
        setAgentZones(currentAgents => {
            const validated = selected.filter(selection => currentAgents.every(agent => agent !== selection))
            return [
                ...currentAgents,
                ...validated
            ]
        })
        setSelected([])
    }

    const onDelete = (agentZone: string) => {
        setAgentZones(currentAgents => {
            return currentAgents.filter(agent => agent !== agentZone)
        })
    }

    return (
        <>
            <AgentDialog open={dialogOpen} onClose={onClose} onAdd={onAdd} agentZones={agentZones}></AgentDialog>

            <Stack direction={'row'} sx={{
                placeItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
            }}>
                <Button variant="outlined" sx={{
                    placeItems: 'center',
                    paddingY: '1rem',
                    flexGrow: agentZones.length > 0 ? '0' : '1'
                }}
                    onClick={() => setDialogOpen(true)}
                >
                    <Stack direction={'row'}><Add />{agentZones.length === 0 && "Add Agents"}</Stack>
                </Button>
                {agentZones.map((agentZone) => (
                    <AgentZone key={agentZone} parentFolder={currentFolder} agentZone={agentZone} onDelete={onDelete}></AgentZone>
                ))}
            </Stack>
        </>
    )
}

const AgentDialog = ({ open, agentZones, onAdd, onClose }: { open: boolean; agentZones: string[]; onAdd: (selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => void; onClose: () => void }) => {
    const [selected, setSelected] = useState<string[]>([])
    const [agentItems, setAgentItems] = useState<string[]>([])

    useEffect(() => {
        const items = AgentTags
            .map(agentTag => agentTag.displayName)
            .filter(agent => agentZones.every(agentZone => agentZone !== agent))

        setAgentItems(items)
    }, [agentZones])

    const addToSelection = (selection: string) => setSelected(currentList => [...currentList, selection])
    const removeFromSelection = (selection: string) => setSelected(currentList => currentList.filter(agent => agent !== selection))
    const onClick = (
        selection: string,
        setActive: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        if (selected.find(selected => selected === selection)) {
            setActive(false)
            removeFromSelection(selection);
            return
        }
        setActive(true)
        addToSelection(selection)
    }
    
    const onDoubleClick = (selection: string) => {
        if (!selected.find(selected => selected === selection)) {
            onAdd([selection], setSelected)
            onClose()        
        }
    }

    return (
        <Dialog
            open={open}
            fullWidth
            onClose={onClose}
        >
            <DialogTitle>
                Agents to Add
            </DialogTitle>
            <DialogContent>
                {agentItems.map(agent => (
                    <AgentDialogItem
                        displayName={agent}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={() => { onAdd(selected, setSelected); onClose() }}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

const AgentDialogItem = ({
    displayName,
    onClick,
    onDoubleClick
}: {
    displayName: string;
    onClick: (
        displayName: string,
        setActive: React.Dispatch<React.SetStateAction<boolean>>
    ) => void;
    onDoubleClick:  (selection: string) => void
}
) => {
    const [active, setActive] = useState<boolean>(false)

    return (
        <Stack
            component={'div'}
            onClick={() => onClick(displayName, setActive)}
            onDoubleClick={() => onDoubleClick(displayName)}
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
        </Stack>
    )
}