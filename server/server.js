Meteor.startup(function() {
    // code to run on server at startup
});

Meteor.publish('userData', function() {
console.log(this.userId);
  if(!this.userId) return null;
  return Meteor.users.find(this.userId, {fields: {
    wins: 1,
  }});
});

Meteor.methods({
    team1: function(team){
        Team1.remove({});
        Team1.insert({
            'team': team,
            'created': new Date()
        });
    },
    team2: function(team){
        Team2.remove({});
        Team2.insert({
            'team': team,
            'created': new Date()
        });
    },
    markTeam1Win: function(){
        var team = Team1.findOne({});

        _.each(team.team, function(player){
            Meteor.users.update({'_id': player._id}, {$inc:{'profile.wins': 1}});
        });

        PastTeams.insert({
            winningTeam: Team1.findOne({}),
            losingTeam: Team2.findOne({}),
            when: new Date()
        });

        Team1.remove({});
        Team2.remove({});

    },
    markTeam2Win: function(){
        var team = Team2.findOne({});

        _.each(team.team, function(player){
            Meteor.users.update({'_id': player._id}, {$inc:{'profile.wins': 1}});
        });

        PastTeams.insert({
            winningTeam: Team2.findOne({}),
            losingTeam: Team1.findOne({}),
            when: new Date()
        });

        Team1.remove({});
        Team2.remove({});
    }
});
