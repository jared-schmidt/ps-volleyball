// Accounts.validateNewUser(function (user) {
//     if(user.services.hasOwnProperty('google')){
//         host = parse(user.services.google.email);
//
//         if (host === 'problemsolutions.net')
//             return true;
//         throw new Meteor.Error(403, "Must use " + Meteor.settings.emailDomin + " email!");
//     }
//     return true;
// });

Accounts.onCreateUser(function(options, user){
    if(user.services.hasOwnProperty('google')){

        // if (inArray(user.services.google.email, Meteor.settings.adminEmails)){
        //     user.roles = 'admin';
        // }
        // else{
        //     user.roles = 'user';
        // }

        Roles.addUsersToRoles(user._id, 'user', 'default-group');

        var accessToken = user.services.google.accessToken, result, profile;

        result = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers:{"User-Agent": "Meteor/1.0"},
            params: {access_token: accessToken }
        });

        if (result.error)
            throw result.error;

        profile = _.pick(result.data,
        "name",
        "given_name",
        "family_name",
        "profile",
        "picture",
        "email",
        "email_verified",
        "birthdate",
        "gender",
        "locale",
        "hd");

        user.profile = profile;

        user.profile.active = false;

        user.profile.winningStreak = 0;
        user.profile.losingStreak = 0;
        user.profile.total = 0;
        user.profile.playingStreak = 0;
        user.profile.wins = 0;
        user.profile.loses = 0;
        user.profile.winPercentage = 0;
        user.profile.retired = false;

        user.profile.title = 'New Person';

    }
    return user;
});
