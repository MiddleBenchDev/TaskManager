const express = require("express")
const TaskRouter = express.Router()
const { Task } = require('../models')

TaskRouter.get('/lists/:listId/tasks', (req, res) => {
    try {
        if (req?.params?.listId) {
            Task.find({
                _listId: req?.params?.listId
            }).then((listTasks) => res?.send(listTasks))
        } else {
            res?.json({ message: 'Please select a list id!' }).status(422)
        }
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})

TaskRouter.post('/lists/:listId/tasks', (req, res) => {
    try {
        let newTask = new Task({
            _listId: req?.params?.listId,
            title: req?.body?.title
        })
        newTask.save().then((taskDoc) => res?.send(taskDoc))
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})

TaskRouter.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    try {
        Task.findOneAndUpdate({ _id: req?.params?.taskId, _listId: req?.params?.listId }, { $set: req?.body }).then(() => res?.send({ message: "Updated Successfully" }))
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})

TaskRouter.delete('/lists/:listId/taskId/:taskId', (req, res) => {
    try {
        Task.findOneAndDelete({ _id: req?.params?.taskId, _listId: req?.params?.listId }).then((removedDoc) => res?.send(removedDoc))
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})

TaskRouter.get('/lists/:listId/tasks/:taskId', (req, res) => {
    try {
        Task.findOne({
            _id: req?.params?.taskId,
            _listId: req?.params?.listId
        }).then((task) => res?.send(task))
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})

module.exports = TaskRouter