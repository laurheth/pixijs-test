// Demonstration of combining text and images
import * as PIXI from 'pixi.js';

// This is the function to combine text + sprites
// It accepts an array consisting of strings and sprites, then assembled them together
// All needs a font size, and a maxWidth (to help with word-wrapping)
// Returns a container with the combined items inside
function combineStringsSprites(array : Array<PIXI.Sprite | string>, fontSize: number, maxWidth: number) {
    const container = new PIXI.Container();
    let xPosition=0;
    let yPosition=0;
    array.forEach(item => {
        // Are we adding a sprite or text?
        let toAdd : PIXI.Sprite | PIXI.Text;

        if (item instanceof PIXI.Sprite) {
            // Scale to match the text
            const scale = fontSize / item.height;
            item.scale.x = scale;
            item.scale.y = scale;

            toAdd = item;
        }
        else {
            // Generate the text object
            toAdd = new PIXI.Text(item,{fontSize: fontSize});
        }
        // Add to the container
        container.addChild(toAdd);
            
        // Word-wrap if needed
        if (xPosition + toAdd.width > maxWidth) {
            yPosition += fontSize*1.2;
            xPosition = 0;
        }

        // Set position
        toAdd.x = xPosition;
        toAdd.y = yPosition;
        // Increase width for the next item
        xPosition += toAdd.width;
    });

    // Return the container with the combined items inside
    return container;
}

const textImageScene = {
    scene: <PIXI.Container> new PIXI.Container(),

    // 120 frames === 2 seconds (assumes 60 fps)
    interval: 120,
    frames: 0,

    textShown: <PIXI.Container | null> null,

    loader: <PIXI.Loader | null> null,

    width: 0,

    // Setup function
    setup: function(loader: PIXI.Loader, width: number) {
        this.loader = loader;
        this.width = width;
        return this.scene;
    },

    // Each animation step
    play: function(delta: number) {
        this.frames += delta;
        if (this.frames >= this.interval) {
            this.frames -= this.interval;
            this.newText();
        }
    },

    // Update text
    newText: function() {
        if (this.loader) {
            if (this.textShown) {
                this.scene.removeChild(this.textShown);
            }
            // Generate the array of text and sprites
            const stringSpriteArray: Array<PIXI.Sprite | string> = [];
            for (let i=0;i<3;i++) {
                if (Math.random()>0.5) {
                    stringSpriteArray.push(
                        new PIXI.Sprite(
                            this.loader.resources["assets/smileEmoticon.png"].texture
                        )
                    )
                }
                else {
                    stringSpriteArray.push("text");
                }
            }
    
            // Choose a font size
            const fontSize = Math.floor(97 * Math.random() + 8);
    
            // Generate and display
            this.textShown = combineStringsSprites(stringSpriteArray,fontSize,this.width);
            this.scene.addChild(this.textShown);
        }
    }
};

export default textImageScene;