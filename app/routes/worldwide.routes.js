module.exports = app => {
    const worldwide = require("../controllers/worldwide.controller.js");

    //Get all worldwide
    app.get('/worldwide', worldwide.getAll);

    //Get today
    app.get('/worldwide/today', worldwide.getToday);

    //Get Predictions
    app.get('/worldwide/predictions', worldwide.getExpectedToday);
};
