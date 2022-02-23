import React from "react";
import { isAutheticated } from "../auth/helper";
import Base from "../core/Base";

const UserDashBoard = () => {
  const userName = isAutheticated().user.name;
  return (
    <Base title="User DashBoard" description="">
      <h1 style={{ textAlign: 'center' }}>Welcome to Tshirt Store, {userName}</h1>
    </Base>
  );
};

export default UserDashBoard;
