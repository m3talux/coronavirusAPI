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

exports.getExpectedToday = (req, res) => {
    Worldwide.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'Server error'
            });
        } else {
            if (data.length > 1) {
                const lastCasesValue = data[data.length - 2].cases;
                const variationPercentages = [];
                let totalVariation = 0;
                const step = 1 / (data.length - 1);
                let importance = 1.0;
                for (let i = 1; i < data.length - 2; i++) {
                    variationPercentages[i - 1] =
                        (Math.abs(data[i].cases - data[i + 1].cases) / data[i].cases) * importance * 100;
                    totalVariation += variationPercentages[i - 1];
                    importance += step;
                }
                const outlook = getTodayOutlook(variationPercentages);
                const percentageIncrease = totalVariation / variationPercentages.length * outlook.outlookValue;
                const expected = Math.round(lastCasesValue + (lastCasesValue * percentageIncrease / 100));
                const actualGrowth = Math.abs((lastCasesValue - data[data.length - 1].cases) / data[data.length - 1].cases) * 100;
                const expectedPercentage = Math.abs((lastCasesValue - expected) / expected) * 100;


                if (data[data.length - 1].cases > expected) {
                    outlook.outlookValue += 0.1;
                    outlook.outlookArray.push({
                        x: outlook.outlookArray.length + 1,
                        y: Math.round(outlook.outlookValue * 100) / 100
                    });
                }

                res.send({
                    expectedCases: expected,
                    expectedCasesGrowth: Math.round(expectedPercentage * 100) / 100,
                    lastCasesValue: lastCasesValue,
                    actualCasesValue: data[data.length - 1].cases,
                    actualCasesGrowth: Math.round(actualGrowth * 100) / 100,
                    outlookValue: Math.round(outlook.outlookValue * 100) / 100,
                    outLookArray: outlook.outlookArray
                });
            } else {
                res.status(404).send({
                    message: 'Not enough data to generate predictions'
                });
            }
        }
    });

    function getTodayOutlook(array) {
        if (array.length > 1) {
            let outlook = 1.0;
            const step = 0.1;
            const outlooks = [];
            for (let i = 1; i < array.length; i++) {
                if (array[i] > array [i - 1]) {
                    outlook += step;
                } else if (array[i] < array[i - 1]) {
                    outlook -= step;
                }
                outlooks.push({x: i, y: Math.round(outlook * 100) / 100});
            }
            return {outlookValue: outlook, outlookArray: outlooks};
        } else return {outlookValue: 1, outlookArray: []};
    }
};
