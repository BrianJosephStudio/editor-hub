import { Button, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useClipUpload } from "../../../context/ClipUploadContext";
import { ClipUpload } from "@editor-hub/api-sdk/dist/ClipUploads";
import { Add, Delete, Theaters } from "@mui/icons-material";

export const DropZone = ({ targetPath }: { targetPath: string }) => {
  const { clipUploads, setClipUploads, uploading, setUploading } = useClipUpload()
  const [localClipUploads, setLocalClipUploads] = useState<ClipUpload[]>([])

  useEffect(() => {
    setClipUploads(currentUploads => {
      const newClipUploads = [...currentUploads]
      localClipUploads.forEach(clipUpload => {
        const exists = currentUploads.some(upload => upload.file.name === clipUpload.file.name)
        if (exists) return;
        newClipUploads.push(clipUpload)
      })
      return newClipUploads
    })
  }, [localClipUploads])
  
  useEffect(() => {
    if(!uploading) return;
    setLocalClipUploads(currentUploads => currentUploads.filter(upload => clipUploads.some(clipUpload => clipUpload.id === upload.id)))
    setUploading(false)
  }, [clipUploads])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setLocalClipUploads(currentFiles => currentFiles.concat(
        acceptedFiles.map<ClipUpload>(file => (new ClipUpload(
          file,
          targetPath
        )))
      ))
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
    },
    multiple: true,
  });

  const removeClip = (event: React.MouseEvent, clipId: string) => {
    event.stopPropagation()
    setLocalClipUploads(currentClips => currentClips.filter(currentClip => currentClip.id !== clipId))
  }

  return (
    <Stack
      {...getRootProps()}
      sx={{
        paddingX: '1rem',
        borderRadius: '0.6rem',
        flexGrow: 1,
        placeContent: 'center',
        cursor: 'pointer',
        borderColor: isDragActive ? 'blue' : 'gray'
      }}
    >
      <input {...getInputProps()} />
      <Stack direction={'row'} paddingY={'0.6rem'} flexGrow={1} sx={{placeContent: 'center'}}>
        {
          (isDragActive ? (
            <Typography>Drop clips...</Typography>
          ) : (
            <>
              <Add></Add>
              <Typography>Add Clips</Typography>
            </>
          ))
        }
      </Stack>
      {localClipUploads.map(clipUpload => (
        <Stack direction={'row'}
          sx={{
            flexGrow: 1,
            alignItems: 'center'
          }}
        >
          <Button
            variant="text"
            onClick={(event) => { event.stopPropagation(); console.log("click on clip") }}
            sx={{
              gap: '1rem'
            }}
          >
            <Theaters></Theaters>
            <Typography>
              {clipUpload.file.name}
            </Typography>
          </Button>
          <Button
            sx={{ marginLeft: 'auto' }}
            onClick={(event) => removeClip(event, clipUpload.id)}
          >
            <Delete fontSize="small" sx={{ fill: 'hsl(0, 64.10%, 54.10%)' }}></Delete>
          </Button>
        </Stack>
      ))
      }
    </Stack>
  );
};