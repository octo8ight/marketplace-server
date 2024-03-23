const  {checkSchema} = require('express-validator')

module.exports = {
    editAction: checkSchema({//validator signup
        token: {
            notEmpty: true
        },
        name:{
            optional: true,
            trim: true, 
            notEmpty: true,
            isLength:{
                option:{
                    min: 2
                },
                errorMessage:'Name must have at least 2 characters'
            }
        },
        email:{
            optional: true,
            isEmail:true,
            normalizeEmail: true,
            errorMessage: 'E-mail invalid'
        },
        password: {
            optional: true,
            notEmpty: true,
            isLength:{
                min:3
            },
            errorMessage: 'Password needs at least 2 characters'
        }
    })
}