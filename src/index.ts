import * as PIXI from 'pixi.js';
import './deckScene.ts';
import deckScene from './deckScene';
import textImageScene from './textImageScene';
import fire from './fire';

// Initialize app
const app = new PIXI.Application({
    width: 100,
    height: 100,
    // antialias: false
});

// Make fullscreen
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// Set a background color and enable zIndex sorting for children
app.renderer.backgroundColor = 0x666666;
app.stage.sortableChildren=true;

// Initialize array of scenes
// 0 == card stack, 1 == text + sprite intermingling, 2 == fire
const scenes: PIXI.Container[] = [];

// Load sprites
const loader = new PIXI.Loader();
loader
    .add("assets/testSprite.png")
    .add("assets/smileEmoticon.png")
    .add("assets/fireParticle.png")
    .load(setup);

let fpsText: PIXI.Text;

// Setup function
function setup() {
    // Text to display FPS in the top left corner
    fpsText = new PIXI.Text("FPS : 0", {stroke: "#ffffff", fill:"#ffffff"});
    app.stage.addChild(fpsText);

    // Setup the deck scene
    scenes.push(deckScene.setup(loader,window.innerWidth));

    // Setup the textImage scene
    scenes.push(textImageScene.setup(loader,window.innerWidth));

    // Setup the fire scene
    scenes.push(fire.setup(loader,window.innerWidth, window.innerHeight));

    scenes.forEach(scene=>{
        app.stage.addChild(scene);
        scene.y = 40;
        scene.visible = false;
    });

    // Default to showing the deck-of-cards demo
    scenes[0].visible = true;

    // Add buttons here
    addChoiceButton(2,"Show Fire Demo", window.innerWidth/2, window.innerHeight - 50);
    addChoiceButton(1,"Show Image + Text Demo", window.innerWidth/2, window.innerHeight - 80);
    addChoiceButton(0,"Show Deck of Sprites Demo", window.innerWidth/2, window.innerHeight - 110);



    app.ticker.add(delta => gameLoop(delta));
}

// Add some text to click on
function addChoiceButton(sceneIndex: number, text: string, xPos: number, yPos: number) {
    const newText = new PIXI.Text(text,{fill:'#ffffff'});
    app.stage.addChild(newText);
    newText.x = xPos - newText.width / 2;
    newText.y = yPos;
    newText.interactive=true;

    const clickListener = ()=>{
        scenes.forEach(scene=>scene.visible=false);
        scenes[sceneIndex].visible=true;
    };

    // Handle click
    newText.addListener('click',clickListener);
    newText.addListener('touchstart',clickListener);

    // Mouse over / off
    newText.addListener('mouseover',()=>{
        newText.style = {fill:'#ffff00'};
    });
    newText.addListener('mouseout',()=>{
        newText.style = {fill:'#ffffff'};
    });
}

// Function to run for every timestep, of size "delta"
function gameLoop(delta:number) {
    // Display current frames per second
    fpsText.text = `FPS : ${app.ticker.FPS.toFixed(1)}`;

    // Update scenes
    if (scenes[0].visible) {
        deckScene.play(delta);
    }
    else if (scenes[1].visible) {
        textImageScene.play(delta);
    }
    else if (scenes[2].visible) {
        fire.play(delta);
    }
}

// Append app to the page
document.body.appendChild(app.view);