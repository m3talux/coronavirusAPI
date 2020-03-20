const Country = require("../models/country.model.js");

exports.createOrUpdate = (country) => {
    Country.getSingleToday(country.country, (error, data) => {
        if (!error && data === null) {
            //Save country in the db
            Country.create(country, (err, newData) => {
                if (err) {
                    console.log('could not create country');
                } else console.log('created country');
            })
        } else if (!error && data !== null) {
            //Update country in the db
            Country.update(data.id, country, (err, updatedData) => {
                if (err) {
                    console.log('could not update country', err);
                } else console.log('updated country');
            })
        }
    });
};

exports.getAll = (req, res) => {
    Country.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'Server error'
            });
        } else res.send(data);
    });
};

exports.getToday = (req, res) => {
    Country.getToday((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'Server error'
            });
        } else res.send(data);
    });
};

exports.getByDate = (req, res) => {
    Country.getByDate(req.params.date, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'Server error'
            });
        } else res.send(data);
    });
};

exports.getSingle = (req, res) => {
    Country.getSingle(req.params.country, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'Server error'
            });
        } else res.send(data);
    });
};

exports.getSingleToday = (req, res) => {
    Country.getSingleToday(req.params.country, (err, data) => {
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

exports.getSingleByDate = (req, res) => {
    Country.getSingleByDate(req.params.country, req.params.date, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'Server error'
            });
        } else if (data === null) {
            res.status(404).send({
                message: 'No data found for ' + req.params.date
            });
        } else res.send(data);
    });
};
