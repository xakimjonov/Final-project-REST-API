const express = require("express");
const router = express.Router();
const database = require('../database/data.js')

router.post('/', (req, res) => {
    let body = req.body
    if (!(body.id && body.isbn && body.title)) {
        res.status(400).send("You should enter all vital infos:(id, isbn, title)")
        return
    }
    for (let i = 0; i < database.readData().books.length; i++) {
        const elm = database.readData().books[i];
        if (elm.id == body.id) {
            res.status(404).send(`id:${body.id} is not available ,change id`)
            return
        }
    }
    body.savedTime = Date();

    let data = database.readData()
    data.books.push(body)
    database.writeData(data)
    res.status(201).send("Successfully  Saved")
})

router.get('/', (req, res) => {
    let title = req.query.title
    if (!title) {
        title = ""
    }
    let list = database.readData().books.filter(e => e.title.toLowerCase().includes(title.toLowerCase()))

    if (list.length == 0) {
        res.status(404).send("books are not found!")
        return
    }
    res.json(list)
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    let books = database.readData().books.find(e => e.id == id)
    if (!books) {
        res.status(404).send(`there is no book with id- ${id} `)
        return
    }
    res.status(200).json(books)
})


router.put('/', (req, res) => {
    let body = req.body
    console.log(body)
    let data = database.readData()
    let books = data.books.find(e => e.id == body.id)
    if (!books) {
        res.status(404).send(`there is no book  with id:${body.id}`)
        return
    }
    for (let i = 0; i < data.books.length; i++) {
        const elm = data.books[i];
        if (body.id == elm.id) {
            body.savedTime = data.books[i].savedTime
            body.updatedTime = new Date()
            data.books[i] = body
            break
        }
    }
    database.writeData(data)
    res.status(201).send("successfully updated")
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    let books = database.readData().books.find(e => e.id == id)
    if (!books) {
        res.status(400).send(`there is no book with id:${id}`)
        return
    }
    let data = database.readData()
    data.books = data.books.filter(e => e.id != id)
    database.writeData(data)
    res.status(201).send("Successfully deleted")
})
module.exports = router;