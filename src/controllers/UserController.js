const User = require('../models/User');
const {validationResult, matchedData} = require('express-validator');
const bcrypt = require('bcrypt');

module.exports = {
    getInfo: async (req, res) => {
        let token = req.query.token;

        const user = await User.aggregate([
            {
                $match: {token}
            },
            {
                $unwind: {
                    path: '$modules',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'modules',
                    localField: 'modules',
                    foreignField: '_id',
                    as: 'modules'
                }
            },
            {
                $unwind: {
                    path: '$modules',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    "name": {$first: '$name'},
                    "email": {$first: '$email'},
                    "token": {$first: '$token'},
                    "modules": {
                        $push: '$modules'
                    }
                }
            }
        ]);
        return res.json(user[0]);
    },
    setInfo: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({error: errors.mapped()});
            return;
        }

        const data = matchedData(req);

        let updates = {};
        if (data.name) {
            updates.name = data.name;
        }

        if (data.email) {
            const emailCheck = await User.findOne({email: data.email});
            if (emailCheck) {
                 res.json({error: "Existing email!"});
                 return;
            }
            updates.email = data.email;
        }
        if (data.password) {
            updates.passwordHash = await bcrypt.hash(data.password, 10);
        }

        await User.findOneAndUpdate({token: data.token}, {$set: updates});
        res.json("Success!");
    }
}