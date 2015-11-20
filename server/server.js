Meteor.startup(function() {
    // code to run on server at startup
    if(Meteor.users.find().count() < 25){
  _.each(_.range(25), function(){
    var randomEmail = faker.internet.email();
    var randomName = faker.name.findName();
    var userName = faker.internet.userName();
    Accounts.createUser({
      username: userName,
      profile: {
        name: randomName,
        active: true
      },
      email: randomEmail,
      password: 'password'
    });
  });
}
});

Meteor.publish('userData', function() {
  if(!this.userId) return null;
  return Meteor.users.find(this.userId, {fields: {
    wins: 1,
  }});
});

function isAdmin(){
    return Meteor.user().profile.name === 'Jared Schmidt' || Meteor.user().profile.name === 'Chris Scott' || Meteor.user().profile.name === 'Jonathan Savage' || Meteor.user().profile.name === 'Peter Kohlway';
}

Meteor.methods({
    changeStatus: function(newStatus){
      Meteor.users.update({'_id': this.userId}, {$set:{'profile.active': newStatus}});
    },
    team1: function(team){
        console.log(isAdmin());
        if (isAdmin() && team.length > 1){
            Team1.remove({});
            Team1.insert({
                'team': team,
                'created': new Date()
            });
        }
    },
    team2: function(team){
        if (isAdmin() && team.length > 1){
            Team2.remove({});
            Team2.insert({
                'team': team,
                'created': new Date()
            });
        }
    },
    markTeam1Win: function(){
        if (isAdmin()){
            var team = Team1.findOne({});
                if (team && team.team.length > 1){
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
            }
        }

    },
    markTeam2Win: function(){
        if (isAdmin()){
            var team = Team2.findOne({});
            if (team && team.team.length > 1){
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
        }
    },
    pastTeams: function(){
        var pastGames = PastTeams.find({}, {sort: {'created': -1}}).fetch();
        return pastGames;
    },
    getHighestRecords: function(){
        var currectPlaying = PlayingStreak.find({}, {sort: {'score': -1}}).fetch()[0];
        var currectWinning = WinningStreak.find({}, {sort: {'score': -1}}).fetch()[0];
        var currectLosing = LosingStreak.find({}, {sort: {'score': -1}}).fetch()[0];
        console.log(currectLosing);
        return {
            playing: currectPlaying,
            winning: currectWinning,
            losing: currectLosing
        }
    },
    fixTotalGamesPlayer: function(){
        var allPlayers = Meteor.users.find().fetch();

        var pastGames = PastTeams.find({}, {sort: {'created': -1}}).fetch();

        var playerCount = [];

        _.each(pastGames, function(game){
            var win = game.winningTeam.team;
            var lose = game.losingTeam.team;

            _.each(win, function(player){
                var found = _.findWhere(playerCount, {_id: player._id});
                if (found){
                    found.total += 1;
                    found.win += 1;
                    found.winningStreak += 1;
                    found.losingStreak = 0;
                    // found.playingStreak += 1;
                } else {
                    playerCount.push({
                        _id: player._id,
                        name: player.profile.name,
                        win: 1,
                        lost: 0,
                        winningStreak: 1,
                        losingStreak: 0,
                        playingStreak: 0,
                        total: 1
                    });
                }
            });

            _.each(lose, function(player){
                var found = _.findWhere(playerCount, {_id: player._id});
                if (found){
                    found.total += 1;
                    found.lost += 1;
                    found.winningStreak = 0;
                    found.losingStreak += 1;
                    // found.playingStreak += 1;
                } else {
                    playerCount.push({
                        _id: player._id,
                        name: player.profile.name,
                        lost: 1,
                        win: 0,
                        winningStreak: 0,
                        losingStreak: 1,
                        playingStreak: 0,
                        total: 1
                    });
                }
            });

            _.each(allPlayers, function(player){
                var playerOnTeam = _.findWhere(win, {'_id': player._id});
                if (!playerOnTeam){
                    playerOnTeam = _.findWhere(lose, {'_id': player._id});
                }

                var found = _.findWhere(playerCount, {_id: player._id});
                if (playerOnTeam){
                    if (found){
                        found.playingStreak += 1;
                    }
                } else {

                    if (found){
                        found.playingStreak = 0;
                    }
                }
                found.winPercentage = (found.win / found.total).toFixed(3);
            });

        });

        var highestPlayingStreak = _.max(playerCount, function(player){ return player.playingStreak; });
        var highestLosingStreak = _.max(playerCount, function(player){ return player.losingStreak; });
        var highestWinningStreak = _.max(playerCount, function(player){ return player.winningStreak; });

        var newHigh = false;
        var newLow = false;
        var newPlay = false;

        var currectPlaying = PlayingStreak.find({}, {sort: {'score': -1}}).fetch()[0];
        console.log(currectPlaying);

        if (!currectPlaying || highestPlayingStreak.playingStreak > currectPlaying.score ){
            console.log("NEW PLAYING RECORD");
            newPlay = true;

            PlayingStreak.insert({
                name: highestPlayingStreak.name,
                playerId:  highestPlayingStreak._id,
                score: highestPlayingStreak.playingStreak,
                when: new Date()
            });
        }

        var currectWinning = WinningStreak.find({}, {sort: {'score': -1}}).fetch()[0];
        console.log(currectWinning);
        if (!currectWinning || highestWinningStreak.winningStreak > currectWinning.score ){
            console.log("NEW WINNING RECORD");
            newHigh = true;
            WinningStreak.insert({
                name: highestWinningStreak.name,
                playerId:  highestWinningStreak._id,
                score: highestWinningStreak.winningStreak,
                when: new Date()
            });
        }

        var currectLosing = LosingStreak.find({}, {sort: {'score': -1}}).fetch()[0];
        console.log(currectLosing);
        if (!currectLosing || highestLosingStreak.losingStreak > currectLosing.score ){
            console.log("NEW LOSING RECORD");
            newLow = true;
            LosingStreak.insert({
                name: highestLosingStreak.name,
                playerId:  highestLosingStreak._id,
                score: highestLosingStreak.losingStreak,
                when: new Date()
            });
        }


        return {
            players: playerCount,
            newHigh: newHigh,
            newLow: newLow,
            newPlay: newPlay
        };
    }
});
