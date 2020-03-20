const sql = require("./db.js");

//constructor
const Country = function (country) {
    this.country = country.country;
    this.cases = country.cases;
    this.todayCases = country.todayCases;
    this.deaths = country.deaths;
    this.todayDeaths = country.todayDeaths;
    this.recovered = country.recovered;
    this.active = country.active;
    this.critical = country.critical;
    this.casesPerOneMillion = country.casesPerOneMillion;
    this.created = country.created;
    this.updated = country.updated;
};

Country.create = (newCountry, result) => {
    sql.query('INSERT INTO countries SET ?', newCountry, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }

        console.log('created country: ', {id: res.insertId, ...newCountry});
        result(null, {id: res.insertId, ...newCountry});
    });
};

Country.update = (id, newCountry, result) => {
    const d = new Date().toYMD();
    sql.query('UPDATE countries SET cases = ?, todayCases = ?, deaths = ?, todayDeaths = ?, recovered = ?, active = ?, critical = ?, casesPerOneMillion = ?, updated = ? WHERE id = ?',
        [newCountry.cases, newCountry.todayCases, newCountry.deaths, newCountry.todayDeaths,
            newCountry.recovered, newCountry.active, newCountry.critical, newCountry.casesPerOneMillion, d, id],
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

            console.log('updated country: ', {id: id, ...newCountry});
            result(null, {id: id, ...newCountry});
        });
};

Country.getToday = (result) => {
    const d = new Date().toYMD();
    sql.query('SELECT * FROM countries WHERE created = ?', [d],
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
            if (res.length) {
                result(null, res);
                return;
            }
            result(null, null);
        });
};

Country.getByDate = (date, result) => {
    sql.query('SELECT * FROM countries WHERE created = ?', [date],
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
            if (res.length) {
                result(null, res);
                return;
            }
            result(null, null);
        });
};

Country.getSingle = (country, result) => {
    sql.query('SELECT * FROM countries WHERE country = ?', [country],
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
            if (res.length) {
                result(null, res);
                return;
            }
            result(null, null);
        });
};

Country.getSingleToday = (country, result) => {
    const d = new Date().toYMD();
    sql.query('SELECT * FROM countries WHERE country = ? AND created = ?', [country, d],
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
            if (res.length) {
                console.log('found country: ', res[0]);
                result(null, res[0]);
                return;
            }
            result(null, null);
        });
};

Country.getSingleByDate = (country, date, result) => {
    sql.query('SELECT * FROM countries WHERE country = ? AND created = ?', [country, date],
        (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
            if (res.length) {
                console.log('found country: ', res[0]);
                result(null, res[0]);
                return;
            }
            result(null, null);
        });
};

Country.getAll = (result) => {
    sql.query('SELECT * FROM countries', (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        result(null, res);
    })
};

module.exports = Country;
