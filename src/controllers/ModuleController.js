const Module = require('../models/Module');
const User = require('../models/User');
const {validationResult, matchedData} = require('express-validator');

module.exports = {
    getList: async (req, res) => {
        let data = await Module.find();

        return res.json(data);
    },
    getItem: async (req, res) => {
        let data = await Module.findById(req.query.id);

        return res.json(data);
    },
    createList: async (req, res) => {
        const newModule = new Module({
            name: req.body.name,
            url: req.body.url,
            desc: req.body.desc,
            imgPath: req.body.imgPath,
            price: req.body.price
        });

        let user = await User.findOne({token: req.body.token});
        const moduletoken = await newModule.save();
        user.modules.push(moduletoken._id);
        await user.save();

        return res.json("Success!");
    },
    createOffer: async (req, res) => {
        let moduletoken = await Module.findById(req.body.id);

        moduletoken.offer.push({
            user: req.user._id,
            price: req.body.price
        });

        await moduletoken.save();
        return res.json("Success!");
    },
    acceptOffer: async (req, res) => {
        let moduletoken = await Module.findById(req.body.id);

        let index = moduletoken.offer.findIndex(item => item._id === req.body.offerId);
        if (index < 0) {
            return res.json("Offer not found!");
        }

        moduletoken.offer[index].status = 'accept';
        await moduletoken.save();
        return res.json("Accept!");
    },
    buyNow: async (req, res) => {
        let user = await User.findOne({token: req.body.token});

        user.modules.push(req.body.id);

        await user.save();
        return res.json("Success!");
    }
}