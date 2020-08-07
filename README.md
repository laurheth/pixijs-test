# pixijs-test

Some tests combining PixiJS, TypeScript, and Webpack. This includes:
- A demo containing 144 sprites, stacked like a deck. Every second, the sprite on the top is moved to a second deck, with the full animation taking two seconds.
- A demonstration of a function combining text with a sprite. A random combination with a random font size is generated every two seconds.
- A simple fire animation, using ten sprites in a PixiJS particle container.

## Installation

You may need Node, TypeScript, TSLint, and http-server to be installed globally.

Clone the repository:

```git clone https://github.com/laurheth/pixijs-test.git <target directory>```

Move into the target directory and install all packages:

```
cd <target directory>
npm install
```

Build everything:

```npm run build```

Finally, move into the `dist` directory and start the server.

```
cd dist
http-server
```

The demonstration should now be running at http://localhost:8080/.
