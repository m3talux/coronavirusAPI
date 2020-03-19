const Worldwide = require("../models/worldwide.model.js");

exports.createOrUpdate = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'Content cannot be empty!'
        });
    }

    const worldwide = new Worldwide({
        cases: req.body.cases,
        deaths: req.body.deaths,
        recovered: req.body.recovered,
        created: req.body.created,
        updated: req.body.updated
    });

    Worldwide.getToday((error, data) => {
        if (!error && data === null) {
            //Save worldwide in the db
            Worldwide.create(worldwide, (err, newData) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || 'Server error'
                    });
                } else res.send(newData);
            })
        } else if (!error && data !== null) {
            //Update worldwide in the db
            Worldwide.update(data.id, worldwide, (err, updatedData) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || 'Server error'
                    });
                } else res.send(updatedData);
            })
        }
    });
};
