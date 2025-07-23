import { useState } from "react";
import axios from '../components/axiosInstance';
import "./Booking.css";
import { useLocation } from "react-router-dom";
import SelectSeats from "../components/SelectSeats";

const BookingPage = () => {
  const { state } = useLocation();
  const { flight, form } = state;
  const [openSeats , setOpenSeats] = useState(false);
  const [booking, setBooking] = useState({
    name_: "",  // Frontend state uses name_
    gender: "",
    age: "",
    phoneNumber: "",
    emailId: "",
    id: "",
    flightNumber: flight.flightNumber,
    travelDate: form.date,
    noOfSeats: parseInt(form.passengers, 10),
  });

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };
  const savedSeats = localStorage.getItem('selectedSeats') || "";
  
  const handleSubmit = async () => {
    try {
      // Map booking object to send correct key to backend
      const bookingToSend = {
        ...booking,
        age: Number(booking.age),        // Ensure age is sent as a number
        name: booking.name_,             // Map name_ → name
      };
      delete bookingToSend.name_;        // Remove name_ from payload

      const response = await axios.post(
        "http://localhost:8080/booking",
        bookingToSend
      );
      alert("Booking successful!");
    } catch (err) {
      console.error("Booking failed", err);
      alert("Booking failed.");
    }
    const seatOfFlight = {
      flightNumber : flight.flightNumber , 
      date : form.date , 
      passengers : form.passengers ,
      seats : savedSeats

    };
    const saveseats = await axios.post("http://localhost:8080/seatsOfFlight" , seatOfFlight);
  };

  return (
    <div className="booking-container">
      <h2>Booking for flight {flight.flightNumber}</h2>
      <p>
        From: {flight.fromLocation} → To: {flight.toLocation}
      </p>
      <p>
        Date: {form.date} | Passengers: {form.passengers}
      </p>

      <div className="form">
        <label>
          Full Name:
          <input
            type="text"
            name="name_"
            value={booking.name_}
            onChange={handleChange}
          />
        </label>

        <label>
          Gender:
          <input
            type="text"
            name="gender"
            value={booking.gender}
            onChange={handleChange}
          />
        </label>

        <label>
          Age:
          <input
            type="number"
            name="age"
            value={booking.age}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={booking.phoneNumber}
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="emailId"
            value={booking.emailId}
            onChange={handleChange}
          />
        </label>

        <label>
          Government ID:
          <input
            type="text"
            name="id"
            value={booking.id}
            onChange={handleChange}
          />
        </label>
        <button onClick = {() => setOpenSeats(true)} > Select Seats</button>
        <SelectSeats passengers = {form.passengers} isOpen = {openSeats} onClose = {() => setOpenSeats(false)}></SelectSeats>
        <div>Selected Seats : {savedSeats}</div>

        <button onClick={handleSubmit}>Confirm Booking</button>
      </div>
    </div>
  );
};

export default BookingPage;
