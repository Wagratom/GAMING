import { IoMdSettings } from "react-icons/io";
import { UserData } from '../../InitialPage/Contexts/Contexts';
import React, { useContext, useState } from 'react';
import Status from './PlayersStatus';
import ConfigurationGame from './Configurations/Configurations';
import OptionsMiniProfile from './OptionsMiniProfile';

type propsMiniProfile = {
	showMiniPerfil: React.Dispatch<React.SetStateAction<string>>;
}

export default function MiniPerfilUser(props: propsMiniProfile) {
	const userData = useContext(UserData).user;
	const [optionsConf, setOptionsConf] = useState<boolean>(false);
	const [showConfigurations, setShowConfigurations] = useState<boolean>(false);

	if (userData.nickname === '' || userData.avatar === '') {
		return (
			<div className='d-flex p-3' style={{ height: '15vh' }}>
				<div className="spinner-border text-primary m-auto h-75" role="status">
					<span className="visually-hidden m-auto">Loading...</span>
				</div>
			</div>
		);
	}

	console.log(`userData.avatar: ${userData.avatar}`)
	return (
		<div className='d-flex p-3 text-white'>
			{/* toggle to open configuration profile */}
			{showConfigurations ? <ConfigurationGame closed={setShowConfigurations} /> : null}

			<div className='h-100 d-flex align-items-center'>

				{/* avatar photo and status online */}
				<div className='position-relative'>
					<img className="rounded-circle me-3 p-6 w-6" src={userData.avatar} alt='foto' />
					<div className='borda-online'>
						<div className='circle-online'></div>
					</div>
				</div>

				<Status
					is_active={true}
					name={userData.nickname}
					my_id={userData.id}
					admin={[]}
					mute={[]}
					match_status={''}
					player_id={''}
				/>
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
							id={userData.id}
							setShowConfigurations={setShowConfigurations}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
