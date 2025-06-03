import { Avatar } from "@mui/material";
import "./ProfilePic.css";

const ProfilePic = ({ name, imgUrl, isHighlighted }) => {
  return (
    <div className={`profile-pic ${isHighlighted ? "highlighted" : ""}`}>
      <Avatar alt={name} src={imgUrl} className="profile-avatar" />
    </div>
  );
};

export default ProfilePic;
