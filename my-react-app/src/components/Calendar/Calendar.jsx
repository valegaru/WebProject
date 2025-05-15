import { Box, Typography } from "@mui/material";
import { getHour } from "../../utils/getHour";
import ExpenseCard from "../Expenses/ExpenseCard/ExpenseCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchExpensesDayEvents } from "../../utils/firebaseUtils";
import { addEvent, clearEvents } from "../../store/eventSlice/EventSlice";

const Calendar = () => {

  const dispatch = useDispatch();
  const startHour = 12;
  const endHour = 17;
  const events = useSelector((state) => state.events.events);
  const date = useSelector((state) => state.date.selectedDate);
  
  const hoursArray = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  
  useEffect(() => {
  const loadDayEvents = async () => {
    dispatch(clearEvents()); 

    const fetchedEvents = await fetchExpensesDayEvents(
      "xN1RgphfLnpTIm7xoOhu",
      "Lz9ZchnTEIFCFbPF1onz",
      date
    );

    if (fetchedEvents) {
      fetchedEvents.forEach((event) => {
        dispatch(addEvent(event)); 
      });
    }
  };

  loadDayEvents();
}, [date, dispatch]);   

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

            <Box>
              {event && (
                <ExpenseCard
                  title={event.title}
                  amount={event.amount}
                  status={event.status}
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
