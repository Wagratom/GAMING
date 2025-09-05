package com.transcender.main.domain.entity;

import com.transcender.main.domain.valueobject.PlayerMove;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

public class PongGame {
    private final String roomId;
    private final List<String> players = new ArrayList<>();
    private int width = 600, height = 400;
    private int paddleHeight = 80, paddleWidth = 10;
    private int ballX = 300, ballY = 200, ballSize = 10;
    private int ballVelX = 4, ballVelY = 4;
    private int leftPaddleY = 160, rightPaddleY = 160;
    private int scoreLeft = 0, scoreRight = 0;

    public void addPlayer(String playerId) {
        if (!players.contains(playerId) && players.size() < 2) {
            players.add(playerId);
        }
    }

    public void movePlayer(PlayerMove move) {
        if (players.size() < 2) return;

        if (players.get(0).equals(move.playerId())) {
            leftPaddleY += move.deltaY();
        } else if (players.get(1).equals(move.playerId())) {
            rightPaddleY += move.deltaY();
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
            ballX = paddleWidth; // evita bug de ficar preso
        }

        // Colisão com paddle direito
        if (ballX + ballSize >= width - paddleWidth &&
                ballY + ballSize >= rightPaddleY &&
                ballY <= rightPaddleY + paddleHeight) {
            ballVelX *= -1;
            ballX = width - paddleWidth - ballSize;
        }

        // Pontuação
        if (ballX < 0) {
            scoreRight++;
            resetBall();
        } else if (ballX > width) {
            scoreLeft++;
            resetBall();
        }
    }

    private void resetBall() {
        ballX = width / 2;
        ballY = height / 2;
        ballVelX *= -1; // manda para o lado contrário de quem fez ponto
        ballVelY = 4;
    }
}
