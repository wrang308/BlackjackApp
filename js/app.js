

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
    .catch((error) => {
        console.log(error)
    });
  
}

