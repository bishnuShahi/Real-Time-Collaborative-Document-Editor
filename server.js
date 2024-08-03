const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes)


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});