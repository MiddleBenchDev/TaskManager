const express = require("express")
const ListRouter = express.Router()
const { List } = require('../models')

ListRouter.get('/lists', async (req, res) => {
    try {
        const list = await List.find({})
        res.json(list).status(200);
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})

ListRouter.post('/lists', (req, res) => {
    try {
        let title = req?.body?.title

        let newList = new List({
            title: title
        })

        newList.save().then((listDoc) => res?.send(listDoc))
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})

ListRouter.patch('/lists/:id', (req, res) => {
    try {
        List.findOneAndUpdate({ _id: req?.params?.id }, { $set: req?.body }).then(() => res?.sendStatus(200))
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})

ListRouter.delete('/lists/:id', (req, res) => {
    try {
        List.findOneAndDelete({ _id: req?.params?.id }).then((removedDoc) => res?.send(removedDoc))
    } catch (err) {
        res.json({ message: err?.message }).status(500)
    }
})


module.exports = ListRouter