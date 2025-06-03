import { Avatar } from "@mui/material";
import "./ProfilePic.css";

<<<<<<< HEAD
const ProfilePic = ({ name, imgUrl, isHighlighted }) => {
  return (
    <div className={`profile-pic ${isHighlighted ? "highlighted" : ""}`}>
=======
const ProfilePic = ({ name, imgUrl, isHighlighted, onClick }) => {
  return (
    <div
      className={`profile-pic ${isHighlighted ? "highlighted" : ""}`} onClick={onClick} style={{ cursor: 'pointer' }} 
    >
>>>>>>> main
      <Avatar alt={name} src={imgUrl} className="profile-avatar" />
    </div>
  );
};

export default ProfilePic;
