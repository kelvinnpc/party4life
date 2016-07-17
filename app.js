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

function party4life(){
  this.checkSetup();

  this.search = document.getElementById('search');
  //new stuff start
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  //new stuff end

  this.search.addEventListener('click', this.SearchButton.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));//new
  this.signInButton.addEventListener('click', this.signIn.bind(this));//new
  //this.searchInput.addEventListener('input', this.updateSearchInput.bind(this));

  this.initFirebase();
}

//new stuff start
// Signs-in Friendly Chat.
party4life.prototype.signIn = function(googleUser) {
  // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
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
    var profilePicUrl = user.photoURL;   // TODO(DEVELOPER): Get profile pic.
    var userName = user.displayName;        // TODO(DEVELOPER): Get user's name.

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

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
};
/*
party4life.prototype.updateSearchInput = function() {
}
*/
party4life.prototype.SearchButton = function() {
  var searchInput = document.getElementById('searchText');
  searchInput.value = searchInput.value.replace(' ', '_');

  var ref = new Firebase("https://party4life-45452.firebaseio.com/");
  ref.on('child_added', function(snapshot){
    var test = snapshot.child(searchInput.value);
    if(test.val() != null) {
      test.forEach(function(snap){
        console.log("ID: " + snap.val());
      })
    }
    /*if(searchInput.value === searchResult.provider){
      console.log("Provider: " + searchResult.provider);
      console.log("Items: " + searchResult.items);
    }*/
  })
}
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