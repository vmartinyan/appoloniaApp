const express = require('express');
const router = express.Router();
const Employee = require('../models/employee')

router.get('/', async (req, res) => {
    try{
        const filter = req.body;
        const employees = await Employee.find(filter);
        return res.status(200).json({
            employees
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
});


router.post('/', async (req, res) => {
    try{
        const obj = req.body;
       
        const checkEmployee = await Employee.findOne(obj);

        if(checkEmployee){
            return res.status(409).json({message: 'Employee already exist'})
        }

        const emp = new Employee(obj);

        await emp.save();

        return res.status(201).json({
            message: 'Employee created sucessfully',
            emp,
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

        const checkEmp = await Employee.findOne(filter);

        if(!checkEmp){
            return res.status(400).json({message: 'Employee doesen\'t find'});
        }

        const update = (({ _id, ...o }) => o)(obj);
       
        const emp = await Employee.findOneAndUpdate(filter, update, {
            new: true
        });
        
        return res.status(200).json({
            message: 'Employee updated sucessfully',
            emp,
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

        const checkEmp = await Employee.findOne(filter);

        if(!checkEmp){
            return res.status(400).json({message: 'Employee doesen\'t find'});
        }

        const emp = await Employee.deleteOne(filter);
        
        return res.status(200).json({
            message: 'Employee deleted sucessfully',
            emp,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
});

module.exports = router;