class AudioController{
    constructor(){
        this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
        this.bgMusic.volume = 0.5;    
        this.bgMusic.loop = true;
    }
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    flip(){
        this.flipSound.play();
    }

    match(){
        this.matchSound.play();
    }
    victory(){
        this.stopMusic();
        this.victorySound.play();
    }

    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch{
    constructor(totalTime,cards){
        this.cardArrays = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById("time-remaining");
        this.ticker = document.getElementById("flips");
        this.ac = new AudioController();
    }

    startGame(){
        
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(()=>{
            this.ac.startMusic();
            this.suffleCards(this.cardArrays);
            this.countDown = this.startCountDown();
            this.busy = false;
        },500)

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    hideCards(){
        this.cardArrays.forEach(card=>{
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }

    startCountDown(){
        return setInterval(()=>{
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0) this.gameOver();
        },1000)
    }

    gameOver(){
        clearInterval(this.countDown);
        this.ac.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

   victory(){
       clearInterval(this.countDown);
       this.ac.victory();
       document.getElementById('victory-text').classList.add('visible');
   }


    flipCard(card){
        // if(card === this.cardToCheck) return;
         if(this.canFlipCard(card)){
            this.ac.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');
        

        if(this.cardToCheck){
            this.checkToCardMatch(card);
        }else{
            this.cardToCheck = card;
        }
    }
    }

    checkToCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)) 
            this.cardMatch(card,this.cardToCheck);
        else
            this.cardMisMatch(card,this.cardToCheck);

            this.cardToCheck = null;
    }


    cardMatch(card1,card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.ac.match();

        if(this.matchedCards.length === this.cardArrays.length){
            this.victory();
        }
    }

    cardMisMatch(card1,card2){
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;

        }, 1000);
    }

    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    suffleCards(cardArrays){
        for(let i = cardArrays.length-1;i > 0 ;i--){
            let randIndex = Math.floor(Math.random()*(i+1));
            this.cardArrays[randIndex].style.order = i;
            this.cardArrays[i].style.order = randIndex;
        }
    }
    canFlipCard(card){
       
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

function ready(){
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100,cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click',()=>{
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click',()=>{
            game.flipCard(card); 
        });        
    });
}


if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoded',read());
}else{
    ready();
}


