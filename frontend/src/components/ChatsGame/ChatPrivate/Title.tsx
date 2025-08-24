import { Player } from '../../InitialPage/Contexts/Contexts'
import PhotoWithOnlineStatus from '../../Profiles/MineProfile/PhotoWithOnlineStatus'

export default function TitleChatPrivate({ friend }: { friend: Player }): JSX.Element {
	return (
		<div className="p-2 border-bottom d-flex align-items-center" style={{ height: '4rem' }}>
			<PhotoWithOnlineStatus
				online={friend.online}
				imgSrc={friend.avatar}
				photoHeight='2rem'
				photoWidth='2rem'
				positionTop='62%'
				positionEnd='41%'
			/>
			<span className='ms-1 fs-5'>{friend.nickname}</span>
		</div>

	)
}

