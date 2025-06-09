import React, { useEffect, useState, useMemo } from 'react';
import '../ExpenseCard/ExpenseCard.css';
import { useSelector } from 'react-redux';
import ProfileInfo from '../ProfileInfo/ProfileInfo';
import EditExpenseModal from './../EditExpenseModal/EditExpenseModal';
import { getUserProfilePicture } from '../../../utils/firebaseUtils';
import { getUserNameById } from './../../../utils/firebaseUtils';


const ExpenseCard = ({ event, view }) => {
	const [participantProfiles, setParticipantProfiles] = useState({});
	const [loadingProfiles, setLoadingProfiles] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const currencySelect = useSelector((state) => state.currency.currency);

	if (!event) {
		return <div>No event data</div>;
	}

	const {
		id,
		title = 'Untitled Expense',
		amount = 0,
		start,
		end,
		originalStart,
		originalEnd,
		participants = [],
		currency = currencySelect,
	} = event;

	const participantList = useMemo(() => Object.values(participants), [participants]);
	const totalContributed = participants.reduce((sum, p) => {
		return sum + (Number(p.contribution) || 0);
		}, 0);
	const isFullyPaid = Number(totalContributed.toFixed(2)) === Number(Number(amount).toFixed(2));
	const computedStatus = isFullyPaid ? 'paid' : 'pending';

	const isDetailedView = view === 'agenda';

	useEffect(() => {
		const fetchParticipantProfiles = async () => {
			if (participantList.length === 0) return;
			
			setLoadingProfiles(true);
			const profileMap = {};

			try {
				await Promise.all(
					participantList.map(async (participant) => {
						if (participant?.userID) {
							const [profilePicture, username] = await Promise.all([
								getUserProfilePicture(participant.userID),
								getUserNameById(participant.userID)
							]);
							
							profileMap[participant.userID] = {
								name: username || 'Unknown User',
								imgUrl: profilePicture || '',
								contribution: Number(participant.contribution) || 0
							};
						}
					})
				);
				
				setParticipantProfiles(profileMap);
			} catch (error) {
				console.error('Error fetching participant profiles:', error);
			} finally {
				setLoadingProfiles(false);
			}
		};

		fetchParticipantProfiles();
	}, [participantList]);

	const formatAmount = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(Number(amount) || 0);
	};

	const formatTimeRange = () => {
		if (!start && !originalStart) return '';
		const startTime = originalStart || start;
		const endTime = originalEnd || end;

		if (!startTime || !endTime) return '';

		const formatTime = (date) => {
			return new Date(date).toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
		};

		return `${formatTime(startTime)} - ${formatTime(endTime)}`;
	};

	const getStatusStyles = () => {
	const statusStyles = {
		pending: {
			background: ' #ff6b35',
			borderLeft: '4px solid #ff6b35',
		},
		paid: {
			background: ' #45a049',
			borderLeft: '4px solid #45a049',
		},
	};
	return statusStyles[computedStatus] || statusStyles.pending;
};

	const cardStyle = {
		...getStatusStyles(computedStatus),
		color: 'white',
		padding: '8px',
		borderRadius: '6px',
		fontSize: '12px',
		lineHeight: '1.3',
		overflow: 'hidden',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		textShadow: '0 1px 2px rgba(0,0,0,0.3)',
		boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		position: 'relative',
		top: 0,
		left: 0,
		margin: 0,
	};

	const handleMouseEnter = (e) => {
		e.currentTarget.style.transform = 'scale(1.02)';
		e.currentTarget.style.zIndex = '10';
		e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
	};

	const handleMouseLeave = (e) => {
		e.currentTarget.style.transform = 'scale(1)';
		e.currentTarget.style.zIndex = '1';
		e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
	};

	const handleCardClick = () => {
		setShowEditModal(true);
	};

	const handleCloseModal = () => {
		setShowEditModal(false);
	};

	return (
		<>
			<div
				className={`expense-card expense-card--${computedStatus}`}
				style={cardStyle}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleCardClick}
				title={`${title} - ${formatAmount(amount)} - ${participantList.length} participant(s)`}
			>
			<div className='expense-card__content'>
				<div className='expense-card__row'>
					<div className='expense-card__title'>{title}</div>
					<div className='expense-card__amount'>{formatAmount(amount)}</div>
					{isDetailedView && formatTimeRange() && <div className='expense-card__time'>{formatTimeRange()}</div>}
				</div>

				{isDetailedView && participantList.length > 0 && (
				<div className='expense-card__participants'>
						{loadingProfiles ? (
							<div className='expense-card__loading'>Loading participants...</div>
						) : (
							<>
								{participantList.slice(0, 3).map((participant, index) => {
									const profile = participantProfiles[participant.userID];
									if (!profile) return null;
									
									return (
										<ProfileInfo
											key={participant.userID || index}
											name={profile.name}
											imgUrl={profile.imgUrl}
											contribution={profile.contribution}
										/>
									);
								})}
								{participantList.length > 3 && (
									<div className='expense-card__participants-overflow'>
										+{participantList.length - 3} more
									</div>
								)}
							</>
						)}
					</div>
			)}

			</div>

			
		</div>

		{showEditModal && (
			<EditExpenseModal
				event={event}
				onClose={handleCloseModal}
				onEventUpdated={() => {
					handleCloseModal();
				}}
				onEventDeleted={() => {
					handleCloseModal();
				}}
			/>
		)}
	</>
	);
};

export default ExpenseCard;