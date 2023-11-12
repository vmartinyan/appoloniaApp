const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();
const connectDb = require('./config/db');

// Routes
const usersRoute = require('./routes/user')
const departmentsRoute = require('./routes/department')
const employeesRoute = require('./routes/employee')

const app = express();

connectDb();
const port = process.env.NODE_LOCAL_PORT  || 3020;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get('/', (req, res) => {
    res.send('Back end - Node JS')
});

app.use('/users', usersRoute);
app.use('/departments', departmentsRoute);
app.use('/employees', employeesRoute);


app.listen(port, () => {
    console.log('listening on port ' + port)
});