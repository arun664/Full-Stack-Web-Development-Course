const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
const favoriteRouter = express.Router();
var authenticate = require('../authenticate');
favoriteRouter.use(bodyParser.json());
const cors = require('./cors');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({"user":req.user._id})
    .populate('user')
    .populate({
        'path':'dishes',
        'model':'Dish'
    })
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndUpdate({"user":req.user._id})
    .then((favorite) => {
        if(favorite!=null){
            Favorites.findOneAndUpdate({"user":req.user._id},{$addToSet : {"dishes": {$each : req.body }}}, {new: true}, (err, favorite) => {
                if(err) {
                    err = new Error("Dish already Exists in Favourites!!")
                    throw err;
                } 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
            })
        }
        else {
            Favorites.create({"user":req.user._id, "dishes":req.body})
            .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                }, (err) => next(err))
            }
    }, (err) => next(err))
    .catch((err) => {
        err = new Error("Error peforming POST method");
        err.status = 400;
        return next(err);
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyadmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({"user":req.user._id},(err) => {
        if(err) throw err;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json')
        res.end("Successfully Deleted")
    })
    .catch((err) => {
        err = new Error("Document doesn't exist!!");
        err.status = 404;
        return next(err);
    })
})
module.exports = favoriteRouter;