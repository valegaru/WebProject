import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import Navbar from "../../components/Navbar/Navbar";
import DateCarousel from "../../components/DateCarousel/DateCarousel";
import CustomButton from "../../components/CustomButton/CustomButton";
import "./ExpenseTracker.css";
import BudgetRange from "../../components/Expenses/BudgetRange/BudgetRange";
import Calendar from "../../components/Calendar/Calendar";
import CurrencyToggleButton from "../../components/CurrencyToggleButton/CurrencyToggleButton";
import { Typography } from "@mui/material";
import { fetchTripsFromUser, fetchUserData } from "../../utils/firebaseUtils";
import { useSelector } from "react-redux";
import { addEvent } from "../../store/eventSlice/EventSlice";
import AddEventModal from "../../components/Expenses/AddExpenseModal/AddExpenseModal";
import { useParams } from 'react-router-dom';




const ExpenseTracker = () => {
  const dispatch = useDispatch();
  const { tripId, expenseId } = useParams();
  const events = useSelector((state) => state.events);
  const date = useSelector((state) => state.date.selectedDate);
  const uid = useSelector((state) => state.auth.userId);
  const storeState = useSelector((state) => state);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const addExpense = (id,name,price) => {

  }

  useEffect(() => {
  const loadData = async () => {
    console.log("Redux Store:", JSON.stringify(storeState, null, 2));
    
    await fetchUserData(uid);
    await fetchTripsFromUser(uid);

    setLoading(false);
  }

  loadData();
}, []);


  return (
    <>
      <Navbar />
      {loading ? (<Typography>Loading...</Typography>):(<>
      
      <div className="upper-expense">

        <div className="trip-name-and-toggle">
          <Typography
          sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "1.5rem", 
              color: "#3F4C1C",
              }}
              >Expenses</Typography>

            <CurrencyToggleButton/>
          </div>

          <div className="budget-section">
            <BudgetRange label="individual" />
            <BudgetRange label="group" />

          </div>

      </div>
      

      <div className="carousel-and-button">
        <DateCarousel/>
        <CustomButton label="ADD EXPENSE" onClick={() => {setShowModal(true)}}/>
      </div>

      <Calendar/></>)}
      

    {showModal && (
  <AddEventModal
    tripID={tripId}
    expenseID={expenseId}
    date={date}
    onClose={() => setShowModal(false)}
    onEventAdded={(newEventId) => {
      console.log('Event added:', newEventId);
      // Optionally refresh or dispatch
    }}
  />
)}

    </>
  );
}

export default ExpenseTracker;
