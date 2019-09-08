
// var access_token;
var trackIDs = [];
var trackNames = [];
var artistNames = [];
var trackURIs = [];
var albumObjs = [];
var albumArts = [];

var trackDance = [];
var trackEnergy = [];
var trackMood = [];
var trackTempo = [];


var artistImg = [];

var counter = 0;

var chill=[];
var party=[];
var happy=[];
var sad=[];
var angry=[];

var length;

var access_token;

var deferredArr=[];

var alltracks;

var customCount = 0;

//-------------------------------------------------------------------------------

var saduri = "";
var happyuri = "";
var aggressiveuri = "";
var chilluri = "";
var partyuri = "";


var sadcounter = 0;
var happycounter = 0;
var aggressivecounter = 0;
var chillcounter = 0;
var partycounter = 0;

var sadJsonData = {
    "name": "Sad songs - moooodify",
    "description": "Your favourite melancholy tracks generated on moooodify.com"
};
  


//----------------------------------------------------------------------

$(document).ready(function() { 

    access_token = localStorage.getItem('access_token');;
    console.log(access_token);
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?limit=50',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            console.log(response);
            console.log("response aaya");
            console.log("bheja");
            length = response.total;
            counter = response.total;
            getTrackIDs(response);
            getAlbumArt();

        }
    })

});

function getTrackIDs(musicList){

    for(i=0;i<length;i++){
        trackIDs[i] = musicList.items[i].id;
        trackNames[i] = musicList.items[i].name;
        artistNames[i] = musicList.items[i].artists[0].name;
        trackURIs[i] = musicList.items[i].uri;
        albumObjs[i] = musicList.items[i].album.id;
    }
    getAlbumArt(i);
    requestTrackInfo(trackIDs);

}

function getAlbumArt(){

    for(i=0;i<length;i++){
       console.log("album obj: " + albumObjs[i]);
        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + encodeURIComponent(albumObjs[i]),
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            ajaxI: i,
            success: function(response) {
                console.log(response);
                i = this.ajaxI;
                storeImages(response, i);
            }
        })
    }
}

function storeImages(response, i){
        albumArts[i] = response.images[0].url;
}

function requestTrackInfo(trackIDs){
   
    for(index=0;index<length;index++){
        
        var uri = trackIDs[index];
        deferredArr.push(
        $.ajax({
            url: 'https://api.spotify.com/v1/audio-features/'+encodeURIComponent(uri),
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            ajaxI: index,
            success: function(response) {
                console.log(response);
                index = this.ajaxI;
                // console.log("tracks se response aaya");
                // console.log(index);
                setTrackInfo(response, index);

            },
            })
        )
    }

    $.when.apply($,deferredArr).done(function() {
        calculateCategory();
    });
    
}

function setTrackInfo(track, x){

        trackDance[x] = track.danceability;
        trackEnergy[x] = track.energy;
        trackMood[x] = track.valence;
        trackTempo[x] = track.tempo;
        console.log(x);
        console.log(trackMood[x]);
}


function calculateCategory(){
  
         console.log("entered calculation");

    for(i=0;i<length;i++){  

 
        if(trackMood[i] < 0.3 && trackEnergy[i]<0.6) { console.log("adding to sad"); addToSad(i); saduri += String(trackURIs[i]); saduri += "," }
        if(trackMood[i] > 0.65) { console.log("adding to happy"); addToHappy(i);  happyuri += String(trackURIs[i]);  happyuri += "," }
        if(trackEnergy[i] > 0.8) {  console.log("adding to aggr"); addToAggressive(i);  aggressiveuri += String(trackURIs[i]);  aggressiveuri += "," }
        if(trackMood[i] > 0.3 && trackDance[i]>0.75) {  console.log("adding to party"); addToParty(i); partyuri += String(trackURIs[i]);  partyuri += "," }
        if(trackEnergy[i] < 0.4 && trackMood[i] > 0.3) {  console.log("adding to chill"); addToChill(i); chilluri += String(trackURIs[i]);  chilluri += "," }

    }
}

