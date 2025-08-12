import { useContext, useState } from "react"
import { ReactComponent as UnicCoin } from '../../../assets/store/unicCoin.svg'
import { UserData } from "../../InitialPage/Contexts/Contexts"
// import { Tooltip } from "react-tooltip"
import bgLua from "../../../assets/game/planets/backgrounds/bgLuaStore.jpg";

type propsButtonPlay = {
	photo: string,
	explanation: string,
	id: string,
	price: number,
	backgroundBuy?: string,
}

export default function ButtonsItemsStore(props: propsButtonPlay): JSX.Element {
	const [isHover, setIsHover] = useState(false)
	const userData = useContext(UserData)

	const cssBgLua: React.CSSProperties = {
		backgroundImage: `url(${bgLua})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	}

	const cssDiv: React.CSSProperties = {
		...cssBgLua,
		height: '8rem',
		width: '8rem',
		margin: '1rem',
		marginTop: '0',
		padding: '0.5rem',
		borderRadius: '0.5rem',
		transition: 'all 0.5s',
		backgroundColor: '#9400d3',
		boxShadow: '1px 1px 10px #FFF inset, -1px -1px 10px black inset',
		transform: isHover ? 'scale(1.1)' : 'scale(1)',
		backgroundSize: '100% 100%',

	}

	const cssPhoto: React.CSSProperties = {
		height: '6rem', //4.5
		width: '100%',
		marginBottom: '0.5rem',
		borderRadius: '0.5rem',
	}

	const cssButton: React.CSSProperties = {
		width: '100%',
		border: 'none',
		backgroundColor: props.backgroundBuy ? 'transparent' : 'gold',
		backgroundImage: props.backgroundBuy ? `url(${props.photo})` : '',
		backgroundSize: '100% 100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: '0.5rem',
	}

	const buyBar = (itemData: propsButtonPlay) => {
		if (itemData.price > userData.user.coins) {
			alert("You don't have enough coins")
			return
		}

	}
	return (
		<>
			<div style={cssDiv}
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
			>
				<div style={cssPhoto}>
					<img className='h-100 w-100 rounded' src={props.photo} alt="playPong" />
				</div>
				{/* <button type="button" style={cssButton} onClick={() => { buyBar(props) }}>
					<p className="fw-bold me-1">Buy</p>
					<p>{props.price}</p>
					<UnicCoin style={{ height: '2rem' }} />
				</button> */}
				<button type="button" style={cssButton} onClick={() => { buyBar(props) }}>
					<p className="fw-bold me-1">Buy</p>
					<p>{props.price}</p>
					<UnicCoin style={{ height: '2rem' }} />
				</button>

			</div>
		</>
	)
}
