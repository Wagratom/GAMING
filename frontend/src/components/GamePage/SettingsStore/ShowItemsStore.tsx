
import Coins from '../Coins'
import ButtonsItemsStore from './ButtonItemsStore'
import { StoreItems } from './FakeApiStore'

import bgLua from "../../../assets/game/planets/backgrounds/bgLua.jpg";

export default function ShowItemsStore({items}: {items: StoreItems}): JSX.Element {
	const cssbgLua: React.CSSProperties = {
		backgroundImage: `url(${bgLua})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	}

	const cssDivFilhoSelectGame: React.CSSProperties = {
		...cssbgLua,
		position: 'relative',
		zIndex: 2,
		display: 'flex',
		flexDirection: 'column',
	}

	const cssCoins: React.CSSProperties = {
		position: 'absolute',
		top: '0',
		right: '0',
		zIndex: 3,
	}

	return (
		<div style={cssDivFilhoSelectGame}>
			<Coins />
			{items.map((listItems, index) => {
				return (
					<div className="d-flex p-3" id='divOptionsStartGame' key={index}>
						{listItems.map((item) => {
							return (
								<ButtonsItemsStore
									photo={item.photo}
									explanation={item.explanation}
									id={item.id}
									price={item.price}
									backgroundBuy={item.backgroundBuy}
									key={item.id}
								/>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}
