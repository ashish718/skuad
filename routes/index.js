var express = require('express');
var router = express.Router();
let Url = require('../model/UrlSchema')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/shorten', async(req, res, next) =>{
  console.log(req.body);
     let regex = /^[0-9a-zA-Z_]{4,}$/


     if (req.body.shortcode==="") {
       res.status(400).send("Bad Request")
     }
     else if(req.body.shortcode===undefined){

       let regex1= /^[0-9a-zA-Z_]{6}$/
       let makeShortCode = new URL(req.body.url).host
       makeShortCode= makeShortCode.split('.com')

        makeShortCode = makeShortCode[0].split('')

        console.log(makeShortCode.length);

          for (var i = makeShortCode.length; i < 6; i++) {
            makeShortCode.push(1)
          }


        makeShortCode = makeShortCode.join('')
        console.log(makeShortCode, "new makeShortCode");

       if (regex1.test(makeShortCode)===true) {
         Url.findOne({url:req.body.url.toString()})
             .then(updatedDocument => {
               if(updatedDocument) {
                 res.send("Url Already Exists")
               } else {
                 let url = new Url({
                   shortcode:makeShortCode,
                   url:req.body.url,
                   startDate: Date(),
                 })
                 url.save(function(err, docs){
                   if (err) {
                     res.status(400).end("save error")
                   }
                   else {
                     res.status(201).send(`Saved Successfully ${docs}`)
                   }
                 })
               }

             })
             .catch(err => console.error(`Failed to find document: ${err}`))
       }
       else {
         res.status(422).send("shortcode fails to meet the following regexp")
       }
     }
     else{
       console.log("coming in else");
       if (regex.test(req.body.shortcode)===true) {

          Url.findOne({url:req.body.url})
              .then(updatedDocument => {
                if(updatedDocument) {
                  res.status(409).send("desired URL is already in use")
                } else {
                  let url = new Url({
                    shortcode:req.body.shortcode,
                    url:req.body.url,
                    startDate: Date(),
                  })
                  url.save(function(err, docs){
                    if (err) {
                      res.status(400).end("save error")
                    }
                    else {
                      res.status(201).send(`Saved Successfully ${docs}`)
                    }
                  })
                }

              })
              .catch(err => console.error(`Failed to find document: ${err}`))

       }
       else {
         res.status(422).send("shortcode fails to meet the following regexp")
       }
     }



});



router.get('/:shortcode', async(req, res, next)=>{

  console.log("req.params", req.params);

  Url.findOne({shortcode:req.params.shortcode.toString()})
      .then(updatedDocument => {
        if(updatedDocument) {

          let count = updatedDocument.redirectCount + 1

          Url.findOneAndUpdate({shortcode:req.params.shortcode.toString()}, {$set:{redirectCount: count,
          lastSeenDate: Date()}}, { returnNewDocument: true }, function(err, data){
            if (err) {
              console.log("count err", err);
            }
            else {
              res.status(200).send({shortcode:updatedDocument.shortcode, url:updatedDocument.url})
            }
          })
        } else {
          res.status(404).send( {message: `shortcode is not found in the system`,Location: `http://${req.params.shortcode} ---->required`})
        }

      })
      .catch(err => console.error(`Failed to find document: ${err}`))

})

router.get('/:shortcode/stats', async(req, res, next)=>{
  try{
    Url.findOne({shortcode:req.params.shortcode.toString()})
        .then(updatedDocument => {
          if(updatedDocument) {


                res.status(200).send({redirectCount:updatedDocument.redirectCount,startDate:new Date(updatedDocument.startDate), lastSeenDate:new Date(updatedDocument.lastSeenDate)})


          } else {
            res.status(404).send(`http://${req.params.shortcode}.com required, shortcode is not found in the system`)
          }

        })
        .catch(err => console.error(`Failed to find document: ${err}`))
  }
  catch{
    res.send("unexpected error")
  }

})


module.exports = router;
