const dh = require("./discordHelper.js");
const discord = require("discord.js")
const request = require("request");
const HangMan = require("./HangMan.js");
function init(client) {
    const HangManAscii = [
` +---+
  |   |
      |
      |
      |
      |
=========`, `
  +---+
  |   |
  O   |
      |
      |
      |
=========`, `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 '|   |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 '|'  |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 '|'  |
 }    |
      |
=========`, 
`
  +---+
  |   |
  O   |
 '|'  |
 } {  |
      |
=========`];
    const dictionary = ["acres", "adult", "advice", "arrangement", "attempt", "August", "Autumn", "border", "breeze", "brick", "calm", "canal", "Casey", "cast", "chose", "claws", "coach", "constantly", "contrast", "cookies", "customs", "damage", "Danny", "deeply", "depth", "discussion", "doll", "donkey", "Egypt", "Ellen", "essential", "exchange", "exist", "explanation", "facing", "film", "finest", "fireplace", "floating", "folks", "fort", "garage", "grabbed", "grandmother", "habit", "happily", "Harry", "heading", "hunter", "Illinois", "image", "independent", "instant", "January", "kids", "label", "Lee", "lungs", "manufacturing", "Martin", "mathematics", "melted", "memory", "mill", "mission", "monkey", "Mount", "mysterious", "neighborhood", "Norway", "nuts", "occasionally", "official", "ourselves", "palace", "Pennsylvania", "Philadelphia", "plates", "poetry", "policeman", "positive", "possibly", "practical", "pride", "promised", "recall", "relationship", "remarkable", "require", "rhyme", "rocky", "rubbed", "rush", "sale", "satellites", "satisfied", "scared", "selection", "shake", "shaking"];
    let ChoosenWord = null;
    let health = 7;
    let guessedChar = [];
    let currentWord = [];
    let GameStatus = 0;
	let currentmsg = null;
	setWord = () =>{
        ChoosenWord = null;
        health = 7;
        guessedChar = [];
        currentWord = [];
        GameStatus = 0;

		ChoosenWord = dictionary[getRandomNumberInRange(0,dictionary.length-1)].split('');
		currentWord = "-".repeat(ChoosenWord.length).split('');
	}
	guess=(char)=>{
        if(ChoosenWord){
            if(guessedChar.indexOf(char) === -1){
                if(ChoosenWord.indexOf(char) > -1){
                    let isCharInWord = false;
                    let WordMatch = true
                    ChoosenWord.forEach((item,i) => {
                        if(item === char){
                            currentWord[i] = char;
                            isCharInWord = true;
                        }
                    });
                    ChoosenWord.forEach((item,i) => {
                        if(item != currentWord[i]){
                            WordMatch = false;
                        }
                    });
                    !isCharInWord ? health-- : null;
                    WordMatch ? GameStatus = 1 : null;
                }else{
                    health--;
                }
                guessedChar.push(char);
            }else{
                health--;
            }
            health < 0 ? GameStatus = -1 : null;
            ChoosenWord.length == 0 ? GameStatus = 1 : null; 
        }
	}
	getRandomNumberInRange = (min,max) =>{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	this.HangManStart = new dh.Command("HangManStart",(msg)=>{
        setWord();
        currentmsg ? currentmsg.delete() : null;
        currentmsg = msg;
        msg.channel.send(`\`${HangManAscii[HangManAscii.length - health]}\`\n\`${currentWord.join(" ")}\`\n\`Guessed characters : ${guessedChar}\``).then(msg => currentmsg = msg)
	},"HangManStart","Starts Hangman game Usage: !HangManStart");
	this.HangManGuess = new dh.Command("Guess",(msg)=>{
        if(msg.splitContent){
            if(msg.splitContent[0].length === 1){
                guess(msg.splitContent[0]);
                currentmsg ? currentmsg.delete() : null;
                currentmsg = msg;
                msg.channel.send(`\`${HangManAscii[HangManAscii.length - health - 1]}\`\n\`${currentWord.join(" ")}\`\n\`Guessed characters : ${guessedChar}\``).then(msg => currentmsg = msg);
                GameStatus === 1 ? msg.channel.send(`You won the word is \`${ChoosenWord.join(" ")}\``) :
                GameStatus === -1 ? msg.channel.send(`You lost the word was \`${ChoosenWord.join(" ")}\``) : null;
            }
        }
	},"Guess","Guess a character for Hangman game! Usage: !Guess <character>");
	//Return
	return this;
}

module.exports = init;