import { Box, Typography } from "@mui/material";
import ProfilePic from "../../ProfilePic/ProfilePic";
import { useSelector } from "react-redux";

const ProfileInfo = ({ name, imgUrl, contribution}) => {

  const currency = useSelector((state) => state.currency.currency)

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <ProfilePic imgUrl={imgUrl} />
      <Box>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{name}</Typography>
        <Typography sx={{ fontSize: "0.75rem" }}>
          {contribution.toLocaleString()} {currency}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileInfo;
