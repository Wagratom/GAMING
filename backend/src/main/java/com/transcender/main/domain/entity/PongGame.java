package com.transcender.main.domain.entity;

import com.transcender.main.domain.valueobject.PlayerMoveDto;

public class PongGame {

    private final String roomId;
    private final String mode; // "Normal", "Ranqueado", "VSCOOP"

    private UserCore playerLeft;
    private UserCore playerRight;
    private int width = 600, height = 400;
    private int paddleHeight = 80, paddleWidth = 10;
    private int ballX = 300, ballY = 200, ballSize = 10;
    private int ballVelX = 4, ballVelY = 4;
    private int leftPaddleY = 160, rightPaddleY = 160;
    private int scoreLeft = 0, scoreRight = 0;
    private final int paddleSpeed = 5;

    public PongGame(String roomId, String mode) {
        this.roomId = roomId;
        this.mode = mode;
    }

    public void addPlayer(UserCore playerLeftId, UserCore playerRightId) {
        this.playerLeft = playerLeftId;
        this.playerRight = playerRightId;
    }

    // Atualiza posição do paddle baseado no DTO
    public void movePlayer(PlayerMoveDto move) {
        int deltaY = move.isUp() ? -paddleSpeed : paddleSpeed;

        if (move.isLeft()) {
            leftPaddleY += deltaY;
            leftPaddleY = Math.max(0, Math.min(height - paddleHeight, leftPaddleY));
        } else {
            rightPaddleY += deltaY;
            rightPaddleY = Math.max(0, Math.min(height - paddleHeight, rightPaddleY));
        }
    }

    public void updateBall() {
        ballX += ballVelX;
        ballY += ballVelY;

        // Rebote nas paredes superior/inferior
        if (ballY <= 0 || ballY + ballSize >= height) {
            ballVelY *= -1;
        }

        // Colisão com paddle esquerdo
        if (ballX <= paddleWidth &&
                ballY + ballSize >= leftPaddleY &&
                ballY <= leftPaddleY + paddleHeight) {
            ballVelX *= -1;
            increaseSpeed(); // 🚀 aumenta a velocidade
            ballX = paddleWidth;
        }

        // Colisão com paddle direito
        if (ballX + ballSize >= width - paddleWidth &&
                ballY + ballSize >= rightPaddleY &&
                ballY <= rightPaddleY + paddleHeight) {
            ballVelX *= -1;
            increaseSpeed(); // 🚀 aumenta a velocidade
            ballX = width - paddleWidth - ballSize;
        }


        if (ballX + ballSize < 0) {   // bola passou totalmente da esquerda
            scoreRight++;
            resetBall();
        } else if (ballX > width) {   // bola passou da direita
            scoreLeft++;
            resetBall();
        }

    }

    private void resetBall() {
        ballX = width / 2;
        ballY = height / 2;

        // aumenta velocidade gradualmente
        if (ballVelX > 0) ballVelX = Math.abs(ballVelX) + 1;
        else ballVelX = -(Math.abs(ballVelX) + 1);

        ballVelY = 4;
    }

    private void increaseSpeed() {
        if (ballVelX > 0) ballVelX++;
        else ballVelX--;

        if (ballVelY > 0) ballVelY++;
        else ballVelY--;
    }

    // Getters
    public boolean isFinished() {
        return scoreLeft >= 3 || scoreRight >= 3;
    }

    public Long getWinnerId() {
        if (scoreLeft >= 3) {
            return playerLeft.getId();
        } else if (scoreRight >= 3) {
            return playerRight.getId();
        }
        return null;
    }

    public Long getLoserId() {
        if (scoreLeft < 3) {
            return playerLeft.getId();
        } else if (scoreRight < 3) {
            return playerRight.getId();
        }
        return null;
    }

    public Integer getScoreWinner() {
        return (scoreLeft > scoreRight) ? Integer.valueOf(scoreLeft) : Integer.valueOf(scoreRight);
    }

    public Integer getScoreLoser() {
        return (scoreLeft < scoreRight) ? Integer.valueOf(scoreLeft) : Integer.valueOf(scoreRight);
    }

    public String getRoomId() {
        return roomId;
    }

    public int getScoreLeft() {
        return scoreLeft;
    }

    public int getScoreRight() {
        return scoreRight;
    }

    public int getBallX() {
        return ballX;
    }

    public int getBallY() {
        return ballY;
    }

    public int getBallSize() {
        return ballSize;
    }

    public int getLeftPaddleY() {
        return leftPaddleY;
    }

    public int getRightPaddleY() {
        return rightPaddleY;
    }

    public int getPaddleHeight() {
        return paddleHeight;
    }

    public int getPaddleWidth() {
        return paddleWidth;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public UserCore getPlayerLeft() {
        return playerLeft;
    }

    public UserCore getPlayerRight() {
        return playerRight;
    }

}
