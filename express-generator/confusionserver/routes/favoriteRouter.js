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
        if(favorite!=null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }
        else {
            err = new Error("No favorites exist!!");
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndUpdate({"user":req.user._id})
    .then((favorite) => {
        if(favorite!=null){
            Favorites.findOneAndUpdate({"user":req.user._id},{$addToSet : {"dishes": {$each : req.body }}}, {new: true}, (err, favorite) => {
                if(err) throw err;
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
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user":req.user._id})
    .then((favorite) => {
        if(favorite!=null) {
            Favorites.findOneAndRemove({"user":req.user._id},(err) => {
            if(err) {
                    next(err);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/json')
                res.end("Successfully Deleted")
            })
        }
        else {
            err = new Error ("No favorites exist!")
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

favoriteRouter.route('/:dishID')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+req.params.dishID);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndUpdate({"user":req.user._id})
    .then((favorite) => {
        if(favorite!=null){
            Favorites.findOneAndUpdate({"user":req.user._id},{$addToSet : {"dishes": req.params.dishID }}, {new: true}, (err, favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
            })
        }
        else {
            Favorites.create({"user":req.user._id, "dishes":req.params.dishID})
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
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+req.params.dishID);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndRemove(
      { user: req.user._id },
      { dishes: req.params.dishId})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;