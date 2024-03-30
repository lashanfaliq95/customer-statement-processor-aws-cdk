import { useCallback, useState, Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { PreviewImageWrapper, DropZoneBody, PreviewImage } from "./styles";
import { writeToS3 } from "../UploadToS3";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
    writeToS3(acceptedFiles[0], "records.pdf");
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    // accept: { "image/*": [".jpeg", ".png"] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
    maxSize: 256000,
    onDrop,
  });

  return (
    <DropZoneBody
      {...getRootProps()}
      onClick={open}
      // style={{
      //   "&:hover": {
      //     cursor: "pointer",
      //   },
      // }}
    >
      <input {...getInputProps()} />
      <div>
        <div>Drag image here (only .png and .jpeg formats. max size 256kb)</div>
        <div>
          {selectedFile ? (
            <PreviewImageWrapper>
              <PreviewImage
                src={selectedFile ? URL.createObjectURL(selectedFile) : "asd"}
              />
            </PreviewImageWrapper>
          ) : (
            <></>
            // <FiImage size={100}></FiImage>
          )}
        </div>
      </div>
    </DropZoneBody>
  );
}
