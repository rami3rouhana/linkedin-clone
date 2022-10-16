const express = require('express');
const cors  = require('cors');
const { company } = require('./api');

module.exports = async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    company(app);
    
}
