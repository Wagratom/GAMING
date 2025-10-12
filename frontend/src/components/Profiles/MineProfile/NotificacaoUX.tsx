import DinamicProfile from '../DinamicProfile/DinamicProfile';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import { PlayerDto, UserData } from '../../InitialPage/Contexts/Contexts';
import { FaCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { LiaRobotSolid } from "react-icons/lia";
import { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type propsMiniProfile = {
	players: PlayerDto[];
	setPlayers: React.Dispatch<React.SetStateAction<PlayerDto[]>>;
	setReceivedNotification: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function NotificacaoUX({ players, setPlayers, setReceivedNotification }: propsMiniProfile) {
	const { user } = useContext(UserData)

	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>({ id: '', nickname: '' });
	const navigate = useNavigate();

	if (players.length === 0) {
		return (
			<div className='d-flex flex-column justify-content-center align-items-center h-100'>
				<div className='d-flex justify-content-center'>
					<p className='text-white'>Você não possui nenhuma notificaçao</p>
				</div>
			</div>
		)
	}

	function acceptOrDeclineFriendRequest(player: PlayerDto, accept: boolean) {
		// Lógica para aceitar ou recusar a solicitação de amizade
		const url = process.env.REACT_APP_API_URL + `/friends/${player.id}/${accept ? 'accept' : 'decline'}`;
		axios.post(url, {}, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				if (res.status === 200) {
					setPlayers((prevRequests) => prevRequests.filter((p) => p.id !== player.id));
					if (players.length === 1) setReceivedNotification(false)
				}
			})
			.catch((err) => {
				if (err.response?.status === 401) {
					alert("Sessão expirada ou não autorizada. Por favor, faça login novamente.");
					navigate('/login')
				}
			});
	}

	return (
		<div className='p-2 text-white overflow-auto h-100'>
			{!dinamicProfile ? null :
				<DinamicProfile
					openDinamicProfile={setDinamicProfile}
					id={profileData.id}
				/>
			}

			{/* Map for show players list */}
			{
				players.map((userRequests) => {
					if (user.id === userRequests.id) return null;
					return (
						<div className='d-flex  p-1 position relative z-1 ' key={userRequests.id}>
							<div className='d-flex w-100 align-items-center'>
								<PhotoWithOnlineStatus
									online={userRequests.online}
									imgSrc={userRequests.avatar}
									photoHeight='2.5rem'
									photoWidth='2.5rem'
									positionTop='70%'
									positionEnd='47%'
									callback={() => {
										setDinamicProfile("open")
										setProfileData({ id: userRequests.id, nickname: userRequests.nickname })
									}}
								/>
								<p className='d-flex align-items-center'>
									<LiaRobotSolid size={30} className='pe-2' />
									{userRequests.nickname} quer ser seu amigo
								</p>
							</div>
							<div className='d-flex align-items-center me-1'>
								<FaCheck
									size={25}
									className='me-5 c-pointer'
									color='green'
									title='Invite to play'
									onClick={() => acceptOrDeclineFriendRequest(userRequests, true)}
								/>
								<ImCancelCircle
									size={25}
									color='red'
									className='c-pointer'
									title='Invite to play'
									onClick={() => acceptOrDeclineFriendRequest(userRequests, false)}
								/>
							</div>
						</div>
					)
				})}
		</div>
	);
}
