import React, { useState } from "react";
import { idiotTowerContract } from "../contracts/contractConfig";
import { useRecoilValue } from "recoil";
import { accountSelector } from "../recoil/user";
import { useRouter } from "next/router";
import ColorCount from "./ColorCount";
import styled from "styled-components";
import { web3 } from "../contracts/contractConfig";

function MintingTemplate() {
  const router = useRouter();
  const account = useRecoilValue(accountSelector);
  const [number, setNumber] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const isOwner =
    account.toLowerCase() ===
    "0xEb813BD873fEE01C3Be4B2aCfc4f13f34Cea6ED5".toLowerCase();
  const normalNFTPrice = web3.utils.toWei(`${0.01 * number}`, "ether");

  const numberChange = (e: any) => {
    setNumber(e.target.value);
  };

  const handleNoramlMint = async () => {
    try {
      if (typeof window !== "undefined") {
        setLoading(true);
        await idiotTowerContract.methods
          .mintAndPay(number)
          .send({ from: account, value: normalNFTPrice });
        router.push("/mypage");
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOwnerMint = async () => {
    try {
      if (typeof window !== "undefined") {
        setLoading(true);
        await idiotTowerContract.methods
          .ownerMint(number)
          .send({ from: account });
        router.push("/mypage");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <Wrap>
      <ColorCount />
      {!loading ? (
        <MintingBox>
          <input
            placeholder="number of minting"
            onChange={numberChange}
            value={number}
          ></input>
          <button onClick={isOwner ? handleOwnerMint : handleNoramlMint}>
            {isOwner ? "오너민트" : "그냥민트"}
          </button>
          <div className="price">가격:{isOwner ? 0 : 0.01 * number} ether</div>
        </MintingBox>
      ) : (
        <div>NFT 제작중입니다..</div>
      )}
    </Wrap>
  );
}

export default MintingTemplate;

const Wrap = styled.div`
  text-align: center;
`;

const MintingBox = styled.div`
  button {
    margin: 5px;
  }
  .price {
    margin-top: 10px;
  }
`;
