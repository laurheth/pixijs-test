import * as PIXI from 'pixi.js';
import './deckScene.ts';
import deckScene from './deckScene';
import textImageScene from './textImageScene';

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
app.renderer.backgroundColor = 0x009900;
app.stage.sortableChildren=true;

// Initialize array of scenes
// 0 == card stack, 1 == text + sprite intermingling, 2 == fire
const scenes: PIXI.Container[] = [];

// Load sprites
const loader = new PIXI.Loader();
loader
    .add("assets/testSprite.png")
    .add("assets/smileEmoticon.png")
    .load(setup);

let fpsText: PIXI.Text;

// Setup function
function setup() {
    // Text to display FPS in the top left corner
    fpsText = new PIXI.Text("FPS : 0", {stroke: "#ffffff", fill:"#ffffff"});
    app.stage.addChild(fpsText);

    // Setup the deck scene
    scenes.push(deckScene.setup(loader,window.innerWidth));
    deckScene.scene.visible = false;

    // Setup the textImage scene
    scenes.push(textImageScene.setup(loader,window.innerWidth));

    app.stage.addChild(scenes[0]);
    app.stage.addChild(scenes[1]);
    scenes[0].y = 40;
    scenes[1].y = 40;

    app.ticker.add(delta => gameLoop(delta));
}

// Function to run for every timestep, of size "delta"
function gameLoop(delta:number) {
    // Display current frames per second
    fpsText.text = `FPS : ${app.ticker.FPS.toFixed(1)}`;

    // deckScene.play(delta);
    textImageScene.play(delta);

}

// Append app to the page
document.body.appendChild(app.view);