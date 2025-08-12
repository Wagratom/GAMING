import Phaser from 'phaser';
import barInitial from '../../../assets/game/bar/barInitial.png';
import ball from '../../../assets/game/ball2.png';
import { Socket } from 'socket.io-client';
import { useContext } from 'react';
import { UserData } from '../../InitialPage/Contexts/Contexts';
const userData = useContext(UserData).user;
interface DataRoom {
	Player1: string,
	Player2: string,
	Player1Bar: string,
	Player2Bar: string,
	lider: boolean,
	room: string
}

type DataGame = {
	paddleLider: number,
	paddlePlayer: number,
	positionBall: [number, number]
	room: string
	isLider: boolean
}

export class CustomScene extends Phaser.Scene {
	//Inicializando variaveis
	paddle1: Phaser.Physics.Arcade.Sprite = {} as Phaser.Physics.Arcade.Sprite;
	paddle2: Phaser.Physics.Arcade.Sprite = {} as Phaser.Physics.Arcade.Sprite;
	paddle1UpKey: Phaser.Input.Keyboard.Key = {} as Phaser.Input.Keyboard.Key;
	paddle1DownKey: Phaser.Input.Keyboard.Key = {} as Phaser.Input.Keyboard.Key;
	paddle2UpKey: Phaser.Input.Keyboard.Key = {} as Phaser.Input.Keyboard.Key;
	paddle2DownKey: Phaser.Input.Keyboard.Key = {} as Phaser.Input.Keyboard.Key;
	ball: Phaser.Physics.Arcade.Sprite = {} as Phaser.Physics.Arcade.Sprite;
	dataBallGame: { x: number, y: number, lastpaddle: string };
	isLider: boolean;
	socket: Socket;
	onePercenteY: number;
	onePercenteX: number;

	dataGame: DataGame = {
		isLider: false,
		paddleLider: 0,
		paddlePlayer: 0,
		positionBall: [0, 0],
		room: ''
	}

	constructor(data: DataRoom, isLider: boolean) {
		super('CustomScene');
		this.ball = {} as Phaser.Physics.Arcade.Sprite;
		this.socket = userData.socket as Socket;
		this.isLider = isLider;
		this.dataBallGame = { x: 0, y: 0, lastpaddle: '' };
		this.onePercenteX = 0;
		this.onePercenteY = 0;
		this.dataGame.isLider = isLider;
		this.dataGame.room = data.room;
		this.listenSocket();
	}

	convertToPercente(x: number, y: number): [number, number] {
		return [x / this.onePercenteX, y / this.onePercenteY];
	}

	revertToPercente(x: number, y: number): [number, number] {
		return [x * this.onePercenteX, y * this.onePercenteY];
	}

	mirrorShowBallX(x: number, y: number): [number, number] {
		const [revX, revY] = this.revertToPercente(x, y);
		return [this.scale.width - revX, revY];
	}

	emitDataGame(isLider: boolean, data: DataGame) {
		if (!isLider) return;
		const [x, y] = this.convertToPercente(this.ball.x, this.ball.y);
		this.dataGame = {
			isLider: true,
			positionBall: [x, y],
			paddleLider: this.paddle1.y,
			paddlePlayer: 0,
			room: this.dataGame.room
		}
		this.socket.emit('rooms', this.dataGame);
	}

	notLiderEmitPaddle() {
		this.dataGame = {
			isLider: false,
			positionBall: [0, 0],
			paddleLider: 0,
			paddlePlayer: this.paddle1.y,
			room: this.dataGame.room
		}
		this.socket.emit('rooms', this.dataGame);
	}

	listenSocket() {
		this.socket.on('startGame', (data: DataGame) => {
			if (!this.isLider && data.isLider) {
				this.paddle2.y = data.paddleLider;
				const [x, y] = this.mirrorShowBallX(data.positionBall[0], data.positionBall[1]);
				this.ball.x = x;
				this.ball.y = y;
			} else if (this.isLider && !data.isLider) {
				this.paddle2.y = data.paddlePlayer;
			}
		});
	}


	preload() {
		this.load.image('paddle', barInitial);
		this.load.image('ball', ball);
	}

	create() {
		this.onePercenteX = this.scale.width / 100;
		this.onePercenteY = this.scale.height / 100;
		this.dataBallGame = { x: (this.onePercenteX * 10), y: 0, lastpaddle: '' };

		this.add.text(this.scale.width / 2, 10, 'Space Pong', { font: '16px Courier', color: '#00ff00' });

		this.paddle1 = this.physics.add.sprite(50, this.scale.height / 2, 'paddle')
		this.paddle1.setImmovable(true)
		this.paddle1.setScale(0.1);

		this.paddle2 = this.physics.add.sprite(this.scale.width - 50, this.scale.height / 2, 'paddle')
		this.paddle2.setImmovable(true)
		this.paddle2.setScale(0.1);

		if (this.input && this.input.keyboard) {
			this.paddle1UpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
			this.paddle1DownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		}

		this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ball')
		this.ball.setScale(0.1);


		this.ball.setVelocity(this.dataBallGame.x, 0);
		this.ball.setCollideWorldBounds(true);

		this.paddle1.setCollideWorldBounds(true);
		this.paddle2.setCollideWorldBounds(true);

		this.physics.add.collider(this.ball, this.paddle1, () => { this.ballHitPaddle('paddle1') });
		this.physics.add.collider(this.ball, this.paddle2, () => { this.ballHitPaddle('paddle2') });
	}

	ballHitPaddle(paddle: string) {
		let { lastpaddle, x } = this.dataBallGame;

		if (lastpaddle === paddle) return;

		this.dataBallGame.lastpaddle = paddle;
		x = x < 0 ? (x - this.onePercenteX) * -1 : (x + this.onePercenteX) * -1;

		this.dataBallGame.x = x;
		this.dataBallGame.y = Phaser.Math.Between(-200, 200);

		if (this.isLider == true) {
			this.ball.setVelocityX(this.dataBallGame.x);
			this.ball.setVelocityY(this.dataBallGame.y);
		}
	}

	update() {
		if (!this.ball) return;
		if (!this.ball.body) return
		if (!this.paddle1 || !this.paddle2) return;

		if (this.ball.x <= 52 || this.ball.x >= this.scale.width - 52) this.scene.restart();

		//pegar a posicaçãp da bola em %
		if (this.ball.y <= 52 || this.ball.y >= this.scale.height - 52) {
			this.ball.setVelocityY(-this.dataBallGame.y);
			if (this.ball.y <= 52) {
				this.ball.y = 55;
			}
			if (this.ball.y >= this.scale.height - 52) this.ball.y = this.scale.height - 55;
		}

		if (this.paddle1UpKey.isDown) {
			this.paddle1.setVelocityY(-150);
			if (!this.isLider) {
				this.notLiderEmitPaddle();
			}
		}
		else if (this.paddle1DownKey.isDown) {
			this.paddle1.setVelocityY(150);
			if (!this.isLider) {
				this.notLiderEmitPaddle();
			}
		}
		else this.paddle1.setVelocityY(0)
		this.emitDataGame(this.isLider, this.dataGame);
	}
}

