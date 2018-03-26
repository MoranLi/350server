var express = require('express')
var bodyParser = require('body-parser')
var firebase = require('firebase')

var app = express()

app.use(bodyParser.urlencoded({extended:true}))

var config = {
  apiKey: "AIzaSyA_65TBj-GvJRjrsCQeTaL-MZFeFw6XjhI",
  authDomain: "project-407f3.firebaseapp.com",
  databaseURL: "https://project-407f3.firebaseio.com",
  projectId: "project-407f3",
  storageBucket: "project-407f3.appspot.com",
  messagingSenderId: "874447698406"
};
const Firebase = firebase.initializeApp(config);
const db = Firebase.database();
const storage = Firebase.storage().ref()

app.listen(8888, function(){
  console.log("yale camp server start");
})

app.get('/',function(request,responce){
  var itemList = []
  var itemsDB = db.ref('/items/-L8ZA_HeEu6k4iG49E7q')
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

app.post('/',function(request, reqponce){
  var itemsDB = db.ref('/items/-L8ZA_HeEu6k4iG49E7q')
  var image = req.body.files.image

})

app.get('/:id',function(request,responce){

})

app.post('/:id',function(request, reqponce){

})

app.delete('/:id',function(request,responce){

})



