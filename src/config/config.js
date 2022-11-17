const mongoConfig = {
    host: 'mongodb+srv://fedekrenn:aE7ETkIwOIZrZW2V@cluster0.r4mk0zv.mongodb.net/?retryWrites=true&w=majority' || 'mongodb://localhost/ecommerce',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
}

module.exports = mongoConfig;