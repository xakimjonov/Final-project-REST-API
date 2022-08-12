const express = require("express");
const router = express.Router();
const database = require('../database/data.js')

router.post('/:cid/:bid/', (req, res) => {
    let customer_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)
    let data = database.readData()
    if (!(customer_id && book_id)) {
        res.status(400).send("customer_id and book_id are required");
        return
    }

    for (let i = 0; i < data.rental_info.length; i++) {
        const element = data.rental_info[i];
        if (element.customer_id == customer_id && element.book_id == book_id) {
            res.status(400).send(`customer_id:${customer_id} already has been saved with  book_id:${book_id}!`);
            return
        }
    }

    data.rental_info.push({
        customer_id: customer_id,
        book_id: book_id,
        booked_time: new Date(),
        returned_time: "",
        savedTime: new Date(),
        update_time: "",

    })
    database.writeData(data)
    res.status(201).send("successfully saved")
})

router.get('/all', (req, res) => {
    res.json(database.readData().rental_info)
})

router.get('/:cid', (req, res) => {
    let customer_id = parseInt(req.params.cid);
    let customer = database.readData().customers.find(e => e.id == customer_id);

    if (!customer) {
        res.status(400).send("there is no customer with such id");
        return
    }
    let customersList = database.readData().rental_info.filter(e => e.customer_id == customer_id)
    if (!customersList.length) {
        res.status(400).send(`customer_id:${customer_id} doesn't have books`);
        return
    }
    customersList.forEach(e => {
        for (let i = 0; i < database.readData().books.length; i++) {
            if (e.book_id == database.readData().books[i].id) {
                e.book = database.readData().books[i]
                break
            }
        }
    });
    res.json({ info: customersList, customer: customer })
})

router.put('/returned/:cid/:bid', (req, res) => {
    data = database.readData()
    let customer_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)
    let changer = data.rental_info.find(e => e.customer_id == customer_id && e.book_id == book_id)
    changer.returned_time = new Date()
    changer.update_time = new Date()
    database.writeData(data)
    res.status(200).send("successfully updated")
})

router.delete('/:cid/:bid', (req, res) => {
    let customer_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)
    let data = database.readData()

    if (!(customer_id && book_id)) {
        res.status(400).send("customer_id and book_id are required");
        return
    }
    let customerbook = data.rental_info.find(e => e.customer_id == customer_id && e.book_id == book_id)
    if (!customerbook) {
        res.status(400).send(`customer_id:${customer_id} doesn't have book with id:${book_id}!`);
        return
    }

    data.rental_info = data.rental_info.filter(e => e.customer_id != book_id || e.customer_id != book_id)
    database.writeData(data)
    res.status(200).send("successfully deleted")
})
module.exports = router;