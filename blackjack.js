//game setup
let deck = [];
let playerHand = [];
let dealerHand = [];
let numberOfDecks = 1;
let gameOver = false;
let cardCount = 0;

//DOM elements
const deckCountInput = document.getElementById("deck_count");
const errorMessage = document.getElementById("error_message");
const deckSubmitButton = document.getElementById("deck_submit");
const startGameButton = document.getElementById("start_button");
const shuffleButton = document.getElementById("shuffle_button");
const audio = document.getElementById("shuffle_audio");
const hitButton = document.getElementById("hit_button");
const standButton = document.getElementById("stand_button");
const cardCountButton = document.getElementById("card_count_button");
const deckSelection = document.getElementById("deck_selection");
const gameArea = document.getElementById("game_area");
const dealerArea = document.getElementById("dealer_area");
const playerArea = document.getElementById("player_area");
const cardCountArea = document.getElementById("card_count_area");
const playerCards = document.getElementById("player_cards");
const dealerCards = document.getElementById("dealer_cards");
const playerScoreDisplay = document.getElementById("player_score");
const dealerScoreDisplay = document.getElementById("dealer_score");
const cardCountScore = document.getElementById("card_count");
const messageDisplay = document.getElementById("message");
const dealNewHand = document.getElementById("deal_new_button");
const restartGameButton = document.getElementById("restart_button");

//event listeners
deckSubmitButton.addEventListener("click", deckSubmit);
deckCountInput.addEventListener("keydown", (Event) => {
    if (Event.key === "Enter") {
        deckSubmit();
    }
});
startGameButton.addEventListener("click", startGame);
shuffleButton.addEventListener("click", () => {
    deck = riffleShuffle(deck, 100); //shuffle deck
    console.log("The deck has been shuffled successfully!");

    audio.currentTime = 0;
    audio.play(); //plays deck shuffle
});
hitButton.addEventListener("click", playerHit);
standButton.addEventListener("click", playerStand);
dealNewHand.addEventListener("click", dealNew);
cardCountButton.addEventListener("click", revealCardCount);
restartGameButton.addEventListener("click", gameRestart);


//UTILITY FUNCTIONS
//handle deck submit
function deckSubmit() {
    deckSelection.style.display = "none";

    if (isNaN(parseInt(deckCountInput.value))) {
        errorMessage.style.display = "flex";
        setTimeout(() => {
            errorMessage.style.display = "none";
            showGameArea();
        }, 4000)
    } else if (parseInt(deckCountInput.value) > 8) {
        numberOfDecks = 8;
        showGameArea();
    } else {
        numberOfDecks = parseInt(deckCountInput.value);
        showGameArea();
    }
}

//hide buttons
function hideGameButtons() {
    hitButton.style.display = "none";
    standButton.style.display = "none";
    dealNewHand.style.display = "none";
    restartGameButton.style.display = "none";
}

function showHitStand() {
    hitButton.style.display = "block";
    hitButton.disabled = false;
    standButton.style.display = "block";
    standButton.disabled = false;
    cardCountButton.style.display = "block";
    cardCountButton.disabled = false;
}

//show game area
function showGameArea() {
    startGameButton.style.visibility ="visible";
    shuffleButton.style.visibility = "visible";
    messageDisplay.style.visibility = "hidden";
    shuffleButton.disabled = false;
    hideGameButtons();
    deck = createDeck();
}

//show card count
function revealCardCount() {
    cardCountArea.classList.toggle("visible");
    cardCountScore.classList.toggle("visible");
}

//create deck
function createDeck() {
    let values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    let suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    let newDeck = [];
    let iterations = 100;

    for (let i = 0; i < numberOfDecks; i++) {
        for (const value of values) {
            for (const suit of suits) {
                newDeck.push({ value: value, suit: suit });
            }
        }
    }
    return riffleShuffle(newDeck, iterations);
}

//shuffle deck
function riffleShuffle(array, iterations) {
    let shuffled = array.slice();

    //number of shuffles
    for (let i = 0; i < iterations; i++) {
        let midpoint = Math.ceil(shuffled.length / 2);
        let firstHalf = shuffled.slice(0, midpoint), secondHalf = shuffled.slice(midpoint, shuffled.length);
        shuffled = [];

        while (firstHalf.length > 0 || secondHalf.length > 0) {
            if (firstHalf.length && (!secondHalf.length || Math.random() < 0.5)) {
                shuffled.push(firstHalf.shift());
            } else if (secondHalf.length > 0) {
                shuffled.push(secondHalf.shift());
            }
        }
    }
    return shuffled;
}

