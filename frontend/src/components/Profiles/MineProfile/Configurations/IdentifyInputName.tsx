export default function IdentifyInputName({_avatar, _nickname}: {_avatar: string, _nickname: string} ): JSX.Element {
	return (
		<div className='d-flex justify-content-between w-100'>
			<p className="d-flex align-items-center">{_nickname}</p>
			<img src={_avatar} alt={`avatar do ${_nickname}`} />
		</div>
	)
}
