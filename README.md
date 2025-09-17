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
