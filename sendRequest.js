
// var access_token;
var trackIDs = [];
var trackNames = [];
var artistNames = [];
var trackURIs = [];
var albumObjs = [];
var albumArts = [];

var albumObjString = "";
var trackIDString = "";

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


var length = 50;

var oneMonthFlag = 0;
var sixMonthFlag = 0;
var allTimeFlag = 0;

var access_token;

var deferredArr=[];

var customCount = 0;


//-------------------------------------------------------------------------------

var saduri = "";
var happyuri = "";
var aggressiveuri = "";
var chilluri = "";
var partyuri = "";
var customuri = "";


var sadcounter = 0;
var happycounter = 0;
var aggressivecounter = 0;
var chillcounter = 0;
var partycounter = 0;


  
var tabSelectedName = "";
var today; 
var date = "";

var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];





//----------------------------------------------------------------------

$(document).ready(function() { 

    access_token = localStorage.getItem('access_token');
    // console.log(access_token);

    // $.ajaxSetup({ cache: false });

    today = new Date();
    getTodayDate();
    oneMonthRequest();

});

function sixMonthsRequest(){
  

  setSixMonthsActive();
  resetEverything();

  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function(response) {
        // console.log(response);
        // console.log("response aaya");
        // console.log("bheja");
        // length = response.total;
        counter = response.total;
        getTrackIDs(response);

    },
})
}

function allTimeRequest(){
  

  setAllTimeActive();
  resetEverything();

  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function(response) {
        // console.log(response);
        // console.log("response aaya");
        // console.log("bheja");
        // length = response.total;
        counter = response.total;
        getTrackIDs(response);

    },
})
}

function oneMonthRequest(){
  

  resetEverything();
  setOneMonthActive();

  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function(response) {
        // console.log(response);
        // console.log("response aaya");
        // console.log("bheja");
        // length = response.total;
        counter = response.total;
        getTrackIDs(response);
    },
})
}


function resetEverything(){
  saduri = "";
  happyuri = "";
  aggressiveuri = "";
  chilluri = "";
  partyuri = "";
  customuri = "";

  playlistName = "";
  
  albumObjString = "";
  trackIDString = "";

  sadcounter = 0;
  happycounter = 0;
  aggressivecounter = 0;
  chillcounter = 0;
  partycounter = 0;
  
  trackIDs = [];
  trackNames = [];
  artistNames = [];
  trackURIs = [];
  albumObjs = [];
  albumArts = [];

  trackDance = [];
  trackEnergy = [];
  trackMood = [];
  trackTempo = [];


  artistImg = [];

  counter = 0;

  chill=[];
  party=[];
  happy=[];
  sad=[];
  angry=[];

  // length=0

  deferredArr=[];

  customCount = 0;

  oneMonthFlag = 0;
  sixMonthFlag = 0;
  allTimeFlag = 0;

  resetDOMs();
  
}


function resetDOMs(){
  $("#sad-empty-state").removeClass("hide");
  $("#happy-empty-state").removeClass("hide");
  $("#aggressive-empty-state").removeClass("hide");
  $("#chill-empty-state").removeClass("hide");
  $("#party-empty-state").removeClass("hide");
  $("#custom-button").removeClass("show");

//   const myNode = document.getElementById("track-list-custom");
  
//   while (myNode.lastChild.id !== 'custom-empty-state') {
//     myNode.removeChild(cntnt.lastChild);
// }

  $("#track-list-custom").children(":not(#custom-empty-state)").remove();
  $('#custom-empty-state').addClass('empty-state');
  $("#track-list-sad").children(":not(#sad-empty-state)").remove();
  $('#sad-empty-state').addClass('empty-state');
  $("#track-list-happy").children(":not(#happy-empty-state)").remove();
  $('#happy-empty-state').addClass('empty-state');
  $("#track-list-aggressive").children(":not(#aggressive-empty-state)").remove();
  $('#aggressive-empty-state').addClass('empty-state');
  $("#track-list-chill").children(":not(#chill-empty-state)").remove();
  $('#chill-empty-state').addClass('empty-state');
  $("#track-list-party").children(":not(#party-empty-state)").remove();
  $('#party-empty-state').addClass('empty-state');

}


