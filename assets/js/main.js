// constant definitions for visibility (improves readability of code)
const hidden = false;
const visible = true;

// constant definitions for the moves
const rock = 0;
const paper = 1;
const scissors = 2;

const moveNames = ["Rock", "Paper", "Scissors"];


// constant definitions for UI container elements
const gameSetup = document.getElementById('gameSetup');
const gamePlay = document.getElementById('gamePlay');

// constant definitions for single UI elements
const numCustomRounds = document.getElementById('numCustomRounds');

const lblGameProgress = document.getElementById('lblGameProgress');
const lblPlayerPoints = document.getElementById('lblPlayerPoints');
const lblComputerPoints = document.getElementById('lblComputerPoints');

const imgComputerMove = document.getElementById('imgComputerMove');

const btnRock = document.getElementById('btnRock');
const btnPaper = document.getElementById('btnPaper');
const btnScissors = document.getElementById('btnScissors');

const gamePlayMessages = document.getElementById('gamePlayMessages');

// variable definitions for the game
let maxRounds = 5;
let playedRounds = 0;
let playerPoints = 0;
let computerPoints = 0;

// an array to store all player moves to detect some 'possible preferences'
// init with 1 for every move
let playerMoves = [1, 1, 1];


//****************************************************************************
initialize();
function initialize() {

    document.getElementById('rbRounds5').checked = true;
    showGameSetup();
}


//****************************************************************************
function showGameSetup() {

    // first setup rounds ...
    document.body.style.background = "url('assets/img/background-mickey.png') top left/cover no-repeat"
    showHideElement(gameSetup, visible);
    showHideElement(gamePlay, hidden);
}


//****************************************************************************
function checkChanged(numberFieldEnabled) {

    numCustomRounds.disabled = !numberFieldEnabled;
}


//****************************************************************************
// The party begins...
function startGame() {

    getNumberOfRounds();
    playedRounds = 1;
    playerPoints = 0;
    computerPoints = 0;

    document.body.style.background = "url('assets/img/background.png') center/cover no-repeat"

    showHideElement(gameSetup, hidden);
    showHideElement(gamePlay, visible);

    lblGameProgress.innerHTML = `Round ${playedRounds} of ${maxRounds}`;

    lblPlayerPoints.innerHTML = playerPoints;
    lblComputerPoints.innerHTML = computerPoints;

    imgComputerMove.src = 'assets/img/mickey-mouse.png'
    clearMoves();
    lockMoves(false);

}



//****************************************************************************
// get number of rounds
function getNumberOfRounds() {

    for (let i = 5; i <= 20; i += 5) {
        maxRounds = document.getElementById(`rbRounds${i}`).checked ? i : maxRounds;
    }

    if (document.getElementById('rbCustom').checked) {
        maxRounds = numCustomRounds.value;
    }
}

//****************************************************************************
function makeMove(playerMove) {

    let result = 0;

    playerMove = eval(playerMove);

    let computerMove = getComputerMove();

    // lock buttons
    lockMoves(true);

    if (computerMove == rock) {
        imgComputerMove.src = 'assets/img/mickey-mouse-rock.png'
    } else if (computerMove == paper) {
        imgComputerMove.src = 'assets/img/mickey-mouse-paper.png'
    } else if (computerMove == scissors) {
        imgComputerMove.src = 'assets/img/mickey-mouse-scissors.png'
    } else {
        imgComputerMove.src = 'assets/img/mickey-mouse.png'
    }

    switch (true) {
        case (playerMove == computerMove):
            // draw (default): result = 0;

            break;

        case (playerMove == rock):
            result = computerMove == scissors ? 1 : -1;
            break;

        case (playerMove == paper):
            result = computerMove == rock ? 1 : -1;
            break;

        case (playerMove == scissors):
            result = computerMove == paper ? 1 : -1;
            break;

        default:
            // illegal move, should never happen! But who knows...
            console.log("%cWTF! I'm lost!", "color: red;");
            console.log("playerMove:", playerMove);
            return;
    }

    let col = result == -1 ? "red" : (result == 0 ? "orange" : "green");

    switch (playerMove) {
        case rock:
            btnRock.style.background = col;
            break;
        case paper:
            btnPaper.style.background = col;
            break;
        case scissors:
            btnScissors.style.background = col;
            break;
        default:
            break;
    }

    // add result to points
    if (result != 0) result > 0 ? playerPoints++ : computerPoints++;

    // remember player's move
    playerMoves[playerMove]++;

    // show the result of this round
    showResult(result);
}

