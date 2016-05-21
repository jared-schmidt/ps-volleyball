Template.retiredPlayers.events({

});

Template.retiredPlayers.helpers({
    retiredPlayers: function() {
        return Meteor.users.find({
            'profile.retired': true
        }, {
            sort: {
                'profile.name': 1,
            }
        }).fetch();
    }
});