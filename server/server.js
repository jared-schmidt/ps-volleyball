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
            } else if (usersName === 'Chris Scott' || usersName === 'Jonathan Savage' || usersName === 'Lou Wolford') {
                Roles.addUsersToRoles(user._id, admin, 'default-group');
                console.log("Making " + user.profile.name + ' a ' + admin);
            } else {
                Roles.addUsersToRoles(user._id, userRole, 'default-group');
                console.log("Making " + user.profile.name + ' a ' + userRole);
            }
        }
    });

});

function isOdd(num) {
    return num % 2;
}

Meteor.publish('userData', function() {
    if (!this.userId) return null;
    return Meteor.users.find(this.userId, {
        fields: {
            wins: 1,
        }
    });
});

function isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'default-group');
}

function isSuperAdmin(){
    return Roles.userIsInRole(Meteor.userId(), ['super-admin'], 'default-group');
}

function multiplemax(arr, compare) {
    var max = _.max(arr, function(v) {
        return v[compare];
    });
    return _.filter(arr, function(v) {
        return v[compare] == max[compare];
    });
}

function playerExists(team, playerId) {
  var status = false;
  _.each(team, function(player) {
    if (player._id == playerId) {
      status = true;
    }
  });
  return status;
}

Meteor.methods({
    retire: function(userId){
        Meteor.users.update({
            '_id': userId
        }, {
            $set: {
                'profile.retired': true,
                'profile.active': false
            }
        });
        return true;
    },
    clearTeam1: function(){
        Team1.remove({});
        return true;
    },
    clearTeam2: function(){
        Team2.remove({});
        return true;
    },
    log: function(did){
        Logs.insert({
            'user': Meteor.user()._id,
            'did': did,
            'when': new Date()
        });
    },
    addToHome: function(userId){
        if (isAdmin()) {
            var foundPlayer = Meteor.users.find({'_id': userId}).fetch()[0];

            var count = 0;
            var team1Percentage = 0.0;

            var team1 = Team1.find().fetch()[0];

            if (team1){
                team1 = team1.team;
                if (playerExists(team1, userId)) {
                  return false;
                } else {
                  var team2 = Team2.find().fetch()[0];
                  if (team2) {
                    if (playerExists(team2.team, userId)) {
                      return false;
                    }
                  }
                  Meteor.call('log', 'Added Player to home team');
                  team1.push(foundPlayer);
                }
            } else {
                Meteor.call('log', 'Added Player to home team');
                team1 = [foundPlayer];
            }

            _.each(team1, function(player) {
                count += 1;
                team1Percentage += parseFloat(player.profile.winPercentage);
            });
            team1Percentage = parseFloat(team1Percentage) / parseInt(count);

            Team1.remove({});
            Team1.insert({
                'team': team1,
                'teamPercentage': team1Percentage.toFixed(3),
                'created': new Date(),
                'random': false
            });

            return true;
        } else {
            return false;
        }
    },
    addToAway: function(userId){
        if (isAdmin()) {
            var foundPlayer = Meteor.users.find({'_id': userId}).fetch()[0];

            var count = 0;
            var team2Percentage = 0.0;

            var team2 = Team2.find().fetch()[0];

            if (team2){
                team2 = team2.team;
                if (playerExists(team2, userId)) {
                  return false;
                } else {
                  var team1 = Team1.find().fetch()[0];
                  if (team1) {
                    if (playerExists(team1.team, userId)) {
                      return false;
                    }
                  }
                  Meteor.call('log', 'Added Player to away team');
                  team2.push(foundPlayer);
                }
            } else {
                Meteor.call('log', 'Added Player to away team');
                team2 = [foundPlayer];
            }

            _.each(team2, function(player) {
                count += 1;
                team2Percentage += parseFloat(player.profile.winPercentage);
            });
            team2Percentage = parseFloat(team2Percentage) / parseInt(count);

            Team2.remove({});
            Team2.insert({
                'team': team2,
                'teamPercentage': team2Percentage.toFixed(3),
                'created': new Date(),
                'random': false
            });

            return true;
        } else {
            return false;
        }
    },
    removePlayer: function(user) {
      if (isAdmin()) {
        // var foundPlayer = Meteor.users.find({'_id': user.id}).fetch()[0];
        var team;
        if (user.teamId == 1) {
          team = Team1.find().fetch()[0].team;
        } else if (user.teamId == 2) {
          team = Team2.find().fetch()[0].team;
        } else {
          return false;
        }
        var count = 0;
        var teamPercentage = 0.0;
        for (var i = 0; i < team.length; i++) {
          var player = team[i];
          if (player._id === user.id) {
            team.splice(i, 1);
            i--;
          } else {
            count += 1;
            teamPercentage += parseFloat(player.profile.winPercentage);
          }
        }
        if (user.teamId == 1) {
          Team1.remove({});
          Team1.insert({
              'team': team,
              'teamPercentage': teamPercentage.toFixed(3),
              'created': new Date(),
              'random': false
          });
        } else {
          Team2.remove({});
          Team2.insert({
              'team': team,
              'teamPercentage': teamPercentage.toFixed(3),
              'created': new Date(),
              'random': false
          });
        }
        return true;
      }
    },
    changeStatus: function(newStatus) {
        Meteor.call('changeUserStatus', newStatus, this.userId);
    },
    changeUserStatus: function(newStatus, userId) {
        Meteor.users.update({
            '_id': userId
        }, {
            $set: {
                'profile.active': newStatus
            }
        });
    },
    changeUserTitle: function(newTitle, userId) {
        Meteor.users.update({
            '_id': userId
        }, {
            $set: {
                'profile.title': newTitle
            }
        });
    },
    createTeams: function() {
        var allActivePlayers = Meteor.users.find({
            'profile.active': true,
            'profile.retired': false
        }).fetch();

        var mixed = _.shuffle(allActivePlayers);

        mixed = _.shuffle(mixed);

        var oddPerson = null;

        if (isOdd(mixed.length)) {
            oddPerson = mixed.pop();
        }

        var halfLength = mixed.length / 2;
        var totalLength = mixed.length;

        var team1 = mixed.slice(0, halfLength);
        var team2 = mixed.slice(halfLength, totalLength);

        if (oddPerson) {
            if ((Math.floor(Math.random() * 2) === 0)) {
                team1.push(oddPerson);
            } else {
                team2.push(oddPerson);
            }
        }
        var count = 0;
        var team1Percentage = 0.0;
        var team2Percentage = 0.0;
        _.each(team1, function(player) {
            count += 1;
            team1Percentage += parseFloat(player.profile.winPercentage);
        });
        team1Percentage = parseFloat(team1Percentage) / parseInt(count);

        count = 0;
        _.each(team2, function(player) {
            count += 1;
            team2Percentage += parseFloat(player.profile.winPercentage);
        });
        team2Percentage = parseFloat(team2Percentage) / parseInt(count);
        if (team1.length > 0 && team2.length > 0) {
            if (isAdmin()) {
                Team1.remove({});
                Team1.insert({
                    'team': team1,
                    'teamPercentage': team1Percentage.toFixed(3),
                    'created': new Date(),
                    'random': true
                });

                Team2.remove({});
                Team2.insert({
                    'team': team2,
                    'teamPercentage': team2Percentage.toFixed(3),
                    'created': new Date(),
                    'random': true
                });
            }
            return "Created Teams";
        } else {
            return "Not enough people to create team";
        }

    },
    createTeamsOptimized: function(){
        // var allActivePlayers = Meteor.users.find({
        //     'profile.active': true,
        // },{
        //     'sort': {
        //         'profile.winningStreak': -1,
        //         'profile.winPercentage': -1
        //     }
        // }).fetch();

        var allActivePlayers = Meteor.users.find({
            'profile.active': true,
            'profile.retired': false
        },{
            'sort': {
                'profile.winPercentage': -1,
                'profile.winningStreak': -1,
                'profile.losingStreak': 1
            }
        }).fetch();

        var team1 = [];
        var team2 = [];

        // Put best and worst player on the same team
        team1.push(allActivePlayers.shift());
        team1.push(allActivePlayers.pop());

        // If more than 2 players remaining, put second best and second worst on same team
        // If there is only one player left it will skip this and put them on team 2
        if (allActivePlayers.length > 1){
            team2.push(allActivePlayers.shift());
            team2.push(allActivePlayers.pop());
        }

        var shuffledPlayers = _.shuffle(allActivePlayers);
        // Alternate the rest of the players if even number are left
        if (! isOdd(shuffledPlayers.length)){
            _.each(shuffledPlayers, function(player, index){
                if (isOdd(index)){
                    team1.push(player);
                } else {
                    team2.push(player);
                }
            });
        }
        else{
            _.each(shuffledPlayers, function(player, index){
                var randomNum = Math.floor((Math.random() * 10) + 1);
                if (isOdd(randomNum)){
                    team1.push(player);
                }
                else{
                    team2.push(player);
                }
            });

            // In case random number unbalances teams
            while(team1.length - team2.length > 1){
                team2.push(team1.pop());
            }
            while(team2.length - team1.length > 1){
                team1.push(team2.pop());
            }
        }


        var count = 0;
        var team1Percentage = 0.0;
        var team2Percentage = 0.0;
        _.each(team1, function(player) {
            count += 1;
            team1Percentage += parseFloat(player.profile.winPercentage);
        });
        team1Percentage = parseFloat(team1Percentage) / parseInt(count);

        count = 0;
        _.each(team2, function(player) {
            count += 1;
            team2Percentage += parseFloat(player.profile.winPercentage);
        });
        team2Percentage = parseFloat(team2Percentage) / parseInt(count);
        if (team1.length > 0 && team2.length > 0) {
            if (isAdmin()) {
                if (isOdd(Math.floor(Math.random() * 2) + 1)){
                    Team1.remove({});
                    Team1.insert({
                        'team': team1,
                        'teamPercentage': team1Percentage.toFixed(3),
                        'created': new Date(),
                        'random': true
                    });
                    Team2.remove({});
                    Team2.insert({
                        'team': team2,
                        'teamPercentage': team2Percentage.toFixed(3),
                        'created': new Date(),
                        'random': true
                    });
                } else{
                    Team1.remove({});
                    Team1.insert({
                        'team': team2,
                        'teamPercentage': team2Percentage.toFixed(3),
                        'created': new Date(),
                        'random': true
                    });
                    Team2.remove({});
                    Team2.insert({
                        'team': team1,
                        'teamPercentage': team1Percentage.toFixed(3),
                        'created': new Date(),
                        'random': true
                    });
                }
            }
            return "Created Optimized Teams!";
        } else {
            return "Not enough people to create team";
        }



    },
    markTeam1Win: function() {
        if (isAdmin()) {
            var team = Team1.findOne({});
            if (team && team.team.length > 0) {
                _.each(team.team, function(player) {
                    Meteor.users.update({
                        '_id': player._id
                    }, {
                        $inc: {
                            'profile.wins': 1
                        }
                    });
                });

                PastTeams.insert({
                    winningTeam: Team1.findOne({}),
                    losingTeam: Team2.findOne({}),
                    when: new Date(),
                    side: 'Home'
                });

                Team1.remove({});
                Team2.remove({});
            }
            Meteor.call('fixTotalGamesPlayer');
        }
    },
    markTeam2Win: function() {
        if (isAdmin()) {
            var team = Team2.findOne({});
            if (team && team.team.length > 0) {
                _.each(team.team, function(player) {
                    Meteor.users.update({
                        '_id': player._id
                    }, {
                        $inc: {
                            'profile.wins': 1
                        }
                    });
                });

                PastTeams.insert({
                    winningTeam: Team2.findOne({}),
                    losingTeam: Team1.findOne({}),
                    when: new Date(),
                    side: 'Away'
                });

                Team1.remove({});
                Team2.remove({});
            }
            Meteor.call('fixTotalGamesPlayer');
        }
    },
    endSeason: function(){
        if (isSuperAdmin()) {
            console.log("END");
            PastSeasons.insert({
                'pastTeams': PastTeams.find({}).fetch(),
                'records': {
                    'playing': PlayingStreak.find({}).fetch(),
                    'winning': WinningStreak.find({}).fetch(),
                    'losing': LosingStreak.find({}).fetch()
                },
                'when': new Date()
            });

            PastTeams.remove({});
            PlayingStreak.remove({});
            WinningStreak.remove({});
            LosingStreak.remove({});

            _.each(Meteor.users.find().fetch(), function(player){
                Meteor.users.update({'_id': player._id}, {
                    $set: {
                        'profile.winningStreak': 0,
                        'profile.losingStreak': 0,
                        'profile.total': 0,
                        'profile.playingStreak': 0,
                        'profile.wins': 0,
                        'profile.loses': 0,
                        'profile.winPercentage': 0
                    }
                });
            });
            return true;
        }
        return false;
    },
    fixTotalGamesPlayer: function() {
        var allPlayers = Meteor.users.find().fetch();

        var pastGames = PastTeams.find({}, {
            sort: {
                'when': 1
            }
        }).fetch();

        var playerCount = [];

        var winTotal = 0.0;

        _.each(pastGames, function(game) {
            var win = game.winningTeam.team;
            var lose = game.losingTeam.team;

            _.each(win, function(player) {
                var found = _.findWhere(playerCount, {
                    _id: player._id
                });
                if (found) {
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

            _.each(lose, function(player) {
                var found = _.findWhere(playerCount, {
                    _id: player._id
                });
                if (found) {
                    found.total += 1;
                    found.lost += 1;
                    found.winningStreak = 0;
                    found.losingStreak += 1;
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

            _.each(allPlayers, function(player) {
                var playerOnTeam = _.findWhere(win, {
                    '_id': player._id
                });
                if (!playerOnTeam) {
                    playerOnTeam = _.findWhere(lose, {
                        '_id': player._id
                    });
                }

                var found = _.findWhere(playerCount, {
                    _id: player._id
                });
                if (playerOnTeam) {
                    if (found) {
                        found.playingStreak += 1;
                    }
                } else {

                    if (found) {
                        found.playingStreak = 0;
                    }
                }
                if (found) {
                    found.winPercentage = (found.win / found.total).toFixed(3);
                    winTotal += parseFloat(found.winPercentage);
                }
            });

        });

        var avgWin = parseFloat(winTotal / allPlayers.length);
        var constant = 10;
        _.each(allPlayers, function(player) {
            // (Wins + constant * Average Win % of all players) / (Wins + Losses + constant)
            var wins = parseInt(player.profile.wins);
            var loses = parseInt(player.profile.loses);
            var elo = (wins + constant * avgWin) / (wins + loses + constant);
            if (elo){
                console.log(elo);

                Meteor.users.update({
                    '_id': player._id
                }, {
                    $set: {
                        elo: elo
                    }
                });
            }
        });



        var highestPlayingStreak = multiplemax(playerCount, 'playingStreak');
        var highestLosingStreak = multiplemax(playerCount, 'losingStreak');
        var highestWinningStreak = multiplemax(playerCount, 'winningStreak');


        // var highestPlayingStreak = _.max(playerCount, function(player){ return player.playingStreak; });
        // var highestLosingStreak = _.max(playerCount, function(player){ return player.losingStreak; });
        // var highestWinningStreak = _.max(playerCount, function(player){ return player.winningStreak; });

        var newHigh = false;
        var newLow = false;
        var newPlay = false;

        var currectPlaying = PlayingStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];

        if (!currectPlaying || highestPlayingStreak[0].playingStreak > currectPlaying.score) {
            newPlay = true;

            var names = [];
            var ids = [];

            _.each(highestPlayingStreak, function(top) {
                if(top){
                    names.push(top.name);
                    ids.push(top._id);
                }
            });


            if (highestPlayingStreak.length){
                PlayingStreak.insert({
                    name: names,
                    playerId: ids,
                    score: highestPlayingStreak[0].playingStreak,
                    when: new Date()
                });
            }
        }

        var currectWinning = WinningStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];

        if (!currectWinning || highestWinningStreak[0].winningStreak > currectWinning.score) {
            newHigh = true;

            var names = [];
            var ids = [];

            _.each(highestWinningStreak, function(top) {
                if (top){
                    names.push(top.name);
                    ids.push(top._id);
                }
            });

            if (highestWinningStreak.length){
                WinningStreak.insert({
                    name: names,
                    playerId: ids,
                    score: highestWinningStreak[0].winningStreak,
                    when: new Date()
                });
            }
        }

        var currectLosing = LosingStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];
        if (!currectLosing || highestLosingStreak[0].losingStreak > currectLosing.score) {
            newLow = true;

            var names = [];
            var ids = [];

            _.each(highestLosingStreak, function(top) {
                if(top){
                    names.push(top.name);
                    ids.push(top._id);
                }
            });

            if(highestLosingStreak.length){
                LosingStreak.insert({
                    name: names,
                    playerId: ids,
                    score: highestLosingStreak[0].losingStreak,
                    when: new Date()
                });
            }
        }

        _.each(playerCount, function(player) {
            Meteor.users.update({
                '_id': player._id
            }, {
                $set: {
                    'profile.winningStreak': player.winningStreak,
                    'profile.losingStreak': player.losingStreak,
                    'profile.total': player.total,
                    'profile.playingStreak': player.playingStreak,
                    'profile.wins': player.win,
                    'profile.loses': player.lost,
                    'profile.winPercentage': player.winPercentage
                }
            });
        });
        return {
            players: playerCount,
            newHigh: newHigh,
            newLow: newLow,
            newPlay: newPlay
        };
    }
});
