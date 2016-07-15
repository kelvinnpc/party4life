// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

.factory('Auth', function($firebaseAuth) {
    var endPoint = <YOUR_FIREBASE_URL> ; //Kelvin add your firebase URL here
    var usersRef = new Firebase(endPoint);
    return $firebaseAuth(usersRef);
})

.controller('AppCtrl', function($scope, Auth) { //This will attempt to sign in using redirect if it fails it will use popups as not all OS supports redirects
  $scope.login = function(authMethod) {
    Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
    }).catch(function(error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
        });
      } else {
        console.log(error);
      }
    });
  };
})

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

Auth.$onAuth(function(authData) { //I'm not sure if this function need to write the party4life.prototype.... 
    if (authData === null) {
      console.log('Not logged in yet');
    } else {
      console.log('Logged in as', authData.uid);
    }
    // This will display the user's name in our view
    $scope.authData = authData;
});

var ref = new Firebase("https://party4life-45452.firebaseio.com/");
function party4life(){
  this.checkSetup();

  this.search = document.getElementById('search');
  
  this.search.addEventListener('click', this.SearchButton.bind(this));
  //this.searchInput.addEventListener('input', this.updateSearchInput.bind(this));

  this.initFirebase();
}

party4life.prototype.initFirebase = function(){
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  //this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};
/*
party4life.prototype.updateSearchInput = function() {

}
*/
party4life.prototype.SearchButton = function() {
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
    console.log(obj);
  })
};
/*
party4life.prototype.show = function(snap) {
  var obj = snap.val();
  $('pre').text(obj ? JSON.stringify(obj, null, 2) : 'not found');
}
*/
party4life.prototype.makeDisplay = function(id, obj) {
  ref.child('ID/'+ id).on('value', function(snapshot){
    snapshot.forEach(function(snap){
      //console.log(snap.key() + ": " + snap.val());
      obj = obj + snap.key() + ": " + snap.val() + '\n';
    })
    
    //console.log("Test 1");
    /*console.log("snap: " + snapshot.key());
    //console.log("id: " + id);
    if(snapshot.key() === id.toString()){
      var name = snapshot.child(Name).val();
      console.log("Name: " + name);
      snapshot.Food.forEach(function(snap){
        var food = snap.val();
        console.log("Food: " + food);
      })
    }*/
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