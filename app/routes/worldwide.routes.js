module.exports = app => {
    const worldwide = require("../controllers/worldwide.controller.js");

    //Create or Update worldwide
    app.put('/worldwide', worldwide.createOrUpdate);

    //Get all worldwide
    app.get('/worldwide', worldwide.getAll);

    //Get today
    app.get('/worldwide/today', worldwide.getToday);
};
