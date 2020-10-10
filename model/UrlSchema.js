const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({

     shortcode: {
       type:String,
       require: true
     },
     url: {
       type:String,
     },
     startDate: {
       type:Date
     },
     lastSeenDate: {
       type:Date
     },
     redirectCount:{
       type:Number,
       default:0
     }

});

module.exports = mongoose.model('Url', UrlSchema)
