Welcome to Voxology's CallFlows Tutorial Part 1!
================================================
This tutorial's project architecture is based off of the QuickStart
project. To familiarize yourself with how the project is setup, built,
and deployed, please review Voxology's CallFlows Quickstart.

In this part of the tutorial, you will learn to set up the basic
question of whether or not a person will be participating in your
telephony number guessing game.

Index:

1. Creating the route
2. Prompting the caller's participation
3. Addressing the caller's response

### 1. Creating the route

1. In your project, under the **routes** directory, create a new file called *game.js*.
2. Copy the code from *index.js* and paste it into *game.js*
3. In your project's root directory, open *application.js*
4. Under line 6, which reads:

    ```javascript
    var routes = require('./routes/index');
    ```

    Add the code:

    ```javascript
    var game = require('./routes/game');
    ```

5. Under line 16, which reads:

    ```javascript
    app.use('/', routes);
    ```

    Add the code:

    ```javascript
    app.use('/game', game);
    ```

6. This effectively adds the route of `/game` to your application


### 2. Prompting the caller's participation

1. Under the **routes** directory, open the *game.js* file
2. Add a variable called `host_url` under the variable declarations for
   `express` and `router`. We will use this variable as the base url for
   all of our callbacks/redirects.
3. Initialize `host_url` to the base url for your hosted application.
4. In the body of your `router.get('/', ...`, delete the `res.json({...})`
   that is currently there and replace it with:

    ```javascript
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
    ```

Let's break this response down.
- The `actions` attribute consists of an array that contains:
    1. **COLLECT**: the action that collects the user's response using its own set of actions to
                    tell the user what their options are by using the **SAY** action type.
    2. **REDIRECT**: the action that tells our system where to put the response that the user has given. Note that it
                    currently says to **POST** the details to an endpoint at `/game/participation`. This endpoint does not
                    currently exist and will be created in the next step.
- The `name` and `comments` attributes are just helpful for description

### 3. Addressing the caller's response

1. Underneath your `router.get('/', ...`, add the following endpoint:

    ```javascript
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
    ```

Let's break this endpoint down:
- First, we create a variable called `keypress` to store the caller's response to your prompt
- Next, we compare that variable to its appropriate response to find out what the caller would like to do
- Lastly, we respond accordingly
    1. If the user chose to participate (pressed "1"), we play them a message that the tutorial is not
       quite ready yet and to come back later and then end the call.
    2. If the user chose not to participate (pressed "2"), we play them a message telling them to come
       back when they would like to try to the tutorial and then end the call.
    3. If the user failed to reply or replied incorrectly, we tell them that they had an incorrect
       response to the prompt and prompt them again.

Congratulations! You should now have a system that asks your caller whether or not they would like to
participate in your game. In the next part of this tutorial we will cover how to start and manage your
number guessing game.

Please compare your code to the code provided to make sure that they are identical.