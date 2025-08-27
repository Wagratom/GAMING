import DinamicProfile from '../DinamicProfile/DinamicProfile';
import PhotoWithOnlineStatus from './PhotoWithOnlineStatus';
import { Player, UserData } from '../../InitialPage/Contexts/Contexts';
import { FaCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { LiaRobotSolid } from "react-icons/lia";
import { useContext, useState } from 'react';
import axios from 'axios';
import ConnectWebsocket from './FriendWebsocket';

type Notifications = {
	sender: Player;
	receiver: Player;
};

export default function NotificacaoUX({ notifications }: { notifications: Notifications[] }) {
	const { user } = useContext(UserData)

	const [dinamicProfile, setDinamicProfile] = useState<string>("");
	const [profileData, setProfileData] = useState<{ id: string, nickname: string }>({ id: '', nickname: '' });

	function newNotificationFriends(msg: string) {
		console.log("🔔 Nova notificação de amigos recebida ", msg)
	}

	ConnectWebsocket(`/topic/friends/${user.id}`, newNotificationFriends);


	if (notifications.length === 0) {
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
				console.log(res.data);
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
				notifications.map((notification: Notifications) => {
					if (user.id === notification.sender.id) return null;
					return (
						<div className='d-flex  p-1 position relative z-1 ' key={notification.receiver.id}>
							<div className='d-flex w-100 align-items-center'>
								<PhotoWithOnlineStatus
									online={notification.sender.online}
									imgSrc={notification.sender.avatar}
									photoHeight='2.5rem'
									photoWidth='2.5rem'
									positionTop='70%'
									positionEnd='47%'
								/>
								<p className='d-flex align-items-center'>
									<LiaRobotSolid size={30} className='pe-2' />
									{notification.sender.nickname} quer ser seu amigo
								</p>
							</div>
							<div className='d-flex align-items-center me-1'>
								<FaCheck
									size={25}
									className='me-5 c-pointer'
									color='green'
									title='Invite to play'
									onClick={() => acceptOrDeclineFriendRequest(notification.sender, true)}
								/>
								<ImCancelCircle
									size={25}
									color='red'
									className='c-pointer'
									title='Invite to play'
									onClick={() => acceptOrDeclineFriendRequest(notification.sender, false)}
								/>
							</div>
						</div>
					)
				})}
		</div>
	);
}
