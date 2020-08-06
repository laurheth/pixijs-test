import * as PIXI from 'pixi.js';

// Initialize app
const app = new PIXI.Application({
    width: 100,
    height: 100,
    // antialias: false
});

// Make fullscreen
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.backgroundColor = 0x009900;
app.stage.sortableChildren=true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// Load sprites
const loader = new PIXI.Loader();
loader
    .add("assets/testSprite.png")
    .add("assets/smileEmoticon.png")
    .load(setup);

const sprites = {} as any;
let fpsText: PIXI.Text;

// Setup function
function setup() {
    sprites.testSprite = new PIXI.Sprite(
        loader.resources["assets/testSprite.png"].texture
    );
    sprites.smileEmoticon = new PIXI.Sprite(
        loader.resources["assets/smileEmoticon.png"].texture
    );

    // Text to display FPS in the top left corner
    fpsText = new PIXI.Text("FPS : 0", {stroke: "#ffffff", fill:"#ffffff"});
    app.stage.addChild(fpsText);

    app.ticker.add(delta => gameLoop(delta));
}

// Function to run for every timestep, of size "delta"
function gameLoop(delta:number) {
    fpsText.text = `FPS : ${app.ticker.FPS.toFixed(1)}`;
}

// Append app to the page
document.body.appendChild(app.view);