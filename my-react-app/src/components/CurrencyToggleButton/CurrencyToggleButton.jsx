import Button from "@mui/material/Button";

const CurrencyToggleButton = ({ currency, setCurrency }) => {
  const handleToggle = () => {
    setCurrency((prev) => (prev === "COP" ? "USD" : "COP"));
  };

  return (
    <Button
      variant="outlined"
      onClick={handleToggle}
      sx={{
        borderRadius: "20px",
        px: 3,
        textTransform: "none",
        fontWeight: "bold",
        mt: 2,
        alignSelf: "flex-start"
      }}
    >
      {currency === "COP" ? "Switch to USD" : "Switch to COP"}
    </Button>
  );
};

export default CurrencyToggleButton;