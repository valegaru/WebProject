import React, { useEffect, useState } from 'react';
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
import { getUserProfilePicture } from '../../utils/firebaseUtils';
import { useSelector} from 'react-redux';

const Navbar = () => {

	const uid = useSelector((state) => state.auth.userId)
	const [profilePic, setProfilePic] = useState()

	useEffect(() => {
	const fetchProfilePic = async () => {
		const url = await getUserProfilePicture(uid);
		setProfilePic(url) 
	};
	fetchProfilePic();
}, []);

	const navigate = useNavigate();
	const isMobile = useMediaQuery('(max-width:768px)');
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleCreateTrip = () => {
		navigate('/tripcreation');
	};

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const profileClick = () => {
		navigate('/profile')
	}

	return (
		<AppBar elevation={0} sx={{ backgroundColor: '#f4e4c5', px: 4, py: 1 }} className='navbar'>
			<Toolbar disableGutters sx={{ justifyContent: 'space-between', width: '100%' }}>
				<Box className='logo-container'>
					<img src='https://github.com/valegaru/WebProject/blob/main/src/assets/logo.png?raw=true' className='logo-image' />
					{!isMobile && <p className='nav-title'>Postal Trip</p>}
				</Box>

				{!isMobile && (
					<Stack direction='row' spacing={5} alignItems='center'>
						<NavLink to='/home' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
							Home
						</NavLink>
						<NavLink to='/trips' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
							Trips
						</NavLink>
						<NavLink to='/matchmaker' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
							Destination Matchmaker
						</NavLink>
					</Stack>
				)}

				<Stack direction='row' spacing={2} alignItems='center'>
					{isMobile && (
						<>
							<IconButton
								edge='end'
								color='inherit'
								onClick={handleMenuOpen}
								aria-controls='mobile-menu'
								aria-haspopup='true'
							>
								<MenuIcon sx={{ color: '#647e37', fontSize: 32 }} />
							</IconButton>

							<Menu id='mobile-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} keepMounted>
								<MenuItem onClick={handleMenuClose} component={NavLink} to='/home'>
									Home
								</MenuItem>
								<MenuItem onClick={handleMenuClose} component={NavLink} to='/trips'>
									Trips
								</MenuItem>
								<MenuItem onClick={handleMenuClose} component={NavLink} to='/matchmaker'>
									Destination Matchmaker
								</MenuItem>
							</Menu>
						</>
					)}

					<ProfilePic
						name='Juan'
						imgUrl={profilePic}
						onClick={profileClick}
					/>

					<Button variant='contained' className='cta-button' onClick={handleCreateTrip}>
						Create New Trip
					</Button>
				</Stack>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
