import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { accountAtom } from "../recoil/user";
import { idiotTowerContract } from "../contracts/contractConfig";
import { useRouter } from "next/router";

function MypageTemplate() {
  const router = useRouter();
  const [account, setAccount] = useRecoilState(accountAtom);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [tokenArray, setTokenArray] = useState<Array<Array<string>>>([]);
  const [sendAccount, setSendAccount] = useState("");
  const [show, setShow] = useState("");
  const [loading, setLoading] = useState("");
  const [isCoward, setIsCoward] = useState(false);
  const [isMint, setIsMint] = useState(false);
  const [clickToken, setClickToken] = useState("");

  const fetchFunc = useCallback(async () => {
    try {
      const count = await idiotTowerContract.methods.balanceOf(account).call();
      setTokenCount(count);
      const cowardCheck = await idiotTowerContract.methods
        .checkUserIsCoward(account)
        .call();
      setIsCoward(cowardCheck);
      const mintCheck = await idiotTowerContract.methods
        .checkUserHaveMinted(account)
        .call();
      setIsMint(mintCheck);
    } catch (err) {
      console.log(err);
    }
  }, [account]);

  const fetchToken = useCallback(async () => {
    try {
      const tokens = await idiotTowerContract.methods.getTokens(account).call();
      setTokenArray(tokens);
      console.log(tokens);
    } catch (err) {
      console.log(err);
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      fetchToken();
      fetchFunc();
    }
  }, [account, fetchToken, fetchFunc]);

  const handleLogout = async () => {
    setAccount("");
    router.push("/");
  };

  const accountInput = (e: any) => {
    setSendAccount(e.target.value);
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    setSendAccount("");
    setLoading("true");
    try {
      await idiotTowerContract.methods
        .transferNFT(account, sendAccount, clickToken)
        .send({ from: account });
      setLoading("");
      router.reload();
    } catch (err) {
      console.log(err);
      setLoading("");
      router.reload();
    }
  };

  const handleClose = () => {
    setShow("");
  };

  return (
    <div>
      {show && (
        <Modal>
          <div className="background" onClick={handleClose}></div>
          <div className="account-input">
            <div className="close" onClick={handleClose}>
              X
            </div>
            <div className="alert-text">
              No. {clickToken}을 전송하시겠습니까?
            </div>
            {!loading ? (
              <div className="input-wrap">
                <input
                  onChange={accountInput}
                  value={sendAccount}
                  placeholder="보내는 계정"
                ></input>
                <button onClick={handleSend}>전송하기</button>
              </div>
            ) : (
              <div className="loading">보내는중입니다..</div>
            )}
          </div>
        </Modal>
      )}
      <Wrap>
        <Account>
          <div className="account-text">내 계정</div>
          <div className="account">{account}</div>
          <div className="is-coward">
            겁쟁이 여부 : {isCoward === true ? "맞습니다!" : "아닙니다"}
          </div>
          <div className="is-mint">
            민팅 여부 : {isMint === true ? "민팅했습니다" : "하지 않았습니다"}
          </div>
          <div>내 토큰 갯수 : {tokenCount}</div>
        </Account>
        {!loading ? (
          tokenArray.map((token) => (
            <Token key={token[0]}>
              <Image
                alt="nftImg"
                src={"https://ipfs.io/ipfs/" + token[2]}
                width="300px"
                height="10px"
                style={{ zIndex: -1, position: "relative" }}
              ></Image>
              <div className="description">
                <div>No. {token[0]}</div>
                <button
                  onClick={() => {
                    setClickToken(token[0]);
                    setShow("show");
                  }}
                >
                  NFT 선물하기
                </button>
              </div>
            </Token>
          ))
        ) : (
          <div className="loading">보내는중입니다</div>
        )}

        <Logout>
          <button onClick={handleLogout}>로그아웃</button>
        </Logout>
      </Wrap>
    </div>
  );
}

export default MypageTemplate;

const Wrap = styled.div`
  text-align: center;
  .loading {
    margin: 30px;
  }
`;

const Token = styled.div`
  padding-top: 10px;
  margin: auto;
  max-width: 450px;
  .description {
    margin: 30px;
    display: flex;
    justify-content: space-between;
  }
  border: 1px solid;
`;

const Account = styled.div`
  max-width: 450px;
  margin: 0px auto;
  padding: 20px;
  border: 1px solid white;
  .account-text {
    font-size: 24px;
    margin-bottom: 14px;
  }
  .account {
    color: yellow;
  }
  .is-coward {
    margin-top: 24px;
    margin-bottom: 7px;
  }
  .is-mint {
    margin-bottom: 7px;
  }
`;

const Logout = styled.div`
  margin-top: 100px;
  button {
    font-size: 16px;
  }
`;

const Modal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  .background {
    z-index: 1;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.9);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .account-input {
    position: relative;
    z-index: 2;
    width: 600px;
    height: 200px;
    background-color: white;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    .loading {
      position: absolute;
      color: black;
      bottom: 30px;
    }
    .close {
      position: absolute;
      color: black;
      right: 30px;
      top: 20px;
      font-weight: 700;
      font-size: 18px;
      cursor: pointer;
    }
    .alert-text {
      position: absolute;
      color: black;
      top: 70px;
      font-weight: 700;
    }
    .input-wrap {
      margin-top: 150px;
    }
    input {
      width: 300px;
      height: 30px;
      margin-right: 10px;
      background-color: aqua;
      padding: 10px;
      color: black;
    }
    button {
      background-color: blue;
      border: none;
      padding: 7px;
      border-radius: 5px;
    }
  }
`;
