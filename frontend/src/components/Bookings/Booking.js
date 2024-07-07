import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";
import { Typography, Box, FormLabel, TextField, Button } from "@mui/material";

const Booking = () => {
  const [movie, setMovie] = useState();
  const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
  const { id } = useParams();

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => {
        console.log("Movie Details:", res.movie);
        setMovie(res.movie);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movie && movie.ticketPrice) {
      const bookingData = {
        movie: movie._id,
        seatNumber: inputs.seatNumber,
        date: inputs.date,
        price: movie.ticketPrice,
      };

      console.log("Booking Data:", bookingData);

      newBooking(bookingData)
        .then((res) => console.log("Booking Response:", res))
        .catch((err) => console.log(err));
    } else {
      console.log("Movie or ticket price is not available");
    }
  };

  return (
    <div>
      {movie && (
        <Fragment>
          <Typography
            padding={3}
            fontFamily={"fantasy"}
            variant="h4"
            textAlign={"center"}
            color={"#FAF9F6"}
          >
            Book Tickets of Movie : {movie.title}
          </Typography>
          <Box display={"flex"} justifyContent={"center"}>
            <Box
              display={"flex"}
              justifyContent={"column"}
              flexDirection={"column"}
              paddingTop={3}
              width={"50%"}
              marginRight={"auto"}
              paddingLeft={4}
            >
              <img
                width={"80%"}
                height={"300px"}
                src={movie.posterUrl}
                alt={movie.title}
              />
              <Box width={"80%"} marginTop={3} padding={2} color={"#FAF9F6"}>
                <Typography paddingTop={2} fontWeight={"bold"}>
                  Description: {movie.description}
                </Typography>
                <Typography fontWeight={"bold"} marginTop={1}>
                  Cast:
                  {movie.cast.map((cast) => " " + cast + " ")}
                </Typography>
                <Typography fontWeight={"bold"} marginTop={1}>
                  Release Date : {new Date(movie.releaseDate).toDateString()}
                </Typography>
                <Typography fontWeight={"bold"} marginTop={1}>
                  Ticket Price : {movie.ticketPrice}
                </Typography>
              </Box>
            </Box>
            <Box width={"50%"} paddingTop={"10px"}>
              <form onSubmit={handleSubmit}>
                <Box
                  padding={8}
                  margin={"auto"}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  <FormLabel sx={{ color: "#db322b", fontWeight: "bold" }}>
                    Seat Number:
                  </FormLabel>
                  <TextField
                    value={inputs.seatNumber}
                    onChange={handleChange}
                    name="seatNumber"
                    type="number"
                    margin="normal"
                    InputProps={{ sx: { color: "#FAF9F6" } }}
                    variant="standard"
                    sx={{
                      "& .MuiInput-root": {
                        color: "#FAF9F6",
                        fontFamily: "Arial",
                        "&:before": {
                          borderColor: "#FAF9F6",
                          borderWidth: "2px",
                        },
                        "&:after": {
                          borderColor: "#FAF9F6",
                          borderWidth: "3px",
                        },
                      },
                      // Label
                      "& .MuiInputLabel-standard": {
                        color: "#FAF9F6",
                        "&.Mui-focused": {
                          color: "#FAF9F6",
                        },
                      },
                    }}
                  />
                  <FormLabel sx={{ color: "#db322b", fontWeight: "bold" }}>
                    Booking Date:
                  </FormLabel>
                  <TextField
                    value={inputs.date}
                    onChange={handleChange}
                    name="date"
                    type="date"
                    margin="normal"
                    variant="standard"
                    sx={{
                      "& .MuiInput-root": {
                        color: "#FAF9F6",
                        "&:before": {
                          borderColor: "#FAF9F6",
                          borderWidth: "2px",
                        },
                        "&:after": {
                          borderColor: "#FAF9F6",
                          borderWidth: "2px",
                        },
                      },
                      // Label
                      "& .MuiInputLabel-standard": {
                        color: "#FAF9F6",
                        "&.Mui-focused": {
                          color: "#FAF9F6",
                        },
                      },
                    }}
                    InputProps={{ sx: { color: "#FAF9F6" } }}
                  />
                  <Button
                    type="submit"
                    sx={{
                      margin: "auto",
                      color: "#fff",
                      borderRadius: "15px",
                      border: "2px solid #808080",
                      ":hover": {
                        backgroundColor: "#44b35e;",
                        color: "#fff",
                        border: "2px solid #44b35e;",
                      },
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Fragment>
      )}
    </div>
  );
};

export default Booking;
