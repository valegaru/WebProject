import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    navigate('/expenseTracker');
  };

  return (
    <AppBar elevation={0} sx={{ backgroundColor: '#f4e4c5', px: 4, py: 1 }} className="navbar">
      <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
        <Box className="logo-container">
          <Box className="logo-circle" />
          <Typography className="nav-title">Postal Trip</Typography>
        </Box>

        <Stack direction="row" spacing={5} alignItems="center">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Home
          </NavLink>
          <NavLink
            to="/tripPlanner"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Trips
          </NavLink>
          <NavLink
            to="/matchmaker"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Destination Matchmaker
          </NavLink>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src="https://placehold.co/53x53" sx={{ width: 53, height: 53 }} />
          <Button
            variant="contained"
            className="cta-button"
            onClick={handleCreateTrip}
          >
            Create New Trip
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