//****************************************************************************
function getComputerMove() {

    let computerMove;

    // a factor to make the result more 'accurate'
    let factor = 1;

    // try to detect some 'possible preferences'
    let sum = factor * (
        playerMoves[rock] +
        playerMoves[paper] +
        playerMoves[scissors]
    );

    // get a random number 
    let response = Math.random() * sum;

    // and now check the player's preferences
    if (response < playerMoves[rock] * factor) {

        // player prefers rock, but paper wraps stone!
        computerMove = paper;

    } else if (response < playerMoves[paper] * factor) {

        // player prefers paper, but scissors cuts paper!
        computerMove = scissors;

    } else {

        // player prefers scissors, but stone rock scissors!
        computerMove = rock;
    }

    // return computer's move
    return computerMove;
}



//****************************************************************************
async function showResult(result) {

    lblPlayerPoints.innerHTML = playerPoints;
    lblComputerPoints.innerHTML = computerPoints;

    await sleep(3000);
    clearMoves();
    // game hasn't ended...
    if (playedRounds < maxRounds) {
        // increase the number of played rounds    
        playedRounds++;

        lblGameProgress.innerHTML = `Round ${playedRounds} of ${maxRounds}`;

        // unlock buttons
        lockMoves(false);
        return;
    }

    // TODO: show final game result
    let text = "it's a Draw!";
    if (playerPoints != computerPoints)
        text = (playerPoints > computerPoints ? 'Player' : 'Mickey') + ' has won!';

    lblGameProgress.innerHTML = `After ${maxRounds} Rounds ${text}`;

    // wait 10 secs to show the setup screen again
    await sleep(10000);

    // finally show the setup screen again
    showGameSetup();
}


//****************************************************************************
function resetGame() {

}


//****************************************************************************
function getElement(id) {
    return document.getElementById(id);
}

//****************************************************************************
function showHideElement(element, isVisible) {

    // element is visible, nothing to do...
    if (isVisible && (element.style.display != "none"))
        return;

    // element is visible and should be hidden
    if (!isVisible && (element.style.display != "none")) {
        element["save"] = element.style.display;
        element.style.display = "none";
    }

    // element is hidden and should be visible
    if (isVisible && (element.style.display = "none")) {
        element.style.display = element["save"];
        element["save"] = null;
    }
}


//********************************************************************************************
// function clearMoves(): clear background of the three possible moves
function clearMoves() {

    btnRock.style.background = btnPaper.style.background = btnScissors.style.background = "transparent";
    imgComputerMove.src = 'assets/img/mickey-mouse.png'
}


//********************************************************************************************
// function lockMoves(lockState): enable or disables the three possible moves
// used to prevent selection of a move while the result is displayed
function lockMoves(lockState) {

    btnRock.disabled = btnPaper.disabled = btnScissors.disabled = lockState;
}


//********************************************************************************************
// function sleep(milliseconds): suspend execution of the javascript code for the given time
// Important: this function has to be called using await, otherwise the excution of the code
//            continues immediately. If this function is called within another function use 
//            async for the calling function!
// Sample: 
// async function callingFunction() {
//     console.log('before sleep()');
//     await sleep(5000);
//     console.log('after sleep()');
// }
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


//****************************************************************************
// speak(document.getElementById("txtSpeak").value);
function speak(textToSpeak) {

    let utterance = new SpeechSynthesisUtterance(textToSpeak);
    speechSynthesis.speak(utterance);
}


