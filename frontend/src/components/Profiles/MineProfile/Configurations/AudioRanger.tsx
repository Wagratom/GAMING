import { AiOutlineSound } from "react-icons/ai";
import { BsSoundwave } from "react-icons/bs";

export default function AudioRanger(): JSX.Element {
	return (
		<>
			<div className='d-flex'>
				<label htmlFor="song" className="form-label me-5">
					<AiOutlineSound color="black" />
				</label>
				<input type="range" className="form-range" min="0" max="5" step="0.5" id="song"></input>
			</div>
			<div className='d-flex'>
				<label htmlFor="music" className="form-label me-5">
					<BsSoundwave color="black"/>
				</label>
				<input type="range" className="form-range" min="0" max="5" step="0.5" id="music"></input>
			</div>
		</>
	)
}
