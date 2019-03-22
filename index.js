// implement your API here

//Step 1: Run `yarn` to bring in all packages in node modules from package.json

//Step 2: Create index.js file for API execution at ROOT folder of app, next to package.json - this index.js will *become* our API

//Step 3: Run `yarn add express`

//Step 4: If we want to use anything in our app, we must bring it into our App and get a reference. Nodejs we do not use import, we use require - comes from common JS module system. Require that our express package inside of my node modules folder.

const express = require("express");

//Step 7: If we're going to be working on a DB, dont forget to import it

const db = require("./data/db.js");

//Step 5: Create an express application - give us an instance of a server powered by express

const server = express();

//Step 8://**ADD this to make POST and PUT work , piece of middleware
server.use(express.json());

//POST - creates a user using info sent in request body
server.post("/api/users", (req, res) => {
  const userInfo = req.body;
  console.log("User Info", userInfo);

  db.insert(userInfo)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Please provide name and bio for the user." });
    });
});

//GET - returns array of all user objects contained in DB
server.get("/", (req, res) => {
  res.send("Testing");
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

//GET by ID - returns the user object w/ specified id

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

//DELETE by ID -- removes the user with the specified id and returns the deleted user

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deletedUser => {
      if (deletedUser) {
        res.status(204).end();
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The user could not be removed" })
    );
});

//PUT -- updates the user w/ the specified id using data from request body. Returns the modified document, NOT the original

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userInfo = req.body;

  if (userInfo.name && userInfo.bio) {
    db.update(id, userInfo)
      .then(updatedUser => {
        if (updatedUser) {
          db.findById(id)
            .then(user => {
              res.status(200).json({ user });
            })
            .catch();
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  } else {
    res
      .status(400)
      .json({ error: "Please provide name and bio for the user." });
  }
});

//Step 6: Tell server to listen to connections. First arg = port #, second arg is callback function.

//This is a server and it will run, but it has no endpoints yet. Before we RUN the server, we should configure endpoints. This goes on the bottom.
server.listen(8000, () => console.log("API running on port 8000"));
