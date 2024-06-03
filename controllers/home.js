const db = require('../util/db');

exports.getHome = async (req, res) => {
    try {
        db.all(`SELECT * FROM rooms`, [], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.render('home', { data: rows });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