function getTrackIDs(musicList){

  console.log(musicList);
  console.log(length);
    for(i=0;i<length;i++){
        trackIDs[i] = musicList.items[i].id;
        trackIDString += String(musicList.items[i].id); trackIDString += ",";
        trackNames[i] = musicList.items[i].name;
        artistNames[i] = musicList.items[i].artists[0].name;
        trackURIs[i] = musicList.items[i].uri;
        albumObjs[i] = musicList.items[i].album.id;
        albumObjString += String(musicList.items[i].album.id); albumObjString += ",";
    }
    // getAlbumArt(i);
    requestTrackInfo();

}

function getAlbumArt(){

      var str1 = albumObjString.split(',');
      var str2 = ""; var str3 = ""; var str4 = ""; var albumCounter = 0;
      for(i=0;i<length;i++){
        if(i<20){ str2 += str1[i]; str2 += ",";  }
        if( i >= 20 && i < 40) { str3 += str1[i]; str3 += ","; }
        if( i >= 40 && i < length) { str4 += str1[i]; str4 += ","; }
      }
      str2 = str2.replace(/,\s*$/, "");
      str3 = str3.replace(/,\s*$/, "");
      str4 = str4.replace(/,\s*$/, "");
      


      $.when(getAlbumArt1(str2), getAlbumArt2(str3), getAlbumArt3(str4)).done(function(a1, a2, a3){
        storeImages(a1,a2,a3); 
      })
}

function getAlbumArt1(str){
  return $.ajax({
    url: 'https://api.spotify.com/v1/albums?ids=' + encodeURIComponent(str),
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    // ajaxI: i,
    // success: function(response) {
    //     // console.log(response);
    //     // i = this.ajaxI;
       
    // }
})
}

function getAlbumArt2(str){
  return $.ajax({
    url: 'https://api.spotify.com/v1/albums?ids=' + encodeURIComponent(str),
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    // ajaxI: i,
    // success: function(response) {
    //     // console.log(response);
    //     // i = this.ajaxI;
       
    // }
})
}

function getAlbumArt3(str){
  return $.ajax({
    url: 'https://api.spotify.com/v1/albums?ids=' + encodeURIComponent(str),
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    // ajaxI: i,
    // success: function(response) {
    //     // console.log(response);
    //     // i = this.ajaxI;
       
    // }
})
}

function storeImages(response1, response2, response3){

  for(index=0;index<length;index++){   
        if(index<20) { 
          albumArts[index] = response1[0].albums[index].images[0].url;  
        } 
        if( index >= 20 && index < 40) { 
          albumArts[index] = response2[0].albums[index-20].images[0].url; 
        }
        if( index >= 40 && index < length) { 
          albumArts[index] = response3[0].albums[index-40].images[0].url; 
        } 
        console.log(albumArts[index]);
  }

  calculateCategory(); 
}

function requestTrackInfo(){
   
    // for(index=0;index<length;index++){
        
        // var uri = trackIDs[index];
        // deferredArr.push(
        $.ajax({
            url: 'https://api.spotify.com/v1/audio-features?ids='+encodeURIComponent(trackIDString),
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            // ajaxI: index,
            success: function(response) {
                setTrackInfo(response);
            },
            })
        // )
    // }

    // $.when.apply($,deferredArr).done(function() {

    // });
    
}

function setTrackInfo(track){

    for(i=0;i<length;i++){
        trackDance[i] = track.audio_features[i].danceability;
        trackEnergy[i] = track.audio_features[i].energy;
        trackMood[i] = track.audio_features[i].valence;
        trackTempo[i] = track.audio_features[i].tempo;
    }
    getAlbumArt();
        // console.log(x);
        // console.log(trackMood[x]);
}


function calculateCategory(){
  
    var c;

    for(c=0;c<length;c++){  
      // console.log("entered loop");
 
        if(trackMood[c] < 0.3 && trackEnergy[c]<0.6) { addToSad(c); saduri += String(trackURIs[c]); saduri += "," }
        if(trackMood[c] > 0.6 && trackEnergy[c] > 0.3) {  addToHappy(c);  happyuri += String(trackURIs[c]);  happyuri += "," }
        if(trackEnergy[c] > 0.8) {   addToAggressive(c);  aggressiveuri += String(trackURIs[c]);  aggressiveuri += "," }
        if(trackMood[c] > 0.3 && trackDance[c]>0.75) {   addToParty(c); partyuri += String(trackURIs[c]);  partyuri += "," }
        if(trackEnergy[c] < 0.4 && trackMood[c] > 0.3) {   addToChill(c); chilluri += String(trackURIs[c]);  chilluri += "," }

    }
}

