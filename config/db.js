const mongoose = require('mongoose');

//const url = 'mongodb://mongo:27017/appoloniaApp';
const url = 'mongodb://localhost:27017/appoloniaApp';

const connectDb = () => {
    mongoose.connect(url);
};

module.exports = connectDb;