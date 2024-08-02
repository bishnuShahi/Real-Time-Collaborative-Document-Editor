const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('Collaborative Document Editor API');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});