import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const allDays = [
  { date: '07', day: 'Sun' },
  { date: '08', day: 'Mon' },
  { date: '09', day: 'Tue' },
  { date: '10', day: 'Wed' },
  { date: '11', day: 'Thu' },
  { date: '12', day: 'Fri' },
  { date: '13', day: 'Sat' },
  { date: '14', day: 'Sun' },
  { date: '15', day: 'Mon' },
];

const VISIBLE_COUNT = 5;

const DateCarousel = () => {
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
            onClick={() => setSelectedIndex(globalIndex)}
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
              {d.date}
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
