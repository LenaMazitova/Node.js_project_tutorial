const sqlite3 = require('sqlite3').verbose()

const dbName = 'db.sqlite'

const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(err.message)
    }
    console.log('DB connected')
})

db.serialize(() => {
    const sql = `CREATE TABLE IF NOT EXISTS articles
    (id integer primary key, title TEXT, content TEXT)`
    db.run(sql)
})

class Article {
    static all(callback) {
        db.all(`SELECT * FROM articles`, callback)
    }
    static find(id, callback) {
        db.get(`SELECT * FROM articles WHERE id = ? `, id, callback)
    }
    static create(data, callback) {
        const sql = `INSERT INTO articles(title, content) VALUES (?, ?)`
        db.run(sql, data.title, data.content, callback)
    }
    static update(data, callback) {
        const sql = `UPDATE articles SET (title, content) VALUES (?, ?) WHERE id = (?)`
        db.run(sql, data.title, data.content, data.id, callback)
    }
    static delete(id, callback) {
        if (!id) return callback(new Error(`Please provide an id`))
        db.run(`DELETE FROM articles WHERE id = ?`, id, callback)
    }
}

// db.close((err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('DB disconnected');
// });

module.exports = db
module.exports.Article = Article