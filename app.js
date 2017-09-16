var express = require('express')
var mongoose = require('mongoose')
var path = require('path')
var bodyParser = require('body-parser')
var _ = require('lodash')
var Movie = require('./models/movie.js')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/movie', {
	useMongoClient: true
})

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'static')))
app.locals.moment = require('moment')
app.listen(port)

console.log('movie started on port 3000')

// index page
app.get('/', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) console.log(err)
    res.render('index', {
      title: 'movie 首页',
      movies: movies
    });
  })
})

// detail page
app.get('/movie/:id', function(req, res) {
  var id = req.params.id
  Movie.findById(id, function(err, movie) {
    if (err) console.log(err)
    res.render('detail', {
      title: movie.name + ' 详情',
      data: movie
    });
  })
})

// admin new page
app.get('/admin/new', function(req, res) {
  res.render('movie', {
    title: 'movie 录入后台',
    movie: {
      name: '',
      director: '',
      country: '',
      language: '',
      poster: '',
      video: '',
      year: '',
      introduce: ''
    }
  });
})

// submit movie form
app.post('/admin/movie/new', function(req, res) {
  var reqBody = req.body
  var id = reqBody.id
  var _movie
  if (id !== 'undefined') {
    Movie.findById(id, function(err, data) {
      if (err) console.log(err)
      _movie = _.merge(data, reqBody)
      _movie.save(function(err) {
        if (err) console.log(err)
        res.redirect('/movie/' + reqBody.id)
      })
    })
  } else {
    _movie = new Movie({
      name: reqBody.name,
      director: reqBody.director,
      language: reqBody.language,
      country: reqBody.country,
      year: reqBody.year,
      poster: reqBody.poster,
      video: reqBody.video,
      introduce: reqBody.introduce
    })
    _movie.save(function(err, movie) {
      if (err) console.log(err)
      res.redirect('/movie/' + movie._id)
    })
  }
})

// admin update page
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function (err, data) {
      if (err) console.log(err)
      res.render('movie', {
        title: 'movie 更新后台',
        movie: data
      })
    })
  }
})

// list page
app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    res.render('list', {
      title: 'movie 列表',
      list: movies
    });
  })
})

// admin delete movie item
app.delete('/admin/list', function(req, res) {
  var id = req.query.id
  if (id) {
    Movie.update({_id: id}, {'$set': {removed: true}}, function(err) {
      if (err) {
        console.log(err)
      } else {
        res.json({'success': true})
      }
    })
  }
})