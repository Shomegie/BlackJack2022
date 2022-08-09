<script>

    import {shuffleDeck} from '../blackjack/deck.js'

    let deck = shuffleDeck()


    let dealer = false
    let player = true
    let card_count = 0
    let dealer_history =[]
    let player_history =[]



    let drawCard = (actor,action) => {
        card_count+=1
        let card
        // player
        // if (actor) {
        //     player_history.push({
        //         card: card

        //     })

        // // dealer
        // }else{
        //     mainDisp = "Dealer draws card draws card"
        // }
    }

    let mainDisp = "test"

    let startGame = ()=>{

        deck = shuffleDeck()
        drawCard(player,"dealt")
        drawCard(dealer,"dealt")

        drawCard(player,"dealt")
        drawCard(dealer,"dealt")

        game_state_2()
    }

    let game_state_2 = () => {
        console.log("game state 2")
    }



</script>


<div class="relative h-screen w-full">
    <div class="flex justify-center">
        {mainDisp}
    </div>
    <div class="buttons w-full flex justify-center absolute bottom-0 mb-8 p-8">
        <button class="underline" on:click={startGame} >Start Game</button>
    </div>
    
</div>