//deal hands
function dealHands() {
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    initialCardCount(playerHand);
    updateCardCount(getCardValue(dealerHand[0]));
}

//get initial card count
function initialCardCount(hand) {
    for (let card of hand) {
        if (getCardValue(card) < 7) cardCount++;
        else if (getCardValue(card) > 9) cardCount--;
    }
}

//get card values
function getCardValue(card) {
    if (["J", "Q", "K"].includes(card.value)) return 10;
    if (card.value === "A") return 11;
    return parseInt(card.value);
}

//render cards
function renderCards(hand, element) {
    element.innerHTML = "";
    for (let card of hand) {
        const cardContainer = document.createElement("div")
        const cardImage = document.createElement("img");

        if (card.hidden) cardImage.src = "./card_images/card_back.png";
        else cardImage.src = getCardImage(card.value, card.suit);

        cardImage.style.width = "75px";
        cardImage.style.height = "105px";
        cardImage.classList.add("card")
        
        cardContainer.appendChild(cardImage);
        element.appendChild(cardContainer);
    }
}

//get card image
function getCardImage(value, suit){
    if (value === "A" && suit === "hearts") return "./card_images/hearts_ace.png";
    if (value === "A" && suit === "spades") return "./card_images/spades_ace.png";
    if (value === "A" && suit === "diamonds") return "./card_images/diamonds_ace.png";
    if (value === "A" && suit === "clubs") return "./card_images/clubs_ace.png";
    if (value === 2 && suit === "hearts") return "./card_images/hearts_2.png";
    if (value === 2 && suit === "spades") return "./card_images/spades_2.png";
    if (value === 2 && suit === "diamonds") return "./card_images/diamonds_2.png";
    if (value === 2 && suit === "clubs") return "./card_images/clubs_2.png";
    if (value === 3 && suit === "hearts") return "./card_images/hearts_3.png";
    if (value === 3 && suit === "spades") return "./card_images/spades_3.png";
    if (value === 3 && suit === "diamonds") return "./card_images/diamonds_3.png";
    if (value === 3 && suit === "clubs") return "./card_images/clubs_3.png";
    if (value === 4 && suit === "hearts") return "./card_images/hearts_4.png";
    if (value === 4 && suit === "spades") return "./card_images/spades_4.png";
    if (value === 4 && suit === "diamonds") return "./card_images/diamonds_4.png";
    if (value === 4 && suit === "clubs") return "./card_images/clubs_4.png";
    if (value === 5 && suit === "hearts") return "./card_images/hearts_5.png";
    if (value === 5 && suit === "spades") return "./card_images/spades_5.png";
    if (value === 5 && suit === "diamonds") return "./card_images/diamonds_5.png";
    if (value === 5 && suit === "clubs") return "./card_images/clubs_5.png";
    if (value === 6 && suit === "hearts") return "./card_images/hearts_6.png";
    if (value === 6 && suit === "spades") return "./card_images/spades_6.png";
    if (value === 6 && suit === "diamonds") return "./card_images/diamonds_6.png";
    if (value === 6 && suit === "clubs") return "./card_images/clubs_6.png";
    if (value === 7 && suit === "hearts") return "./card_images/hearts_7.png";
    if (value === 7 && suit === "spades") return "./card_images/spades_7.png";
    if (value === 7 && suit === "diamonds") return "./card_images/diamonds_7.png";
    if (value === 7 && suit === "clubs") return "./card_images/clubs_7.png";
    if (value === 8 && suit === "hearts") return "./card_images/hearts_8.png";
    if (value === 8 && suit === "spades") return "./card_images/spades_8.png";
    if (value === 8 && suit === "diamonds") return "./card_images/diamonds_8.png";
    if (value === 8 && suit === "clubs") return "./card_images/clubs_8.png";
    if (value === 9 && suit === "hearts") return "./card_images/hearts_9.png";
    if (value === 9 && suit === "spades") return "./card_images/spades_9.png";
    if (value === 9 && suit === "diamonds") return "./card_images/diamonds_9.png";
    if (value === 9 && suit === "clubs") return "./card_images/clubs_9.png";
    if (value === 10 && suit === "hearts") return "./card_images/hearts_10.png";
    if (value === 10 && suit === "spades") return "./card_images/spades_10.png";
    if (value === 10 && suit === "diamonds") return "./card_images/diamonds_10.png";
    if (value === 10 && suit === "clubs") return "./card_images/clubs_10.png";
    if (value === "J" && suit === "hearts") return "./card_images/hearts_jack.png";
    if (value === "J" && suit === "spades") return "./card_images/spades_jack.png";
    if (value === "J" && suit === "diamonds") return "./card_images/diamonds_jack.png";
    if (value === "J" && suit === "clubs") return "./card_images/clubs_jack.png";
    if (value === "Q" && suit === "hearts") return "./card_images/hearts_queen.png";
    if (value === "Q" && suit === "spades") return "./card_images/spades_queen.png";
    if (value === "Q" && suit === "diamonds") return "./card_images/diamonds_queen.png";
    if (value === "Q" && suit === "clubs") return "./card_images/clubs_queen.png";
    if (value === "K" && suit === "hearts") return "./card_images/hearts_king.png";
    if (value === "K" && suit === "spades") return "./card_images/spades_king.png";
    if (value === "K" && suit === "diamonds") return "./card_images/diamonds_king.png";
    if (value === "K" && suit === "clubs") return "./card_images/clubs_king.png";
}

