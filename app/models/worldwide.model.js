const sql = require("./db.js");

//constructor
const Worldwide = function (worldwide) {
    this.cases = worldwide.cases;
    this.deaths = worldwide.deaths;
    this.recovered = worldwide.recovered;
    this.created = worldwide.created;
    this.updated = worldwide.updated;
};

Worldwide.create = (newWorldwide, result) => {
    sql.query('INSERT INTO worldwide SET ?', newWorldwide, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }

        console.log('created worldwide: ', {id: res.insertId, ...newWorldwide});
        result(null, {id: res.insertId, ...newWorldwide});
    });
};

Worldwide.update = (id, newWorldwide, result) => {
    const d = new Date().toYMD();
    sql.query('UPDATE worldwide SET cases = ?, deaths = ?, recovered = ?, updated = ? WHERE id = ?',
        [newWorldwide.cases, newWorldwide.deaths, newWorldwide.recovered, d, id],
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }

            if (res.affectedRows === 0) {
                // not found worldwide with the id
                result({kind: "not_found"}, null);
                return;
            }

            console.log('updated worldwide: ', {id: id, ...newWorldwide});
            result(null, {id: id, ...newWorldwide});
        });
};

Worldwide.getToday = (result) => {
    const d = new Date().toYMD();
    sql.query('SELECT * FROM worldwide WHERE created = ?', [d], (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log('found worldwide: ', res[0]);
            result(null, res[0]);
            return;
        }
        result(null, null);
    });
};

Worldwide.getAll = (result) => {
    sql.query('SELECT * FROM worldwide', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        result(null, res);
    })
};

module.exports = Worldwide;
