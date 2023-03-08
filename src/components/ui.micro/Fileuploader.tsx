import React, { useState, ChangeEvent } from "react";
import { AttachFile, Close } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { OutlineButton, PrimaryButton } from "./Buttons";

interface FileUploadProps {
  label: string;
  onChange: (file: File) => void;
}

export default function FileUpload({ label, onChange }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);

  const handleFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <label htmlFor="files" style={{ display: "none" }}>
        {label}
      </label>
      <input
        name="uploads"
        id="files"
        type="file"
        style={{ display: "none" }}
        accept=".jpg, .jpeg, .png, .svg, .gif , .pdf , .docx"
        onChange={handleFile}
      />
      <OutlineButton  startIcon={<AttachFile fontSize="small" />} onChange={()=>{setToggle(!toggle)}}>
        {label}
      </OutlineButton>
      {file && (
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Typography>{file.name}</Typography>
          <Close color="primary" fontSize="small" onClick={() => setFile(null)} />
        </Box>
      )}
    </div>
  );
}
