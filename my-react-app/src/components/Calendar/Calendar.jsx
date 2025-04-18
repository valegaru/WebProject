import { Box, Typography } from "@mui/material";
import { events } from "../../data/events";
import { getHour } from "../../utils/getHour";
import ExpenseCard from "../Expenses/ExpenseCard/ExpenseCard";

const Calendar = ({ currency }) => {
  const startHour = 12;
  const endHour = 17;

  const hoursArray = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  return (
    <Box
      sx={{
        borderLeft: "2px solid #ccc",
        overflowY: "auto",
        maxHeight: "80vh",
        paddingRight: 2,
      }}
    >
      {hoursArray.map((hour) => {
        const event = events.find((e) => getHour(e.startTime) === hour);

        return (
          <Box
            key={hour}
            sx={{
              borderBottom: "1px solid #eee",
              paddingY: 2,
              paddingLeft: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Hour label */}
            <Typography
              sx={{
                fontWeight: "bold",
                minWidth: 60,
                textAlign: "right",
                color: event ? "inherit" : "#999",
              }}
            >
              {`${hour}:00`}
            </Typography>

            {/* Event (Expense Card) */}
            <Box>
              {event && (
                <ExpenseCard
                  title={event.title}
                  amount={event.amount}
                  status={event.status}
                  currency={currency}
                  participants={event.participants || []}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default Calendar;