function getCustomTracks(){
  console.log("fetching custom tracks");
  hideCustomButton();
  var moodVal = document.getElementById("mood-slider").value; 
  moodVal = moodVal/100;
  var danceVal = document.getElementById("dance-slider").value; 
  danceVal = danceVal/100;
  var energyVal = document.getElementById("energy-slider").value;
  energyVal = energyVal/100;
  console.log(moodVal, danceVal, energyVal);
  
  customCount = 0;
  var customTracks = [];
  var customuri = "";
  emptyCustomList();

  for(i=0;i<length;i++){  
    
    if((trackMood[i] <= moodVal + 0.25) && (trackMood[i] >= moodVal - 0.25) && (trackDance[i] <= danceVal + 0.25) && (trackDance[i] >= danceVal -0.25) && (trackEnergy[i] <= energyVal + 0.25) && (trackMood[i] >= energyVal - 0.25) ){
      
      customuri += String(trackURIs[i]); customuri += ",";  addToCustom(i); customCount++;

    }
  }


}

function emptyCustomList(){
  const myNode = document.getElementById("track-list-custom");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
}
}

function addToCustom(i){
  var referenceNode = document.querySelector('#track-list-custom');

  var imgNode = document.createElement('div');
  imgNode.className = "album-art";

  var album_img = document.createElement('img');
  album_img.src = albumArts[i];

  imgNode.appendChild(album_img);

  var trackNode = document.createElement('div');
  trackNode.className = "track";


  var newNode = document.createElement('div');
  newNode.className = "track-description";
  
  var trackname = document.createElement('div');
  trackname.innerHTML = trackNames[i];
  trackname.className = "track-name";

  var artistname = document.createElement('div');
  artistname.innerHTML = artistNames[i];
  artistname.className = "artist-name";

  newNode.appendChild(trackname);
  newNode.appendChild(artistname);

  trackNode.appendChild(imgNode);
  trackNode.appendChild(newNode);

  referenceNode.appendChild(trackNode);

  // hideCustomEmptyState();
  showCustomButton();
}


function addToSad(i){
    
    var referenceNode = document.querySelector('#track-list-sad');

    var imgNode = document.createElement('div');
    imgNode.className = "album-art";

    var album_img = document.createElement('img');
    album_img.src = albumArts[i];

    imgNode.appendChild(album_img);

    var trackNode = document.createElement('div');
    trackNode.className = "track";


    var newNode = document.createElement('div');
    newNode.className = "track-description";
    
    var trackname = document.createElement('div');
    trackname.innerHTML = trackNames[i];
    trackname.className = "track-name";

    var artistname = document.createElement('div');
    artistname.innerHTML = artistNames[i];
    artistname.className = "artist-name";

    newNode.appendChild(trackname);
    newNode.appendChild(artistname);

    trackNode.appendChild(imgNode);
    trackNode.appendChild(newNode);

    referenceNode.appendChild(trackNode);

    hideSadEmptyState();
}


function addToHappy(i){
    
    var referenceNode = document.querySelector('#track-list-happy');

    var imgNode = document.createElement('div');
    imgNode.className = "album-art";

    var album_img = document.createElement('img');
    album_img.src = albumArts[i];

    imgNode.appendChild(album_img);

    var trackNode = document.createElement('div');
    trackNode.className = "track";


    var newNode = document.createElement('div');
    newNode.className = "track-description";
    
    var trackname = document.createElement('div');
    trackname.innerHTML = trackNames[i];
    trackname.className = "track-name";

    var artistname = document.createElement('div');
    artistname.innerHTML = artistNames[i];
    artistname.className = "artist-name";

    newNode.appendChild(trackname);
    newNode.appendChild(artistname);

    trackNode.appendChild(imgNode);
    trackNode.appendChild(newNode);

    referenceNode.appendChild(trackNode);

    hideHappyEmptyState();
}

