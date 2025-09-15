# Train-Your-Own-Prediction-Model

Since you can download all your messages from discord by requesting your data, I thought it would be fun to make some scripts to train a text prediction model based on my messages. This is a wip project, doesn't have much error logging, and could break if the files aren't set up properly. You need Node.js to run this.

# Usage

After recieving your messages from discord, they should be in this format:
```
index.json
/c34546745847
/c345357567882
/c2342341253467
```

Download the scripts into a new folder, and copy over this message folder into the project folder. Note that the messages need to be in their OWN sub-folder of the project folder. This sub-folder NEEDS to be named `Messages`. Now move the `index.json` file out of the sub-folder into the main folder, but leave the other channel folders (e.g `c2342341253467`) in the subfolder. Your file tree should look like this:

```
/Messages
index.json
generateModel.js
parse.js
random.js
tokenize.js
```

Now run these commands in this order, waiting for each to finish before moving on.

```
node parse

node generateModel
```

The `parse` script parses your message folders and pushes all the messages into one array, outputing `output.json`

The `generateModel` script might take around 10 seconds to run, and it will output `model.json`. This is the trained model, and now we just need to use it, with the next command:

```
node random <startingPhrase>
```

The `startingPhrase` argument is the input text for the model to start it's predictions upon. It will generate until it meets the end of a sentence, or if it can't find predictions for that phrase.

