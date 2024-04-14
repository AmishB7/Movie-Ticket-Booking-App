// import { Box, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import MovieItem from "./Movies/MovieItem";
// import poster from "../Images/poster.jpg";
// import { Link } from "react-router-dom";
// import { GetAllMovies } from "../api-helpers/api-helpers";
// import Button from "@mui/material/Button";

// const HomePage = () => {
//   const [movies, setMovies] = useState([]);
//   useEffect(() => {
//     GetAllMovies()
//       .then((data) => setMovies(data.movies))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <Box width={"100%"} height={"100%"} margin="auto" marginTop={2}>
//       <Box margin={"auto"} width={"90%"} height={"65vh"}>
//         <img src={poster} alt="poster" width={"100%"} height={"100%"} />
//       </Box>
//       <Box padding={5} margin={"auto"}>
//         <Typography
//           variant="h5"
//           textAlign={"center"}
//           color={"#FAF9F6"}
//           fontSize="25px"
//           width={"40%"}
//           margin={"auto"}
//           padding={1}
//         >
//           NOW SHOWING
//         </Typography>
//       </Box>
//       <Box
//         display="flex"
//         width="95%"
//         flexWrap="wrap"
//         margin={"auto"}
//         paddingLeft={10}
//         justifyContent="flex-start"
//       >
//         {movies &&
//           movies
//             .slice(0, 4)
//             .map((movie, index) => (
//               <MovieItem
//                 id={movie._id}
//                 title={movie.title}
//                 PosterUrl={movie.posterUrl}
//                 trailerUrl={movie.trailerUrl}
//                 releaseDate={movie.releaseDate}
//                 duration={movie.duration}
//                 key={index}
//               />
//             ))}
//       </Box>
//       <Box display={"flex"} padding={5} margin={"auto"}>
//         <Button
//           LinkComponent={Link}
//           to="/Movies"
//           variant="outlined"
//           sx={{ margin: "auto", color: "wheat" }}
//         >
//           View all Movies
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default HomePage;

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MovieItem from "./Movies/MovieItem";
import poster from "../Images/poster.jpg";
import { useNavigate } from "react-router-dom";
import { GetAllMovies } from "../api-helpers/api-helpers";
import Button from "@mui/material/Button";

const HomePage = ({ handleTabChange, setSelectedTab }) => {
  useEffect(() => {
    setSelectedTab(0); // Update selected tab state when navigating to the home page
  }, [setSelectedTab]);

  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const handleViewAllMovies = () => {
    handleTabChange(1); // Update the selected tab index to 1 (Movies tab)
    navigate("/Movies"); // Navigate to the Movies page
  };

  return (
    <Box width={"100%"} height={"100%"} margin="auto" marginTop={2}>
      <Box margin={"auto"} width={"90%"} height={"65vh"}>
        <img src={poster} alt="poster" width={"100%"} height={"100%"} />
      </Box>
      <Box padding={5} margin={"auto"}>
        <Typography
          variant="h5"
          textAlign={"center"}
          color={"#FAF9F6"}
          fontSize="25px"
          width={"40%"}
          margin={"auto"}
          padding={1}
        >
          NOW SHOWING
        </Typography>
      </Box>
      <Box
        display="flex"
        width="95%"
        flexWrap="wrap"
        margin={"auto"}
        paddingLeft={10}
        justifyContent="flex-start"
      >
        {movies &&
          movies
            .slice(0, 4)
            .map((movie, index) => (
              <MovieItem
                id={movie._id}
                title={movie.title}
                PosterUrl={movie.posterUrl}
                trailerUrl={movie.trailerUrl}
                releaseDate={movie.releaseDate}
                duration={movie.duration}
                key={index}
              />
            ))}
      </Box>
      <Box display={"flex"} padding={5} margin={"auto"}>
        <Button
          variant="outlined"
          sx={{ margin: "auto", color: "wheat" }}
          onClick={handleViewAllMovies} // Handle click event to view all movies
        >
          View all Movies
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
