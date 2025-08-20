export default function AvatarAndUser(props: {avatarUrl: string, nickname: string}): JSX.Element {
	return (
		<div className="d-flex align-items-center h-100">
			<div className="d-flex w-50 justify-content-center h-100">
				<img
					className="rounded-circle mh-100 mw-100"
					src={props.avatarUrl}
					alt="foto de perfil"
				/>
			</div>
			<div className="d-flex w-50 justify-content-center">
				<p>{props.nickname}</p>
			</div>
		</div>
	)
}
