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
import { addNewExpense, fetchExpensesDayEvents, fetchTripsFromUser, fetchUserData } from "../../utils/firebaseUtils";
import { useSelector } from "react-redux";
import { auth } from "../../services/firebase";
import { addEvent } from "../../store/eventSlice/EventSlice";


const ExpenseTracker = () => {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events);
  const date = useSelector((state) => state.date.selectedDate);
  const uid = useSelector((state) => state.auth.userId);
  const storeState = useSelector((state) => state);
  const currency = useSelector((state) => state.currency.currency)


  const [individualBudget, setIndividualBudget] = useState(0);
  const [groupBudget, setGroupBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const addExpense = (id,name,price) => {
    addNewExpense(id,name,price)
    console.log("expensed" + id + name + price)
  }

  useEffect(() => {
  const loadData = async () => {
    console.log("Redux Store:", JSON.stringify(storeState, null, 2));
    
    await fetchUserData(uid);
    await fetchTripsFromUser(uid);

    const events = await fetchExpensesDayEvents("xN1RgphfLnpTIm7xoOhu", "Lz9ZchnTEIFCFbPF1onz", date);

    events.forEach((event) => {
      dispatch(addEvent(event));
    });

    const individualTotal = events.reduce((sum, event) => {
    const yourParticipation = event.participants
      ? Object.values(event.participants).find(p => p.userID === uid)
      : null;
      return yourParticipation ? sum + Number(yourParticipation.contribution) : sum;
    }, 0);

    const groupTotal = events.reduce((sum, event) => sum + Number(event.amount), 0);

    setIndividualBudget(individualTotal);
    setGroupBudget(groupTotal);
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
              >Paris Voyage Expense</Typography>

            <CurrencyToggleButton/>
          </div>

          <div className="budget-section">
            <BudgetRange label="individual" min={individualBudget} max={individualBudget}/>
            <BudgetRange label="group" min={groupBudget} max={groupBudget}/>

          </div>

      </div>
      

      <div className="carousel-and-button">
        <DateCarousel/>
        <CustomButton label="ADD EXPENSE" onClick={() => addExpense({ uidUser: uid, name: "22", price: "er" })}/>
      </div>

      <Calendar/></>)}
      

    </>
  );
}

export default ExpenseTracker;
