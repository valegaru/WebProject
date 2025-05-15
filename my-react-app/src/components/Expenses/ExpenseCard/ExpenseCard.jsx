import { Box } from "@mui/material";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import "./ExpenseCard.css";
import { useSelector } from "react-redux";

const ExpenseCard = ({ title, amount, status, participants }) => {

  const currency = useSelector((state) => state.currency.currency)

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
        {Object.values(participants).map((p, index) => (
          <ProfileInfo
            key={index}
            name={p.name}
            imgUrl={p.imgUrl}
            contribution={p.contribution}
          />
        ))}
      </Box>
    </div>
  );
};

export default ExpenseCard;