function addToParty(i){
    
    var referenceNode = document.querySelector('#track-list-party');

    var imgNode = document.createElement('div');
    imgNode.className = "album-art";

    var album_img = document.createElement('img');
    album_img.src = albumArts[i];

    imgNode.appendChild(album_img);

    var trackNode = document.createElement('div');
    trackNode.className = "track";


    var newNode = document.createElement('div');
    newNode.className = "track-description";
    
    var trackname = document.createElement('div');
    trackname.innerHTML = trackNames[i];
    trackname.className = "track-name";

    var artistname = document.createElement('div');
    artistname.innerHTML = artistNames[i];
    artistname.className = "artist-name";

    newNode.appendChild(trackname);
    newNode.appendChild(artistname);

    trackNode.appendChild(imgNode);
    trackNode.appendChild(newNode);

    referenceNode.appendChild(trackNode);

    hidePartyEmptyStates();
}


function addToChill(i){
    
    var referenceNode = document.querySelector('#track-list-chill');

    var imgNode = document.createElement('div');
    imgNode.className = "album-art";

    var album_img = document.createElement('img');
    album_img.src = albumArts[i];

    imgNode.appendChild(album_img);

    var trackNode = document.createElement('div');
    trackNode.className = "track";


    var newNode = document.createElement('div');
    newNode.className = "track-description";
    
    var trackname = document.createElement('div');
    trackname.innerHTML = trackNames[i];
    trackname.className = "track-name";

    var artistname = document.createElement('div');
    artistname.innerHTML = artistNames[i];
    artistname.className = "artist-name";

    newNode.appendChild(trackname);
    newNode.appendChild(artistname);

    trackNode.appendChild(imgNode);
    trackNode.appendChild(newNode);

    referenceNode.appendChild(trackNode);

    hideChillEmptyStates();
}


function addToAggressive(i){
    
    var referenceNode = document.querySelector('#track-list-aggressive');

    var imgNode = document.createElement('div');
    imgNode.className = "album-art";

    var album_img = document.createElement('img');
    album_img.src = albumArts[i];

    imgNode.appendChild(album_img);

    var trackNode = document.createElement('div');
    trackNode.className = "track";


    var newNode = document.createElement('div');
    newNode.className = "track-description";
    
    var trackname = document.createElement('div');
    trackname.innerHTML = trackNames[i];
    trackname.className = "track-name";

    var artistname = document.createElement('div');
    artistname.innerHTML = artistNames[i];
    artistname.className = "artist-name";

    newNode.appendChild(trackname);
    newNode.appendChild(artistname);

    trackNode.appendChild(imgNode);
    trackNode.appendChild(newNode);

    referenceNode.appendChild(trackNode);

    hideAggressiveEmptyState();

    
}



// ---------------------------------------------------------------------


function getuserIDCustom(){
    
  $.ajax({
      url: 'https://api.spotify.com/v1/me/',
      headers: {
          'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
          createPlaylistCustom(response);

      }
  })

}

function getuserIDSad(){
    
    $.ajax({
        url: 'https://api.spotify.com/v1/me/',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            createPlaylistSad(response);

        }
    })

}

function getuserIDHappy(){
    
    $.ajax({
        url: 'https://api.spotify.com/v1/me/',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            createPlaylistHappy(response);

        }
    })

}

function getuserIDAggressive(){
    
    $.ajax({
        url: 'https://api.spotify.com/v1/me/',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            createPlaylistAggressive(response);

        }
    })

}

function getuserIDChill(){
    
    $.ajax({
        url: 'https://api.spotify.com/v1/me/',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            createPlaylistChill(response);

        }
    })

}

function getuserIDParty(){
    
    $.ajax({
        url: 'https://api.spotify.com/v1/me/',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            createPlaylistParty(response);

        }
    })

}


// ---------------------------------------------------------------------


