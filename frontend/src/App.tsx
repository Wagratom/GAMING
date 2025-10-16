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
					<Route path="bankai/login" element={<Login />} />
					<Route path="bankai" element={<InicialPage />}>
						<Route index element={<Game />} />
						<Route path="bankai/room/:room" element={<GameWW />} />
					</Route>
					<Route path="*" element={<Navigate to="/bankai" replace />} />

				</Routes>
			</BrowserRouter>
		</div>
	);
}
