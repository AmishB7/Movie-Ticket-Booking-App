import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GetAllMovies } from "../../api-helpers/api-helpers";
import MovieItem from "./MovieItem";
const Movies = () => {
  const [movies, setMovies] = useState();
  useEffect(() => {
    GetAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Box margin={"auto"} marginTop={4}>
      <Typography
        margin="auto"
        variant="h5"
        fontSize="25px"
        width="40%"
        color={"#FAF9F6"}
        textAlign={"center"}
        padding={1}
      >
        NOW SHOWING
      </Typography>
      <Box
        width={"95%"}
        margin={"auto"}
        display={"flex"}
        flexWrap={"wrap"}
        marginTop={5}
        justifyContent="flex-start"
        paddingLeft={10}
      >
        {movies &&
          movies.map((movie, index) => (
            <MovieItem
              key={index}
              id={movie._id}
              title={movie.title}
              PosterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              trailerUrl={movie.trailerUrl}
              duration={movie.duration}
              ticketPrice={movie.ticketPrice}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Movies;
