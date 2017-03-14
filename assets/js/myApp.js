//GET https://accounts.spotify.com/authorize
// GET https://accounts.spotify.com/authorize/?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09
// var client_id = 'e47bbc49931e47c9b58e0418a2d7f472';
// var client_secret = '3e6111715f0a44eb871a290db9f148bf';
// var redirect_uri = 'http://localhost:9000';

// log token to console for lazy fun
// request.get(options, function(error, response, body) {
// console.log(body);
// });

//Global variables =====================================================
var topics=["happy", "sad", "chilled out", "angry"];
var userInfo = false;
var zip = '';

//Functions===============================================

// Function for displaying topic buttons
    function renderButtons() {
        $("#itemButtons").empty();
		//loop for adding buttons modeled after in class example on movie topics
        for (var i = 0; i < topics.length; i++) {
          var a = $("<button>");
          a.addClass("topicItem");
          a.attr("data-name", topics[i]);
          a.text(topics[i]);
          $("#itemButtons").append(a);
        }
     }; //end of renderButtons function

// Function to add new topic button
    $("#addItem").on("click", function(event) {

        event.preventDefault();
        var newTopic = $("#search-input").val().trim();
        $("#search-input").val("");
        //if statement to prevent duplicate items from being added
        if (topics.indexOf(newTopic)=== -1) {
        topics.push(newTopic);
        renderButtons();
    	} else {return}
      });

//onclick function to get still gifs
    $("#itemButtons").on("click", ".topicItem", function() {
      $("#playlistItems").empty();
      topic = $(this).attr("data-name");

      var queryUrl="https://api.spotify.com/v1/search?q=" + topic +"&type=playlist" ;



         $.ajax({
          url: queryUrl,
          // headers: { "Authorization": "Bearer " + "BQBVgnFxqm_8fUIR3uRjY5KZTL85HDbuM34jCM8_Sr7W51L8DphLMCNP76c4h_z294Tez3Iz6OerYYbxigMOBDRcOhS5arxkXjxm7j8xEtKrEiMFjHQMPL7GmvBP__JwLyoIuouUD6_0o66TvAb1Upkt7tV4HCwL-C9k"},
          method: "GET"
          }).done(function(response) {

           results=response.playlists.items;

           console.log(results);

            for (var i=0; i<results.length; i++) {
              playlistDiv=$("<div>");
              $(playlistDiv).attr('data-href',results[i].tracks.href);
              pName=$("<p>");
              pName.text("Playlist Name: " + results[i].name);
              pHref=$("<p>");
              pHref.text("External Href from Object: " + results[i].external_urls)

              playlistDiv.append(pName);
              playlistDiv.append(pHref);

              playlistDiv.addClass("playlistDiv");
              $("#playlistItems").append(playlistDiv);
            } // end of for loop
          });  // end of done function response
    }); // end of topicItem on click function

    //GET https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks
function grabPlaylist(e) {
  e.preventDefault();
  var playlistUrl = $(this).attr('data-href');
  $.ajax({

  url: playlistUrl,
  headers: { "Authorization": "Bearer " + access_token},
   method: "GET"
   }).done(function(response) {
     console.log(response);
     for (i=0; i<response.items.length; i++) {
     console.log('Artist: ' + response.items[i].track.artists[0].name);
     console.log('Song: ' + response.items[i].track.name);
   }
  });
}

function getTokenFromServer() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
  q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

//Main process to render initial buttons===============================================
renderButtons();
var token = getTokenFromServer();
var access_token = token.access_token;
console.log(token);

//firebased god
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCJWSKJq1r2_Fyu9hk8NdNFXWV1PAmgLXU",
    authDomain: "mood-mash-userbase.firebaseapp.com",
    databaseURL: "https://mood-mash-userbase.firebaseio.com",
    storageBucket: "mood-mash-userbase.appspot.com",
    messagingSenderId: "1081624019575"
  };

firebase.initializeApp(config);
var database = firebase.database();

function grabZip() {
  //this function should run on page refresh!
  //1. Check if user exists in firebase
  // database.ref().on('value', function(snapshot) {
  //   if(snapshot.child('user').exists()) {
  //         userInfo = true;
  //         database.ref().off();
  //     }
  //   else {
  //       return;
  //   }
  //   }, function(errorObject) {
  //     // In case of error this will print the error
  //     console.log("The read failed: " + errorObject.code);
  //   });
    //2. If user exists in firebase ... check to see if they have an access token (HINT: they won't have one unless they are logged into spotify)
  if (jQuery.isEmptyObject(token) /*&& userInfo === true*/) {
    //you are NOT logged in!
    return;
  }
  else {
    //launch the ZIP code finder
    $(window).load(function(){
      $('.grab-info').addClass('activate');
    });
  }
}

function storeZip(e) {
  e.preventDefault();
  zip = $('#zip').val().trim();
  database.ref().set({
    userZip: zip
  });
  console.log(zip);
  $('.grab-info').removeClass('activate');
}

database.ref().on("value", function(snapshot) {
  // Then we console.log the value of snapshot
  console.log(snapshot.val());

  // Then update the clickCounter variable with data from the database.
  // clickCounter = snapshot.val().clickCount;

// If there is an error that Firebase runs into -- it will be stored in the "errorObject"
// Again we could have named errorObject anything we wanted.
}, function(errorObject) {

  // In case of error this will print the error
  console.log("The read failed: " + errorObject.code);
});


$('#playlistItems').on('click', '.playlistDiv', grabPlaylist);
$('.add-zip').on('click', storeZip);
grabZip();
console.log(zip);
