window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const firstOuterTiles = Array.from(document.querySelectorAll('.firstOuterTiles'));
    const secondOuterTiles = Array.from(document.querySelectorAll('.secondOuterTiles'));
    const red = document.querySelector('.red');
    const blue = document.querySelector('.blue');
    const yellow = document.querySelector('.yellow');
    const green = document.querySelector('.green');
    const lightblue = document.querySelector('.lightblue');
    const orange = document.querySelector('.orange');
    const purple = document.querySelector('.purple');
    const pink = document.querySelector('.pink');
    const startButton = document.querySelector('.startButton');
    const cutout = document.querySelector('.cutout');
    const progressIndicator = document.querySelector('.progressIndicator');

    let currentColors = [red, blue, yellow, green];
    let userClick = false;
    let roundBoard = document.createElement('div');
    let roundCounter = document.createElement('p');
    let round = 1;
    roundCounter.innerText = 'Round ' + round;
    let tileLightSpeed = 600;
    let progressCount = 0;

    const randomTile = () => {
        return currentColors[parseInt(Math.random() * currentColors.length)];
    }

    let sequence = [randomTile()];
    let tilesToGuess = [...sequence];

    const lightUp = tile => {
        return new Promise(resolve => {
            tile.classList.add('active');
            setTimeout(() => { // Little wait after AI turn
                setTimeout(() => { // Time each tile is pressed
                    tile.classList.remove('active');
                    setTimeout(() => { // Time in between each tile press
                        resolve();
                    }, 250)
                }, tileLightSpeed)
            }, 400)
        })
    }
    
    const AITurn = async () => {
        userClick = false;
        let ball = document.createElement('div');
        ball.classList.add('progressBall');
        progressIndicator.appendChild(ball);
        if (round == 10) { // Extra difficulties if requirements are met
            tileLightSpeed = 300;
        } else if (round == 15) {
            lightblue.classList.remove('hide');
            orange.classList.remove('hide');
            currentColors = [red, blue, yellow, green, lightblue, orange];
            firstOuterTiles.forEach((outerTile) => { // We are now able to click these new two tiles
                outerTile.addEventListener('click', () => {
                    if (userClick) {
                        outerTile.classList.add('active');
                        setTimeout(() => {
                            outerTile.classList.remove('active');
                        }, 300)
                        checkTile(outerTile);
                    }
                });
            });
        } else if (round == 20) {
            purple.classList.remove('hide');
            pink.classList.remove('hide');
            currentColors = [red, blue, yellow, green, lightblue, orange, purple, pink];
            secondOuterTiles.forEach((outerTile) => { // We are now able to click these new two tiles
                outerTile.addEventListener('click', () => {
                    if (userClick) {
                        outerTile.classList.add('active');
                        setTimeout(() => {
                            outerTile.classList.remove('active');
                        }, 300)
                        checkTile(outerTile);
                    }
                });
            });
        }
        for (tile of sequence) {
            await lightUp(tile);
        }
        userClick = true;
    }

    const checkTile = clickedTile => {
        const nextTile = tilesToGuess.shift();
        if (nextTile === clickedTile) {
            progressIndicator.getElementsByTagName('div')[progressCount].classList.add('progressBallDone'); // We take the div from progressIndicator that's the same as the round we're in and we add the class we want
            progressCount++;
            if (tilesToGuess.length === 0) {
                userClick = false;
                sequence.push(currentColors[parseInt(Math.random() * currentColors.length)]);
                tilesToGuess = [...sequence];
                round++;
                roundCounter.innerText = 'Round ' + round;
                progressCount = 0;
                var balls = document.querySelectorAll(".progressBall");
                setTimeout(() => { // Wait to see last green ball
                    [].forEach.call(balls, function(ball) {
                        ball.classList.remove("progressBallDone");
                    });
                }, 600)
                setTimeout(() => { // Little wait after player turn
                    AITurn();
                }, 500)
            }
        } else {
            roundCounter.innerText = 'Game over';
            roundCounter.classList.add('endMessage');
            userClick = false;
            progressIndicator.getElementsByTagName('div')[progressCount].classList.add('progressBallFail');
            setTimeout(() => {
                roundBoard.remove();  // We reset everything to start again
                cutout.appendChild(startButton);
                round = 1;
                roundCounter.classList.remove('endMessage');
                sequence = [randomTile()];
                tilesToGuess = [...sequence];
                lightblue.classList.add('hide');
                orange.classList.add('hide');
                purple.classList.add('hide');
                pink.classList.add('hide');
                progressCount = 0;
                var balls = document.querySelectorAll(".progressBall");
                [].forEach.call(balls, function(ball) {
                    ball.remove();
                });
            }, 1500)
        }
    }

    tiles.forEach((tile) => {
        tile.addEventListener('click', () => {
            if (userClick) {
                tile.classList.add('active');
                setTimeout(() => { // User press animation
                    tile.classList.remove('active');
                }, 300)
                checkTile(tile);
            }
        });
    });

    startButton.addEventListener('click', () => {
        startButton.remove();
        roundBoard.classList.add('roundBoard');
        cutout.appendChild(roundBoard);
        roundCounter.innerText = 'Round ' + round;
        roundBoard.appendChild(roundCounter);
        AITurn();
    });
});