function getCustomTracks(){
  // console.log("fetching custom tracks");
  hideCustomButton();
  var moodVal = document.getElementById("mood-slider").value; 
  moodVal = moodVal/100;
  var danceVal = document.getElementById("dance-slider").value; 
  danceVal = danceVal/100;
  var energyVal = document.getElementById("energy-slider").value;
  energyVal = energyVal/100;
  // console.log(moodVal, danceVal, energyVal);
  
  customCount = 0;
  emptyCustomList();

  for(i=0;i<length;i++){  
    
    if((trackMood[i] <= moodVal + 0.25) && (trackMood[i] >= moodVal - 0.25) && (trackDance[i] <= danceVal + 0.25) && (trackDance[i] >= danceVal -0.25) && (trackEnergy[i] <= energyVal + 0.25) && (trackMood[i] >= energyVal - 0.25) ){
      
      customuri += String(trackURIs[i]); customuri += ",";  addToCustom(i); customCount++; 
    }

    if(i==length-1 && customCount ==0){
      showEmptyMessage();
    }

  }

}

function emptyCustomList(){
  const myNode = document.getElementById("track-list-custom");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
}
}


function showEmptyMessage(){
  var referenceNode = document.querySelector('#track-list-custom');
  var newNode = document.createElement('div');
  newNode.className = "empty-state";

  newNode.innerHTML = "No songs found for this mood. Try another."

  referenceNode.appendChild(newNode);
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


function addToSad(c){
    
    var referenceNode = document.querySelector('#track-list-sad');

    var imgNode = document.createElement('div');
    imgNode.className = "album-art";

    var album_img = document.createElement('img');
    album_img.src = albumArts[c];

    imgNode.appendChild(album_img);

    var trackNode = document.createElement('div');
    trackNode.className = "track";


    var newNode = document.createElement('div');
    newNode.className = "track-description";
    
    var trackname = document.createElement('div');
    trackname.innerHTML = trackNames[c];
    trackname.className = "track-name";

    var artistname = document.createElement('div');
    artistname.innerHTML = artistNames[c];
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
           "name": "top custom tracks | " + String(tabSelectedName) + " | moooodify | " + String(date),
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
             "name": "top mellow tracks | " + String(tabSelectedName) + " | moooodify | " + String(date),
            "description": "Your favourite mellow tracks generated on moooodify.com"

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
             "name": "top upbeat tracks | " + String(tabSelectedName) + " | moooodify | " + String(date),
            "description": "Your favourite upbeat tracks generated on moooodify.com"

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
             "name": "top high energy tracks | " + String(tabSelectedName) + " | moooodify | " + String(date),
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
             "name":  "top chill tracks | " + String(tabSelectedName) + " | moooodify | " + String(date),
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
             "name": "top party tracks | " + String(tabSelectedName) + " | moooodify | " + String(date),
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




function addCustomTracks(playlist){
  $.ajax({
      type: 'POST',
      url: 'https://api.spotify.com/v1/playlists/' + encodeURIComponent(playlist.id) + '/tracks?uris=' + customuri,
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

function showCustomEmptyState(){
  var x = document.getElementById("custom-empty-state");
  x.className = "show";
}

function showCustomButton(){
  var x = document.getElementById("custom-button");
  x.className = "show";
}


function hideCustomButton(){
  $("#custom-button").removeClass("show");
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

function setOneMonthActive(){
  oneMonthFlag = 1;
  tabSelectedName = "last month"
  $('#one-month-tab').addClass('active');
  $('#six-months-tab').removeClass('active');
  $('#all-time-tab').removeClass('active');
}

function setSixMonthsActive(){
  sixMonthFlag = 1;
  tabSelectedName = "last 6 months"
  $('#one-month-tab').removeClass('active');
  $('#six-months-tab').addClass('active');
  $('#all-time-tab').removeClass('active');
}

function setAllTimeActive(){
  allTimeFlag = 1;
  tabSelectedName = "all time"
  $('#one-month-tab').removeClass('active');
  $('#six-months-tab').removeClass('active');
  $('#all-time-tab').addClass('active');
}


function getTodayDate(){

var dd = String(today.getDate());
var mm = String(today.getMonth());
var yyyy = today.getFullYear();

date = dd + "th " + monthNames[mm] + ", " + yyyy;
}

//------------------------------------------------------------------------------------

