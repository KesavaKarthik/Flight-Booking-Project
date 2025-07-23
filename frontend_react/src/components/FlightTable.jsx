//import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightTable.css';
import axios from './axiosInstance';

const FlightTable  = ({isOpen , flights ,sort , form}) => {
    if(!isOpen) return null;


    let sortedFlights = [];
    if(sort === false){
        sortedFlights = [...flights].sort((a, b) => a.price - b.price);
        
    }
    else{
      
        sortedFlights = [...flights].sort((a, b) => {
        const [h1, m1, s1] = a.departureTime.split(":").map(Number);
        const [h2, m2, s2] = b.departureTime.split(":").map(Number);

        const totalSecondsA = h1 * 3600 + m1 * 60 + s1;
        const totalSecondsB = h2 * 3600 + m2 * 60 + s2;

        return totalSecondsA - totalSecondsB;
      });

    }
    const navigate = useNavigate();
    const handleBooking = async (flight) => {
      const flightdetails = {
        flightNumber : flight.flightNumber ,
        travleDate : form.date 

      }
      const response = await axios.post('http://localhost:8080/SeatsPosition',flightdetails);
      console.log("recieved seat data ",response.data);
      localStorage.setItem( 'bookedSeats' , response.data);
      navigate( '/BookingPage' ,{ state : {flight , form} });

    }
    return (
        <div className="results">
        
          <table>
            <thead>
              <tr>
                <th>Flight</th>
                <th>Airline</th>
                <th>From</th>
                <th>To</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Price</th>
                <th>Book</th>
              </tr>
            </thead>
            <tbody>
              {sortedFlights.map((flight, index) => (
                <tr key={index}>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.airline}</td>
                  <td>{flight.fromLocation}</td>
                  <td>{flight.toLocation}</td>
                  <td>{flight.departureTime}</td>
                  <td>{flight.arrivalTime}</td>
                  <td>{flight.price}</td>
                  <td> <button onClick={() => handleBooking(flight)}>Book</button> </td>

                </tr>
              ))}
            </tbody>
          </table>
          
      </div>

    );

}
export default FlightTable;