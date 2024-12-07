'use strict';
import { words } from './words.js';

const startButton = document.getElementById('start-button');
const playButton = document.getElementById('play-button');
const typingInput = document.getElementById('typing-input');
const wordDisplay = document.getElementById('word-display');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer');
const highScoresList = document.getElementById('high-scores');
const scoreboardContainer = document.querySelector('.scoreboard');
const backgroundMusic = document.getElementById('background-music');

let score = 0;
let totalHits = 0;
let timer = null;
let startTime;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    totalHits = 0;
    startTime = Date.now();
    typingInput.value = '';
    typingInput.disabled = false;
    playButton.style.display = 'none';
    scoreboardContainer.style.display = 'none';
    typingInput.focus();
    generateWord();

    backgroundMusic.play();

    timer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `⏱ ${15 - elapsedTime}s`;

        if (elapsedTime >= 15) {
            endGame();
        }
    }, 1000);
}

function generateWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    wordDisplay.textContent = words[randomIndex];
}

typingInput.addEventListener('input', () => {
    if (typingInput.value === wordDisplay.textContent) {
        score++;
        totalHits++;
        typingInput.value = '';
        generateWord();
    } else if (typingInput.value.length > wordDisplay.textContent.length) {
        totalHits++;
        typingInput.value = '';
        generateWord();
    }
    updateScore();
});

function updateScore() {
    scoreDisplay.textContent = `Hits: ${score}`;
}

function endGame() {
    clearInterval(timer);
    typingInput.disabled = true;
    playButton.style.display = 'block';

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    const percentage = totalHits > 0 ? Math.round((score / totalHits) * 100) : 0;
    const date = new Date().toLocaleDateString();
    const gameResult = {
        hits: score,
        percentage: percentage,
        date: date
    };

    highScores.push(gameResult);
    highScores.sort((a, b) => b.hits - a.hits).splice(10);
    localStorage.setItem('highScores', JSON.stringify(highScores));

    displayScoreboard();
}

function displayScoreboard() {
    scoreboardContainer.style.display = 'block';

    if (highScores.length === 0) {
        highScoresList.innerHTML = '<li>No games played yet!</li>';
    } else {
        highScoresList.innerHTML = highScores
            .map((score, index) => `
                <li class="${index === 0 ? 'best' : ''}">
                    <span>#${index + 1}</span>
                    <span>${score.hits} words</span>
                    <span>${score.date}</span>
                </li>
            `)
            .join('');
    }
}

scoreboardContainer.style.display = 'none';
