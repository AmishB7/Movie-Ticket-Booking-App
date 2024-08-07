import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.js";
import HomePage from "./components/HomePage.js";
import Movies from "./components/Movies/Movies.js";
import Admin from "./components/Admin/Admin.js";
import User from "./components/User/User.js";
import UserProfile from "./components/Profile/UserProfile.js";
import AdminProfile from "./components/Profile/AdminProfile.js";
import AddMovie from "./components/Movies/AddMovie.js";
import Success from "./components/Profile/Success.js";
import Failure from "./components/Profile/Failure.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { adminActions, userActions } from "./components/Store/index.js";
import Booking from "./components/Bookings/Booking.js";

function App() {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  console.log("is Admin Logged in", isAdminLoggedIn);
  console.log("Is user logged in ", isUserLoggedIn);
  const [selectedTab, setSelectedTab] = useState(0); // State to keep track of the selected tab

  useEffect(() => {
    if (localStorage.getItem("UserID")) {
      dispatch(userActions.login());
    } else if (localStorage.getItem("adminID")) {
      dispatch(adminActions.login());
    }
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Header selectedTab={selectedTab} handleTabChange={handleTabChange} />
      <section>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setSelectedTab={setSelectedTab}
                handleTabChange={handleTabChange}
              />
            }
          />
          <Route
            path="/Home"
            element={
              <HomePage
                setSelectedTab={setSelectedTab}
                handleTabChange={handleTabChange}
              />
            }
          />
          <Route
            path="/Movies"
            element={<Movies setSelectedTab={setSelectedTab} />}
          />
          <Route
            path="/Admin"
            element={<Admin setSelectedTab={setSelectedTab} />}
          />
          <Route
            path="/User"
            element={<User setSelectedTab={setSelectedTab} />}
          />
          {isUserLoggedIn && (
            <>
              <Route
                path="/Booking"
                element={<UserProfile setSelectedTab={setSelectedTab} />}
              />

              <Route
                path="/success"
                element={<Success setSelectedTab={setSelectedTab} />}
              />
              <Route
                path="/failure"
                element={<Failure setSelectedTab={setSelectedTab} />}
              />
              <Route
                path="/Booking/:id"
                element={
                  <Booking
                    setSelectedTab={setSelectedTab}
                    handleTabChange={handleTabChange}
                  />
                }
              />
            </>
          )}
          {isAdminLoggedIn && (
            <>
              <Route
                path="/AdminProfile"
                element={<AdminProfile setSelectedTab={setSelectedTab} />}
              />
              <Route
                path="/AddMovie"
                element={<AddMovie setSelectedTab={setSelectedTab} />}
              />
            </>
          )}
        </Routes>
      </section>
    </>
  );
}

export default App;
