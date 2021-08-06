
const drawButton = document.getElementById("drawButton");
const stayButton = document.getElementById("stayButton");
const playerTotal = document.getElementById("playerTotal");
const dealerTotal = document.getElementById("dealerTotal");
const dealerWinsElement = document.getElementById("dealerWins");
const playerWinsElement = document.getElementById("playerWins");
const dealerCards = document.getElementById("dealerCards");
const playerCards = document.getElementById("playerCards");
const winner = document.getElementById("winner");
const playAgainButton = document.getElementById("playAgainButton");

const jokerCard = {"image":"https://deckofcardsapi.com/static/img/X1.png"};


const API = "https://www.deckofcardsapi.com/api/deck/";
let deckId = "";

let playerHand = [];
let dealerHand = [];
let playerWins = 0;
let dealerWins = 0;

const initNewGame = () => {
    
    playerHand = [];
    dealerHand = [];
    drawCard(playerHand, 2);
    setTimeout(() => {
        drawCard(dealerHand, 1);  
         
    }, 3500);
    setTimeout(() => {
        console.log("before calling joker")
        addCardsToElement(dealerCards, jokerCard);   
    }, 5000);
    

    
    playerCards.innerHTML = "";
    dealerCards.innerHTML = "";
    renderTotal();
}

fetch(API + "new/shuffle/?deck_count=6")
    .then(response => response.json())
    .then(data => deck = data)
    .then(deck =>  deckId = deck.deck_id)
    .then(initNewGame)
    .catch((error) => {
        console.log(error)
    });

console.log(deckId);

const drawCard = (user, count) => {

    fetch(API + deckId +"/draw/?count="+ count)
    .then(response => response.json())
    .then(data => cards = data)
    .then(cards => (addCardToUser(user, cards.cards)))
    .then(renderTotal)
    .catch((error) => {
        console.log(error)
    });

}

const addCardToUser = (user, cards) => {
    let elem = (user === playerHand) ? playerCards : dealerCards;

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        setTimeout(() => {
            addCardsToElement(elem, card);
        }, i * 2000);
    
    }
    user.push(...cards);

    if(getTotal(playerHand) > 21){
        stayButton.style.display = "none";
        drawButton.style.display = "none";
        checkWinner();
    }

}

const getTotal = (userCards) =>{
    let total = 0;
    let aces = 0;
    
    userCards.forEach(element => {
        if(isNaN(parseInt(element.value))){
            if(element.value !== "ACE")
            total += 10;
            else
            aces++;
        }
        else{
        total += parseInt(element.value);
        }
    });

    if(aces > 0){
        if(total + 11 + aces - 1 > 21){
            total += aces;
        }
        else{
            total += 11 + aces - 1;
        }
    }

   return total;
}

const renderTotal = () => {
    dealerWinsElement.innerText = "dealer:" + dealerWins;
    playerWinsElement.innerText = "player:" + playerWins;
    playerTotal.innerText = getTotal(playerHand) > 21 ? "bust" : getTotal(playerHand);
    dealerTotal.innerText = getTotal(dealerHand) > 21 ? "bust" : getTotal(dealerHand);
}

const stay = () => {
    stayButton.style.display = "none";
    drawButton.style.display = "none";
    dealerCards.removeChild(dealerCards.lastChild);

    dealerGetCard();

}

const dealerGetCard = () => {
    renderTotal();
    if(getTotal(dealerHand) < 17){
        drawCard(dealerHand, 1)
        setTimeout(function() {
            dealerGetCard();
        }, 1500)
    }else{
        checkWinner();
    }
}



const checkWinner = () => {
    if(getTotal(playerHand) > 21){
        dealerWins++;
        winner.innerText = "Dealer wins";
    }else if(getTotal(dealerHand) > 21){
        playerWins++;
        winner.innerText = "Player wins";
    }else if(getTotal(dealerHand) < getTotal(playerHand)){
        playerWins++;
        winner.innerText = "Player wins";
    }else{
        dealerWins++;
        winner.innerText = "Dealer wins";
    }
    playAgainButton.style.display = "block";
    setTimeout(() => {
        renderTotal();  
    }, 1500);

}

const playAgain = () => {
    playAgainButton.style.display = "none";
    drawButton.style.display = "initial";
    stayButton.style.display = "initial";
    winner.innerHTML = "";
    initNewGame();
/* 
    setTimeout(function() {
    }, 1000)
 */}

const addCardsToElement = (element, ...card) => {
    console.log(card)
    console.log(card[0])
    
    let div = document.createElement('div');
    let img = document.createElement('img');
    img.src = card[0].image;
    div.appendChild(img);
    div.classList.add("tst");
    element.appendChild(div);


    if(card.length > 1){
        addCardsToElement(element, ...card.shift());
    }

}

drawButton.addEventListener("click",(function(){
drawCard(playerHand, 1);
}));

stayButton.addEventListener("click", stay);

playAgainButton.addEventListener("click", playAgain);

