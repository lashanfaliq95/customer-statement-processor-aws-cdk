import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { IoMdDownload } from "react-icons/io";
import Card from "react-bootstrap/Card";

function DefaultExample({
  list,
  onClick,
  isInputBucket,
}: {
  list: any;
  onClick: any;
  isInputBucket?: boolean;
}) {
  console.log("list", list);
  return (
    <Card style={{ minHeight: "500px" }}>
      <Card.Body>
        <Card.Title>
          {isInputBucket ? "Input bucket file list" : "Output bucket file list"}
        </Card.Title>

        <ListGroup as="ol" numbered>
          {list &&
            list.map((item: any) => (
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{item.Key}</div>
                  {new Date(item.LastModified).toDateString()}
                </div>
                <Button
                  variant="warning"
                  onClick={() => onClick(item.Key, isInputBucket)}
                >
                  <IoMdDownload />
                </Button>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default DefaultExample;
