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
        path:'dishes',
        model:'Dish'
    })
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findById(req.user._id)
    .then((favorite) => {
        req.body.user = req.user._id;
        favorite.dishes.push(req.body);
        favorite.save()
        .then((favorite) => {
            Favorites.findById(req.user._id)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => {
        err = new Error("Error peforming POST method");
        err.status = 400;
        return next(err);
    })
})
module.exports = favoriteRouter;