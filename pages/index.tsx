import type { NextPage } from "next";
import dynamic from "next/dynamic";

const DynamicUserList = dynamic(() => import("../src/components/UserList"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <DynamicUserList />
    </>
  );
};

export default Home;
