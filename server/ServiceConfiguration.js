isDevEnv = function () {
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

if (isDevEnv()) {
    console.log("ENV -> LOCAL");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: '17949077904-dtilfr90jis1f102152g9nt9vn98efib.apps.googleusercontent.com',
        secret: 'wlTZaq7F99aupNJUbWNLJejX'
    });
} else {
  console.log("ENV -> PRODUCTION");
  ServiceConfiguration.configurations.insert({
      service: 'google',
      clientId: '933385738461-jsshkdlvbgbr62gukk8qngrvhr6qdnc3.apps.googleusercontent.com',
      secret: 'K8lO8Q3DC3GkSbbBh4L5Dwla'
  });
}
