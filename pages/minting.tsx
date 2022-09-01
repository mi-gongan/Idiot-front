import React from "react";
import MintingTemplate from "../src/components/MintingTemplate";
import dynamic from "next/dynamic";

const DynamicMinting = dynamic(
  () => import("../src/components/MintingTemplate"),
  {
    ssr: false,
  }
);
function minting() {
  return <DynamicMinting />;
}

export default minting;
