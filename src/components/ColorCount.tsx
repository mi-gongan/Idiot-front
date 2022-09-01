import React, { useEffect, useState, useCallback } from "react";
import { idiotTowerContract } from "../contracts/contractConfig";
import styled from "styled-components";

function ColorCount() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [black, setBlack] = useState(0);
  const [gray, setGray] = useState(0);
  const [white, setWhite] = useState(0);

  const colorFetch = useCallback(async () => {
    const redCount = await idiotTowerContract.methods
      .countTokenColor("red")
      .call();
    setRed(redCount);
    const greenCount = await idiotTowerContract.methods
      .countTokenColor("green")
      .call();
    setGreen(greenCount);
    const blueCount = await idiotTowerContract.methods
      .countTokenColor("blue")
      .call();
    setBlue(blueCount);
    const blackCount = await idiotTowerContract.methods
      .countTokenColor("black")
      .call();
    setBlack(blackCount);
    const grayCount = await idiotTowerContract.methods
      .countTokenColor("gray")
      .call();
    setGray(grayCount);
    const whiteCount = await idiotTowerContract.methods
      .countTokenColor("white")
      .call();
    setWhite(whiteCount);
  }, []);

  useEffect(() => {
    colorFetch();
  }, [colorFetch]);

  return (
    <Wrap>
      <div className="description">현재 색깔별 minting된 갯수</div>
      <div>red : {red}</div>
      <div>green : {green}</div>
      <div>blue : {blue}</div>
      <div>black : {black}</div>
      <div>gray : {gray}</div>
      <div>white : {white}</div>
    </Wrap>
  );
}

export default ColorCount;

const Wrap = styled.div`
  .description {
    font-size: 18px;
    margin: 10px;
  }
  margin-bottom: 30px;
`;
