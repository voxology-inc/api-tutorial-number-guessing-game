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
                        "url": host_url + "/game/participation",
                        "method": "POST"
                    }
                }
            ]

        });
});

router.post('/participation', function(req, res){

    var keypress = req.body.key_presses[0].digits; //Create a variable to store the caller's response

    if(keypress === '1'){  //The caller wants to continue with the tutorial

        res.json(
            {
                "name"      : 'invite_accept',
                "comments"  : 'Plays the user a goodbye message and then hangs up',
                "actions"   : [
                    {
                        "type": "SAY",
                        "params": {
                            "text": "You have decided to participate in the tutorial. Sadly, it is not finished yet. Check back in a little bit.",
                            "loop": 1
                        }
                    },
                    {
                        "type": "HANGUP"
                    }
                ]
            });

    }
    else if(keypress === '2'){ //The caller wants to leave with the tutorial

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
    else{ //The caller did not properly respond to the prompt

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
                            "url": host_url + "/game/participation",
                            "method": "POST"
                        }
                    }
                ]
            }
        );
    }
});

module.exports = router;

