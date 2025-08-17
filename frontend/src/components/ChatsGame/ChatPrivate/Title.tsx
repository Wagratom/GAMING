import { Players } from '../../InitialPage/Contexts/Contexts'
import PhotoWithOnlineStatus from '../../Profiles/MineProfile/PhotoWithOnlineStatus'

export default function TitleChatPrivate({ player }: { player: Players }): JSX.Element {
	return (
		<div className="p-2 border-bottom d-flex align-items-center" style={{ height: '4rem' }}>
			<PhotoWithOnlineStatus
				online={player.online}
				imgSrc={player.avatar}
				photoHeight='2rem'
				photoWidth='2rem'
				positionTop='62%'
				positionEnd='41%'
			/>
			<span className='ms-1 fs-5'>{player.nickname}</span>
		</div>

	)
}

