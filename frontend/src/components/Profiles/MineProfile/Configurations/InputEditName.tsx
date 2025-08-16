import { CiEdit } from "react-icons/ci";
import { MdOutlineAddAPhoto } from "react-icons/md";

export default function InputEditName(): JSX.Element {
	return (
		<div className='d-flex w-100 animation-div-nickname'>
			<div className="d-flex w-50">
				<input
					className="remove-format-input p-0"
					type="text"
					name="nickname"
					placeholder='nickName'
				/>
				<label htmlFor="editNameInput">
					<CiEdit size={35} type="button" />
				</label>
			</div>
			<div className="d-flex align-items-center ms-1 w-50"
				onClick={() => { document.getElementsByName('avatar')[0].click() }}
			>
				<p style={{color: '#6b6475'}}>Photo</p>
				<input
					className="remove-format-input p-0 d-none bg-dark"
					type="file"
					name="avatar"
					placeholder='Photo'
				/>
				<MdOutlineAddAPhoto size={35} type="button" className="ms-auto" />
			</div>
		</div>

	)
}
