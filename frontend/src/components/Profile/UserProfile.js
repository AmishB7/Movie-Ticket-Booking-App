import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import {
  deleteBooking,
  getUserBooking,
  getUserDetails,
} from "../../api-helpers/api-helpers.js";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircle";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    getUserBooking()
      .then((res) => {
        console.log("Bookings Response:", res); // Log bookings response
        setBookings(res.bookings);
        calculateTotalPrice(res.bookings); // Calculate total price on initial load
      })
      .catch((err) => console.log(err));

    getUserDetails()
      .then((res) => {
        console.log("User Details Response:", res); // Log user details response
        setUser(res.user);
      })
      .catch((err) => console.log(err));
  }, []);

  const calculateTotalPrice = (bookings) => {
    let total = 0;
    bookings.forEach((booking) => {
      total += booking.ticketPrice;
    });
    setTotalPrice(total);
  };

  const handleDelete = (id) => {
    deleteBooking(id)
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  const handlePurchase = () => {
    window.location.href = "/success";
    // Generate UUID for transaction_uuid
    const uuid = uuidv4();

    // Generate HMAC SHA-256 signature
    const signature = generateSignature(uuid);

    // Construct the form and submit it
    const form = document.createElement("form");
    form.setAttribute(
      "action",
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
    );
    form.setAttribute("method", "POST");

    // Add each input field
    const fields = {
      amount: totalPrice.toFixed(2),
      tax_amount: "0",
      total_amount: totalPrice.toFixed(2),
      transaction_uuid: uuid,
      product_code: "EPAYTEST",
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: "http://localhost:3000/success",
      failure_url: "http://localhost:3000/failure",
      signed_field_names:
        "amount,tax_amount,total_amount,transaction_uuid,product_code,product_service_charge,product_delivery_charge,success_url,failure_url",
      signature: signature,
    };

    // Append each field to the form
    Object.keys(fields).forEach((fieldName) => {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", fieldName);
      input.setAttribute("value", fields[fieldName]);
      form.appendChild(input);
    });

    // Append the form to the document and submit it
    document.body.appendChild(form);
    form.submit();
  };

  const generateSignature = (uuid) => {
    const secretKey = "your_secret_key"; // Replace with your actual secret key provided by eSewa

    // Construct the message to be signed based on the signed_field_names order
    const message = `total_amount=${totalPrice},transaction_uuid=${uuid},product_code=EPAYTEST`;

    // Generate HMAC SHA-256 hash using CryptoJS
    const hash = CryptoJS.HmacSHA256(message, secretKey);

    // Convert hash to Base64-encoded string as required by eSewa
    const signature = CryptoJS.enc.Base64.stringify(hash);

    console.log("Generated UUID:", uuid);
    console.log("Generated Signature:", signature);

    return signature;
  };

  return (
    <Box width={"100%"} display="flex">
      <Fragment>
        {user && (
          <Box
            flexDirection={"column"}
            justifyContent="center"
            alignItems={"center"}
            width={"30%"}
            padding={3}
          >
            <AccountCircleOutlinedIcon
              sx={{ fontSize: "10rem", textAlign: "center", ml: 3 }}
            />
            <Typography
              padding={1}
              width={"auto"}
              textAlign={"center"}
              border={"1px solid #ccc"}
              borderRadius={6}
              color={"white"}
            >
              Name: {user.name}
            </Typography>
            <Typography
              mt={1}
              padding={1}
              width={"auto"}
              textAlign={"center"}
              border={"1px solid #ccc"}
              borderRadius={6}
              color={"white"}
            >
              Email: {user.email}
            </Typography>
          </Box>
        )}
        {bookings.length > 0 && (
          <Box width={"70%"} display="flex" flexDirection={"column"}>
            <Typography
              variant="h3"
              fontFamily={"verdana"}
              textAlign="center"
              padding={2}
              color={"red"}
            >
              Bookings
            </Typography>
            <Box
              margin={"auto"}
              display="flex"
              flexDirection={"column"}
              width="80%"
            >
              <List>
                {bookings.map((booking) => (
                  <ListItem
                    key={booking._id}
                    sx={{
                      bgcolor: "#00d386",
                      color: "white",
                      textAlign: "center",
                      margin: 1,
                    }}
                  >
                    <ListItemText
                      sx={{ margin: 1, width: "auto", textAlign: "left" }}
                    >
                      Movie: {booking.movie.title}
                    </ListItemText>
                    <ListItemText
                      sx={{ margin: 1, width: "auto", textAlign: "left" }}
                    >
                      Seat: {booking.seatNumber}
                    </ListItemText>
                    <ListItemText
                      sx={{ margin: 1, width: "auto", textAlign: "left" }}
                    >
                      Price: {booking.ticketPrice}
                    </ListItemText>
                    <ListItemText
                      sx={{ margin: 1, width: "auto", textAlign: "left" }}
                    >
                      Date: {new Date(booking.date).toDateString()}
                    </ListItemText>
                    <IconButton
                      onClick={() => handleDelete(booking._id)}
                      color="error"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Typography
                variant="h5"
                textAlign="right"
                mt={2}
                mr={2}
                color="blue"
              >
                Total Price: ${totalPrice.toFixed(2)}
              </Typography>
              <Box mt={2} textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "30%" }}
                  onClick={handlePurchase}
                >
                  Purchase
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {bookings.length === 0 && (
          <Box width={"70%"} display="flex" flexDirection={"column"}>
            <Typography
              variant="h3"
              fontFamily={"verdana"}
              textAlign="center"
              padding={2}
              color={"red"}
            >
              No Bookings
            </Typography>
          </Box>
        )}
      </Fragment>
    </Box>
  );
};

export default UserProfile;
