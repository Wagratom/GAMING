import Bar from "./Bar";
import TopRank from "./TopRank/TopRank";
import bgTerra from '../../assets/game/planets/backgrounds/bgTerra.jpg'
import { SetStateAction } from "react";
import { IoMdClose } from "react-icons/io";

type propsRanking = {
	openStore: React.Dispatch<SetStateAction<string>>;
}

export default function Ranking(props: propsRanking): JSX.Element {
	const cssBackgroundTerra = {
		backgroundImage: `url(${bgTerra})`,
		backgroundSize: 'cover',
		backgroundPosition: 'contain',
		backgroundRepeat: 'no-repeat',
	}

	return (
		<div
			className="h-75 w-75 rounded position-absolute top-50 start-50 translate-middle"
			style={cssBackgroundTerra}
			onClick={(event) => event.stopPropagation()}
		>
			<IoMdClose
				className="button-close"
				style={{
					backgroundColor: '#7cdedb',
					boxShadow: `2px 2px 1px #FFF inset, -8px -8px 8px ${'#0f3a28'} inset`
				}}
				onClick={() => props.openStore('')}
			/>

			<div className="d-flex flex-column h-100 p-5">
				<Bar />
				<div className="h-100 overflow-auto">
					<TopRank />
				</div>
			</div>
		</div>
	)
}
