import { Box, Button, Stack, Typography } from "@mui/material"
import { DropZone } from "./DropZone"
import { Close } from "@mui/icons-material";

export const MapZone = ({ parentFolder, mapZone, onDelete }: { parentFolder: string; mapZone: string, onDelete: (map: string) => void }) => {
    const currentFolder = `${parentFolder}/${mapZone}`

    return (
        <Box sx={{ backgroundColor: 'hsl(226, 21.60%, 34.50%)', padding: '0.4rem', borderRadius: '0.4rem' }}>
            <Stack direction={'row'} sx={{ position: 'relative', placeContent: 'center'}}>
                <Button
                    onClick={() => onDelete(mapZone)}
                    sx={{
                        position: 'absolute',
                        left: '0',
                        
                    }}
                    >
                    <Close fontSize='small'></Close>
                </Button>
                <Typography>{mapZone}</Typography>
            </Stack>
            <Stack
                direction={'column'}
                sx={{
                }}>
                <DropZone targetPath={currentFolder}></DropZone>
            </Stack>
        </Box>
    )
}