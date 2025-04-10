import { Typography } from "@mui/material";
import "./ExpenseCard.css";

const ExpenseCard = ({ title, amount, status, currency }) => {
  return (
    <div className={`expense-card ${status}`}>
      <Typography className="expense-card-title">
        {title}
      </Typography>
      <Typography className="expense-card-amount">
        {amount.toLocaleString()} {currency}
      </Typography>
      <Typography className="expense-card-status">
        {status}
      </Typography>
    </div>
  );
};

export default ExpenseCard;
