import DinamicProfile from '../DinamicProfile/DinamicProfile';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import { Player, UserData } from '../../InitialPage/Contexts/Contexts';
import { FaCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { LiaRobotSolid } from "react-icons/lia";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ConnectWebsocket from './FriendWebsocket';


type Notifications = {
	sender: Player;
	receiver: Player;
};


export default function NotificacaoUX({ resoucePlayer }: { resoucePlayer: String }) {
	const { user } = useContext(UserData)
	const [friendshipRequests, setFriendshipRequests] = useState<Player[]>([]);

	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>({ id: '', nickname: '' });

	useEffect(() => {
		console.log("Recurso de notificação alterado:", resoucePlayer);
		if (!resoucePlayer.startsWith("/notifications")) return;
		console.log("Recurso de notificação alterado:", resoucePlayer);

		const route = `${process.env.REACT_APP_API_URL}/notifications?status=PENDING` ?? "http://localhost:8080/notifications?status=PENDING";

		axios.get(route, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				console.log("Notificações recebidas:", res.data);
				setFriendshipRequests(res.data.map((notification: Notifications) => notification.sender));
			})
			.catch(() => { });
	}, [resoucePlayer]);


	function newNotificationFriends(msg: string) {
		console.log("🔔 Nova notificação de amigos recebida ", msg)
	}

	ConnectWebsocket(`/topic/friends/${user.id}`, newNotificationFriends);


	if (friendshipRequests.length === 0) {
		return (
			<div className='d-flex flex-column justify-content-center align-items-center h-100'>
				<div className='d-flex justify-content-center'>
					<p className='text-white'>Você não possui nenhuma notificaçao</p>
				</div>
			</div>
		)
	}

	function acceptOrDeclineFriendRequest(player: Player, accept: boolean) {
		// Lógica para aceitar ou recusar a solicitação de amizade
		const url = process.env.REACT_APP_API_URL + `/friends/${player.id}/${accept ? 'accept' : 'decline'}`;
		axios.post(url, {}, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => {
				if (res.status === 200) {
					setFriendshipRequests((prevRequests) => prevRequests.filter((p) => p.id !== player.id));
				}
			})
			.catch((err) => {
				console.error("Erro ao processar a solicitação de amizade:", err);
			});
	}

	return (
		<div className='p-2 text-white overflow-auto h-100'>
			{!dinamicProfile ? null :
				<DinamicProfile
					openDinamicProfile={setDinamicProfile}
					nickName={profileData.nickname}
					id={profileData.id}
				/>
			}

			{/* Map for show players list */}
			{
				friendshipRequests.map((userRequests) => {
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
