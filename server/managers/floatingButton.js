Meteor.methods({
    endSeason: function() {
        if (isSuperAdmin()) {
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

            _.each(Meteor.users.find().fetch(), function(player) {
                Meteor.users.update({
                    '_id': player._id
                }, {
                    $set: {
                        'profile.winningStreak': 0,
                        'profile.losingStreak': 0,
                        'profile.total': 0,
                        'profile.playingStreak': 0,
                        'profile.wins': 0,
                        'profile.loses': 0,
                        'profile.winPercentage': 0.0,
                        'profile.points': 0,
                        'profile.elo': 0.0

                    }
                });
            });
            return true;
        }
        return false;
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
    createTeamsOptimized: function() {
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
        }, {
            'sort': {
                'profile.winPercentage': -1,
                'profile.winningStreak': -1,
                'profile.losingStreak': 1
            }
        }).fetch();

        var team1 = [];
        var team2 = [];

        // /////////////////////////////////////////////////////////////////////////////////////////
        // Part of Dave's

        // Rookies (players who played less then 3 games)
        var rookies = [];
        var remainingPlayers = allActivePlayers;

        _.each(allActivePlayers, function(player, index) {
            if (player && player.profile.total <= 3) {
                rookies.push(player);
                remainingPlayers = _.without(allActivePlayers, _.findWhere(allActivePlayers, {
                    '_id': player._id
                }));
            }
        });

        allActivePlayers = remainingPlayers;

        // /////////////////////////////////////////////////////////////////////////////////////////


        // Put best and worst player on the same team
        var bestPlayer = allActivePlayers.shift();
        var worstPlayer = allActivePlayers.pop();
        // console.log("Best -> ", bestPlayer);
        team1.push(bestPlayer);
        team1.push(worstPlayer);

        // If more than 2 players remaining, put second best and second worst on same team
        // If there is only one player left it will skip this and put them on team 2
        if (allActivePlayers.length > 1) {
            team2.push(allActivePlayers.shift());
            team2.push(allActivePlayers.pop());
        }

        // -----------------------------------------------------------------------------------------

        // Lou's
        // var shuffledPlayers = _.shuffle(allActivePlayers);
        // // Alternate the rest of the players if even number are left
        // if (! isOdd(shuffledPlayers.length)){
        //     _.each(shuffledPlayers, function(player, index){
        //         if (isOdd(index)){
        //             team1.push(player);
        //         } else {
        //             team2.push(player);
        //         }
        //     });
        // }
        // else{
        //     _.each(shuffledPlayers, function(player, index){
        //         var randomNum = Math.floor((Math.random() * 10) + 1);
        //         if (isOdd(randomNum)){
        //             team1.push(player);
        //         }
        //         else{
        //             team2.push(player);
        //         }
        //     });

        //     // In case random number unbalances teams
        //     while(team1.length - team2.length > 1){
        //         team2.push(team1.pop());
        //     }
        //     while(team2.length - team1.length > 1){
        //         team1.push(team2.pop());
        //     }
        // }

        // -----------------------------------------------------------------------------------------

        // Dave's
        var flipSide = false;
        var team1Turn = true;
        var randomLastPlayer = null;

        if (isOdd(allActivePlayers.length)) {
            randomLastPlayer = allActivePlayers.pop();
        }
        var firstLoop = true;

        //Pop off the current top which would be player 3 onto team 2
        team2.push(allActivePlayers.shift());

        //loop through the remainders now give 2 to each team
        while (allActivePlayers.length > 0)
        {

            if (team1Turn)
            {
                team1.push(allActivePlayers.shift());

                //if not empty yet give them another
                if (allActivePlayers.length != 0)
                {
                    team1.push(allActivePlayers.shift());
                }
                team1Turn = false;
            }
            else
            {
                team2.push(allActivePlayers.shift());

                //if not empty yet give them another
                if (allActivePlayers.length != 0)
                {
                    team2.push(allActivePlayers.shift());
                }
                team1Turn = true;
            }
        }

        // for (var i=0; i<=allActivePlayers.length-2; i++){
        //     if (firstLoop){
        //         team2.push(allActivePlayers[i].pop());
        //         //allActivePlayers = _.without(allActivePlayers, _.findWhere(allActivePlayers, {'_id': allActivePlayers[i]._id}));
        //         firstLoop = false;
        //     } else {
        //         if (!flipSide){
        //             team1.push(allActivePlayers[i].pop());
        //             //allActivePlayers = _.without(allActivePlayers, _.findWhere(allActivePlayers, {'_id': allActivePlayers[i]._id}));
        //             if (allActivePlayers[i+1]){
        //                 team1.push(allActivePlayers[i+1].pop());
        //                 //allActivePlayers = _.without(allActivePlayers, _.findWhere(allActivePlayers, {'_id': allActivePlayers[i]._id}));
        //             }
        //             flipSide = true;
        //         } else {
        //             team2.push(allActivePlayers[i].pop());
        //             allActivePlayers = _.without(allActivePlayers, _.findWhere(allActivePlayers, {'_id': allActivePlayers[i]._id}));
        //             if (allActivePlayers[i+1]){
        //                 team2.push(allActivePlayers[i+1]);
        //                 allActivePlayers = _.without(allActivePlayers, _.findWhere(allActivePlayers, {'_id': allActivePlayers[i]._id}));
        //             }
        //         }
        //     }
        // }

        if (randomLastPlayer) {
            var randomNum = Math.floor((Math.random() * 10) + 1);
            if (isOdd(randomNum)) {
                team1.push(randomLastPlayer);
            }
            else {
                team2.push(randomLastPlayer);
            }
        }

        // Rookies (players who played less then 3 games)
        var team1Turn = true;
        if (Math.random() >= 0.5) {
            team1Turn = false;
        }
        // mix up array
        rookies = _.shuffle(rookies);
        // go through and randomly place
        while (rookies.length > 0){
        	var player = rookies.shift();
        	if (team1Turn) {
        	    team1.push(player);
        	    team1Turn = false;
        	} else {
        	    team2.push(player);
        	    team1Turn = true;
        	}
        }


        // In case random number unbalances teams
        while (team1.length - team2.length > 1) {
            team2.push(team1.pop());
        }
        while (team2.length - team1.length > 1) {
            team1.push(team2.pop());
        }
        // -----------------------------------------------------------------------------------------


        var count = 0;
        var team1Percentage = 0.0;
        var team1Points = 0;
        var team2Percentage = 0.0;
        var team2Points = 0;
        _.each(team1, function(player) {
            count += 1;
            team1Percentage += parseFloat(player.profile.winPercentage);
            team1Points += parseInt(player.profile.points);
        });
        team1Percentage = parseFloat(team1Percentage) / parseInt(count);

        count = 0;
        _.each(team2, function(player) {
            count += 1;
            team2Percentage += parseFloat(player.profile.winPercentage);
            team2Points += parseInt(player.profile.points);
        });
        team2Percentage = parseFloat(team2Percentage) / parseInt(count);
        if (team1.length > 0 && team2.length > 0) {
            if (isAdmin()) {
                if (isOdd(Math.floor(Math.random() * 2) + 1)) {
                    Team1.remove({});
                    Team1.insert({
                        'team': team1,
                        'teamPercentage': team1Percentage.toFixed(3),
                        'points': team1Points,
                        'created': new Date(),
                        'random': true
                    });
                    Team2.remove({});
                    Team2.insert({
                        'team': team2,
                        'teamPercentage': team2Percentage.toFixed(3),
                        'points': team2Points,
                        'created': new Date(),
                        'random': true
                    });
                } else {
                    Team1.remove({});
                    Team1.insert({
                        'team': team2,
                        'teamPercentage': team2Percentage.toFixed(3),
                        'points': team2Points,
                        'created': new Date(),
                        'random': true
                    });
                    Team2.remove({});
                    Team2.insert({
                        'team': team1,
                        'teamPercentage': team1Percentage.toFixed(3),
                        'points': team1Points,
                        'created': new Date(),
                        'random': true
                    });
                }
            }
            return "Created Optimized Teams!";
        } else {
            return "Not enough people to create team";
        }
    }
});
