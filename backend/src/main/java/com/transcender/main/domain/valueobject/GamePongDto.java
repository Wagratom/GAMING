package com.transcender.main.domain.valueobject;


import com.transcender.main.domain.entity.PongGame;
import lombok.Getter;

@Getter
public class GamePongDto {
    private final BallDto ball;
    private final PaddleDto paddleLeft;
    private final PaddleDto paddleRight;
    private final int placarLeft;
    private final int placarRight;
    private final Long winner;
    private final WindowDto window;
    private final PowerDto power;
    private final Long playerLeftId;
    private final Long playerRightId;

    public record BallDto(int positionX, int positionY, int size) {
    }

    public record PaddleDto(int positionX, int positionFront, int height, int width, int velocity) {
    }

    public record WindowDto(int height, int width) {
    }

    public record PowerDto(int x, int y, int size) {
    }

    public GamePongDto(PongGame game) {
        this.ball = new BallDto(game.getBallX(), game.getBallY(), game.getBallSize());
        this.paddleLeft = new PaddleDto(0, game.getLeftPaddleY(), game.getPaddleHeight(), game.getPaddleWidth(), 5);
        this.paddleRight = new PaddleDto(game.getWidth() - game.getPaddleWidth(), game.getRightPaddleY(), game.getPaddleHeight(), game.getPaddleWidth(), 5);
        this.placarLeft = game.getScoreLeft();
        this.placarRight = game.getScoreRight();
        this.winner = game.getWinnerId();
        this.power = new PowerDto(0, 0, 0);
        this.window = new WindowDto(game.getHeight(), game.getWidth());
        this.playerLeftId = game.getPlayerRight().getId();
        this.playerRightId = game.getPlayerLeft().getId();
    }
}