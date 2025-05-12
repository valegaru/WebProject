import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import DateCarousel from "../../components/DateCarousel/DateCarousel";
import CustomButton from "../../components/CustomButton/CustomButton";
import "./ExpenseTracker.css";
import BudgetRange from "../../components/Expenses/BudgetRange/BudgetRange";
import Calendar from "../../components/Calendar/Calendar";
import CurrencyToggleButton from "../../components/CurrencyToggleButton/CurrencyToggleButton";
import { Typography } from "@mui/material";
import { addNewExpense, fetchDayEvents, fetchUserData } from "../../utils/firebaseUtils";
import { useSelector } from "react-redux";
import { auth } from "../../services/firebase";
import { fetchTripsFromUser } from "../../utils/tripsUtils";



function ExpenseTracker() {
  const [currency, setCurrency] = useState("COP");
  const [selectedDate, setSelectedDate] = useState(""); 
  const events = useSelector((state) => state.events);
  const date = useSelector((state) => state.date);
  const uid = useSelector((state) => state.auth.user);
  const uidBURN = "G5ZH4Tqp0QTNLDUNkYwNQOaNCZa2"
  const storeState = useSelector((state) => state);



  const [individualBudget, setIndividualBudget] = useState(0);
  const [groupBudget, setGroupBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const addExpense = (id,name,price) => {
    addNewExpense(id,name,price)
    console.log("expensed" + id + name + price)
  }

  useEffect(() => {
    console.log("Redux Store:", JSON.stringify(storeState, null, 2));
    fetchUserData(uidBURN);
    fetchTripsFromUser(uidBURN);
    fetchDayEvents("xN1RgphfLnpTIm7xoOhu","Lz9ZchnTEIFCFbPF1onz", "2025-04-07")
    
    const individualTotal = events.reduce((sum, event) => {
      const yourParticipation = event.participants?.find((p) => p.name === "You");
      return yourParticipation ? sum + yourParticipation.contribution : sum;
    }, 0);

    const groupTotal = events.reduce((sum, event) => sum + event.amount, 0);

    setIndividualBudget(individualTotal);
    setGroupBudget(groupTotal);
    setSelectedDate(date);
    setLoading(false);
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

            <CurrencyToggleButton currency={currency} setCurrency={setCurrency}/>
          </div>

          <div className="budget-section">
            <BudgetRange label="individual" min={individualBudget} max={individualBudget} currency={currency}/>
            <BudgetRange label="group" min={groupBudget} max={groupBudget} currency={currency}/>

          </div>

      </div>
      

      <div className="carousel-and-button">
        <DateCarousel onDateChange={setSelectedDate} />
        <CustomButton label="ADD EXPENSE" onClick={() => addExpense({ uidUser: "e", name: "22", price: "er" })}/>
      </div>

      <Calendar currency={currency} /></>)}
      

    </>
  );
}

export default ExpenseTracker;
