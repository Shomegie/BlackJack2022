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
let game_running = false
let game_running2 = true

let start_reset = true

const ffanimate = () =>{
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

                        // todo: hit/sit function
                    },400)
                },400)
            },400)
        },100)
}

let startGame = ()=>{
        deck = shuffleDeck()
        drawCard(player,"dealt")
        //drawCard(dealer,"dealt")
        render_card()

        drawCard(player,"dealt")
        drawCard(dealer,"dealt")
        render_card()
        //hit_stay_state()
        console.log(player_history)
}



let disp_1 = ""
let disp_2 = ""
let disp_3 = ""
let disp_4 = "test"




$:player_total = player_history.reduce((sum,index)=>{
        return sum+= index.card[0].cardvalue
    },0)

$:dealer_total = dealer_history.reduce((sum,index)=>{
    return sum+= index.card[0].cardvalue
    },0)


let drawCard = (user,action,facedown=false) => {
    card_index+=1
    let card = deck.splice(Math.floor(Math.random()*(deck.length)),1)

    if (user) {
        player_history.push({card: card, action: action, facedown:facedown, card_index:card_index})
    }else{
        dealer_history.push({card: card, action: action, facedown:facedown, card_index:card_index})
    }
}

let render_card = ()=>{
    player_history = player_history
    dealer_history = dealer_history
}



// let cards = ["JC","7D","4C","AH"]
let cards = ["JC","7D"]


let dummy = () =>{
    cards.push("JC")
    cards = cards
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
                            <div transition:fade class="bg-black absolute bottom-7 left-0 right-0 m-auto w-fit bg-opacity-10 text-opacity-60 text-teal-700 rounded-full text-xs py-1 px-4">{dealer_total}</div>
                        {/if}
                        <div class="absolute w-fit h-full left-0 right-0 m-auto flex mt-6 transition">
                            {#if dealer_history.length > 0}
                                {#each dealer_history as image,i (i)}
                                    <img in:fly={{ x: 100, y:25, duration: 500 }}
                                    out:fly={{ x: 100, duration: 400 }} src={`cards/${image.card[0].id}.svg`} class={`h-28 ${i==0?"":"-ml-14 mt-1"}`} alt={i}> 
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
            <div class="details w-full h-1/5 border-0 border-lime-600"></div>
            <div class="player w-full h-2/5 border-0 border-rose-600 p-2">
                <div class="player_cards h-3/4 w-full flex items-center mx-auto relative ">
                    {#if game_running}
                    <div transition:fade class="bg-black absolute top-0 left-0 right-0 w-fit m-auto -mt-8 bg-opacity-10 text-opacity-70 text-teal-600 rounded-full text-xs py-1 px-4">Hand:{player_total}</div>
                    {/if}
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
                </div>
            </div>
        </div>
        <!-- Foreground: end -->

    <div class="controls text-indigo-200 absolute bottom-0 z-30 w-full p-4 flex justify-center mb-8">
        <div class="flex flex-col">
            {#if start_reset}
                <div transition:fade class="play_button  cursor-pointer text-teal-700 p-2 px-4 flex justify-center" on:click={ffanimate}>Start</div>
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