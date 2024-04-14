import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Container,
  Typography,
} from "@mui/material";
import TheatersIcon from "@mui/icons-material/Theaters";
import { Box } from "@mui/system";
import { Link, useLocation } from "react-router-dom";
import { GetAllMovies } from "../api-helpers/api-helpers";
import { useDispatch, useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import { adminActions, userActions } from "./Store";
import Alert from "@mui/material/Alert";

const Header = ({ selectedTab, handleTabChange }) => {
  const location = useLocation(); // Get the current location using useLocation()

  // Update the selected tab based on the current location pathname
  React.useEffect(() => {
    switch (location.pathname) {
      case "/Home":
        handleTabChange(null, 0);
        break;
      case "/Movies":
        handleTabChange(null, 1);
        break;
      case "/About":
        handleTabChange(null, 2);
        break;
      case "/Booking":
        handleTabChange(null, 3);
        break;

      // Add cases for other routes if needed
      default:
        handleTabChange(null, 0);
    }
  }, [location.pathname, handleTabChange]);
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [movies, setMovies] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    GetAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const Logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#091138" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TheatersIcon />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MTB
          </Typography>

          <Box flexGrow={1} display="flex" justifyContent="center">
            <Tabs
              textColor="inherit"
              indicatorColor="secondary"
              value={selectedTab} // Use the selectedTab prop to set the value of the Tabs component
              onChange={handleTabChange} // Use the handleTabChange prop as the onChange event handler
              sx={{
                "& .MuiTab-root": { "&:hover": { backgroundColor: "#123456" } },
              }}
            >
              {!isAdminLoggedIn &&
                !isUserLoggedIn && [
                  <Tab key="home" component={Link} to="/Home" label="Home" />,
                  <Tab
                    key="movies"
                    component={Link}
                    to="/Movies"
                    label="Movies"
                  />,
                  <Tab
                    key="About"
                    component={Link}
                    to="/About"
                    label="About"
                  />,
                  <Tab
                    key="admin"
                    component={Link}
                    to="/Admin"
                    label="Admin"
                  />,
                ]}
              {isUserLoggedIn && [
                <Tab key="home" component={Link} to="/Home" label="Home" />,
                <Tab
                  key="movies"
                  component={Link}
                  to="/Movies"
                  label="Movies"
                />,
                <Tab key="About" component={Link} to="/About" label="About" />,
                <Tab
                  key="Booking"
                  component={Link}
                  to="/Booking"
                  label="Booking"
                />,
              ]}
              {isAdminLoggedIn && [
                <Tab key="home" component={Link} to="/Home" label="Home" />,
                <Tab
                  key="movies"
                  component={Link}
                  to="/Movies"
                  label="Movies"
                />,
                <Tab
                  key="admin"
                  component={Link}
                  to="/Aprofile"
                  label="Admin"
                />,
                <Tab
                  key="Add Movie"
                  component={Link}
                  to="/"
                  label="Add Movie"
                />,
              ]}
            </Tabs>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ p: 0 }}>
              {isUserLoggedIn && (
                <Tooltip title="User">
                  <Avatar alt="Amish" src="/static/images/avatar/2.jpg" />
                </Tooltip>
              )}
            </IconButton>

            {isUserLoggedIn && (
              <Tooltip title="Logout">
                <Button
                  sx={{
                    marginLeft: "5px",
                    color: "#fff",
                    borderRadius: "10px",
                    ":hover": {
                      backgroundColor: "#a3211c",
                      color: "#fff",
                    },
                  }}
                  onClick={() => Logout(false)}
                >
                  <LogoutIcon />
                </Button>
              </Tooltip>
            )}
            {showAlert && (
              <Box
                sx={{
                  position: "fixed",
                  top: "5%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 999,
                  maxWidth: 400,
                  width: "90%",
                  borderRadius: 8,
                }}
              >
                <Alert severity="info">You Have Been Logged Out.</Alert>
              </Box>
            )}
            {isAdminLoggedIn && (
              <Tooltip title="Logout">
                <Button
                  sx={{
                    marginLeft: "5px",
                    color: "#fff",
                    borderRadius: "10px",
                    ":hover": {
                      backgroundColor: "#a3211c",
                      color: "#fff",
                    },
                  }}
                  startIcon={<LogoutIcon />}
                >
                  {" "}
                  {"logout"}
                </Button>
              </Tooltip>
            )}
            {!isUserLoggedIn && (
              <Button
                component={Link}
                to="/User"
                sx={{
                  margin: "auto",
                  color: "#fff",
                  borderRadius: "15px",
                  border: "2px solid #808080",
                  ":hover": {
                    backgroundColor: "#808080",
                    color: "#fff",
                  },
                }}
                startIcon={<PersonIcon />}
              >
                {"login"}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
