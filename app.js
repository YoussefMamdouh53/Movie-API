const express = require("express");
const app = express();
const movieRouter = require("./routes/movie.js");

app.use(express.json());
app.use("/api/movies", movieRouter);

module.exports = app;