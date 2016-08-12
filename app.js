// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

var ref = new Firebase("https://party4life-45452.firebaseio.com/");
var profilePicUrl = "img/icon-user-default.png";
var userEmail = "hotmail";
var userName = "";
var id = 0;

function party4life(){
  this.checkSetup();

  this.search = document.getElementById('search');
  //new stuff start
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.searchDisplay = document.getElementById('search-result');
  this.addButton = document.getElementById('add');
  this.removeButton = document.getElementById('remove');
  document.getElementById('pre').style.display="none";
  //new stuff end

  this.search.addEventListener('click', this.SearchButton.bind(this));
  this.userName.addEventListener('click', this.goProfile.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));//new
  this.signInButton.addEventListener('click', this.signIn.bind(this));//new
  //this.searchInput.addEventListener('input', this.updateSearchInput.bind(this));
  this.addButton.addEventListener('click', this.addFood.bind(this));
  this.removeButton.addEventListener('click', this.removeFood.bind(this));

  //console.log("Date now: " + Date.now());
  this.initFirebase();
}

party4life.prototype.addFood = function() {
  var newFood = document.getElementById('update');
  //console.log(newFood.value);
  newFood.value = newFood.value.replace(' ', '_');
  //console.log("id: " + id);
  refIdFood = ref.child('ID/' + id + '/Food');
  //console.log("asd: " + refFood.child('1').value);
  var foodArray;
  //Add ID section
  refIdFood.once('value', function(snap){
    foodArray = snap.exportVal();
    var numFood = snap.numChildren();
    //console.log("foodArray[0]: " + foodArray[0]);
    if(foodArray[0] === ""){
      foodArray[0] = newFood.value;
    }
    else{
      foodArray[numFood] = newFood.value;
    }
    
    refIdFood.set(foodArray);
    //console.log("numFood: " + numFood);
    //console.log("foodArray: " + JSON.stringify(foodArray));
  })
  //Add Food section
  refFood = ref.child('Food/' + newFood.value);
  refFood.once('value', function(snap){
    if(snap.exists()){
      foo = {};
      foo[userName] = id;
      refFood.update(foo);
    }
    else {
      refFood = ref.child('Food');
      foo = {};
      foo[newFood.value] = userName;
      refFood.update(foo);
      foo = {};
      foo[userName] = id;
      refFood.child(newFood.value).update(foo);
      //console.log("foo: " + foo);
      //refFood.update(foo);
      //refFood.child(newFood.value/userName).update()
    }
  })
}

party4life.prototype.removeFood = function() {
  var byeFood = document.getElementById('update');
  byeFood.value = byeFood.value.replace(' ', '_');
  var refIdFood = ref.child('ID/' + id + '/Food');
  refIdFood.once('value', function(snapshot){
    snapshot.forEach(function(snap){
      if(snap.val() === byeFood.value){
        //clear ID section
        var foodArray = snapshot.exportVal();
        //console.log("remove: " + snapshot.numChildren());
        var index = snapshot.numChildren() - 1;
        var lastFood = snapshot.child(index).val();
        //console.log("lastFood: " + lastFood);
        if(index === 0){
          foodArray[0] = "";
        }
        else{
          foodArray[snap.key()] = lastFood;
          delete foodArray[index];
        }
        
        refIdFood.set(foodArray);

        //clear Food section
        var refFood = ref.child('Food/' + byeFood.value);
        refFood.once('value', function(snapshot){
          var foodProvider = snapshot.exportVal();
          //console.log("foodProvider1: " + JSON.stringify(foodProvider));
          delete foodProvider[userName];
          refFood.set(foodProvider);
          //.log("foodProvider2: " + JSON.stringify(foodProvider));
          //console.log("user: " + userName);
        })
      }
    })
  })
}

