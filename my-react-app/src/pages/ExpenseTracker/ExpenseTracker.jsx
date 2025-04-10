import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import DateCarousel from "../../components/DateCarousel/DateCarousel";
import CustomButton from "../../components/CustomButton/CustomButton";
import "./ExpenseTracker.css";
import BudgetRange from "../../components/Expenses/BudgetRange/BudgetRange";
import Calendar from "../../components/Calendar/Calendar";
import CurrencyToggleButton from "../../components/CurrencyToggleButton/CurrencyToggleButton";
import { events } from "../../data/events"; 


function ExpenseTracker() {
  const [currency, setCurrency] = useState("COP");
  const [selectedDate, setSelectedDate] = useState("2025-04-09"); 

  const [individualBudget, setIndividualBudget] = useState(0);
  const [groupBudget, setGroupBudget] = useState(0);

  useEffect(() => {

    const individualTotal = events.reduce((sum, event) => {
      const yourParticipation = event.participants?.find((p) => p.name === "You");
      return yourParticipation ? sum + yourParticipation.contribution : sum;
    }, 0);

    const groupTotal = events.reduce((sum, event) => sum + event.amount, 0);

    setIndividualBudget(individualTotal);
    setGroupBudget(groupTotal);
  }, [selectedDate]); 

  return (
    <>
      <Navbar />

      <div className="budget-section">
        <BudgetRange
          label="individual"
          min={individualBudget}
          max={individualBudget}
          currency={currency}
        />
        <BudgetRange
          label="group"
          min={groupBudget}
          max={groupBudget}
          currency={currency}
        />
        <CurrencyToggleButton currency={currency} setCurrency={setCurrency} />
      </div>

      <div className="carousel-and-button">
        <DateCarousel onDateChange={setSelectedDate} />
        <CustomButton label="ADD EXPENSE" />
      </div>

      <Calendar currency={currency} />
    </>
  );
}

export default ExpenseTracker;
