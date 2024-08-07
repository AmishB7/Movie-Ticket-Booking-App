import React, { useState } from "react";
import {
  Box,
  Button,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const labelStyle = { mt: 1, mb: 1 };
const AuthForm = ({ onSubmit, isAdmin, handleClose }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate(); 
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputs, isSignup);
    navigate('/');
  };
  return (
    <Dialog PaperProps={{ style: { borderRadius: 20 } }} open={true}>
      <Box
        sx={{
          marginLeft: "auto",
          padding: 1,
        }}
      >
        <IconButton onClick={handleClose}>
          <CloseIcon />{" "}
        </IconButton>
      </Box>
      <Typography
        variant="standard"
        textAlign={"center"}
        fontSize={40}
        fontFamily={"serif"}
      >
        {isSignup ? "SIGNUP" : "Login"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box
          padding={6}
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
          width={400}
          margin={"auto"}
          alignContent={"center"}
        >
          {!isAdmin && isSignup && (
            <>
              {" "}
              <FormLabel sx={labelStyle}>Name</FormLabel>
              <TextField
                value={inputs.name}
                onChange={handleChange}
                margin="normal"
                variant="standard"
                type={"text"}
                name="name"
              />
            </>
          )}
          <FormLabel sx={labelStyle}>Email</FormLabel>
          <TextField
            value={inputs.email}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"email"}
            name="email"
          />
          <FormLabel>Password</FormLabel>
          <TextField
            value={inputs.password}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"password"}
            name="password"
          />
          <Button
            sx={{
              marginTop: 2,
              borderRadius: 10,
              bgcolor: "#4682B4",
              fontFamily: "serif",
            }}
            type="submit"
            fullWidth
            variant="contained"
          >
            {isSignup ? "Signup" : "Login"}
          </Button>
          {!isAdmin && (
            <Typography marginTop={2} textAlign={"center"}>
              {isSignup
                ? "Already have an account ?"
                : "Don't have an account ?"}{" "}
              <Button
                onClick={() => setIsSignup(!isSignup)}
                sx={{ textDecoration: "underline" }}
              >
                {" "}
                {isSignup ? "Login" : "Sign up"}{" "}
              </Button>
            </Typography>
          )}
        </Box>
      </form>
    </Dialog>
  );
};

export default AuthForm;
