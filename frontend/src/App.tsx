import './index.css';
import { Login } from './components/LoginPage/Login';
import InicialPage from './components/InitialPage/InitialPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Game from './components/GamePage/Game/Game';
import GameWW from './components/GamePage/Game/RoomPaty';

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<InicialPage />}>
						<Route index element={<Game />} />
						<Route path="room/:room" element={<GameWW />} />
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />

				</Routes>
			</BrowserRouter>
		</div>
	);
}
