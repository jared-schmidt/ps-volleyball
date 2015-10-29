Meteor.startup(function() {
    // code to run on server at startup
});

Meteor.methods({
    team1: function(team){
        console.log(team);
        Team1.remove({});
        Team1.insert({
            'team': team
        });
    },
    team2: function(team){
        console.log(team);
        Team2.remove({});
        Team2.insert({
            'team': team
        });
    }
});