function createPlaylistCustom(user){
   
  $.ajax({
      type: 'POST',
      url: 'https://api.spotify.com/v1/users/' + encodeURIComponent(user.id) + '/playlists',
      data: JSON.stringify({
           "name": "custom mood - moooodify",
          "description": "Tracks that suit your mood, generated on moooodify.com"

       }),
      headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
      },
      success: function(result) {
        console.log('Woo! :)');
        addCustomTracks(result);
        
      },
      error: function() {
        console.log('Error! :(');
      }
    })
}




function createPlaylistSad(user){
   
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/users/' + encodeURIComponent(user.id) + '/playlists',
        data: JSON.stringify({
             "name": "downers - moooodify",
            "description": "Your favourite melancholy tracks generated on moooodify.com"

         }),
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          addSadTracks(result);
          
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function createPlaylistHappy(user){
   
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/users/' + encodeURIComponent(user.id) + '/playlists',
        data: JSON.stringify({
             "name": "uplifting - moooodify",
            "description": "Your favourite uplifting tracks generated on moooodify.com"

         }),
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          addHappyTracks(result);
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function createPlaylistAggressive(user){
   
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/users/' + encodeURIComponent(user.id) + '/playlists',
        data: JSON.stringify({
             "name": "high energy - moooodify",
            "description": "Your favourite high octane tracks generated on moooodify.com"

         }),
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          addAggressiveTracks(result);
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function createPlaylistChill(user){
   
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/users/' + encodeURIComponent(user.id) + '/playlists',
        data: JSON.stringify({
             "name": "relaxing - moooodify",
            "description": "Your favourite tracks to chill out to, generated on moooodify.com"

         }),
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          addChillTracks(result);
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function createPlaylistParty(user){
   
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/users/' + encodeURIComponent(user.id) + '/playlists',
        data: JSON.stringify({
             "name": "party - moooodify",
            "description": "Dance the night away to these tracks generated on moooodify.com"

         }),
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          addPartyTracks(result);
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}



//-----------------------------------------------------------------------

function addCustomTracks(playlist){
  $.ajax({
      type: 'POST',
      url: 'https://api.spotify.com/v1/playlists/' + encodeURIComponent(playlist.id) + '/tracks?uris=' + saduri,
      headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
      },
      success: function(result) {
        console.log('Woo! :)');
        showSnackbar();
      },
      error: function() {
        console.log('Error! :(');
      }
    })
}




function addSadTracks(playlist){
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/playlists/' + encodeURIComponent(playlist.id) + '/tracks?uris=' + saduri,
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          showSnackbar();
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function addHappyTracks(playlist){
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/playlists/' + encodeURIComponent(playlist.id) + '/tracks?uris=' + happyuri,
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          showSnackbar();
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function addAggressiveTracks(playlist){
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/playlists/' + encodeURIComponent(playlist.id) + '/tracks?uris=' + aggressiveuri,
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          showSnackbar();
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function addChillTracks(playlist){
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/playlists/' + encodeURIComponent(playlist.id) + '/tracks?uris=' + chilluri,
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          showSnackbar();
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function addPartyTracks(playlist){
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/playlists/' + encodeURIComponent(playlist.id) + '/tracks?uris=' + partyuri,
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          showSnackbar();
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

// ---------------------------------------------------------------------

function showSnackbar(){
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// function hideCustomEmptyState(){
//   var x = document.getElementById("custom-empty-state");
//   x.className = "hide";
// }

function showCustomButton(){
  var x = document.getElementById("custom-button");
  x.className = "show";
}

function hideCustomButton(){
  $("#custom-button").removeClass("intro");
}

function hideSadEmptyState(){
  var x = document.getElementById("sad-empty-state");
  x.className = "hide";
}

function hideHappyEmptyState(){
  var x = document.getElementById("happy-empty-state");
  x.className = "hide";
}

function hideAggressiveEmptyState(){
  var x = document.getElementById("aggressive-empty-state");
  x.className = "hide";
}

function hideChillEmptyStates(){
  var x = document.getElementById("chill-empty-state");
  x.className = "hide";
}

function hidePartyEmptyStates(){
  var x = document.getElementById("party-empty-state");
  x.className = "hide";
}


//------------------------------------------------------------------------------------

