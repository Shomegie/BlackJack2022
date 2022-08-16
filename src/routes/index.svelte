<script> 
import {flip} from 'svelte/animate'
import {draw, fly, fade} from 'svelte/transition'
import {cubicInOut,cubicIn, sineIn,backOut} from 'svelte/easing'

import {shuffleDeck} from '../blackjack/deck.js'

let deck = shuffleDeck()

let dealer = false
let player = true
let card_index = 0
let dealer_history =[]
let player_history =[]
let player_aceCount = 0
let dealer_aceCount = 0
let game_running = false
let hit_stay_state = false
let player_game_eval_color = ""
let player_game_eval_message = ""
let player_game_eval = false
let end_game = false
let start_reset = true



const reset_game = ()=>{
    card_index = 0
    dealer_history =[]
    player_history =[]
    player_aceCount = 0
    dealer_aceCount = 0
    game_running = false
    player_game_eval_color = ""
    player_game_eval_message = ""
    player_game_eval = false
    end_game = false
    start_reset = true
    render_card()
}


// game eval 
$: if (aceHandler(player_total,player_aceCount) > 21){
    setTimeout(()=>{
        end_game = true
        hit_stay_state = false
        player_game_eval_color ="text-red-500"
        player_game_eval_message = "Round loss, bust ..."
        player_game_eval = true
    },500)

    // reveal blinder
} else if(aceHandler(dealer_total,dealer_aceCount) == 21 && end_game ){
    //hit_stay_state = false
    //dealerHitAction()
    player_game_eval_color ="text-red-500"
    player_game_eval_message = "Round loss, dealer has blackjack"
    player_game_eval = true

} else if(aceHandler(player_total,player_aceCount) == 21 && end_game){
    player_game_eval_color ="text-yellow-300"
    player_game_eval_message = "Blackjack!!!"
    player_game_eval = true

} else if(aceHandler(dealer_total,dealer_aceCount) > 21 && end_game ){
    player_game_eval_color ="text-lime-300"
    player_game_eval_message = "Round win, dealer bust"
    player_game_eval = true
} else if((aceHandler(dealer_total,dealer_aceCount) == aceHandler(player_total,player_aceCount)) && end_game) {
    player_game_eval_color ="text-amber-600"
    player_game_eval_message = "Stalemate, payout even ..."
    player_game_eval = true
} else if((aceHandler(dealer_total,dealer_aceCount) > aceHandler(player_total,player_aceCount)) && end_game) {
    player_game_eval_color ="text-red-500"
    player_game_eval_message = `Round loss, dealer has ${aceHandler(dealer_total,dealer_aceCount)}`
    player_game_eval = true
}  else if((aceHandler(dealer_total,dealer_aceCount) < aceHandler(player_total,player_aceCount)) && end_game) {
    player_game_eval_color ="text-lime-300"
    player_game_eval_message = `Round win, dealer has ${aceHandler(dealer_total,dealer_aceCount)}`
    player_game_eval = true
} 






const startGame = () =>{
    if (start_reset){

        deck = shuffleDeck()
        start_reset = false

        setTimeout(()=>{
            drawCard(player,"dealt")
            render_card();
            setTimeout(()=>{
                drawCard(dealer,"dealt",true)
                render_card();
                setTimeout(()=>{
                    drawCard(player,"dealt")
                    render_card()
                    setTimeout(()=>{
                        drawCard(dealer,"dealt")
                        render_card()
                        game_running = true
                        hit_stay_state = true
                    },400)
                },400)
            },400)
        },100)
    }


}

$: aceHandler = (final_total, aceCount) =>{
    if (aceCount >= 1){
        final_total += 10

        if(final_total > 21)
            final_total -= 10
    }
    return final_total
}



const hitAction = () =>{
    drawCard(player,"hit",false,()=>{
        aceHandler(dealer_total,dealer_aceCount)
        render_card()
    })
}

const dealerHitAction = ()=>{
    hit_stay_state = false
    let draw_interval = setInterval(function (){
        if (aceHandler(dealer_total,dealer_aceCount ) < 17) {
        drawCard(dealer,"hit", false , ()=>{
            console.log(aceHandler(dealer_total,dealer_aceCount))
        })
        render_card()
        }else{
            end_game = true
            clearInterval(draw_interval)
        }
    }, 500);
}




$:player_total = player_history.reduce((sum,index)=>{
        return sum+= index.card[0].cardvalue
    },0)

$:dealer_total = dealer_history.reduce((sum,index)=>{
    return sum+= index.card[0].cardvalue
    },0)


let drawCard = (user,action,facedown=false,callback) => {
    card_index+=1
    let card = deck.splice(Math.floor(Math.random()*(deck.length)),1)

    if (user) {
        player_history.push({card: card, action: action, facedown:facedown, card_index:card_index})
        if (card[0].cardvalue ==1) 
            player_aceCount +=1
        if (typeof callback == "function")
        callback();
    }else{
        dealer_history.push({card: card, action: action, facedown:facedown, card_index:card_index})
        if (card[0].cardvalue ==1) 
            dealer_aceCount +=1
    }


}

let render_card = (callback)=>{
    player_history = player_history
    dealer_history = dealer_history

    if (typeof callback == "function")
        callback();


}



$: preloadImageUrls = [...Array(52).keys()].map((key) => `/cards/${key+1}.svg`);


</script>

