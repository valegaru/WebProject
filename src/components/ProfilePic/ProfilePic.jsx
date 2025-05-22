import { Avatar } from "@mui/material";
import "./ProfilePic.css";

const ProfilePic = ({ name, imgUrl, isHighlighted, onClick }) => {
  return (
    <div
      className={`profile-pic ${isHighlighted ? "highlighted" : ""}`} onClick={onClick} style={{ cursor: 'pointer' }} 
    >
      <Avatar alt={name} src={imgUrl} className="profile-avatar" />
    </div>
  );
};

export default ProfilePic;
