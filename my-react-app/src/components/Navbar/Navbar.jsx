import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCreateTrip = () => {
    navigate('/expenseTracker');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar elevation={0} sx={{ backgroundColor: '#f4e4c5', px: 4, py: 1 }} className="navbar">
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', width: '100%' }}>
        
        {/* Logo and (conditionally) title */}
        <Box className="logo-container">
          <img src="/src/assets/logo.png" className="logo-image" />
          {!isMobile && (
            <Typography className="nav-title">Postal Trip</Typography>
          )}
        </Box>

        {/* Desktop Nav */}
        {!isMobile && (
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
        )}

        {/* Right Side */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Mobile Menu Button */}
          {isMobile && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleMenuOpen}
                aria-controls="mobile-menu"
                aria-haspopup="true"
              >
                <MenuIcon sx={{ color: '#647e37', fontSize: 32 }} />
              </IconButton>

              <Menu
                id="mobile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                keepMounted
              >
                <MenuItem onClick={handleMenuClose} component={NavLink} to="/">Home</MenuItem>
                <MenuItem onClick={handleMenuClose} component={NavLink} to="/tripPlanner">Trips</MenuItem>
                <MenuItem onClick={handleMenuClose} component={NavLink} to="/matchmaker">Destination Matchmaker</MenuItem>
              </Menu>
            </>
          )}

          {/* Avatar & Button (always shown) */}
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
