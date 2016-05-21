Meteor.startup(function() {
    // code to run on server at startup
    // if (Meteor.users.find().count() < 5) {
    //     _.each(_.range(5), function() {
    //         var randomEmail = faker.internet.email();
    //         var randomName = faker.name.findName();
    //         var userName = faker.internet.userName();
    //         Accounts.createUser({
    //             username: userName,
    //             profile: {
    //                 name: randomName,
    //                 active: true,
    //                 retired: false,
    //             },
    //             email: randomEmail,
    //             password: 'password'
    //         });
    //     });
    // }


    _.each(Meteor.users.find().fetch(), function(user) {
        var superAdmin = 'super-admin';
        var admin = 'admin';
        var userRole = 'user';

        if (user._id) {
            var usersName = user.profile.name;

            if (usersName === 'Jared Schmidt') {
                Roles.addUsersToRoles(user._id, superAdmin, 'default-group');
                console.log("Making " + user.profile.name + ' a ' + superAdmin);
            } else if (usersName === 'Chris Scott' || usersName === 'Jonathan Savage' || usersName === 'Lou Wolford' || usersName === 'David Bodenschatz') {
                Roles.addUsersToRoles(user._id, admin, 'default-group');
                console.log("Making " + user.profile.name + ' a ' + admin);
            } else {
                Roles.addUsersToRoles(user._id, userRole, 'default-group');
                console.log("Making " + user.profile.name + ' a ' + userRole);
            }
        }
    });

});