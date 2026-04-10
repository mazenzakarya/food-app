require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const connectDB = require('./config/connectionDB');

connectDB();
app.use('/api/recipes', require('./routes/recipe'));
app.use('/api/users', require('./routes/user'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});