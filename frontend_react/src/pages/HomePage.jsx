import React, { useState } from 'react';
import axios from '../components/axiosInstance';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Signup from '../components/Signup';
import FlightTable from '../components/FlightTable';
import Sort from '../components/Sort';
import { useEffect } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const [flights, setFlights] = useState([]);
  const [showLogin , setshowLogin] = useState(false);
  const [showSignup , setSignup] = useState(false);
  const [showFlights , setshowFlights] = useState(false);
  const [sortby , setsortby] = useState(false);
  const [showSort , setshowSort] = useState(false);
  const [showEnter , setShowEnter] = useState(true);
  const [complete , setComplete] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:8080/getFlights', form);
      console.log("Received Flights Data:", response.data);
      setFlights(response.data);
       // Assuming backend returns a list of flights
      setshowFlights(true);
    } catch (err) {
      console.error("Error fetching flights", err);
    }
  };

  useEffect(() => {
    if (complete) {
      setShowEnter(false);
    }
  }, [complete]);

  

  return (
    <div className="home-container">
      <h1>Flight Search</h1>
      <div className="auth-container">
        {showEnter && (
            <><button id="login" onClick={() =>  setshowLogin(true)  }>Login</button>
            <button id="SignUp" onClick={() =>  setSignup(true)  }>Sign up</button></>
        )}
        {!showEnter && (
           <div class = "login_complete">Login Complete</div>
        )}


      
      </div>

      <Login isOpen={showLogin} onClose={() => setshowLogin(false)} complete = {() => setComplete(true)}/>
      <Signup isOpen={showSignup} onClose={() => setSignup(false)} complete = {() => setComplete(true)} />
      
      
      <div className="form">
        <input 
          type="text" 
          name="from" 
          placeholder="From" 
          value={form.from} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="to" 
          placeholder="To" 
          value={form.to} 
          onChange={handleChange} 
        />
        <input 
          type="date" 
          name="date" 
          value={form.date} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="passengers" 
          min="1" 
          value={form.passengers} 
          onChange={handleChange} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {showFlights && (
        <button className="sort-button" onClick={() => setshowSort(true)}>Sort By</button>
      )}
      <Sort isOpen={showSort} onClose={() => setshowSort(false)} setSortTime = { () => setsortby(true) }  setSortprice = { () => setsortby(false)} />
      <FlightTable isOpen = {showFlights} flights = {flights}  sort = {sortby} form = {form}/>

      
    </div>
  );
};

export default HomePage;