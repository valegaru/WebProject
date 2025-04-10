import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import DateCarousel from "../../components/DateCarousel/DateCarousel";
import CustomButton from "../../components/CustomButton/CustomButton";
import "./ExpenseTracker.css";
import BudgetRange from "../../components/Expenses/BudgetRange/BudgetRange";
import Calendar from "../../components/Calendar/Calendar";
import CurrencyToggleButton from "../../components/CurrencyToggleButton/CurrencyToggleButton";
import { events } from "../../data/events"; // <-- import your events data
import { getHour } from "../../utils/getHour"; // if you want to filter by date/hour later

function ExpenseTracker() {
  const [currency, setCurrency] = useState("COP");
  const [selectedDate, setSelectedDate] = useState("2025-04-09"); // Replace if you use real dates

  const [individualBudget, setIndividualBudget] = useState(0);
  const [groupBudget, setGroupBudget] = useState(0);

  useEffect(() => {
    const individualTotal = events
      .filter((event) => event.participants?.includes("You"))
      .reduce((sum, event) => sum + event.amount, 0);

    const groupTotal = events.reduce((sum, event) => sum + event.amount, 0);

    setIndividualBudget(individualTotal);
    setGroupBudget(groupTotal);
  }, [selectedDate]); // You can update this when filtering events by date in the future

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
