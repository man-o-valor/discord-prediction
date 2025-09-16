# Train-Your-Own-Prediction-Model

This is a program to train your own text prediction model on your discord messages. 

# Prerequisites

Requires Node.js

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
node main
```

After that, you can use your model just by running the following command:

```
node model <phrase>
```

Since this is a text prediction model it needs a phrase to start with. If it cannot predict anything from that input it will just output the input phrase.
