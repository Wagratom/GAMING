import { AiOutlineClose } from 'react-icons/ai';

export default function Bar({ openOrClosedConf }: { openOrClosedConf: () => void}) : JSX.Element {
	return (
		<div className="d-flex align-items-center border-bottom" style={{ height: '55px' }}>
			<AiOutlineClose className="ms-5" role="button" size={30} onClick={openOrClosedConf} />
			<h5 className="m-0 ms-5">Dados do Grupo</h5>
		</div>
	)
}
