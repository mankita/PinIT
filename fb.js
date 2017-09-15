window.fbAsyncInit = function() {
    FB.init({
        appId : '277134119456975',
        autoLogAppEvents : true,
        xfbml : true,
        version : 'v2.10'
    });
    FB.getLoginStatus(function(loginStatusResponse) {

        if (loginStatusResponse.status === 'connected') {
            console.log('Logged in.');

            fetchPosts();
        } else {

            FB.login(function(response) {
                if(response.authResponse) {
                    console.log("Welcome! Fetching your information...");
                    fetchPosts();
                } else {
                    console.log('User cancelled login or did not fully authorize');
                }
            }, {
                scope: 'user_posts',
                return_scopes: true
            });
        }
    });

    FB.AppEvents.logPageView();
};

function fetchPosts() {
    FB.api('/me/posts?with=location', function(postResponse) {
        console.log(postResponse);
        printPostStories(postResponse.data);
        getMorePosts(postResponse, 0);
    });
}

function printPostStories(posts) {
    posts.forEach(function(post){
        console.log(post.story);
        var index = post.story.indexOf(" at ");
        if(index !== -1) {
            var fbLoc = post.story.substr(index+4).trim() + "";
            console.log(" About to pin" + fbLoc);
            pinAddress(fbLoc);
        } else {
            var inIndex = post.story.indexOf(" in ");
            var fbLoc = post.story.substr(inIndex+4).trim() + "";
            console.log(" About to pin" + fbLoc);
            pinAddress(fbLoc);
        }
    });
}

function getMorePosts(responseData, count) {
    console.log(responseData);
    if(count > 15) {
        return;
    }
    if(responseData.paging) {
        $.get(responseData.paging.next, function(response) {
            printPostStories(response.data);
            getMorePosts(response, count + response.data.length);
        }, "json");
    }
}

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var myMap;
function initMap() {
    myMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: new google.maps.LatLng(28.52,77.13),
        mapTypeId: 'roadmap'
    });
}

function pinAddress(myAddress){
    //var myAddress= document.getElementById('address').value;
    console.log("Plotting " + myAddress);
    var geocoder = new google.maps.Geocoder();
    console.log("Geocode ready");
    geocoder.geocode({address: myAddress}, function(result, status){
        drawPin(myMap, result[0].geometry.location);  
    });
}

function pinAddressWithText() {
    var myAddress= document.getElementById('address').value;
    console.log("Plotting " + myAddress);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: myAddress}, function(result, status){
        drawPin(myMap, result[0].geometry.location);  
    });
}

function drawPin(drawMap, drawLocation){
    console.log("Drawing pin for " + drawLocation);
    var marker = new google.maps.Marker({
        position: drawLocation,
        map: drawMap
    });  
}
