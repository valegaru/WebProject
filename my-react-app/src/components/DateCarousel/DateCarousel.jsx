import React, { useEffect, useState } from 'react';
import { Box, IconButton, Paper, Typography, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../../store/dateSlice/DateSlice';
import { addEvent } from '../../store/eventSlice/EventSlice';


const allDays = [
  { date: '2025-04-07', day: 'Mon' },
  { date: '2025-04-08', day: 'Tue' },
  { date: '2025-04-09', day: 'Wed' },
  { date: '2025-04-10', day: 'Thu' },
  { date: '2025-04-11', day: 'Fri' },
  { date: '2025-04-12', day: 'Sat' },
  { date: '2025-04-13', day: 'Sun' },
  { date: '2025-04-14', day: 'Mon' },
  { date: '2025-04-15', day: 'Tue' },
];


const VISIBLE_COUNT = 5;

const DateCarousel = () => {

  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.selectedDate)

  const [startIndex, setStartIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const endIndex = startIndex + VISIBLE_COUNT;
  const visibleDays = allDays.slice(startIndex, endIndex);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, allDays.length - VISIBLE_COUNT)
    );
  };

  const dateClick = (date) => {
    dispatch(setSelectedDate(date))
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton onClick={handlePrev} disabled={startIndex === 0}>
        <ChevronLeft sx={{ color: '#647e37' }} />
      </IconButton>

      {visibleDays.map((d, i) => {
        const globalIndex = startIndex + i;
        const isSelected = globalIndex === selectedIndex;

        return (
          <Paper
            key={globalIndex}
            onClick={() => {
              dateClick(d.date)
              console.log(date)
              setSelectedIndex(globalIndex)}}
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              cursor: 'pointer',
              backgroundColor: isSelected ? '#647e37' : '#f4e4c5',
              color: isSelected ? 'white' : '#2d2e27',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease-in-out',
              boxSizing: 'border-box',
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              {new Date(d.date+"T00:00").getDate()}
            </Typography>
            <Typography variant="body2">{d.day}</Typography>

          </Paper>
        );
      })}

      <IconButton onClick={handleNext} disabled={endIndex >= allDays.length}>
        <ChevronRight sx={{ color: '#647e37' }} />
      </IconButton>
    </Stack>
  );
};

export default DateCarousel;
