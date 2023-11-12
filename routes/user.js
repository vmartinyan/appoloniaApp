const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.post('/', async (req, res) => {
    try{
        const {name, password} = req.body;
        if(name === 'admin' && password === 'admin'){
            return res.status(200).json('Welcome to the admin page')
        }

        if(!(name && password)){
            return res.status(200).json('Please enter a name and password')
        }

        const checkUser = await User.findOne({name, password});

        if(checkUser){
            return res.status(409).json({message: 'User already exist'})
        }

        const user = new User({name, password});

        await user.save();

        return res.status(201).json({
            message: 'User created sucessfully',
            user,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
});

router.get('/', async (req, res) => {
    try{
        const filter = {};
        const users = await User.find(filter);
        return res.status(200).json({
            users
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

module.exports = router;