import axios from "axios";

export const GetAllMovies = async () => {
  const res = await axios.get("/movie").catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("No Data");
  }

  const data = await res.data;
  return data;
};

export const sendUserAuthReq = async (data, signup) => {
  console.log("Data received:", data);
  console.log("route", signup);
  const res = await axios
    .post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    })
    .catch((err) => console.log(err));
  if (res.status !== 200 && res.status !== 201) {
    console.log("Unexpected error occured");
  }

  const resData = await res.data;
  return resData;
};

export const sendAdminAuthReq = async (data) => {
  console.log("Data received:", data);
  const res = await axios
    .post("admin/login", {
      email: data.email,
      password: data.password,
    })
    .catch((err) => {
      return console.log(err);
    });
  if (res.status !== 200 && res.status !== 201) {
    console.log("unexpected error occured");
  }
  const resdata = await res.data;
  return resdata;
};

export const getMovieDetails = async (id) => {
  const res = await axios.get(`/movie/${id}`).catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("unexpected Error");
  }
  const resData = await res.data;
  return resData;
};
