import Phaser from "phaser";
import base from '../../../assets/game/planets/base.png';
import planetGame from '../../../assets/game/planets/planetGame.png';
import planetaLua from '../../../assets/game/planets/PlanetaLua.png';
import Lua from '../../../assets/game/planets/lua.png';
import planetaTerra from '../../../assets/game/planets/PlanetaTerra.png';
import satelete from '../../../assets/game/planets/satelete.png';
import naveFrente from '../../../assets/game/nave/naveFrente.png';
import naveCostas from '../../../assets/game/nave/naveCostas.png';
import naveDescendo from '../../../assets/game/nave/naveDescendo.png';
import naveLateral from '../../../assets/game/nave/naveLateral.png';

export default class GameScene extends Phaser.Scene {
    nave!: Phaser.Physics.Arcade.Sprite;
    pntBase!: Phaser.Physics.Arcade.Sprite;
    pntGame!: Phaser.Physics.Arcade.Sprite;
    pntLua!: Phaser.Physics.Arcade.Sprite;
    luaTerra!: Phaser.Physics.Arcade.Sprite;
    pntTerra!: Phaser.Physics.Arcade.Sprite;
    sateleteChat!: Phaser.Physics.Arcade.Sprite;

    collisionCallback: ((planet: string) => void) | null = null;

    init(data: { collisionCallback?: (planet: string) => void }) {
        if (data.collisionCallback) this.collisionCallback = data.collisionCallback;
    }

    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        // Planetas
        this.load.image("pntBase", base);
        this.load.image("planetGame", planetGame);
        this.load.image("planetLua", planetaLua);
        this.load.image("planetTerra", planetaTerra);
        this.load.image("satelete", satelete);
        this.load.image("Lua", Lua);
        // Nave
        this.load.image('naveFrente', naveFrente);
        this.load.image('naveCostas', naveCostas);
        this.load.image('naveDescendo', naveDescendo);
        this.load.image('naveLateral', naveLateral);
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        // Nave
        this.nave = this.physics.add.sprite(w / 2, h / 2, "naveFrente").setCollideWorldBounds(true);

        // 🔥 Planeta Fire
        this.pntGame = this.physics.add.sprite(w * 0.9, h * 0.15, "planetGame").setScale(0.3);
        this.pntGame.setCircle(this.pntGame.width / 2, 0, 0);

        // 🌙 Lua planeta
        this.pntLua = this.physics.add.sprite(w * 0.1, h * 0.2, "planetLua");
        this.pntLua.setCircle(this.pntLua.width / 2, 0, 0);

        // 🪐 Planeta com anel
        this.pntBase = this.physics.add.sprite(w * 0.1, h * 0.8, "pntBase").setScale(0.1);

        // 🌍 Terra
        this.pntTerra = this.physics.add.sprite(w * 0.6, h * 0.3, "planetTerra").setScale(0.7);
        this.pntTerra.setCircle(this.pntTerra.width / 2, 0, 0);

        // 🌑 Lua menor (30%)
        this.luaTerra = this.physics.add.sprite(w * 0.57, h * 0.25, "Lua").setScale(0.3);
        this.luaTerra.setCircle(this.luaTerra.width / 2, 0, 0);

        // 🛰️ Satélite menor (30%)
        this.sateleteChat = this.physics.add.sprite(w * 0.6, h * 0.7, "satelete").setScale(0.3);
        this.sateleteChat.setCircle(this.sateleteChat.width / 2, 10, 0);

        // Colisores + limites do mundo
        this.setupColliders();
        this.physics.world.setBounds(0, 0, w, h);

        // Escala inicial da nave
        this.updateNaveScale();

        [this.pntTerra, this.pntLua, this.pntGame, this.pntBase, this.luaTerra, this.sateleteChat].forEach(planet => {
            planet.setImmovable(true);
            planet.body!.pushable = false;
        });
        this.nave.body!.pushable = false; // nave não empurra planetas
        // Resize
        window.addEventListener('resize', () => { this.resizee() });
    }

    resizee() {
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;


        // Reposicionar todos os elementos na tela
        this.pntTerra.x = containerWidth * 0.6;
        this.pntTerra.y = containerHeight * 0.3;
    
        this.luaTerra.x = containerWidth * 0.57;
        this.luaTerra.y = containerHeight * 0.25;

        this.pntGame.x = containerWidth * 0.9;
        this.pntGame.y = containerHeight * 0.15;

        this.pntLua.x = containerWidth * 0.1;
        this.pntLua.y = containerHeight * 0.2;

        this.pntBase.x = containerWidth * 0.1;
        this.pntBase.y = containerHeight * 0.8;

        this.sateleteChat.x = containerWidth * 0.6;
        this.sateleteChat.y = containerHeight * 0.7;

        // Reposicionar a nave no centro da tela
        this.nave.x = containerWidth / 2;
        this.nave.y = containerHeight / 2;

        //redimecionar a nave
        if (this.physics.world) {
            this.physics.world.setBounds(0, 0, containerWidth, containerHeight);
        }
    }

    setupColliders() {
        const colliders = [
            [this.nave, this.pntTerra, "planetTerra"],
            [this.nave, this.pntLua, "planetLua"],
            [this.nave, this.pntGame, "planetGame"],
            [this.nave, this.pntBase, "pntBase"],
            [this.nave, this.sateleteChat, "satelite"],
            [this.nave, this.luaTerra, "Lua"]
        ] as const;

        colliders.forEach(([obj1, obj2, name]) => {
            // Usar collider, não overlap
            this.physics.add.collider(obj1, obj2, () => {
                if (this.collisionCallback) {
                    this.collisionCallback(name);
                }
            });
        });
    }

    updateNaveScale() {
        const x = this.nave.x;
        let scale = (x / this.scale.width) / 5 + 0.1;
        if (scale < 0.1) scale = 0.1;
        this.nave.setScale(scale);
    }

    update() {
        const cursors = this.input.keyboard?.createCursorKeys();
        if (!cursors) return;

        let vx = 0, vy = 0;
        let texture = "naveFrente";
        let flip = false;

        if (cursors.left.isDown) vx = -100;
        if (cursors.right.isDown) vx = 100;
        if (cursors.up.isDown) vy = -100;
        if (cursors.down.isDown) vy = 100;

        // Escolhe textura
        if (cursors.up.isDown && cursors.left.isDown) { texture = 'naveCostas'; flip = true; }
        else if (cursors.up.isDown && cursors.right.isDown) texture = 'naveCostas';
        else if (cursors.down.isDown && cursors.left.isDown) { texture = 'naveDescendo'; flip = true; }
        else if (cursors.down.isDown && cursors.right.isDown) texture = 'naveDescendo';
        else if (cursors.up.isDown) texture = 'naveCostas';
        else if (cursors.down.isDown) texture = 'naveFrente';
        else if (cursors.left.isDown) { texture = 'naveLateral'; flip = true; }
        else if (cursors.right.isDown) texture = 'naveLateral';

        this.nave.setTexture(texture);
        this.nave.setFlipX(flip);
        this.nave.setVelocity(vx, vy);

        this.updateNaveScale();
    }
}
