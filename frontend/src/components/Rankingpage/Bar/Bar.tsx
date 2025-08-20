import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

export default function Bar() {
	return (
		<div className="row g-0 align-items-center text-center shadow-grounps p-2" style={{backgroundColor: 'transparent'}}>
			<div className="col-5">
				<LeftSide />
			</div>

			<div className="col-2"></div>

			<div className="col-5">
				<RightSide />
			</div>
		</div>
	)
}
