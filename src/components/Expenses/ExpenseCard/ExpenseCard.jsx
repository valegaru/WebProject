import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import "./ExpenseCard.css";
import { useSelector } from "react-redux";
import { getUserProfilePicture } from "../../../utils/firebaseUtils";

const ExpenseCard = ({ title, amount, participants }) => {
  const currency = useSelector((state) => state.currency.currency);
  const [status, setStatus] = useState("missing");
  const [profilePics, setProfilePics] = useState({});

  useEffect(() => {
  const fetchPics = async () => {
    const picMap = {};
    await Promise.all(
      Object.values(participants || {}).map(async (p) => {
        console.log("Fetching profile picture for participant:", p);
        const url = await getUserProfilePicture(p.userID); 
        console.log(`Fetched URL for ${p.name} (${p.userID}):`, url);
        picMap[p.userID] = url; 
      })
    );
    setProfilePics(picMap);
  };

  if (participants) fetchPics();
}, [participants]);



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
            imgUrl={profilePics[p.userID] || ""}
            contribution={p.contribution}
          />
        ))}
      </Box>
    </div>
  );
};

export default ExpenseCard;
