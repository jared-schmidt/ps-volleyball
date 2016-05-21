Template.pastTeams.events({

});

Template.pastTeams.helpers({
    pastTeams: function() {
        var pastGames = PastTeams.find({}, {
            sort: {
                'when': 1
            }
        }).fetch();
        return pastGames;
    }
});
