
// var access_token;

$(document).ready(function() { 

    console.log("ready");

    const urlParams = new URLSearchParams(window.location.search);
    const access_hash = window.location.hash.substr(1).split('&');
    var key = {};
    // access_token = access_hash.substr(access_hash.search(/(?<=^|&)access_token=/))
    //               .split('&')[0]
    //               .split('=')[1];

    for (i=0; i<access_hash.length; i++) {
        var tmp = access_hash[i].split('=');
        key[tmp[0]] = tmp[1];
      } 
    console.log(key['access_token']);
    access_token = key['access_token'];
    localStorage.setItem('access_token', access_token);
    window.location.assign("app.html");
});

