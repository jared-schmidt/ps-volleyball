Meteor.startup(function() {
    // code to run on server at startup
});

Meteor.publish('userData', function() {
  if(!this.userId) return null;
  return Meteor.users.find(this.userId, {fields: {
    wins: 1,
  }});
});

Meteor.methods({
    changeStatus: function(newStatus){
      Meteor.users.update({'_id': this.userId}, {$set:{'profile.active': newStatus}});
    },
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
    },
    fixTotalGamesPlayer: function(){

        var pastGames = PastTeams.find({}).fetch();

        var playerCount = [];

        _.each(pastGames, function(game){
            var win = game.winningTeam.team;
            var lose = game.losingTeam.team;

            _.each(win, function(player){
                var found = _.findWhere(playerCount, {_id: player._id});
                if (found){
                    found.total += 1;
                    found.win += 1;
                } else {
                    playerCount.push({
                        _id: player._id,
                        name: player.profile.name,
                        win: 1,
                        lost: 0,
                        total: 1
                    });
                }
            });

            _.each(lose, function(player){
                var found = _.findWhere(playerCount, {_id: player._id});
                if (found){
                    found.total += 1;
                    found.lost += 1;
                } else {
                    playerCount.push({
                        _id: player._id,
                        name: player.profile.name,
                        lost: 1,
                        win: 0,
                        total: 1
                    });
                }
            });

        });
        console.log(playerCount);
        
        return playerCount;
    }
});
