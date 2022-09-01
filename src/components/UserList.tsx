import React, { useState, useEffect } from "react";
import { idiotTowerContract } from "../contracts/contractConfig";
import styled from "styled-components";

function UserList() {
  const [users, setUsers] = useState<Array<string>>([]);
  const [cowardUsers, setCowardUsers] = useState<Array<string>>([]);
  const [choice, setChoice] = useState("user");
  const getUserList = async () => {
    const userList = await idiotTowerContract.methods.getUserList().call();
    setUsers(userList);
    console.log(userList);
  };
  const getCowardList = async () => {
    const cowardList = await idiotTowerContract.methods.getCowardList().call();
    setCowardUsers(cowardList);
    console.log(cowardList);
  };

  useEffect(() => {
    getUserList();
    getCowardList();
  }, []);

  const showUser = () => {
    setChoice("user");
  };

  const showCoward = () => {
    setChoice("coward");
  };
  return (
    <Wrap>
      <Choice>
        <div className={choice === "user" ? "choice" : ""} onClick={showUser}>
          User
        </div>
        <div
          className={choice === "coward" ? "choice" : ""}
          onClick={showCoward}
        >
          Coward
        </div>
      </Choice>
      {choice === "user" ? (
        <List>
          <div className="description">User List</div>
          {users.map((user, index) => (
            <div key={index}>{user}</div>
          ))}
        </List>
      ) : (
        <List>
          <div className="description">Coward List</div>
          {cowardUsers.map((user, index) => (
            <div key={index}>{user}</div>
          ))}
        </List>
      )}
    </Wrap>
  );
}

export default UserList;

const Wrap = styled.div`
  text-align: center;
`;
const Choice = styled.div`
  display: flex;
  justify-content: center;
  div {
    font-size: 20px;
    padding: 7px;
    margin: 5px;
    cursor: pointer;
  }
  .choice {
    border: 2px solid blue;
    border-radius: 7px;
    font-weight: 600;
  }
`;
const List = styled.div`
  .description {
    font-size: 24px;
    margin: 10px;
  }
`;
