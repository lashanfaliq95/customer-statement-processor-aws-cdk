import readFromS3 from "./helpers/readFromS3";
import { saveAs } from "file-saver";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import { getFormat, delay } from "./utils";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { ToastContainer } from "react-toastify";
import {
  createSuccessNotification,
  createFailureNotification,
} from "./helpers/notifications";

function App() {
  const queryClient = useQueryClient();

  const { data: inputList } = useQuery({
    queryKey: ["bucketList"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/file-list/bucket/${process.env.REACT_APP_INPUT_BUCKET_NAME}`
      );
      return res.data;
    },
  });

  const { data: outputList } = useQuery({
    queryKey: ["bucketListOutput"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/file-list/bucket/${process.env.REACT_APP_OUTPUT_BUCKET_NAME}`
      );
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(`${process.env.REACT_APP_BASE_URL}/run-job-cloud`);
    },
    onSuccess: async () => {
      createSuccessNotification("Successfully ran job");
      await delay(3000);
      queryClient.invalidateQueries({ queryKey: ["bucketListOutput"] });
    },
    onError: async () => {
      createFailureNotification("Failed to run job");
    },
  });

  const { mutate: uploadMutate } = useMutation({
    mutationFn: (data: any) => {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      return axios.post(
        `${process.env.REACT_APP_BASE_URL}/upload-file/bucket/${process.env
          .REACT_APP_INPUT_BUCKET_NAME!}`,
        data,
        config
      );
    },
    onSuccess: async () => {
      // Workaround wait for file to upload to s3
      createSuccessNotification("Successfully uploaded file");
      await delay(3000);
      queryClient.invalidateQueries({ queryKey: ["bucketList"] });
    },
    onError: async () => {
      createFailureNotification("Failed to upload file");
    },
  });

  const asyncFunc = async (file: string, isInputBucket: boolean) => {
    const blob: any = await readFromS3(
      file,
      isInputBucket
        ? process.env.REACT_APP_INPUT_BUCKET_NAME!
        : process.env.REACT_APP_OUTPUT_BUCKET_NAME!
    );

    const finalBlob = new Blob([blob], {
      type: getFormat(file),
    });

    saveAs(finalBlob!, file);
  };

  return (
    <>
      <Container fluid style={{ padding: "5%" }}>
        <Row style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1>Customer statement processor</h1>
        </Row>

        <Row>
          <Col md="4">
            {inputList && (
              <FileList list={inputList} onClick={asyncFunc} isInputBucket />
            )}
          </Col>
          <Col
            md="4"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FileUpload OnFileUpload={(data: any) => uploadMutate(data)} />
            <Button
              variant="secondary"
              onClick={() => {
                mutation.mutate();
              }}
              size="sm"
              style={{ width: "30%", marginTop: "10px", alignSelf: "center" }}
            >
              Run Job
            </Button>
          </Col>
          <Col md="4">
            {outputList && <FileList list={outputList} onClick={asyncFunc} />}
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
}

export default App;
