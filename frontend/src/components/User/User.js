import React from "react";
import AuthForm from "../Auth/AuthForm";
import { sendUserAuthReq } from "../../api-helpers/api-helpers";
import { useDispatch } from "react-redux";
import { userActions } from "../Store";

const User = () => {
  const dispatch = useDispatch();
  const onResReceived = (data) => {
    console.log(data);
    dispatch(userActions.login());
    localStorage.setItem("UserID", data.id);
  };
  const getData = (data, signup) => {
    console.log("User", data);
    sendUserAuthReq(data, signup)
      .then(onResReceived)
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={false} />
    </div>
  );
};

export default User;
