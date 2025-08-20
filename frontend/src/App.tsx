import './index.css';
import { Login } from './components/LoginPage/Login';
import InicialPage from './components/InitialPage/InitialPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginFake from './components/LoginPage/LoginFake';
import Game from './components/GamePage/Game/Game';
import GameWW from './components/GamePage/Game/GameWW';

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/fake" element={<LoginFake />} />
					<Route path="/game/" element={<InicialPage />}>
						<Route index element={<Game />} />
						<Route path="pong/:room" element={<GameWW />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}
