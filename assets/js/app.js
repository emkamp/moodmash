$(document).ready(function() {

// Global variables
  //=====================================================
  var topics = ["worked up", "puzzled", "exhausted", "determined", "political", "possessed", "touchy", "furstrated", "blissful", "dreamy", ];
  var widgetWidth = 300;
  var widgetHeight = 380;
  var widgetUrl = "https://embed.spotify.com/?uri=spotify:user:";
  var artists = []; //NOTE--this creates an empty array that populates with each mood click.  I'm not sure what our

  //end plan is for selection/displaying the actual B.I.T. info so creating this as one option

  // Functions
  //===============================================

  // Function for displaying topic buttons
  function renderButtons() {
      $("#item-buttons").empty();
      //loop for adding buttons modeled after in class example on movie topics
      for (var i = 0; i < topics.length; i++) {
          var a = $("<button>");
          a.addClass("topic-item");
          a.attr("data-name", topics[i]);
          a.text(topics[i]);
          $("#item-buttons").append(a);
      }
  }; //end of renderButtons function

  // Function to add new topic button
  /*
  $("#add-item").on("click", function(event) {
      event.preventDefault();
      var newTopic = $("#search-input").val().trim();
      $("#search-input").val("");
      // if statement to prevent duplicate items from being added
      if (topics.indexOf(newTopic) === -1) {
          topics.push(newTopic);
          renderButtons();
      } else {
          return
      }
  });
  */

  // onclick function to get still gifs
  $("#item-buttons").on("click", ".topic-item", function() {
      $("#playlist-items").empty();
      artists = [];
      topic = $(this).attr("data-name");
      var listArr = []
          // leaving this as playlist instead of artist because jason got the spotify authorization
      var queryUrl = "https://api.spotify.com/v1/search?q=" + topic + "&type=playlist";

      $.ajax({
          url: queryUrl,
          //headers: { "Authorization": "Bearer " + "BQBVgnFxqm_8fUIR3uRjY5KZTL85HDbuM34jCM8_Sr7W51L8DphLMCNP76c4h_z294Tez3Iz6OerYYbxigMOBDRcOhS5arxkXjxm7j8xEtKrEiMFjHQMPL7GmvBP__JwLyoIuouUD6_0o66TvAb1Upkt7tV4HCwL-C9k"},
          method: "GET"
      }).done(function(response) {

          results = response.playlists.items;
          console.log(results);

          /*
          for (var i = 0; i < results.length; i++) {
              playlistDiv = $("<div>")
              pName = $("<p>");
              pName.text("Playlist Name: " + results[i].name);
              pHref = $("<p>");
              pHref.text("External Href from Object: " + results[i].external_urls.spotify)
              playlistDiv.append(pName);
              playlistDiv.append(pHref);
              playlistDiv.addClass("playlistDiv");
              $("#playlist-items").append(playlistDiv);
          } // end of for loop
          */

          var listMin = 0;
          var listMax = results.length;

          function pickList(min, max) {
              var i = parseInt(Math.random() * (max - min) + min);
              var currentListName = results[i].name;
              var currentListID = results[i].id;
              var currentListUser = results[i].uri;
              var currentListUserId = currentListUser.match("user:(.*):playlist");
              console.log("PLAYLIST INFO  //  random list: " + i + ", name: " + currentListName + ", id: " + currentListID);
              console.log("PLAYLIST OWNER INFO  //  currentListUser: " + currentListUser + ", currentListUserId: " + currentListUserId[1]);

              $("#playlist-items").append(currentListName);

              // build this: <iframe src="" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
              var widget = $("<iframe>");
              widget.attr({
                  "width": widgetWidth, // see global variables
                  "height": widgetHeight, // see global variables
                  "frameborder": 0,
                  "allowtransparency": "true",
                  "src": widgetUrl + currentListUserId[1] + ":playlist:" + currentListID // build url
              });
              console.log(widget);
              $("#widget-container").html(widget);
          }

          pickList(listMin, listMax); // select a playlist at random from the search results

          // modify this to get artist info from playlist instead of track
          // clicking an item will send artist to BIT and return show data
          // later, we will remove the click function and have this happen automatically when a new track starts.
          /*
          for (var i = 0; i < results.length; i++) {
              playlistDiv = $("<div>")
              playlistDiv.addClass("well well-sm")
              pName = $("<p>");
              pName.text("Track Name: " + results[i].name);
              //pushing artists to the artist array, but building in index test to prevent duplicates
              if (artists.indexOf(results[i].artists[0].name) === -1) {
                  artists.push(results[i].artists[0].name)
              };
              pArtist = $("<p>");
              pArtist.text(results[i].artists[0].name);
              pArtist.addClass("artist-name");
              pArtist.attr("data-name", results[i].artists[0].name)
              playlistDiv.append(pName);
              playlistDiv.append(pArtist);
              playlistDiv.addClass("playlistDiv");
              $("#playlist-items").append(playlistDiv);
          } // end of for loop
          */

      }); // end of done function response
  }); // end of topicItem on click function

  // See note in global variables section regarding array.  Not sure what our design plan is for displaying the event info.
  // For now, to get our "proof of concept", I am just using an onclick event below for each artist name to pull from B.I.T.
  $("#playlist-items").on("click", ".artist-name", function() {
          var artistName = $(this).attr("data-name");
          $("#artist-events").empty();
          console.log(artistName)

          var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=MoodMash"; // to add date range format is "&date=2017-03-01,2017-12-31";
          $.ajax({
                  url: queryUrl,
                  method: "GET"
              }).done(function(response) {
                  eventListings = response;
                  console.log(eventListings);

                  for (var i = 0; i < eventListings.length; i++) {
                      var convertedDate = moment(eventListings[i].datetime).format("MM/DD/YY" + ", " + "hh:mm");
                      eventDiv = $("<div>");
                      eventDiv.addClass("well well-sm");
                      pDate = $("<p>");
                      pVenue = $("<p>");
                      pCity = $("<p>");
                      pCoordinates = $("<p>");
                      pDate.text(convertedDate);
                      pVenue.text(eventListings[i].venue.name);
                      pCity.text(eventListings[i].venue.city + ", " + eventListings[i].venue.region);
                      pCoordinates.text(eventListings[i].venue.latitude + " ,  " + eventListings[i].venue.longitude);
                      eventDiv.append(pDate, pVenue, pCity, pCoordinates);
                      $("#artist-events").append(eventDiv);
                  } // end of for loop
              }) // end of done function
      }) // end of onclick for getArtistEvents

  // Main process to render initial buttons
  //===============================================
  renderButtons();

  // Kwaku's stuff
  //=================================================
  $("#app-login").hide();
  $("#app-main").hide();

  $("#returning-user").on("click", function() {
      $("#app-intro").hide();
      $("#app-login").show();
      $("#new-log-in").hide();
  });

  $("#new-user").on("click", function() {
      $("#app-intro").hide();
      $("#app-login").show();
      $("#exist-log-in").hide();
  });


  $("#check-user").on("click", function() {
      $("#app-login").hide();
      $("#app-main").show();
      console.log("working");
  });


  $("#add-new-user").on("click", function() {
      $("#app-login").hide();
      $("#app-main").show();
      console.log("working");
  });

  //background colors
  $(window).scroll(function() {
      var previousScroll = 0;
      var currentScroll = $(this).scrollTop();
      if (currentScroll > previousScroll) {
          $("body").style.backgroundColor = "PapayaWhip";
      } else {
          $("body").style.backgroundColor = "LightYellow";
      }
      previousScroll = currentScroll;
  });

  // Initialize Firebase
  // temporarily disabled for bad key
  /*
  var config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      storageBucket: ""
  };
  firebase.initializeApp(config);
  // Create a variable to reference the database
  var database = firebase.database();
  // Initial Values
  // var user = "";
  database.ref().on("value", function(snapshot) {
      //RETURNING USERS
      $("#check-user").on("click", function(event) {
          event.preventDefault();
          var userId = $("#user-name-input").val().trim();
          //do we need to store to check if exists? and delete the repeat If so?
          //In that case:
          // database.ref().set({
          //      user-id: user-id,
          //    });
          if (snapshot.child("user-id").exists()) {
              //delete recent addition
              //show span of "welcome Back"
              //trigger function to change html to show mood icons and home page.
              //load user information with stored zipcode
          } else {
              //delete recent addition
              //show span above input "We did not recognize this name"
          }
      });
  });
*/

  //NEW USERS
  $("#add-new-user").on("click", function(event) {
      event.preventDefault();
      var userId = $("#user-name-input2").val().trim();
      var userZip = $("#zip-code").val().trim();
      database.ref().set({
          userInfo: userId,
          userZip
      });
      //trigger function to change html to show mood icons and home page.
      //end of firebase on value
  });




//KEEP THIS CODE to MERGE
/*         $.ajax({
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
    */

//THIS FUNCTION GRABS INFO FROM RETURNED LISTING
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

//THIS GETS THE ACCESS TOKEN DURING SESSION
function getTokenFromServer() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
  q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

//RENDER TOKEN
var token = getTokenFromServer();
var access_token = token.access_token;
console.log(token);

//firebased god
  var config = {
    apiKey: "AIzaSyCJWSKJq1r2_Fyu9hk8NdNFXWV1PAmgLXU",
    authDomain: "mood-mash-userbase.firebaseapp.com",
    databaseURL: "https://mood-mash-userbase.firebaseio.com",
    storageBucket: "mood-mash-userbase.appspot.com",
    messagingSenderId: "1081624019575"
  };

$('#playlistItems').on('click', '.playlistDiv', grabPlaylist);



//MAIN PAGE TWO


    $("#moodDiv").hide();

    //Gradient

    var colors = new Array(

        [255, 228, 181], [238, 130, 238], [210, 105, 30], [25, 25, 112], [255, 228, 77], [95, 158, 160], [124, 252, 0], [191, 191, 191], [0, 0, 0], [255, 182, 193], [75, 0, 130], [255, 0, 0]);

    var step = 0;
    //color table indices for:
    // current color left
    // next color left
    // current color right
    // next color right
    var colorIndices = [0, 1, 2, 3];

    //transition speed
    var gradientSpeed = 0.0015;

    function updateGradient() {

        if ($ === undefined) return;

        var c0_0 = colors[colorIndices[0]];
        var c0_1 = colors[colorIndices[1]];
        var c1_0 = colors[colorIndices[2]];
        var c1_1 = colors[colorIndices[3]];

        var istep = 1 - step;
        var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
        var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
        var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
        var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

        var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
        var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
        var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
        var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

        $('#gradient').css({
            background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
        }).css({
            background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
        });

        step += gradientSpeed;
        if (step >= 1) {
            step %= 1;
            colorIndices[0] = colorIndices[1];
            colorIndices[2] = colorIndices[3];

            //pick two new target color indices
            //do not pick the same as the current one
            colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
            colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;

        }
    }

    setInterval(updateGradient, 10);

    //END OF GRADIENT



    $(".btn-warning").on("click", function() {
        $("#emotions").effect("clip", 300, callback);
        $("#moodDiv").delay(1250).show("clip", 505);

        function callback() {

            setTimeout(function() {

                $("#emotions").removeAttr("style").hide().fadeIn();
            }, 1000);
        };



        $("html,body").delay(500).animate({ scrollTop: $("#page2").offset().top }, 1400);
        $("#moodDiv").empty();
        $("#moodDiv").append(this.getAttribute("data-emo"));

        switch (this.getAttribute("data-emo")) {


            case "Puzzled":
            case "Overwhelmed":
            case "Frustrated":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/16/18/58/texture-2072133_960_720.png')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/16/18/34/desktop-2072063_960_720.png')");
                $("#playerLayer").css("backgroundColor", "SandyBrown");
                $("#suggestionsLayer").css("backgroundColor", "midnightBlue");
                $("#suggestions").css("borderColor","#330000");
                $("#player").css("borderColor","##330000");
                $("#page2").css("backgroundColor", "#4d0000");
                console.log("working");


                break;


            case "Touchy":
            case "Worked Up":
            case "Hangry":


                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/23/18/54/sun-2092921__340.png')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/12/26/13/16/backgrounds-1932050__340.jpg')");
                $("#playerLayer").css("backgroundColor", "Thistle");
                $("#suggestionsLayer").css("backgroundColor", "Thistle");
                $("#playerLayer").css("borderColor", "black");
                $("#suggestionsLayer").css("borderColor", "black");
                $("#page2").css("backgroundColor", "#f2c6a6");

                console.log("working");


                console.log("working");

                break;


            case "Determined":
            case "Productive":
            case "Studious":
            case "Accomplished":

                console.log("working!!");
                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/22/23/49/bright-1851267__340.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/23/13/46/abstract-1852931__340.jpg')");
                $("#page2").css("backgroundColor", "beige");
                break;


            case "Zen":
            case "Uplifted":
            case "Dreamy":
                console.log("working");

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/12/17/19/05/background-1914145_960_720.jpg')");
                $("#playerLayer").css("backgroundColor", "Violet");
                $("#suggestionsLayer").css("backgroundColor", "YellowGreen");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/29/04/42/color-1867371_960_720.jpg')");
                $("#page2").css("backgroundColor", "#d1e0b8");
                break;

            case "Morose":
            case "Emo":

                console.log("working");

                break;

            case "Sleepy":
            case "Exhausted":
            case "Washed":
            case "Lazy":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/12/26/09/41/bokeh-1931727_960_720.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/09/13/24/background-2051998__340.jpg')");
                $("#suggestionsLayer").css("backgroundColor", "PowderBlue");
                $("#suggestionsLayer").css("borderColor", "SlateGray");
                $("#playerLayer").css("backgroundColor", "SkyBlue");
                $("#playerLayer").css("borderColor", "SlateGray");
                $("#page2").css("backgroundColor", "#eafbfb");
                console.log("working!");
                break;

            case "Frisky":
            case "Seductive":


                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/12/02/12/fractal-2136278__340.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/12/02/12/fractal-2136278__340.jpg')");
                $("#playerLayer").css("backgroundColor", "SaddleBrown");
                $("#suggestionsLayer").css("backgroundColor", "SaddleBrown");
                $("#page2").css("backgroundColor", "#5a2d0c");
                $("#suggestionsLayer").css("borderColor", "#2d1606");
                $("#playerLayer").css("borderColor", "#2d1606");
                $("#suggestions").css("borderColor", "#160b03");
                $("#player").css("borderColor", "#160b03");

                console.log("working");

                break;

            case "Blissful":
            case "Jubilant":
            case "Playful":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2012/03/02/11/06/abstract-21118__340.jpg')");
                // $("#playerLayer").css("backgroundColor", "lightGray");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/06/10/05/wood-1802625__340.jpg')");
                $("#page2").css("backgroundColor", "#fff4b3");
                console.log("working");

                break;

            case "Political":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/01/16/43/fabric-2109038__340.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/01/16/43/fabric-2109038__340.jpg')");
                $("#page2").css("backgroundColor", "lightGray");
                console.log("working");

                break;

            case "Possessed":

                console.log("working");

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/26/00/24/colorful-2099189_960_720.png')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/26/00/24/colorful-2099189_960_720.png'");
                $("#playerLayer").css("backgroundColor", "lightGray");
                $("#suggestionsLayer").css("backgroundColor", "lightGray");
                $("#playerLayer").css("borderColor", "black");
                $("#suggestionsLayer").css("borderColor", "black");
                $("#page2").css("backgroundColor", "beige");


                break;

            case "Lit":

                console.log("working");

                break;

            case "Swole":
            case "Pumped":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/05/16/15/38/texture-1395979__340.jpg')");
                $("#playerLayer").css("backgroundColor", "peru");
                $("#suggestionsLayer").css("backgroundColor", "lightGray");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2015/06/30/21/06/grid-826831__340.jpg')");
                $("#page2").css("backgroundColor", "beige");
                console.log("working");

                break;




        };

    });






    $(".btn-primary").on("click", function() {

        $("html,body").animate({ scrollTop: $("#welcome").offset().top }, 500);
        $("#moodDiv").hide();



    });
























//end of ducment.ready

});
