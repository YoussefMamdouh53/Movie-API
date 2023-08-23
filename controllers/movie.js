const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456789',
        database: 'movies_db'
    }
});

const joi = require("joi");

const select = (req, res) => {
    knex("movies").select([
        "id","name","author","description"
    ]).where({
        is_deleted: "0"
    }).then(movies => {
        res.status(200).json(movies);
    }).catch(err => console.error(err));
};

const create = (req, res) => {
    const { name , author, description} = req.body;
    const schema = joi.object({
        name : joi.string().min(4).max(50).required(),
        author: joi.string().min(4).max(50).required(),
        description: joi.string().min(10).required()
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
        return res.status(400).json("Invalid data provided!");
    }
    else {
        // Check for existing data in our database...
        knex("movies").select().where({
            name: name,
            is_deleted: "0"
        }).then(movies => {
            if (movies.length > 0) {
                // data found...
                return res.status(400).json("existing data was found!");
            }
            else {
                // Inserting data...
                knex("movies").insert({
                    name: name,
                    description: description,
                    author: author,
                    is_deleted: "0"
                }).then(()=>{
                    return res.status(200).json("movie added successfully!");
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    }
   
};

const update = (req, res) => {
    const id = req.params.id;
    const { name , author, description} = req.body;
    const schema = joi.object({
        id: joi.number().required(),
        name : joi.string().min(4).max(50).required(),
        author: joi.string().min(4).max(50).required(),
        description: joi.string().min(10).required()
    });

    const validate = schema.validate({
        id:id,
        name: name,
        description: description,
        author: author,
    });
    if (validate.error) {
        return res.status(400).json("Invalid data provided!");
    }
    else {
        // Check for existing data in our database...
        knex("movies").select().where({
            id: id,
            is_deleted: "0"
        }).then(movies => {
            if (movies.length == 0) {
                // id not found
                return res.status(400).json("data not found!");
            }
            else {
                // updating data...
                knex("movies").update({
                    name: name,
                    description: description,
                    author: author
                }).where({
                    id : id
                }).then(()=>{
                    return res.status(200).json("movie updated successfully!");
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    }

};

const remove = (req, res) => {
    const id = req.params.id;
    const schema = joi.object({
        id: joi.number().required()
    });
    const validate = schema.validate({
        id: id,
    });
    if (validate.error) {
        return res.status(400).json("Invalid data provided!");
    }
    else {
        // Check for existing data in our database...
        knex("movies").select().where({
            id: id,
            is_deleted: "0"
        }).then(movies => {
            if (movies.length == 0) {
                // id not found
                return res.status(400).json("data not found!");
            }
            else {
                // deleting data...
                knex("movies").update({
                    is_deleted: "1"
                }).where({
                    id : id
                }).then(()=>{
                    return res.status(200).json("movie deleted successfully!");
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    }
};

const restore = (req, res) => {
    const id = req.params.id;
    const schema = joi.object({
        id: joi.number().required()
    });
    const validate = schema.validate({
        id: id,
    });
    if (validate.error) {
        return res.status(400).json("Invalid data provided!");
    }
    else {
        // Check for existing data in our database...
        knex("movies").select().where({
            id: id,
            is_deleted: "1"
        }).then(movies => {
            if (movies.length == 0) {
                // id not found
                return res.status(400).json("data not found!");
            }
            else {
                // restoring data...
                knex("movies").update({
                    is_deleted: "0"
                }).where({
                    id : id
                }).then(()=>{
                    return res.status(200).json("movie restored successfully!");
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    }
}

module.exports = { create, select, update, remove, restore };