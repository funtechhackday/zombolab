require('dotenv').config();

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.json({
        'data': {
            message: 'zombolab api',
        }
    });
});

app.listen(+process.env.SERVER_PORT, () => {
    console.log('App listening on port: ' + process.env.SERVER_PORT);
});