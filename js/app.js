
const drawButton = document.getElementById("drawButton");
const playerTotal = document.getElementById("playerTotal");

const API = "https://www.deckofcardsapi.com/api/deck/";
let deckId = "";

let playerHand = [];
let dealerHand = [];

fetch(API + "new/shuffle/?deck_count=6")
    .then(response => response.json())
    .then(data => deck = data)
    .then(deck =>  deckId = deck.deck_id)
    .catch((error) => {
        console.log(error)
    });

console.log(deckId);

const drawCard = (user, count) => {

    fetch(API + deckId +"/draw/?count="+ count)
    .then(response => response.json())
    .then(data => cards = data)
    .then(cards =>  user.push(...cards.cards))
    .then(renderTotal)
    .catch((error) => {
        console.log(error)
    });


  
}

const getTotal = (user) =>{
    let total = 0;
    let aces = 0;
    
    user.forEach(element => {
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
    else
    total += 11 + aces - 1;
    }

    

   return total; //user.reduce((a, b) => user.value + user.value, 0)
}

const renderTotal = () =>{
    playerTotal.innerText = getTotal(playerHand) > 21 ? "bust" : getTotal(playerHand);
}


drawButton.addEventListener("click",(function(){
drawCard(playerHand, 1);
}));