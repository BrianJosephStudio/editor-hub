import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material"
import { useSettings } from "../../contexts/Settings.context"

export const SettingsPage = () => {
    const { downloadLocation, setDownloadLocationFromValue } = useSettings()

    const onDownloadLocationChange = (event: SelectChangeEvent) => {
        const {value} = event.target
        if(!value) throw 'no value found in target'
        setDownloadLocationFromValue(value)
    }

    return (
        <Box
            component={'div'}
            id=""
            data-testid=""
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                gap: '1rem'
            }}
        >
            <Stack direction={'column'}>
                <FormControl>
                    <InputLabel sx={{ color: 'white' }}>Download Location</InputLabel>
                    <Select
                        value={downloadLocation}
                        sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'hsl(0, 0%, 50%)',
                            },
                            '& .MuiSelect-icon': {
                                color: 'white',
                            },
                        }}
                        onChange={onDownloadLocationChange}
                    >
                        <MenuItem key={'documents'} value={'documents'}>Documents</MenuItem>
                        <MenuItem key={'projectFolder'} value={'projectFolder'}>Current Project Folder</MenuItem>
                    </Select>
                </FormControl>

            </Stack>
        </Box>
    )
}