const express = require("express");
const router = express.Router();
const database = require('../database/data.js')

router.post('/', (req, res) => {
    let body = req.body
    let data = database.readData()
    if (!(body.id && body.firstname && body.lastname && body.phone)) {

        res.status(400).send("You should enter all vital infos:(id, firstname,lastname, phone)")
        return
    }
    for (let i = 0; i < database.readData().customers.length; i++) {
        const elm = database.readData().customers[i];
        if (elm.id == body.id) {
            res.status(404).send(`id:${body.id} is not available, change id `)
            return
        }
    }
    body.savedTime = new Date()
    data.customers.push(body)
    database.writeData(data)
    res.status(201).send("Successfully saved")
})

router.get('/', (req, res) => {
    let data = database.readData()
    let name = req.query.name
    if (!name) {
        res.json(data.customers)
    }
    let list = data.customers.filter(e => (e.firstname + " " + e.lastname).toLowerCase().includes(name.toLowerCase()))

    if (!list.length ) {
        res.status(404).send("customer is not found!")
        return
    } else {
         res.json(list)
        return
    }
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    let data = database.readData()
    let customers = data.customers.find(e => e.id == id)
    if (!customers) {
        res.status(400).send(` there is no customer with id:${id}`);
        return
    }
    res.status(200).json(customers)
})


router.put('/', (req, res) => {
    let data = database.readData()
    let body = req.body
    console.log(body)
    let customers = data.customers.find(e => e.id == body.id)

    if (!customers) {
        res.status(400).send(`there is no customer with id:${body.id}`);
        return
    }
    for (let i = 0; i < data.customers.length; i++) {
        const elm = data.customers[i];
        if (elm.id == body.id) {
            body.savedTime = data.customers[i].savedTime
            body.updatedTime = new Date()
            data.customers[i] = body
            break;
        }
    }
    database.writeData(data)
    res.status(200).send("successfully updated")
})

router.delete('/:id', (req, res) => {
    let data = database.readData()
    let id = req.params.id
    let customers = data.customers.find(e => e.id == id)
    if (!customers) {
        res.status(400).send(`id:${id} is not found `);
        return
    }

    data.customers = data.customers.filter(e => e.id != id)
    database.writeData(data)
    res.status(201).send("Successfully deleted")
})

module.exports = router;
