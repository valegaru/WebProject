import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	Button,
	Stack,
	IconButton,
	Menu,
	MenuItem,
	useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Navbar.css';
import ProfilePic from '../ProfilePic/ProfilePic';

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
		<AppBar elevation={0} sx={{ backgroundColor: '#f4e4c5', px: 4, py: 1 }} className='navbar'>
			<Toolbar disableGutters sx={{ justifyContent: 'space-between', width: '100%' }}>
				{/* Logo and title (changes order in mobile) */}
				<Box className='logo-container'>
					<img src='/src/assets/logo.png' className='logo-image' />
					{!isMobile && <p className='nav-title'>Postal Trip</p>}
				</Box>

				{/* Navigation links (hidden in mobile) */}
				{!isMobile && (
					<Stack direction='row' spacing={5} alignItems='center'>
						<NavLink to='/' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
							Home
						</NavLink>
						<NavLink to='/tripPlanner' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
							Trips
						</NavLink>
						<NavLink to='/matchmaker' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
							Destination Matchmaker
						</NavLink>
					</Stack>
				)}

				{/* Right items stack */}
				<Stack direction='row' spacing={2} alignItems='center'>
					{/* Mobile Menu and Profile */}
					{isMobile && (
						<>
							<IconButton
								edge='end'
								color='inherit'
								onClick={handleMenuOpen}
								aria-controls='mobile-menu'
								aria-haspopup='true'
								sx={{ order: 1 }} // Position it first in mobile
							>
								<MenuIcon sx={{ color: '#647e37', fontSize: 32 }} />
							</IconButton>

							<Menu id='mobile-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} keepMounted>
								<MenuItem onClick={handleMenuClose} component={NavLink} to='/'>
									Home
								</MenuItem>
								<MenuItem onClick={handleMenuClose} component={NavLink} to='/tripPlanner'>
									Trips
								</MenuItem>
								<MenuItem onClick={handleMenuClose} component={NavLink} to='/matchmaker'>
									Destination Matchmaker
								</MenuItem>
							</Menu>

							<ProfilePic
								name='Juan'
								imgUrl='https://github.com/valegaru/WebProject/blob/main/my-react-app/src/assets/user1.png?raw=true'
								sx={{ order: 2 }} // Position profile picture second in mobile
							/>

							<Button
								variant='contained'
								className='cta-button'
								onClick={handleCreateTrip}
								sx={{ order: 4 }} // Position the button last in mobile
							>
								Create New Trip
							</Button>
						</>
					)}

					{/* Desktop Profile and Button */}
					{!isMobile && (
						<>
							<ProfilePic
								name='Juan'
								imgUrl='https://github.com/valegaru/WebProject/blob/main/my-react-app/src/assets/user1.png?raw=true'
							/>
							<Button variant='contained' className='cta-button' onClick={handleCreateTrip}>
								Create New Trip
							</Button>
						</>
					)}
				</Stack>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;

// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import {
//   AppBar, Box, Toolbar, Typography, Button,
//   Stack, IconButton, Menu, MenuItem, useMediaQuery
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import './Navbar.css';
// import ProfilePic from '../ProfilePic/ProfilePic';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery('(max-width:768px)');
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleCreateTrip = () => {
//     navigate('/expenseTracker');
//   };

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <AppBar elevation={0} sx={{ backgroundColor: '#f4e4c5', px: 4, py: 1 }} className="navbar">
//       <Toolbar disableGutters sx={{ justifyContent: 'space-between', width: '100%' }}>

//         <Box className="logo-container">
//           <img src="/src/assets/logo.png" className="logo-image" />
//           {!isMobile && (<p className="nav-title">Postal Trip</p>)}
//         </Box>

//         {!isMobile && (

//           <Stack direction="row" spacing={5} alignItems="center">
//             <NavLink
//               to="/"
//               className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
//             >
//               Home
//             </NavLink>
//             <NavLink
//               to="/tripPlanner"
//               className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
//             >
//               Trips
//             </NavLink>
//             <NavLink
//               to="/matchmaker"
//               className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
//             >
//               Destination Matchmaker
//             </NavLink>
//           </Stack>
//         )}

//         <Stack direction="row" spacing={2} alignItems="center">
//           {isMobile && (
//             <>
//               <IconButton
//                 edge="end"
//                 color="inherit"
//                 onClick={handleMenuOpen}
//                 aria-controls="mobile-menu"
//                 aria-haspopup="true"
//               >
//                 <MenuIcon sx={{ color: '#647e37', fontSize: 32 }} />
//               </IconButton>

//               <Menu
//                 id="mobile-menu"
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 keepMounted
//               >
//                 <MenuItem onClick={handleMenuClose} component={NavLink} to="/">Home</MenuItem>
//                 <MenuItem onClick={handleMenuClose} component={NavLink} to="/tripPlanner">Trips</MenuItem>
//                 <MenuItem onClick={handleMenuClose} component={NavLink} to="/matchmaker">Destination Matchmaker</MenuItem>
//               </Menu>
//             </>
//           )}

//           <ProfilePic
//             name="Juan"
//             imgUrl="https://github.com/valegaru/WebProject/blob/main/my-react-app/src/assets/user1.png?raw=true"
//           />

//           <Button
//             variant="contained"
//             className="cta-button"
//             onClick={handleCreateTrip}
//           >
//             New Trip
//           </Button>
//         </Stack>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
