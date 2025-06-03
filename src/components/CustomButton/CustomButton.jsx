import React from 'react';
import Button from '@mui/material/Button';

function darkenColor(hex, amount) {
  const col = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (col >> 16) - 255 * amount);
  const g = Math.max(0, ((col >> 8) & 0xff) - 255 * amount);
  const b = Math.max(0, (col & 0xff) - 255 * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

const CustomButton = ({
  label,
  onClick,
  color = '#a2471c',
  variant = 'contained',
  sx = {}
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      sx={{
        backgroundColor: variant === 'contained' ? color : undefined,
        color: variant === 'contained' ? '#fff' : color,
        borderRadius: '24px',
        fontWeight: 'bold',
        px: 4,
        py: 1.5,
        textTransform: 'uppercase',
        '&:hover': {
          backgroundColor:
            variant === 'contained' ? darkenColor(color, 0.15) : undefined,
        },
        ...sx,
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;