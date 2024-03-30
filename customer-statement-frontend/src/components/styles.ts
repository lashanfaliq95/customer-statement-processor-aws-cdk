import styled from "styled-components";

const PreviewImageWrapper = styled.div`
  display: inline-flex;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 100px;
  height: 100px;
  padding: 4px;
  box-sizing: border-box;
`;

const DropZoneBody = styled.div`
  padding: 10px;
  border: 1px #d8dbe0;
  background: #ebedef;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  &:hover {
    background-color: #e4f9f9;
  }
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export { PreviewImageWrapper, DropZoneBody, PreviewImage, BtnWrapper };
