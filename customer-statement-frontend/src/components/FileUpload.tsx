import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DropZoneBody } from "./styles";
import { FiImage } from "react-icons/fi";

export default function FileUpload({ OnFileUpload }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    setSelectedFile(acceptedFiles[0])
    OnFileUpload(formData);
  }, [OnFileUpload]);
  
  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    noClick: true,
    noKeyboard: true,
    maxSize: 256000,
    onDrop,
  });

  return (
    <DropZoneBody {...getRootProps()} onClick={open}>
      <input {...getInputProps()} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <div>Drag file here to upload to input s3</div>
        <div>
          <FiImage size={100}></FiImage>
        </div>
        <span> {selectedFile && (selectedFile as any).path}</span>
      </div>
    </DropZoneBody>
  );
}
