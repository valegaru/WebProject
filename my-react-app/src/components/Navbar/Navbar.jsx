import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ px: 4, py: 1 }} className="navbar">

      <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>

        <Box className="logo-container">
          <Box className="logo-circle" />
          <Typography className="nav-title">Postal Trip</Typography>
        </Box>


        <Stack direction="row" spacing={5} alignItems="center">
          <Typography className="nav-link active">Home</Typography>
          <Typography className="nav-link bold">Trips</Typography>
          <Typography className="nav-link">Destination Matchmaker</Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src="https://placehold.co/53x53" sx={{ width: 53, height: 53 }} />
          <Button variant="contained" className="cta-button">
            Create New Trip
          </Button>
        </Stack>

      </Toolbar>

    </AppBar>
  );
};

export default Navbar;