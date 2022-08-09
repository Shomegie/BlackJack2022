let deck = []
let card;
    
let getCardValue = (card_id)=> {
    let value = card_id%13>10?10:card_id%13
    return value===0?10:value
} 

let getCardFace = (face)=> {
    if (face>39)
        return "clubs"
    else if (face>26)
        return "spades"
    else if (face>13)
        return "diamonds"
    else
        return "hearts"
}

export let shuffleDeck = () => {
    deck=[]
    for (let i=1; i<=52; i++){
        card = {id:i,value:getCardValue(i),face:getCardFace(i)}
        deck.push(card)
    }
    return deck;
}

// let draw = ()=> {
//     let length = deck.length
//     let draw_pick = Math.floor((Math.random()*length))
//     return  deck.splice(draw_pick,1)
// }


