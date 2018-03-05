var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json(
      {
        "actions": [
          {
            "type"   : "SAY",
            "params" : {
              "text" : "Hello World."
            }
          }
        ]
      }
  );
});

module.exports = router;
