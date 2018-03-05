Welcome to Voxology's CallFlows Tutorial Part 2!
==================================================

This tutorial's project architecture is based off of the QuickStart
project. To familiarize yourself with how the project is setup, built,
and deployed, please review Voxology's CallFlows Quickstart.

This part of the tutorial is a continuation of the tutorial that we started
in Part 1. If you have not completed Part 1, do not continue with this step.

In this part of the tutorial we will run callers through a prompting loop until
they guess the correct number. Upon a correct guess, we will play the caller a
congratulatory message before ending the call.

Index:

1. Starting the game
2. Prompting for the caller's guess
3. Handling the caller's guess

### 1. Starting the game

1. Change the response for your caller when they choose to start playing the game from this:

    ```javascript
    res.json(
        {
            "name"      : 'invite_accept',
            "comments"  : 'Explains the rules of the game',
            "actions"   : [
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
                }
            ]

        });
    ```

    To this:
    ```javascript
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
    ```

The new response now explains how the game is played and tells the caller that the system has created a random number between 1 and 100 for the user to guess. If we look at the **SESSIONDATA** action, we can see that for this session we have created a `number` (the number the user is trying to guess) and a `numGuessses` (what we will use to count the number of guesses a user takes). Notice that the new response also has a **REDIRECT** to an endpoint we don't have in our application. We will be creating this endpoint in the next step and it will handle prompting for the caller's guess.

### 2. Prompting for the caller's guess

1. Underneath your endpoint `router.post('/participation', ...`, add the following endpoint:

    ```javascript
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
    ```

This endpoint's purpose, as described above, is to prompt the caller for a guess on what their number is. Notice that before we respond, we get the `session_data` that we passed along from our previous callback and increment the caller's number of guesses by 1. Then, in our response, we tell them to enter their guess and place a **COLLECT** action that will collect up to three digits. Finally, we want to pass the updated `session_data` along so that we don't lose track of what number our user is guessing. Again, notice that the response also has a **REDIRECT** to an endpoint we don't have in our application. We will be creating this endpoint in the next step and it will handle responding to the caller's guess.

### 3. Handling the caller's guess

1. Underneath your endpoint `router.post('/guess-prompt', ...`, add the following endpoint:
    ```javascript
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
    ```
This endpoint's purpose, as described above, is to handle responding to the caller's guess. Notice that we first store the caller's guess into a variable called `keypresses` and his session data into a variable called `session_data`. We then compare that guess to the random number that we have assigned to that caller, found in his `session_data`.
    - If the guess is correct, we use the **PLAY** action to play a short sound of victory and then congratulate the user.
    - If the guess was too high, we tell the user that their guess was too high and then prompt them to guess again, passing along the `session_data` as we do so.
    - If the guess was too low, we tell the user that their guess was too low and then prompt them to guess again, passing along the `session_data` as we do so.

Congratulations! You should now have a system that asks your caller whether or not they would like to participate in your game and leads them through an entire number guessing game before congratulating them! We hope you enjoyed this tutorial and can't wait to see what you make possible with the CallFlows platform.

Please compare your code to the code provided to make sure that they are identical.