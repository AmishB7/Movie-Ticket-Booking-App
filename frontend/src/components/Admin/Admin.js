import React from "react";
import AuthForm from "../Auth/AuthForm";
import { sendAdminAuthReq } from "../../api-helpers/api-helpers";
import { useDispatch } from "react-redux";
import { adminActions } from "../Store";

const Admin = () => {
  const dispatch = useDispatch();
  const onResReceived = (data) => {
    console.log(data);
    dispatch(adminActions.login());
    localStorage.setItem("adminID", data.id);
    localStorage.setItem("token", data.token);
  };

  const getData = (data) => {
    console.log("admin", data);
    sendAdminAuthReq(data)
      .then(onResReceived)
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={true} />
    </div>
  );
};

export default Admin;
