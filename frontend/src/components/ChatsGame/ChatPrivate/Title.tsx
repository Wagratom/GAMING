import { useState } from 'react';
import { PlayerDto } from '../../InitialPage/Contexts/Contexts'
import PhotoWithOnlineStatus from '../../Profiles/MineProfile/PhotoWithOnlineStatus'
import useWebSocket from '../../Profiles/MineProfile/useWebSocket';

export default function TitleChatPrivate({ friend }: { friend: PlayerDto }): JSX.Element {
	const [online, setOnline] = useState<boolean>(friend.online)

	useWebSocket("/topic/login", (nickname: string) => {
		if (friend.nickname === nickname) setOnline(true)
	})

	useWebSocket("/topic/logout", (userId: string) => {
		if (friend.id === userId) setOnline(false)
	});

	return (
		<div className="p-2 border-bottom d-flex align-items-center" style={{ height: '4rem' }}>
			<PhotoWithOnlineStatus
				online={online}
				imgSrc={friend.avatar}
				photoHeight='2rem'
				photoWidth='2rem'
				positionTop='61%'
				positionEnd='40%'
			/>
			<span className='ms-1 fs-5'>{friend.nickname}</span>
		</div>

	)
}

