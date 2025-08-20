import { IoMdSettings } from "react-icons/io";
import { UserData } from '../../InitialPage/Contexts/Contexts';
import React, { useContext, useState } from 'react';
import ConfigurationGame from './Configurations/Configurations';
import OptionsMiniProfile from './OptionsMiniProfile';
import PhotoWithOnlineStatus from "./PhotoWithOnlineStatus";

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
}

export default function MiniPerfilUser(props: propsMiniProfile) {
	const { user } = useContext(UserData);
	const [optionsConf, setOptionsConf] = useState<boolean>(false);
	const [showConfigurations, setShowConfigurations] = useState<boolean>(false);

	if (user.nickname === '' || user.avatar === '') {
		return (
			<div className='d-flex p-3' style={{ height: '15vh' }}>
				<div className="spinner-border text-primary m-auto h-75" role="status">
					<span className="visually-hidden m-auto">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className='d-flex p-3 text-white'>
			{/* toggle to open configuration profile */}
			{showConfigurations ? <ConfigurationGame closed={setShowConfigurations} /> : null}

			<div className='h-100 d-flex align-items-center'>

				{/* avatar photo and status online */}
				<PhotoWithOnlineStatus
					online={user.online}
					imgSrc={user.avatar}
					photoHeight='5rem'
					photoWidth='5rem'
					positionTop='78%'
					positionEnd='61%'
				/>
				{/* nickName and online */}
				<div>
					<p>{user.nickname}</p>
					<p>{user.online ? 'Online' : "Offline"}</p>
				</div>
			</div>

			{/* icon to open options settings */}
			<div className='position-relative w-100'>
				<div className='d-flex justify-content-end ms-auto position-relative z-3'>
					<IoMdSettings
						type='button'
						size={20}
						fill={optionsConf ? 'gray' : 'white'}
						onClick={() => setOptionsConf(!optionsConf)}
					/>
				</div>
				<div className="position-absolute  top-0 end-0 z-1">
					{optionsConf && (
						<OptionsMiniProfile
							showMiniPerfil={props.showMiniPerfil}
							id={user.id}
							setShowConfigurations={setShowConfigurations}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
