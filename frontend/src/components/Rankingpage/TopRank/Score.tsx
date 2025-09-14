import { typeRaking } from './TopRank';

export default function Score({ statusPart }: { statusPart: typeRaking }): JSX.Element {
	return (
		<div className="d-flex align-items-center justify-content-center h-100">
			<div className="ms-3">
				<p className="text-primary">VTR</p>
				<p>{statusPart.wins}</p>
			</div>
			<div className="ms-3">
				<p className="text-primary">DRT</p>
				<p>{statusPart.loses}</p>
			</div>
			<div className="ms-3">
				<p className="text-primary">EMPT</p>
				<p>{statusPart.draws}</p>
			</div>
		</div>
	);
}
