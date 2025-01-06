import React from 'react';
import { Box, Typography } from '@mui/material';
import { Upload } from '@mui/icons-material';
import {DropzoneInputProps, DropzoneRootProps} from "react-dropzone";
interface ImageDropzoneProps {
  isDragActive: boolean;
  getRootProps:  <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps:  <T extends DropzoneInputProps>(props?: T) => T;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ isDragActive, getRootProps, getInputProps }) => (
  <Box
    {...getRootProps()}
    sx={{
      border: '2px dashed',
      borderColor: isDragActive ? 'primary.main' : 'grey.300',
      borderRadius: 2,
      p: 4,
      textAlign: 'center',
      cursor: 'pointer',
      bgcolor: isDragActive ? 'action.hover' : 'background.paper',
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: 'action.hover',
      },
    }}
  >
    <input {...getInputProps()} />
    <Upload width={48} className="mx-auto mb-4 text-gray-400" />
    <Typography variant="h6" gutterBottom>
      {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      or click to select a file
    </Typography>
  </Box>
);