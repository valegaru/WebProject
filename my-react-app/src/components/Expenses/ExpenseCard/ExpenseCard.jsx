import { Box } from "@mui/material";
import ProfilePic from "../../ProfilePic/ProfilePic";
import "./ExpenseCard.css";

const ExpenseCard = ({ title, amount, status, currency, participants }) => {
  return (
    <div className={`expense-card ${status}`}>
      <p className="expense-card-title">{title}</p>

      <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: "row" }}>
        <p className="expense-card-amount">{amount.toLocaleString()} {currency}</p>
        <p className="expense-card-status">{status}</p>
      </Box>

      <Box sx={{ display: "flex", gap: "4px", flexDirection:"row" }}>
        {participants?.map((name, index) => (
          <ProfilePic key={index} imgUrl={"https://github.com/valegaru/WebProject/blob/main/my-react-app/src/assets/user1.png?raw=true"}/>
        ))}
      </Box>
    </div>
  );
};

export default ExpenseCard;
