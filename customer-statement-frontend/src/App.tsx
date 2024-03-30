import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import getFileListFromS3 from "./getFileListFromS3";
import readFromS3 from "./readFromS3";
import { Button } from "react-bootstrap";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FileUpload from "./components/FileUpload";

const filePattern = /\.[0-9a-z]+$/i;
const csvFormat = "text/csv;charset=utf-8;";
const xmlFormat = "text/xml;charset=utf-8;";
const pdfFormat = "application/pdf";

const getFormat = (file: string) => {
  const ext = file.match(filePattern)?.[0];
  let format;
  if (ext === ".csv") {
    format = csvFormat;
  } else if (ext === ".xml") {
    format = xmlFormat;
  } else {
    format = pdfFormat;
  }
  return format;
};

function App() {
  const [inputList, setInputList] = useState([]);
  const [outputList, setOutputList] = useState([]);

  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      // get the data from the api
      const inputList = await getFileListFromS3(true);
      const outputList = await getFileListFromS3(false);

      setInputList(inputList);
      setOutputList(outputList);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  const asyncFunc = async (file: string) => {
    const blob: any = await readFromS3(file);
    console.log(blob);
    const content = await blob.Body.transformToByteArray();
    console.log("content", content, content.toString());
    console.log(file, getFormat(file));
    const finalBlob = new Blob([content], {
      type: getFormat(file),
    });

    saveAs(finalBlob!, file);
  };

  return (
    <Container>
      <Row>
        <Col md="4">
          {" "}
          <ListGroup>
            {inputList?.map(({ Key }) => (
              <>
                <ListGroup.Item key={Key}></ListGroup.Item>
                {Key} <Button onClick={() => asyncFunc(Key)}>download</Button>
              </>
            ))}
          </ListGroup>
        </Col>
        <Col md="4">
          <FileUpload />
        </Col>
        <Col md="4">
          {" "}
          Output
          <ListGroup>
            {" "}
            {outputList?.map(({ Key }) => (
              <>
                <ListGroup.Item key={Key}></ListGroup.Item>
                {Key} <Button onClick={() => asyncFunc(Key)}>download</Button>
              </>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
