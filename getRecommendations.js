var trackIDstring = "";

var recctrackIDs = [];
var recctrackNames = [];
var reccartistNames = [];
var recctrackURIs = [];
var reccalbumObjs = [];
var reccalbumArts = [];

var recctrackDance = [];
var recctrackEnergy = [];
var recctrackMood = [];
var recctrackTempo = [];

$(document).ready(function() { 
function getReccs(){
    for(i=0;i<length;i++){
        trackIDstring += String(trackIDs[i]); trackIDstring += ",";
    }
    sendReccRequest();
}
});

function sendReccRequest(){
    
    $.ajax({
            type: 'GET',
            url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + trackIDstring,
            headers: {
              'Authorization': 'Bearer ' + access_token,
              'Content-Type': 'application/json'
            },
            success: function(result) {
              console.log('Woo! :)');
              getReccTrackIDs(response);
              getReccAlbumArt();
            },
            error: function() {
              console.log('Error! :(');
            }
    })
}

function getReccTrackIDs(musicList){

        for(i=0;i<length;i++){
            recctrackIDs[i] = musicList.items[i].id;
            recctrackNames[i] = musicList.items[i].name;
            reccartistNames[i] = musicList.items[i].artists[0].name;
            recctrackURIs[i] = musicList.items[i].uri;
            reccalbumObjs[i] = musicList.items[i].album.id;
        }
        requestreccTrackInfo(trackIDs);
    
}

function getReccAlbumArt(){

    for(i=0;i<length;i++){
       console.log("album obj: " + reccalbumObjs[i]);
        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + encodeURIComponent(reccalbumObjs[i]),
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            ajaxI: i,
            success: function(response) {
                console.log(response);
                i = this.ajaxI;
                storereccImages(response, i);
            }
        })
    }
}


function storereccImages(response, i){
    reccalbumArts[i] = response.images[0].url;
}

function requestreccTrackInfo(trackIDs){

for(index=0;index<length;index++){
    
    var uri = recctrackIDs[index];
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
            console.log("tracks se response aaya");
            console.log(index);
            setReccTrackInfo(response, index);

        },
        })
    )
}

$.when.apply($,deferredArr).done(function() {
    calculateReccCategory();
});
}

function setReccTrackInfo(track, x){

    recctrackDance[x] = track.danceability;
    recctrackEnergy[x] = track.energy;
    recctrackMood[x] = track.valence;
    recctrackTempo[x] = track.tempo;
    console.log(x);
}

function calculateReccCategory(i){
  
    console.log("entered calculation");

    for(i=0;i<length;i++){  


   if(recctrackMood[i] < 0.3 && recctrackEnergy[i]<0.6) { console.log("adding to sad"); reccaddToSad(i); reccsaduri += String(recctrackURIs[i]); reccsaduri += "," }
   if(recctrackMood[i] > 0.6 && recctrackEnergy[i] > 0.3) { console.log("adding to happy"); reccaddToHappy(i);  recchappyuri += String(recctrackURIs[i]);  recchappyuri += "," }
   if(recctrackEnergy[i] > 0.8) {  console.log("adding to aggr"); reccaddToAggressive(i);  reccaggressiveuri += String(recctrackURIs[i]);  reccaggressiveuri += "," }
   if(recctrackMood[i] > 0.3 && recctrackDance[i]>0.75) {  console.log("adding to party"); reccaddToParty(i); reccpartyuri += String(recctrackURIs[i]);  reccpartyuri += "," }
   if(recctrackEnergy[i] < 0.4 && recctrackMood[i] > 0.3) {  console.log("adding to chill"); reccaddToChill(i); reccchilluri += String(recctrackURIs[i]);  reccchilluri += "," }

    }
}

function reccaddToSad(){

    var referenceNode = document.querySelector('#recc-track-list-sad');

    var imgNode = document.createElement('div');
    imgNode.className = "album-art";

    var album_img = document.createElement('img');
    album_img.src = reccalbumArts[i];

    imgNode.appendChild(album_img);

    var trackNode = document.createElement('div');
    trackNode.className = "track";


    var newNode = document.createElement('div');
    newNode.className = "track-description";
    
    var trackname = document.createElement('div');
    trackname.innerHTML = recctrackNames[i];
    trackname.className = "track-name";

    var artistname = document.createElement('div');
    artistname.innerHTML = reccartistNames[i];
    artistname.className = "artist-name";

    newNode.appendChild(trackname);
    newNode.appendChild(artistname);

    trackNode.appendChild(imgNode);
    trackNode.appendChild(newNode);

    referenceNode.appendChild(trackNode);

    hideReccSadEmptyState();
}

function hideReccSadEmptyState(){
    var x = document.getElementById("sad-recc-empty-state");
    x.className = "hide";
  }
//--------------------------------

function getuserReccIDSad(){
    
    $.ajax({
        url: 'https://api.spotify.com/v1/me/',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            createPlaylistReccSad(response);

        }
    })

}


function createPlaylistReccSad(user){
   
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/users/' + encodeURIComponent(user.id) + '/playlists',
        data: JSON.stringify({
             "name": "recommended downers - moooodify",
            "description": "Your favourite melancholy tracks generated on moooodify.com"

         }),
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        success: function(result) {
          console.log('Woo! :)');
          addReccSadTracks(result);
          
        },
        error: function() {
          console.log('Error! :(');
        }
      })
}

function addReccSadTracks(playlist){
    $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/playlists/' + encodeURIComponent(playlist.id) + '/tracks?uris=' + reccsaduri,
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