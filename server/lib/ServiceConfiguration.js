

isDevEnv = function() {
    var rv = false
    if (String(process.env.ROOT_URL).indexOf("localhost") >= 0) {
        rv = true;
    }
    console.log("isDev -> ", rv);
    return rv
};

ServiceConfiguration.configurations.remove({
    service: 'google'
});

// db.meteor_accounts_loginServiceConfiguration.insert({"service": "google", "clientId":"933385738461-jsshkdlvbgbr62gukk8qngrvhr6qdnc3.apps.googleusercontent.com", "secret":"K8lO8Q3DC3GkSbbBh4L5Dwla"})

if (isDevEnv()) {
    console.log("ENV -> LOCAL");

    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: '17949077904-dtilfr90jis1f102152g9nt9vn98efib.apps.googleusercontent.com',
        secret: 'wlTZaq7F99aupNJUbWNLJejX'
    });
} else {
    console.log("ENV -> PRODUCTION");

    // if (Meteor.isCordova) {
        ServiceConfiguration.configurations.insert({
            service: 'google',
            loginStyle: "redirect",
            clientId: '933385738461-jsshkdlvbgbr62gukk8qngrvhr6qdnc3.apps.googleusercontent.com',
            secret: 'K8lO8Q3DC3GkSbbBh4L5Dwla'
        });
    // } else {
        // ServiceConfiguration.configurations.insert({
        //     service: 'google',
        //     loginStyle: "popup",
        //     clientId: '933385738461-jsshkdlvbgbr62gukk8qngrvhr6qdnc3.apps.googleusercontent.com',
        //     secret: 'K8lO8Q3DC3GkSbbBh4L5Dwla'
        // });
    // }




}
