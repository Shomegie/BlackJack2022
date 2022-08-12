<script>
    import {shuffleDeck} from '../blackjack/deck.js'

    let deck = shuffleDeck()


    let dealer = false
    let player = true
    let card_index = 0
    let dealer_history =[]
    let player_history =[]

    let hitstay = false


    $:player_total = player_history.reduce((sum,index)=>{
        return sum+= index.card[0].cardvalue
    },0)

    $:dealer_total = dealer_history.reduce((sum,index)=>{
        return sum+= index.card[0].cardvalue
    },0)


    let drawCard = (user,action) => {
        card_index+=1
        let card = deck.splice(Math.floor(Math.random()*(deck.length)),1)

        if (user) {
            player_history.push({card: card, action: action, card_index:card_index})
        }else{
            dealer_history.push({card: card, action: action, card_index:card_index})
        }
    }

    let mainDisp = "test"

    let startGame = ()=>{
        deck = shuffleDeck()
        drawCard(player,"dealt")
        //drawCard(dealer,"dealt")

        drawCard(player,"dealt")
        drawCard(dealer,"dealt")

        player_history = player_history
        dealer_history = dealer_history

        //hit_stay_state()
    }

    let hit = () => {
        drawCard(player,"hit")
        game_eval_state()
    }

    let stay = () => {

    }

    let game_eval_state = () => {
        player_history = player_history
        dealer_history = dealer_history
    }
</script>


<div class="relative h-screen w-full">
    <div class="flex justify-center relative">
        <div class="absolute right-0 px-8 text-stone-400 flex flex-col text-xs">
            <div class="">Player: {player_total}</div>
            <div class="">Dealer: {dealer_total}</div>
        </div>
        {mainDisp}
    </div>
    <div class="buttons w-full flex justify-center absolute top-20 mb-8 p-8">
        <div class="flex flex-col">
            <button class="underline w-full" on:click={startGame} >Start Game</button>
            <div class="flex p-4 space-x-4 text-sm text-blue-300">
                <button on:click={hit}>Hit</button>
                <button on:click={stay}>Stay</button>
            </div>
        </div>

    </div>
    
</div>

