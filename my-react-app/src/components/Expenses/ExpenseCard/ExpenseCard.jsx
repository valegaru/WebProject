import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import "./ExpenseCard.css";
import { useSelector } from "react-redux";

const ExpenseCard = ({ title, amount, participants }) => {
  const currency = useSelector((state) => state.currency.currency);
  const [status, setStatus] = useState("missing");

  useEffect(() => {
    const numericAmount = Number(amount);

    if (!participants || isNaN(numericAmount)) return;

    let totalContribution = 0;

    Object.values(participants).forEach((participant) => {
      const contribution = Number(participant.contribution || 0);
      totalContribution += contribution;
    });

    const newStatus = totalContribution >= numericAmount ? "complete" : "missing";
    setStatus(newStatus);
  }, [participants, amount]);

  return (
    <div className={`expense-card ${status}`}>
      <div className="left-content">
        <p className="expense-card-title">{title}</p>

        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: "row" }}>
          <p className="expense-card-amount">{Number(amount).toLocaleString()} {currency}</p>
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
