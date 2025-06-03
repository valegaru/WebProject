<<<<<<< HEAD
=======
import { useEffect, useState } from "react";
>>>>>>> main
import { Box } from "@mui/material";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import "./ExpenseCard.css";
import { useSelector } from "react-redux";
<<<<<<< HEAD

const ExpenseCard = ({ title, amount, status, participants }) => {

  const currency = useSelector((state) => state.currency.currency)
=======
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


>>>>>>> main

  return (
    <div className={`expense-card ${status}`}>
      <div className="left-content">
        <p className="expense-card-title">{title}</p>

        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: "row" }}>
<<<<<<< HEAD
          <p className="expense-card-amount">{amount.toLocaleString()} {currency}</p>
=======
          <p className="expense-card-amount">{Number(amount).toLocaleString()} {currency}</p>
>>>>>>> main
          <p className="expense-card-status">{status}</p>
        </Box>
      </div>

      <Box sx={{ display: "flex", gap: "12px", flexDirection: "row", flexWrap: "wrap" }}>
        {Object.values(participants).map((p, index) => (
          <ProfileInfo
            key={index}
            name={p.name}
<<<<<<< HEAD
            imgUrl={p.imgUrl}
=======
            imgUrl={profilePics[p.userID] || ""}
>>>>>>> main
            contribution={p.contribution}
          />
        ))}
      </Box>
    </div>
  );
};

export default ExpenseCard;
