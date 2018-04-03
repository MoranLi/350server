var express = require('express')
var bodyParser = require('body-parser')
var firebase = require('firebase')
var fs = require('file-system')
var path = require('path')
var fileUpload = require('express-fileupload');
var cors = require('cors')

var app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

app.use(fileUpload());
app.use(cors())

app.use('/image', express.static(path.join(__dirname, 'image')))

var config = {
  apiKey: "AIzaSyA_65TBj-GvJRjrsCQeTaL-MZFeFw6XjhI",
  authDomain: "project-407f3.firebaseapp.com",
  databaseURL: "https://project-407f3.firebaseio.com",
  projectId: "project-407f3",
  storageBucket: "project-407f3.appspot.com",
  messagingSenderId: "874447698406"
};
const Firebase = firebase.initializeApp(config)
const db = Firebase.database()

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("yale camp server start");
})

app.get('/',function(request,responce){
  var itemList = []
  var itemsDB = db.ref('/items')
  console.log("start load item");
  itemsDB.once('value').then(function(dataSnapshot){
      var data = dataSnapshot.val();
      data.forEach(function(f,i){
          var sub = f;
          sub["index"] = i;
          itemList.push(sub)
      });
      console.log("success load item");
      responce.send(itemList)
  }).catch(function(err){
      console.log("fail load item");
      responce.send(err)
  })
})

app.post('/',function(request, responce){
  var images = request.files.images
  console.log(images)
  db.ref('/id').once('value').then(function(current){
    var currentId = current.val().current
    fs.writeFile("./image/"+images.name,images.data,(err) => {
      if(err){
        console.log(err);
        responce.send(err)
      }
      else {
        var newItem = {
          itemDescription: request.body.description,
          itemImageAlt: "placeholder",
          itemImageSrc: "http://server350.herokuapp.com/image/"+images.name,
          itemPrice: request.body.price,
          id: currentId
        }
        db.ref('/items/'+currentId).set(newItem).then(() => {
          db.ref().update({
            '/id': {
              current: currentId+1
            }
          }).then(() => {
            responce.send("success")
          }).catch((err) => {
            console.log(err);
            responce.send(err)
          })
        }).catch((err) => {
          console.log(err);
          responce.send(err)
        })
      }
    })
  }).catch(function(err){
      console.log(err);
      responce.send(err)
  })
})

app.get(':/id',function(request, responce){
  db.ref('/items/'+request.params.id).once('value').then((data) => {
    responce.send(data)
  }).catch(function(err){
      console.log(err);
      responce.send(err)
  })
})

app.post('/:id',function(request, responce){
  if(request.files.images) {
    var images = request.files.images
    fs.writeFile("./image/"+images.name,images.data,(err) => {
      if(err){
        responce.send(err)
      }
      else {
        db.ref('/items/'+request.params.id).once('value').then((data) =>{
          var oldData = data.val()
          var newItem = {
            itemDescription: request.body.description ? request.body.description : oldData.itemDescription,
            itemImageAlt: "placeholder",
            itemImageSrc: "http://server350.herokuapp.com/image/"+images.name,
            itemPrice: request.body.price ? request.body.price : oldData.itemPrice,
            id: request.params.id
          }
          db.ref('/items/'+request.params.id).set(newItem).then(() => {
            responce.send("success")
          }).catch((err) => {
            responce.send(err)
          })
        }).catch(function(err){
          console.log("fail load item");
          responce.send(err)
        })
      }
    })
  }
  else {
    db.ref('/items/'+request.params.id).once('value').then((data) =>{
      var oldData = data.val()
      var newItem = {
        itemDescription: request.body.description ? request.body.description : oldData.itemDescription,
        itemImageAlt: "placeholder",
        itemImageSrc: oldData.itemImageSrc,
        itemPrice: request.body.price ? request.body.price : oldData.itemPrice,
        id: request.params.id
      }
      db.ref('/items/'+request.params.id).set(newItem).then(() => {
        responce.send("success")
      }).catch((err) => {
        responce.send(err)
      })
    }).catch(function(err){
      console.log("fail load item");
      responce.send(err)
    })
  }
})

app.delete('/:id',function(request,responce){
  db.ref('/items/'+request.params.id).remove().then(
    responce.send("delete success")
  ).catch(function(err){
    console.log("fail load item");
    responce.send(err)
  })
})



