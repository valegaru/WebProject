import { Box, Typography } from "@mui/material";
import { events } from "../../data/events";
import { getHour } from "../../utils/getHour";
import ExpenseCard from "../Expenses/ExpenseCard/ExpenseCard";

const Calendar = ({ currency }) => {
  const startHour = 12;
  const endHour = 17;
  const hourHeight = 80;

  return (
    <Box
      sx={{
        borderLeft: "2px solid #ccc",
        height: (endHour - startHour) * hourHeight,
        overflowY: "scroll",
      }}
    >
      {[...Array(endHour - startHour)].map((_, i) => {
        const hour = startHour + i;
        const event = events.find((e) => getHour(e.startTime) === hour);

        return (
          <Box
            key={hour}
            sx={{
              height: hourHeight,
              borderBottom: "1px solid #eee",
              paddingLeft: 1,
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", minWidth: 50, marginRight: 2 }}
            >
              {`${hour}:00`}
            </Typography>

            {event && (
              <ExpenseCard
                title={event.title}
                amount={event.amount}
                status={event.status}
                currency={currency}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Calendar;
