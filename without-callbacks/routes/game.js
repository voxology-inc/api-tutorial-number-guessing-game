var express = require('express');
var router = express.Router();

var host_url = "YOUR HOST URL";

router.get('/', function(req, res, next) {
    res.json(
        {
            "actions": [
                {
                    "type": "SAY",
                    "params": {
                        "text": "Welcome to Shout points number guessing game. When guessing, please follow each guess with a pound. I am thinking of a number between one and one hundred."
                    }
                },
                {
                    "type": "SESSIONDATA",
                    "session_data": {
                        "number": Math.ceil(Math.random() * 100)
                    }
                },
                {
                    "type": "LABEL",
                    "name": "guess_again"
                },
                {
                    "type": "COLLECT",
                    "actions": [{
                        "type": "SAY",
                        "params": {
                            "text": "Enter your guess."
                        }
                    }],
                    "params": {
                        "finish_on_key": "pound",
                        "num_digits": 3,
                        "timeout": 5000
                    }
                },
                {
                    "type": "IF",
                    "condition": "$keyPresses == $sessionData.number",
                    "then": [{
                        "type": "PLAY",
                        "params": {
                            "url": "https://s3-us-west-2.amazonaws.com/com.voxology.demo/number-guessing-game/kazoo-fanfare.mp3"
                        }

                    },{
                        "type": "SAY",
                        "params": {
                            "text": "Congratulations! You guessed the correct number! We hope you enjoyed this game. Call again at anytime to play again!"
                        }
                    }, {
                        "type": "HANGUP"
                    }]
                },
                {
                    "type": "IF",
                    "condition": "$keyPresses < $sessionData.number",
                    "then": [{
                        "type": "SAY",
                        "params": {
                            "text": "Your guess, ${keyPresses}, was too low."
                        }
                    }],
                    "orElse": [{
                        "type": "SAY",
                        "params": {
                            "text": "Your guess, ${keyPresses}, was too high."
                        }
                    }]
                },
                {
                    "type": "GOTO",
                    "params": {
                        "label": "guess_again"
                    }
                }
            ]
        });
});

module.exports = router;

