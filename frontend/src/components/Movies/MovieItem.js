import { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Modal,
} from "@mui/material";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ReactPlayer from "react-player";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const MovieItem = ({
  title,
  releaseDate,
  PosterUrl,
  id,
  duration,
  trailerUrl,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Card
      sx={{
        margin: 2,
        minWidth: 300,
        maxWidth: 300,
        height: 500,
        borderRadius: 5,
        alignContent: "center",
        bgcolor: "#182356",
        ":hover": {
          boxShadow: "10px 10px 20px #696969",
        },
      }}
    >
      <img height={"65%"} width={"100%"} src={PosterUrl} alt={title} />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color={"#FAF9F6"}>
          {title}
        </Typography>
        <Typography variant="body2" color="#777777">
          {new Date(releaseDate).toDateString()}
        </Typography>
        <Typography variant="body2" color="#777777">
          {duration}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          sx={{
            margin: "auto",
            color: "#db322b",
            borderRadius: "10px",
            ":hover": {
              backgroundColor: "#a3211c",
              color: "#fff",
            },
          }}
          size="Medium"
          onClick={handleOpen}
          startIcon={<PlayCircleOutlineIcon />}
        >
          Trailer
        </Button>
        <Button
          sx={{
            margin: "auto",
            color: "#db322b",
            borderRadius: "10px",
            ":hover": {
              backgroundColor: "#a3211c",
              color: "#fff",
            },
          }}
          size="Medium"
          startIcon={<LocalActivityOutlinedIcon />}
          LinkComponent={Link}
          to={`/Booking/${id}`}
        >
          Buy Now
        </Button>
      </CardActions>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <ReactPlayer url={trailerUrl} width="60%" height="80%" />
          <Button
            onClick={handleClose}
            variant="inherit"
            style={{ position: "absolute", top: 60, right: 120 }}
            sx={{
              borderRadius: "20px",
              color: "#fff",
              bgcolor: "#808080",
              ":hover": {
                color: "#fff",
                bgcolor: "#bd4028",
              },
            }}
          >
            <CloseIcon />
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default MovieItem;
