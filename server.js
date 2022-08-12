const port = 3000;
const express = require("express");
const server = express();
server.use(express.json());



const customersRouter = require('./routers/customers')
const booksRouter = require('./routers/books')
const rentalInfoRouter = require('./routers/rental_info')

server.use('/customers', customersRouter)
server.use('/books', booksRouter)
server.use('/bookstore/rental-info', rentalInfoRouter)

server.listen(port, () => {
    console.log(`Server has started on port: ${port}`)
});