<svelte:head>
    {#each preloadImageUrls as image}
      <link rel="preload" as="image" href={image} />
    {/each}
</svelte:head>

<div class=" board h-screen w-full relative">
    <!-- board: full screen -->

    <div class="background flex h-2/3 pt-32 justify-center items-center">
        <img src="Logo.svg" alt="">
    </div>
        <!-- Foreground: start -->
        <div class="foreground h-full absolute top-0 w-full bg-blue-400 bg-opacity-0 z-20 flex flex-col">
            <div class="dealer w-full h-2/5 border-0 border-yellow-600">
                <div class=" w-full h-full flex flex-col">
                    <div class="h-2/5"></div>
                    <div class="h-3/5 relative">
                        {#if game_running }
                            <div transition:fade class="bg-black absolute bottom-7 xl:bottom-10 left-0 right-0 m-auto w-fit bg-opacity-10 text-opacity-90 text-teal-700 rounded-full text-xs py-1 px-4">{aceHandler(dealer_total,dealer_aceCount)}</div>
                        {/if}
                        <div class="absolute w-fit h-full left-0 right-0 m-auto flex mt-6 transition">
                            {#if dealer_history.length > 0}
                                {#each dealer_history as image,i (i)}
                                    <img in:fly={{ x: 100, y:25, duration: 500 }}
                                    out:fly={{ x: 100, duration: 400 }} src={`cards/${image.card[0].id}.svg`} class={`h-28 cursor-pointer ${i==0?"":"-ml-14 mt-1"}`} alt={i}> 
                                {/each}
                            {:else}
                                <p></p>
                            {/if}
<!-- 
                            <img class="h-28 " src={`cards/card_back.svg`} alt=""> 
                            <img class="h-28 mt-1 -ml-14" src={`/cards/12.svg`} alt="">  -->
                        </div>

                    </div>

                </div>
            </div>
            <div class="details w-full h-1/5 border-0 border-lime-600">
                <div class="w-full h-full flex flex-col-reverse mt-3">
                    {#if end_game}
                        <div transition:fade class={`h-1/3 w-fit mx-auto text-white text-opacity-70 text-sm cursor-pointer flex p-2`} on:click={reset_game}>New Game <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-0.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg></div>
                    {/if}
                </div>
            </div>
            <div class="player w-full h-2/5 border-0 border-rose-600 p-2">
                <div class="player_cards h-3/4 w-full flex items-center mx-auto relative ">
                    <!-- {#if game_running}
                    <div transition:fade class="bg-black absolute top-0 left-0 right-0 w-fit m-auto -mt-8 bg-opacity-10 text-opacity-70 text-teal-600 rounded-full text-xs py-1 px-4">Hand:{player_total}</div>
                    {/if} -->
                    <div class="absolute left-0 right-0 m-auto mt-6 h-full w-fit drop flex transition-all">
                        {#if player_history.length > 0 }
                            {#each player_history as image,i (i)}
                                <!-- <img in:fly={{x:50,duration:1000}} animate:flip class={`h-2/3 ${i==0?"":"-ml-20"}`} src={`${image}.svg`} alt="">  -->
                                <img in:fly={{x:50, y:-50,duration:700}} class={`xl:h-44 h-40 cursor-pointer ${i==0?"":"-ml-24"} ${i==0?"-mt-2":""} ${i==3?"":""} ${i==5?"mt-2":""}`} src={`cards/${image.card[0].id}.svg`} alt={image.card[0].cardface}>
                            {/each}
                        {:else}
                            <p></p>
                        {/if}
                    </div>
                    {#if game_running}
                        <div transition:fade class="bg-black absolute top-52 left-0 right-0 w-fit m-auto -mt-7 xl:-mt-2 bg-opacity-10 text-opacity-70 text-teal-600 rounded-full text-sm py-0 px-4 flex flex-col">
                            <div class="w-fit mx-auto">Hand:{aceHandler(player_total,player_aceCount)}</div>
                            {#if player_game_eval}
                                <div class={`${player_game_eval_color} w-fit mx-auto text-opacity-60`}>{player_game_eval_message}</div>
                            {/if}
                        </div>
                    {/if}
                </div>
                {#if hit_stay_state}
                    <div transition:fade class="hit_stay w-fit mx-auto flex  text-xl divide-teal-900 divide-x divide-opacity-20 pb-1 font-light text-opacity-60  text-teal-600">
                        <button class="px-5 py-1 hover:cursor-pointer group -mt-0.5 group"><div class=" text-opacity-50 border-opacity-50 border-b pb-0 transition duration-200 group-hover:border-teal-500  group-hover:border-opacity-80 group-hover:text-teal-500  group-hover:text-opacity-80 border-teal-600 " on:click={dealerHitAction}>Stay</div></button>
                        <button  class="px-6 py-1 tracking-wider cursor-pointer transition hover:text-teal-500 hover:text-opacity-90 duration-200 flex" on:click={hitAction}>Hit<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg></button>
                    </div>
                {/if}

            </div>

        </div>
        <!-- Foreground: end -->

    <div class="controls text-indigo-200 absolute bottom-0 z-30 w-full p-4 flex justify-center mb-8">
        <div class="flex flex-col">
            {#if start_reset}
                <div transition:fade class="play_button cursor-pointer text-teal-700 p-2 px-4 flex justify-center" on:click={startGame}>Start</div>
            {/if}
        </div>
    </div>
    <!-- board: end -->
</div>

<style>
    .board{
        background-image: linear-gradient(to right top, #0a1517, #0d1419, #111219, #151017, #180f13);
    }
</style>