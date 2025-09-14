import { MatchInfo, UserDto } from "../../InitialPage/Contexts/Contexts";



export default function MatchHistory({ userId, matchers }: { userId: string, matchers: MatchInfo[] }) {
	const sizePicture: React.CSSProperties = {
		width: '50px',
		height: '50px'
	}

	const colorGreen: React.CSSProperties = {
		color: 'lime',
	}

	const colorRed: React.CSSProperties = {
		color: 'red',
	}
	function mountHistoryBar(match: MatchInfo) {
		const oponente: UserDto = match.loser.id === userId ? match.winner : match.loser;
		const isLoser = match.loser.id === userId;
		return (
			<>
				<div className='d-flex p-2 justify-content-between hover text-center' key={match.id}>
					<div>
						<img
							style={sizePicture}
							className='rounded-circle'
							src={oponente.avatar}
							alt={`avatar do ${oponente.nickname} `} />
					</div>
					<div className='fs-5 col-3'>
						<p className="letter-pixel">Adversary</p>
						<p className="letter-pixel">{oponente.nickname}</p>
					</div>
					<div className='fs-5 fw-bold col-2'>
						<p className="letter-pixel">Score</p>
						<p>
							{`${isLoser ? match.winnerScore : match.loserScore} X ${isLoser ? match.loserScore : match.winnerScore}`}
						</p>
					</div>
					<p
						style={isLoser ? colorRed : colorGreen}
						className="letter-pixel fs-1"
						dangerouslySetInnerHTML={{ __html: isLoser ? "DEFEAT&nbsp;" : "VICTORY" }}
					/>
				</div>
				<hr />
			</>
		)
	}

	matchers.sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
	return (
		<div>
			{matchers.map((match: MatchInfo, index) => {
				return (mountHistoryBar(match))
			})}
		</div>
	);
}

//TODO: Remover outro Profile
