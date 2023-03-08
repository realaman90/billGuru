'use client';
import { useState, ChangeEvent } from 'react';
import { Box, Typography } from '@mui/material';
import { Upload } from '@mui/icons-material';
import CreateIcon from '@mui/icons-material/Create';

interface ImageUploaderProps {
  styleProps: any;
  hoverStyles: any;
  label: string;
  handleImageUpload: Function;
}

type OnChangeHandler = (file: File) => void;

export const ImageUploader = ({
  styleProps,
  hoverStyles,
  label,
  handleImageUpload,
}: ImageUploaderProps) => {
  const [file, setFile] = useState<File>();

  const handleFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
    if (selectedFile) {
      handleImageUpload(selectedFile);
    }
  };

  let content = '';
  let previewImage = '';
  if (file) {
    previewImage = URL.createObjectURL(file);
  }

  return (
    <Box
      sx={{
        width: 50,
        height: 100,
        backgroundColor: 'white',
        border: 'solid 1px lightgray',
        borderRadius: 2,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        transition: 'border 0.3s',
        ...styleProps,

        '&:hover': {
          ...hoverStyles,
        },
      }}
    >
      {!file && (
        <Box
          sx={{
            position: 'absolute',
            width: styleProps.width,
            height: styleProps.height,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
          }}
          hidden={file !== undefined}
        >
          {label && (
            <Typography
              sx={{
                fontSize: { xs: '0.6em', sm: '0.8em', md: '1em' },
                width: '100%',
                textAlign: 'center',
                color: 'gray',
              }}
            >
              {label}
            </Typography>
          )}
          <Upload fontSize="large" />
        </Box>
      )}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          display: 'flex',
        }}
      >
        <label
          htmlFor="file-uploader"
          style={{
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            zIndex: 20,
          }}
          onMouseEnter={() => {
            content = 'Click to change';
            console.log(content);
          }}
          onMouseLeave={() => {
            content = '';
          }}
        >
          <input
            id="file-uploader"
            name="file-uploader"
            type="file"
            accept="image/*"
            onChange={handleFile}
            hidden
          />
        </label>
      </Box>
      {file && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            margin: 'auto',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <img
            src={previewImage}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: `contain`,
              borderRadius: 5,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 25, sm: 30 },
              height: { xs: 25, sm: 30 },
              backgroundColor: '#6750a4',
              borderRadius: 100,
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CreateIcon
              sx={{
                color: 'white',
                width: '60%',
                height: '60%',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
