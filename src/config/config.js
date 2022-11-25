
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const mongoConfig = {
    host: 'mongodb+srv://fedekrenn:aE7ETkIwOIZrZW2V@cluster0.r4mk0zv.mongodb.net/?retryWrites=true&w=majority' || 'mongodb://localhost/ecommerce',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
}

const sessionConfig = {

    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://fedekrenn:aE7ETkIwOIZrZW2V@cluster0.r4mk0zv.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),

    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}

module.exports = { mongoConfig, sessionConfig };