//calculate score
function calculateScore(hand) {
    let total = 0;
    let aceCount = 0;

    for (let card of hand) {
        total += getCardValue(card);
        if (card.value === "A") aceCount++;
    }

    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }
    return total
}

//update scores
function updateScores() {
    playerScoreDisplay.textContent = "Score: " + calculateScore(playerHand);
    const formattedCardCount = cardCount > 0 ? "+" + cardCount : cardCount;
    cardCountScore.textContent = "Count: " + formattedCardCount;
    if (gameOver) dealerScoreDisplay.textContent = "Score " + calculateScore(dealerHand);
    else dealerScoreDisplay.textContent = "Score ?"
}

//update card count
function updateCardCount(cardValue) {
    if (cardValue < 7) cardCount++;
    else if (cardValue > 9) cardCount--;
}

//deal new hand
function dealNew() {
    playerHand = [];
    dealerHand = [];
    messageDisplay.style.visibility = "hidden";
    dealNewHand.style.display = "none";
    restartGameButton.style.display = "none";
    startGame();
}

//restart game
function gameRestart() {
    location.reload(true);
}

//GAME EXECUTION
function startGame() {
    gameArea.style.visibility = "visible";
    cardCountArea.style.visibility = "visible";
    cardCountArea.style.opacity = "1";
    shuffleButton.style.display = "none";
    startGameButton.style.display = "none";
    showHitStand();

    dealHands();
    gameOver = false;
    messageDisplay.textContent = "";

    renderCards(playerHand, playerCards);
    renderCards([dealerHand[0], { hidden: true }], dealerCards);
    updateScores();
}

//player hit
function playerHit() {
    if (gameOver) return;
    let temp;

    temp = deck.pop();
    playerHand.push(temp);

    updateCardCount(getCardValue(temp));
    renderCards(playerHand, playerCards);
    updateScores();

    if (calculateScore(playerHand) > 21) {
        updateCardCount(getCardValue(dealerHand[1]));
        endGame("You bust! The House wins.")
    }
}

//player stand
function playerStand() {
    if (gameOver) return;
    hitButton.disabled = true;
    standButton.disabled = true;

    while (calculateScore(dealerHand) < 17) {
        let temp;
        temp = deck.pop();
        dealerHand.push(temp);
        updateCardCount(getCardValue(temp));
    }
    updateCardCount(getCardValue(dealerHand[1]));

    renderCards(dealerHand, dealerCards);
    updateScores();

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame("You win!")
    } else if (playerScore < dealerScore) {
        endGame("Dealer wins!");
    } else {
        endGame("It's a tie!");
    }
}

//endgame
function endGame(message) {
    gameOver = true;
    hitButton.style.display = "none";
    standButton.style.display = "none";
    renderCards(dealerHand, dealerCards);
    messageDisplay.textContent = message;
    dealNewHand.style.display = "flex";
    restartGameButton.style.display = "flex";
    dealNewHand.style.visibility = "visible";
    restartGameButton.style.visibility = "visible";
    messageDisplay.style.visibility ="visible";
    updateScores();
}
