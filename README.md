# Train-Your-Own-Prediction-Model

This is a program to train your own text prediction model on your discord messages. 

# Prerequisites

Requires Node.js

Requires you to request your data from discord, can be found in `User Settings -> Data & Privacy -> Request Your Data`. It is recommended to only ask for messages, as that's all this project needs to function.

# Usage

After recieving your messages from discord, they should be in this format:
```
index.json
/c34546745847
/c345357567882
/c2342341253467
```
Run the following command to start the parsing and training process and answer the prompts to configure the paths to your `index.js` and messages folder.
```
node setup
```
After that, you can use your model just by running the following command:
```
node chat
```
This will open a chat session with the model.

Since this is a text prediction model it needs a phrase to start with. If it cannot predict anything from that input it will just output the input phrase.

# How to Use This In A Project

Okay, so you've trained your model and you want to use it's output another project. This is thankfully, quite easy with Node.js. 

Firstly, you need your `model.json` file (of course!). Then the only two files you need from this project is `tokenize.js` and `model.js`. `model.js` uses `tokenize.js`, hence why we need it as well.

Finally, import the following functions from `model.js`:

```js
const { generateTokens, stringifyOutput } = require('./model');
```
These functions require some parms:
```js
generateTokens(context, startingPhrase)
```
- `context`: Number of tokens to look back upon in order to predict the next word. 

- `startingPhrase`: Phrase to build upon.
```js
stringifyOutput(array)
```
- `array`: Array of tokens to be formatted as a string (use `generateTokens()` as input).

`generateTokens()` returns an array of tokens, and `stringifyOutput` can be used to format this array of tokens to display. For example:
```js
stringifyOutput(generateTokens(3, "Hello there"))
```

