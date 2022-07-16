const express = require('express');
const router = express.Router();
const Tasks = require("../models/Tasks");
const { body, validationResult } = require('express-validator');
const getuser = require("../middleware/getuser");



// ROUTE 1:  /fetchalltasks 

router.get('/fetchalltasks', getuser, async (req, res) => {

    try {
        let usertasks = await Tasks.find({ user: req.id });
        res.json(usertasks);
    }
    catch (error) {
        return res.status(500).json({ error: "Some error occured." });
    }
})



// ROUTE 2:  /addtask

router.post('/addtask', getuser, [
    body('title').isLength({ min: 1 }),
    body('description').isLength({ min: 1 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let usertask = await Tasks.create({
            user:req.id,
            title:req.body.title,
            description:req.body.description
        })
        res.json(usertask);
    }
    catch (error) {
        return res.status(500).json({ error: "Some error occured." });
    }
})



// ROUTE 3:  /updatetask

router.put('/updatetask/:id', getuser, async (req, res) => {

    try {
        let {title,description} = req.body;
        // New Task Object
        const newTask = {title,description};
        // if(title){newTask.title= title};
        // if(description){newTask.description= description};


        // Matching User Id
        let task = await Tasks.findById(req.params.id);
        if(!task){return res.status(404).json({ error: "Not Found." })};

        if(task.user.toString() !== req.id)
        {
            return res.status(401).json({ error: "Not Allowed" });
        }


        // Updating Task
        task = await Tasks.findByIdAndUpdate(req.params.id, {$set:newTask}, {new:true});
        res.json(task);

    }
    catch (error) {
        return res.status(500).json({ error: "Some error occured." });
    }
})


// ROUTE 4:  /deletetask

router.delete('/deletetask/:id', getuser, async (req, res) => {

    try {
        // Matching User Id
        let task = await Tasks.findById(req.params.id);
        if(!task){return res.status(404).json({ error: "Not Found." })};

        if(task.user.toString() !== req.id)
        {
            return res.status(401).json({ error: "Not Allowed" });
        }

        
        // Deleting Task
        task = await Tasks.findByIdAndDelete(req.params.id);
        res.json({status: "Done", task:task});

    }
    catch (error) {
        return res.status(500).json({ error: "Some error occured." });
    }
})

module.exports = router;