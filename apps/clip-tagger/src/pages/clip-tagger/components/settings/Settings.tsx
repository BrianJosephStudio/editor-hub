import { Box, Button, FormControlLabel, Input, InputAdornment, InputLabel, Slider, Stack, Switch, TextField, Typography } from "@mui/material";
import { useClipViewer } from "../../../../context/ClipViewerContext";
import { useTags } from "../../../../context/TagsContext";
import { VolumeDown, VolumeUp } from "@mui/icons-material";

export const Settings = () => {
  const {
    pauseOnInput,
    setPauseOnInput,
    skipTime,
    setSkipTime,
    currentVolume,
    setCurrentVolume
  } = useClipViewer();
  const {
    tagOffset,
    setTagOffset,
  } = useTags();


  return (
    <Box
      sx={{
        display: "flex",
        placeContent: "flex-start",
        backgroundColor: 'hsl(0, 0.00%, 62.70%)'
      }}
    >
      <TextField
        label="Tag Offset"
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">ms</InputAdornment>
        }}
        variant="filled"
        value={tagOffset}
        onKeyDown={(event) => event.stopPropagation()}
        onChange={(event) => {
          const inputValue = event.target.value;
          const inputValueNumber = parseInt(inputValue);
          setTagOffset(Math.max(0, inputValueNumber));
        }}
      />
      <TextField
        label="Skip Time"
        type="number"
        sx={{ color: 'white' }}
        InputProps={{
          startAdornment: <InputAdornment position="start">ms</InputAdornment>
        }}
        variant="filled"
        value={skipTime}
        onKeyDown={(event) => event.stopPropagation()}
        onChange={(event) => {
          const inputValue = event.target.value;
          const inputValueNumber = parseInt(inputValue);
          setSkipTime(Math.max(0, inputValueNumber));
        }}
      />
      <FormControlLabel label={`Pause on Input`} control={
        <Switch
          defaultChecked={pauseOnInput}
          value={pauseOnInput}
          onChange={() => {
            setPauseOnInput((currentValue) => !currentValue);
          }}
        >
        </Switch>
      }></FormControlLabel>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <Slider
          sx={{ width: '6rem' }}
          aria-label="Volume"
          min={0}
          max={1}
          step={0.01}
          value={currentVolume}
          onChange={(_event, value) => {
            setCurrentVolume(value as number)
          }} />
        <VolumeUp />
      </Stack>
      {currentVolume}
    </Box>
  )
}