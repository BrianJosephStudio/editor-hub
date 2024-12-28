import { Box, Button, Input, InputAdornment, InputLabel, TextField, Typography } from "@mui/material";
import { useClipViewer } from "../../../../context/ClipViewerContext";
import { useTags } from "../../../../context/TagsContext";

export const Settings = () => {
	const { pauseOnInput, setPauseOnInput, skipTime, setSkipTime } = useClipViewer();
	const {
		tagOffset,
		setTagOffset,
	} = useTags();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				placeContent: "center",
				backgroundColor: 'white'
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
				sx={{color: 'white'}}
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
			<Button
				sx={{
					flexGrow: 1,
					stroke: "none",
					borderRadius: "0",
					"&:focus": {
						outline: "none",
					},
					"&:active": {
						outline: "none",
					},
				}}
				variant={"contained"}
				color={pauseOnInput ? "success" : "primary"}
				onClick={() => {
					setPauseOnInput((currentValue) => !currentValue);
				}}
			>
				Pause on Input
			</Button>
		</Box>
	)
}