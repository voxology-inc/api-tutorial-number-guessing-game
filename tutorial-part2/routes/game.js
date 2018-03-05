var express = require('express');
var router = express.Router();

var host_url = "YOUR HOST URL";

router.get('/', function(req, res, next) {
    res.json(
        {
            "name"      : 'invitation',
            "comments"  : 'Asks caller whether or not they would like to play the game',
            "actions"   : [
                {
                    "type": "COLLECT",
                    "actions":[
                        {
                            "type": "SAY",
                            "params": {
                                "text": "Hello, welcome to a Call Flows tutorial. " +
                                "If you'd like to participate, please press 1. " +
                                "If you would not like to participate, please press 2. ",
                                "loop": 1
                            }
                        }
                    ],
                    "params": {
                        "num_digits": 1,
                        "timeout": 5000
                    }
                },
                {
                    "type": "REDIRECT",
                    "params": {
                        "url"       : host_url + "/game/participation",
                        "method"      : "POST"
                    }
                }
            ]

        });
});

router.post('/participation', function(req, res){

    var keypress = req.body.key_presses[0].digits;

    if(keypress === '1'){

        res.json(
            {
                "name"      : 'invite_accept',
                "comments"  : 'Explains the rules of the game',
                "actions"   : [
                    {
                        "type": "SAY",
                        "params": {
                            "text": "This is a simple number guessing game. When guessing, please follow each guess with a pound. I am thinking of a number between one and one hundred.",
                            "loop": 1
                        }
                    },
                    {
                        "type": "SESSIONDATA",
                        "session_data": {
                            "number": Math.ceil(Math.random() * 100),
                            "numGuesses": 0
                        }
                    },
                    {
                        "type": "REDIRECT",
                        "params": {
                            "url"       : host_url + "/game/guess-prompt",
                            "method"      : "POST"
                        }
                    }
                ]

            });

    }
    else if(keypress === '2'){

        res.json(
            {
                "name"      : 'invite_decline',
                "comments"  : 'Plays the user a goodbye message and then hangs up',
                "actions"   : [
                    {
                        "type": "SAY",
                        "params": {
                            "text": "Call back again at anytime to experience the tutorial. Goodbye.",
                            "loop": 1
                        }
                    },
                    {
                        "type": "HANGUP"
                    }
                ]
            }
        );
    }
    else{

        res.json(
            {
                "name"      : 'invite_improper',
                "comments"  : 'Prompts again in case of failed/incorrect response',
                "actions"   : [
                    {
                        "type": "COLLECT",
                        "actions":[
                            {
                                "type": "SAY",
                                "params": {
                                    "text": "We're sorry, but we didn't receive a proper response." +
                                    "Press 1 to participate or press 2 to decline.",
                                    "loop": 1
                                }
                            }
                        ],
                        "params": {
                            "num_digits": 1,
                            "timeout": 5000
                        }
                    },
                    {
                        "type": "REDIRECT",
                        "params": {
                            "url"       : host_url + "/game/participation",
                            "method"      : "POST"
                        }
                    }
                ]
            }
        );
    }
});

router.post('/guess-prompt', function(req, res){

    var session_data = req.body.session_data;
    session_data.numGuesses += 1;

    res.json(
        {
            "name": 'guess_prompt',
            "comments": 'Asks caller to guess',
            "actions": [
                {
                    "type": "COLLECT",
                    "actions":[
                        {
                            "type": "SAY",
                            "params": {
                                "text": "Enter your guess.",
                                "loop": 1
                            }
                        }
                    ],
                    "params": {
                        "finish_on_key": "pound",
                        "num_digits": 3
                    }
                },
                {
                    "type": "SESSIONDATA",
                    "session_data": session_data
                },
                {
                    "type": "REDIRECT",
                    "params": {
                        "url": host_url + "/game/guess",
                        "method": "POST"
                    }
                }
            ]
        });

});

router.post('/guess', function(req, res){

    var keypresses = req.body.key_presses[0].digits;
    var session_data = req.body.session_data;


    if(+keypresses === session_data.number){

        res.json(
            {
                "name": 'guess_correct',
                "comments": 'Congratulates the user on guessing the correct number before hanging up',
                "actions": [
                    {
                        "type": "PLAY",
                        "params": {
                            "url": "https://s3-us-west-2.amazonaws.com/com.voxology.demo/number-guessing-game/kazoo-fanfare.mp3"
                        }

                    },
                    {
                        "type": "SAY",
                        "params": {
                            "text": "Congratulations! You guessed the correct number! We hope you enjoyed this game. Call again at anytime to play again!",
                            "loop": 1
                        }
                    },
                    {
                        "type": "HANGUP"
                    }
                ]
            });

    }
    else if(+keypresses > session_data.number){

        res.json(
            {
                "name"      : 'guess_wrong',
                "comments"  : 'User guess too high',
                "actions"   : [
                    {
                        "type": "SAY",
                        "params": {
                            "text": "Your guess, " + keypresses + ", was too high.",
                            "loop": 1
                        }
                    },
                    {
                        "type": "SESSIONDATA",
                        "session_data": session_data
                    },
                    {
                        "type": "REDIRECT",
                        "params": {
                            "url"       : host_url + "/game/guess-prompt",
                            "method"      : "POST"
                        }
                    }
                ]
            });

    }
    else if(+keypresses < session_data.number){

        res.json(
            {
                "name"      : 'guess_wrong',
                "comments"  : 'User guess too low',
                "actions"   : [
                    {
                        "type": "SAY",
                        "params": {
                            "text": "Your guess, " + keypresses + ", was too low.",
                            "loop": 1
                        }
                    },
                    {
                        "type": "SESSIONDATA",
                        "session_data": session_data
                    },
                    {
                        "type": "REDIRECT",
                        "params": {
                            "url"       : host_url + "/game/guess-prompt",
                            "method"      : "POST"
                        }
                    }
                ]
            });
    }
});

module.exports = router;

