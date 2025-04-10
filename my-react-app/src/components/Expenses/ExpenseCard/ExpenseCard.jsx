import { Box } from "@mui/material";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import "./ExpenseCard.css";

const ExpenseCard = ({ title, amount, status, currency, participants }) => {
  return (
    <div className={`expense-card ${status}`}>
      <div className="left-content">
        <p className="expense-card-title">{title}</p>

        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: "row" }}>
          <p className="expense-card-amount">{amount.toLocaleString()} {currency}</p>
          <p className="expense-card-status">{status}</p>
        </Box>
      </div>

      <Box sx={{ display: "flex", gap: "12px", flexDirection: "row", flexWrap: "wrap" }}>
        {participants?.map((p, index) => (
          <ProfileInfo
            key={index}
            name={p.name}
            imgUrl={p.imgUrl}
            contribution={p.contribution}
            currency={currency}
          />
        ))}
      </Box>
    </div>
  );
};

export default ExpenseCard;
