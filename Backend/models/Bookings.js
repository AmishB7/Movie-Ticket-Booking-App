import mongoose, { mongo } from "mongoose";

const bookingSchema = new mongoose.Schema({
    movie :{
        type: mongoose.Types.ObjectId,
        ref : "Movie",
        required : true,
    },
    date:{
        type: Date,
        required: true,
    },
    seatNumber:{
        type: Number,
        required: true,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref : "User",
        required: true,
    },
    ticketPrice:{
        type: Number,
        required: true,
    },
    paymentStatus:{
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("Bookings", bookingSchema);
