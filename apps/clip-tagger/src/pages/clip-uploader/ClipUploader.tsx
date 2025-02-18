import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useClipUpload } from "../../context/ClipUploadContext";
import apiClient from "../../api/ApiClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { setPatchFolders } from "../../redux/slices/clipUpload.slice";
import { PatchZone } from "./components/PatchZone";
import { toast } from "sonner";
import { ParsedFileName } from "../../util/dropboxFileParsing";
import { getNextAvailableIndex } from "../../util/fileRenaming";
import { ClipUpload } from "@editor-hub/api-sdk";

const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath) throw new Error("Missing envs");


export const ClipUploader = () => {
  const { clipUploads, setClipUploads, selectedPatch, setSlectedPatch, setUploading } = useClipUpload()
  const dispatch = useDispatch()
  const patchFolders = useSelector((state: RootState) => state.clipUpload.patchFolders)

  useEffect(() => {
    const fetchPatches = async () => {
      const rootFolderEntries = await apiClient.getFolderEntries(clipsRootPath)
      dispatch(setPatchFolders(rootFolderEntries))
    }
    fetchPatches()
  }, [])

  const onUploadClick = async () => {
    try {
      setUploading(true)

      const groupedByUploadPath = clipUploads.reduce<Map<string, ClipUpload[]>>((acc, clipUpload) => {
        const { uploadPath } = clipUpload;

        if (!acc.has(uploadPath)) {
          acc.set(uploadPath, []);
        }

        acc.get(uploadPath)?.push(clipUpload);

        return acc;
      }, new Map<string, ClipUpload[]>());

      groupedByUploadPath.forEach(async (clipUploads, uploadPath) => {
        let nextAvailableIndex: number = 0
        
        await apiClient.getFolderEntries(uploadPath)
          .then(folderEntries => {
            nextAvailableIndex = getNextAvailableIndex(folderEntries)
          })
          .catch(e => console.error(e))

        clipUploads.forEach(clipUpload => {
          const { file } = clipUpload
          const parsedFileName = new ParsedFileName(`${uploadPath}/${file.name}`, nextAvailableIndex)
          clipUpload.setNewClipName(parsedFileName.trueName)
          nextAvailableIndex ++
        })

      })

      const { data: { async_job_id } } = await apiClient.uploadClips(clipUploads)

      const { data: uploadResponse } = await apiClient.checkClipUploadJob(async_job_id)
      if (uploadResponse[".tag"] === 'in_progress') throw 'uploads are in progress'

      const failedUploads = clipUploads.filter(clipUpload => {
        const entry = uploadResponse.entries!.find(entry => entry.path_display === `${clipUpload.uploadPath}/${clipUpload.newClipName}`) //todo: fix after name change
        console.log(uploadResponse)
        if (!entry) throw 'entry not found but was expected'

        const success = entry['.tag'] === 'success'
        if (success) {
          clipUpload.setSuccess(true)
          toast.success(`Uploaded ${clipUpload.newClipName}`) 
        } else {
          clipUpload.setSuccess(false)
          toast.error(`Error uploading ${clipUpload.newClipName}`)
        }
        return success !== true
      })
      setClipUploads(failedUploads)
    } catch (e: any) {
      setUploading(false)
      console.error(e)
      toast.error('Something went wrong uploading')
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    const entryMatch = patchFolders.find(patchFolder => patchFolder.name === event.target.value)
    if (!entryMatch) throw 'No matching entry found'
    setSlectedPatch(entryMatch)
  }
  return (
    <>
      {/* <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{file.name}</DialogTitle>
                <DialogContent>
                    <video
                        controls
                        style={{ width: '100%' }}
                        src={URL.createObjectURL(file)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog> */}

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        overflowX: 'auto',
      }}>
        {!selectedPatch &&
          <FormControl>
            <InputLabel> Choose a patch </InputLabel>
            <Select onChange={handleChange}>
              {patchFolders.map(patchFolder => (
                <MenuItem value={patchFolder.name}>
                  {patchFolder.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
        {selectedPatch &&
          <PatchZone parentFolder={clipsRootPath}></PatchZone>
        }
      </Box>
      <Box sx={{
        padding: '1rem',
        position: 'sticky',
        bottom: '0%'
      }}>
        <Button variant="contained" onClick={onUploadClick}>Upload</Button>
      </Box>
    </>
  );
};