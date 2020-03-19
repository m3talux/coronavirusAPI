module.exports = app => {
    const worldwide = require("../controllers/worldwide.controller.js");

    //Create new worldwide
    app.put('/worldwide', worldwide.createOrUpdate);
};
