function tokenize(text) {

    let punctuation = [".", "-", "!", "?", ":", ","]
    let endingPunctuation = ['.', '!', '?']

    function isLetter(char) {
        return /^\p{L}$/u.test(char);
    }

    function isSpace(char) {
        return char === ' ';
    }

    function isCharacter(char) {
        return char !== ' ' && char !== null;
    }

    function isPunctuation(char) {
        return punctuation.includes(char);
    }

    let length = text.length;
    let token = '';
    let output = [];
    let inEmoji = false;

    for (let i = 0; i < length; i++) {

        let currentChar = text[i] ?? null;
        let nextChar = text[i + 1] ?? null;
        let nextNextChar = text[i + 2] ?? null;
        let sentenceEnd = false;


        let continueToken = true;

        if (currentChar === ':') { inEmoji = true }
        if (inEmoji && (isSpace(currentChar) || nextChar === null)) { inEmoji = false }

        let emojiEnd = inEmoji && nextChar === ':';


        if (nextChar === null || isSpace(nextChar)) { continueToken = false }
        if (isSpace(currentChar) && isSpace(nextChar) && isCharacter(nextNextChar)) { continueToken = false }
        if (isCharacter(currentChar) && !isPunctuation(currentChar) && isPunctuation(nextChar) && isPunctuation(nextNextChar)) { continueToken = false }
        if (isCharacter(currentChar) && !isPunctuation(currentChar) && isPunctuation(nextChar) && !isCharacter(nextNextChar) && !emojiEnd) { 
            continueToken = false; 
            if (endingPunctuation.includes(nextChar)) {
                sentenceEnd = true 
            }
        }

        token += currentChar;

        if (!continueToken) {
            output.push(token);
            token = sentenceEnd ? '<!end>' : '';
        }
    }
    return output;
}

module.exports = tokenize;