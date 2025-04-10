import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import DateCarousel from "../../components/DateCarousel/DateCarousel";
import CustomButton from "../../components/CustomButton/CustomButton";
import "./ExpenseTracker.css";
import BudgetRange from "../../components/Expenses/BudgetRange/BudgetRange";
import Calendar from "../../components/Calendar/Calendar";

function ExpenseTracker() {
  
  const [individualBudget, setIndividualBudget] = useState({
    min: 100000,
    max: 500000,
  });

  const [groupBudget, setGroupBudget] = useState({
    min: individualBudget.min + 100000,
    max: individualBudget.max + 500000,
  });

  const [currency, setCurrency] = useState("COP")

  return (
    <>
      <Navbar />


        <BudgetRange label={"individual"} min={individualBudget.min} max={individualBudget.max} currency={currency}/>
        <BudgetRange label={"group"} min={groupBudget.min} max={groupBudget.max} currency={currency}/>


      <div className="carousel-and-button">
        <DateCarousel />
        <CustomButton label="ADD EXPENSE" />
      </div>

      <Calendar currency={currency}></Calendar>

    </>
  );
}

export default ExpenseTracker;
