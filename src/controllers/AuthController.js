const bcrypt = require('bcrypt');
const {validationResult, matchedData} = require('express-validator');
const User = require('../models/User');

module.exports = {
    signin: async (req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//checking if there is an error in the field or if it is empty through errors
            res.json({error: errors.mapped()});
            return;
        }
        const data = matchedData(req);//requesting the bank for validation
        const user = await User.findOne({email:data.email});//searching email

        if(!user){//validating email
            res.json({error: 'Wrong email and/or password!'});
            return;
        }
        //validating the password
        const match = await bcrypt.compare(data.password, user.passwordHash);
        if(!match){
            res.json({error: 'Wrong email and/or password!'});
            return;
        }    
        
        const payload = (Date.now()+ Math.random()).toString();//generating random number and transforming it into a string passing it to payload to transform it into a token
        const token =  await bcrypt.hash(payload, 10);//encrypt in the payload and storing the token

        user.token = token;
        await user.save();
        res.json({token, email: data.email});
    },
    signup: async(req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//if errors is not empty
            res.json({error: errors.mapped()});//show errors
            return;
        }//if there is no error
        const data = matchedData(req);//requesting the bank for validation
        const user = await User.findOne({//verify if email exists
            email: data.email
        });
        if (user) {
            res.json({
                error:{email:{msg:'email already exists'}}
            });
        }

        const passwordHash  = await bcrypt.hash(data.password, 10);//crypto in user password

        const payload = (Date.now()+ Math.random()).toString();//generating random number and transforming it into a string passing it to payload to transform it into a token
        const token =  await bcrypt.hash(payload, 10);//encrypt in the payload and storing the token

        const newUser = new User({//instantiating the model with the past values
            name:data.name,
            email: data.email,
            passwordHash,
            token
        });
        await newUser.save();//saving the passed values in the database
        res.json({token});//returning a token in json
    }
}