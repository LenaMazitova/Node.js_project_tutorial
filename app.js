require('dotenv').config()
const url_dev = require('url')
const http = require('http')

const express = require('express')


const app = express()
const bodyparser = require('body-parser')
const Article = require('./db').Article
const read = require('node-readability')

app.set('port', process.env.PORT || 3001)
app.set('view engine', 'ejs')
// for json-encoded
app.use(bodyparser.json())
// for form-encoded
app.use(bodyparser.urlencoded({ extended: true }))

// Assigning articles
// const articles = [{ title: 'example1' }, { title: 'example2' }, { title: 'example3' }]

// Fetchig all of articles
app.get('/articles', (request, response, next) => {
    Article.all((err, articles) => {
        if (err) return next(err)
        response.format({
            html: () => {
                response.render('articles.ejs', { articles: articles })
            },
            json: () => {
                response.send(articles)
            }
        })
    })
})

// Posting articles
app.post('/articles', (request, response, next) => {
    const url = request.body.url
    read(url, (err, result) => {
        if (err || !result) response.status(500).send('Error downloading aricle')
        Article.create({ title: result.title, content: result.content }),
            (err, article) => {
                if (err) return next(err)
                response.sendStatus(200)
            }
    })
})

// Fetching specific article
app.get('/articles/:id', (request, response, next) => {
    // extract the identifier
    const id = request.params.id
    Article.find(id, (err, articles) => {
        if (err) return next(err)
        response.format({
            html: () => {
                response.render('article_id.ejs', { articles: articles })
            },
            json: () => {
                response.send(articles)
            }
        })
        // return row ? console.log(`${row.id}; ${row.title}; ${row.content}`) : console.log('Not found')
    })
})

// Deleting specific article
app.delete('/articles/:id', (request, response, next) => {
    // extract the identifier
    const id = request.params.id
    Article.delete(id, (err) => {
        if (err) return next(err)
        response.send({ message: `Deleted` })
    })
})

app.listen(app.get('port'), () => {
    console.log(`Web app available at: http://127.0.0.1:${app.get('port')}`)
})
