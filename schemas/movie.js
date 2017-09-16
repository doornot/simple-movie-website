// 新建 Schema
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

var MovieSchema = new mongoose.Schema({
  name: String,
  director: String,
  language: String,
  country: String,
  year: Number,
  poster: String,
  introduce: String,
  video: String,
  removed: {
    type: Boolean,
    default: false
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})
MovieSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
MovieSchema.statics = {
  fetch: function(cb) {
    return this.find({removed: false}).sort('meta.updateAt').exec(cb)
  },
  findById: function(id, cb) {
    return this.findOne({_id: id}).exec(cb)
  }
}
module.exports = MovieSchema