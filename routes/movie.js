const movieRouter = require("express").Router();
const movieController = require("../controllers/movie");

movieRouter.get("/", movieController.select);
movieRouter.post("/create", movieController.create);
movieRouter.put("/update/:id", movieController.update);
movieRouter.delete("/delete/:id", movieController.remove);
movieRouter.patch("/restore/:id", movieController.restore);

module.exports = movieRouter;
