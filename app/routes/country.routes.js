module.exports = app => {
    const country = require("../controllers/country.controller.js");

    //Get all countries
    app.get('/countries', country.getAll);

    //Get today
    app.get('/countries/today', country.getToday);

    //Get by date
    app.get('/countries/historical/:date', country.getByDate);

    //Get single
    app.get('/countries/:country', country.getSingle);

    //Get single today
    app.get('/countries/:country/today', country.getSingleToday);

    //Get single by date
    app.get('/countries/:country/:date', country.getSingleByDate);
};
