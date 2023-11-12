const express = require('express');
const router = express.Router();
const Department = require('../models/department')

router.get('/', async (req, res) => {
    try{
        const filter = req.body;
        const deps = await Department.find(filter);
        return res.status(200).json({
            deps
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
});


router.post('/', async (req, res) => {
    try{
        const {name} = req.body;
       
        const checkDep = await Department.findOne({name});

        if(checkDep){
            return res.status(409).json({message: 'Department already exist'})
        }

        const dep = new Department({name});

        await dep.save();

        return res.status(201).json({
            message: 'Department created sucessfully',
            dep,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
});

router.put('/', async (req, res) => {
    try{
        const obj = req.body;
        const filter = {_id: obj.id};

        const checkDep = await Department.findOne(filter);

        if(!checkDep){
            return res.status(400).json({message: 'Department doesen\'t find'});
        }

        const update = (({ _id, ...o }) => o)(obj);
       
        const dep = await Department.findOneAndUpdate(filter, update, {
            new: true
        });
        
        return res.status(200).json({
            message: 'Department updated sucessfully',
            dep,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
});

router.delete('/', async (req, res) => {
    try{
        const obj = req.body;
        const filter = {_id: obj.id};

        const checkDep = await Department.findOne(filter);

        if(!checkDep){
            return res.status(400).json({message: 'Department doesen\'t find'});
        }

        const dep = await Department.deleteOne(filter);
        
        return res.status(200).json({
            message: 'Department deleted sucessfully',
            dep,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
});

module.exports = router;