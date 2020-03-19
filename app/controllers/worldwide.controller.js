const Worldwide = require("../models/worldwide.model.js");

exports.createOrUpdate = (worldwide) => {

    Worldwide.getToday((error, data) => {
        if (!error && data === null) {
            //Save worldwide in the db
            Worldwide.create(worldwide, (err, newData) => {
                if (err) {
                    console.log('could not create worldwide');
                } else console.log('created worldwide');
            })
        } else if (!error && data !== null) {
            //Update worldwide in the db
            Worldwide.update(data.id, worldwide, (err, updatedData) => {
                if (err) {
                    console.log('could not update worldwide');
                } else console.log('updated worldwide');
            })
        }
    });
};

exports.getAll = (req, res) => {
    Worldwide.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'Server error'
            });
        } else res.send(data);
    });
};

exports.getToday = (req, res) => {
    Worldwide.getToday((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'Server error'
            });
        } else if (data === null) {
            res.status(404).send({
                message: 'No data found for today'
            });
        } else res.send(data);
    });
};
