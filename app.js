require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);
const { validateMovie, validateUser } = require("./validator.js");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

// Movies Public
const movieHandlers = require("./movieHandlers");
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

//Users Public
const userHandlers = require("./userHandlers.js");
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", hashPassword, validateUser, userHandlers.postUser);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken);
// Movies Private
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

//Users Private
app.put("/api/users/:id", hashPassword, validateUser, userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
