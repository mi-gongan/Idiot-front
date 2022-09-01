import React from "react";
import dynamic from "next/dynamic";

const DynamicMypage = dynamic(
  () => import("../src/components/MypageTemplate"),
  {
    ssr: false,
  }
);

function mypage() {
  return <DynamicMypage />;
}

export default mypage;