//new stuff start
// Signs-in Friendly Chat.
party4life.prototype.signIn = function(googleUser) {
  // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
  //this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider).then(function(result) {
    userName = result.user.displayName;
    userName = userName.toLowerCase();
    userName = userName.replace(' ', '_');
    userEmail = result.user.email;
    userEmail = userEmail.replace('.', ',');
    
    ref.child('Email/' + userEmail).once('value', function(snapshot){
      //console.log("snap " + snapshot.val());
      if(snapshot.val() === null) {
        //console.log("create new");
        var newref = ref.child('ID').push();
        id = newref.key();
        newref.set({
          "Food" : {
              0 : ""
            },
            "Name" : {
              0 : userName
            },
            "Email" : {
              0 : userEmail
            }
        });
        foo = {};
        foo[userEmail] = id;
        ref.child('Email').update(foo);
        foo = {};
        foo[userName] = {0 : id};
        ref.child('Name').update(foo);
        //console.log("key: " + id);
        //ref.child('Email/'+userEmail+"/"+id).set();
      }
      else{
        id = snapshot.val();
      }
    });
    
    //console.log(user);
  });
};

// Signs-out of Friendly Chat.
party4life.prototype.signOut = function() {
  // TODO(DEVELOPER): Sign out of Firebase.
  this.auth.signOut();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
party4life.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    profilePicUrl = user.photoURL;   // TODO(DEVELOPER): Get profile pic.
    userName = user.displayName;        // TODO(DEVELOPER): Get user's name.
    userName = userName.toLowerCase();
    userName = userName.replace(' ', '_');

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;
    

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');
    this.addButton.removeAttribute('hidden');
    this.removeButton.removeAttribute('hidden');
    document.getElementById('foodBox').style.display="block";

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');
    this.addButton.setAttribute('hidden', 'true');
    this.removeButton.setAttribute('hidden', 'true');
    document.getElementById('foodBox').style.display="none";

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};
// new stuff end

party4life.prototype.initFirebase = function(){
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));//new
  //this.searchDisplay.setAttribute('hidden', 'true');
};
/*
party4life.prototype.updateSearchInput = function() {
}
*/

party4life.prototype.goProfile = function() {
  //console.log(userEmail);
  //console.log("Food array: " + ref.child('ID/' + id + '/Food'));
  ref.child('Email/' + userEmail).once('value', function(snapshot){ 
    //userEmail = userEmail.replace('.', ',');
    //console.log("userEmail: " + userEmail);
    //var email = snapshot.child(userEmail);
    //console.log("snap val is" + snapshot.val());
    //var snap = snapshot.child('id');
    //console.log("id: " + id);
    //console.log("snap key: " + snap.val());
    var obj = "";  
    obj = party4life.prototype.makeDisplay(snapshot.val(), obj) + '\n';
    $('pre').text(obj.toString());
  })
  document.getElementById("textHead").innerHTML = "Profile";
  document.getElementById("pre").style.display="block";
}

party4life.prototype.SearchButton = function() {
  this.searchDisplay.removeAttribute('hidden');
  var searchInput = document.getElementById('searchText');
  searchInput.value = searchInput.value.replace(' ', '_');
  var obj = "";

  ref.on('child_added', function(snapshot){
    var searchResult = snapshot.child(searchInput.value);
    if(searchResult.val() != null) {
      searchResult.forEach(function(snap){
        obj = party4life.prototype.makeDisplay(snap.val(), obj) + '\n';
      }) 
    }
    $('pre').text(obj.toString());
    //console.log(obj);
  })
  document.getElementById("textHead").innerHTML = "Search Result";
  document.getElementById("pre").style.display = "block";
}

party4life.prototype.makeDisplay = function(id, obj) {
  ref.child('ID/'+ id).on('value', function(snapshot){
    //console.log("snapshoppy: " + JSON.stringify(snapshot.child("Food").val()));
    snapshot.forEach(function(snap){
      //console.log(snap.key() + ": " + snap.val());
      var content = snap.val();
      if(snap.key() === "Email") {
        content[0] = content[0].replace(',','.');
      }
      //console.log("snappy: " + snap.val());
      obj = obj + snap.key() + ": " + content + '\n';
    })
  })
  return obj;
};

/*
party4life.prototype.SearchButton = function(){
  var ref = new Firebase("https://party4life-45452.firebaseio.com/");
  ref.orderByChild("height").on("child_added", function(snapshot) {
    console.log(snapshot.key() + " was " + snapshot.val().height + " meters tall");
  });    
};
*/
party4life.prototype.checkSetup = function(){
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
      'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
      'actually a Firebase bug that occurs rarely.' +
      'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
      'and make sure the storageBucket attribute is not empty.');
  }
};
window.onload = function(){
    window.party = new party4life();
};