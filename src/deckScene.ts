// The scene for the deck of cards
import * as PIXI from 'pixi.js';

class MovingCard {
    card: PIXI.Sprite;
    startPosition: Array<number>;
    endPosition: Array<number>;
    progress: number;
    duration: number;

    constructor(card: PIXI.Sprite, startPosition: Array<number>, endPosition: Array<number>) {
        this.card = card;
        this.card.zIndex = 150;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.progress= 0;
        // Assuming 60 FPS, 120 === 2 seconds
        this.duration = 120;
    }

    // Animiation step
    update(delta: number) {
        this.progress += delta;
        if (this.progress >= this.duration) {
            this.progress = this.duration;
        }

        const fraction = this.progress / this.duration;

        const newPosition: Array<number> = [
            fraction * this.endPosition[0] + (1-fraction) * this.startPosition[0],
            fraction * this.endPosition[1] + (1-fraction) * this.startPosition[1]
        ];

        this.card.x = newPosition[0];
        this.card.y = newPosition[1];
    }

    // Returns "true" if it has reached the destination
    isComplete() {
        return this.progress >= this.duration;
    }
}

const deckScene = {
    scene: <PIXI.Container> new PIXI.Container(),
    deck1: <Array<PIXI.Sprite>> [],
    deck2: <Array<PIXI.Sprite>> [],
    rootPositions: <Array<Array<number>>> [],

    movingCards: <Array<MovingCard>> [],

    // Assuming 60 FPS, this equates to a 1 second interval
    cardInterval: 60,
    frames: 0,

    // Setup function
    setup: function(loader: PIXI.Loader, width: number) {
        // Allow zIndex
        this.scene.sortableChildren=true;

        // Initial root positions
        this.rootPositions.push([5,144]);
        this.rootPositions.push([width - loader.resources["assets/testSprite.png"].texture.width - 5,144]);

        // Deck 1 initializes with all sprites in it, before transferring to the other deck
        for (let i=0;i<144;i++) {
            const newCard = new PIXI.Sprite(
                loader.resources["assets/testSprite.png"].texture
            );
            // Set initial zIndex
            newCard.zIndex = i+1;
            
            // Set initial position
            newCard.x=this.rootPositions[0][0];
            newCard.y=this.rootPositions[0][1]-i;
            
            // Add to the deck
            this.deck1.push(newCard);

            // Add to the scene
            this.scene.addChild(newCard);
        }


        return this.scene;
    },

    // Each animation step
    play: function(delta: number) {
        this.frames += delta;
        // At the appropriate interval
        if (this.frames > this.cardInterval) {
            this.frames -= this.cardInterval;
            const cardToMove = this.deck1.pop();
            if (cardToMove !== undefined) {
                // Remove top card from the deck
                
                // Initialize new moving card
                const newMovingCard = new MovingCard(
                    cardToMove,
                    [this.rootPositions[0][0], this.rootPositions[0][1]-this.deck1.length],
                    [this.rootPositions[1][0], this.rootPositions[1][1]-this.deck2.length-1],
                    );
                    
                this.deck2.push(cardToMove);

                // Complete cards will be popped off the end, so unshift new cards at the start
                // Use a "FILO" approach to make life a bit easier
                this.movingCards.unshift(newMovingCard);
            }
        }

        // Update all moving cards
        this.movingCards.forEach(card=>card.update(delta));

        // Check if cards are done, and if so, remove them from the list
        for (let i=this.movingCards.length-1; i>=0;i--) {
            if (this.movingCards[i].isComplete()) {
                // Because we're using a First In Last Out approach, complete cards should always be at the end
                // Start at end, and just pop them off as necessary
                const movingCard = this.movingCards.pop();
                if (movingCard) {
                    // Set the appropriate zIndex
                    movingCard.card.zIndex = this.deck2.length;
                }
            }
        }
    }
}

export default deckScene;