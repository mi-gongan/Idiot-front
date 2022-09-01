import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { accountAtom } from "../recoil/user";
import styled from "styled-components";

function Layout() {
  const router = useRouter();
  const [account, setAccount] = useRecoilState(accountAtom);
  const [render, setRender] = useState("");
  const [present, setPresent] = useState("");

  useEffect(() => {
    setRender("ok");
    setPresent(router.pathname);
  }, [router]);

  const goHome = () => {
    router.push("/");
  };

  const handleMint = () => {
    router.push("/minting");
  };

  const handleMypage = () => {
    router.push("/mypage");
  };

  const handleLogin = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        router.push("/");
      } else {
        alert("Install MetaMask");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrap>
      <h2 className="title" onClick={goHome}>
        Idiot Tower
      </h2>
      <div>
        {render && account && (
          <button
            onClick={handleMint}
            className={present === "/minting" ? "show" : ""}
          >
            Minting
          </button>
        )}
      </div>
      <div>
        {render && account ? (
          <button
            onClick={handleMypage}
            value="/mypage"
            className={present === "/mypage" ? "show" : ""}
          >
            Mypage
          </button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
    </Wrap>
  );
}

export default Layout;

const Wrap = styled.div`
  display: flex;
  position: relative;
  justify-content: flex-end;
  height: 80px;
  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  button {
    height: 30px;
    margin: 20px 30px 0px 30px;
  }
  .show {
    color: black;
    font-weight: 700;
  }
  border-bottom: 1px solid;
  margin-bottom: 20px;

  @media screen and (width< 620px) {
    .title {
      left: 20%;
    }
  }
`;
