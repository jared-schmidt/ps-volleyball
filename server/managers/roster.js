Meteor.methods({
    fixAll: function(){
        Meteor.call('getPastTeamData', function(){
            Meteor.call('fixTotalGamesPlayer');
        });
    },
    fixTotalGamesPlayer: function() {
        var allPlayers = Meteor.users.find().fetch();

        var pastGames = PastTeams.find({}, {
            sort: {
                'when': 1
            }
        }).fetch();

        var playerCount = [];

        var winPoints = 3;
        var winPointsBreaker = 2;
        var losePointsBreaker = 1;
        var losePoints = 0;

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
                    if (game.isTie) {
                        found.points += winPointsBreaker;
                    } else {
                        found.points += winPoints;
                    }
                } else {
                    var p = winPoints;
                    if (game.isTie) {
                        p = winPointsBreaker;
                    }
                    playerCount.push({
                        _id: player._id,
                        name: player.profile.name,
                        win: 1,
                        lost: 0,
                        winningStreak: 1,
                        losingStreak: 0,
                        playingStreak: 0,
                        total: 1,
                        points: p
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
                    if (game.isTie) {
                        found.points += losePointsBreaker;
                    } else {
                        found.points += losePoints;
                    }
                } else {
                    var p = losePoints;
                    if (game.isTie) {
                        p = losePointsBreaker;
                    }
                    playerCount.push({
                        _id: player._id,
                        name: player.profile.name,
                        lost: 1,
                        win: 0,
                        winningStreak: 0,
                        losingStreak: 1,
                        playingStreak: 0,
                        total: 1,
                        points: p
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
                }
            });

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
                if (top) {
                    names.push(top.name);
                    ids.push(top._id);
                }
            });


            if (highestPlayingStreak.length) {
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
                if (top) {
                    names.push(top.name);
                    ids.push(top._id);
                }
            });

            if (highestWinningStreak.length) {
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
                if (top) {
                    names.push(top.name);
                    ids.push(top._id);
                }
            });

            if (highestLosingStreak.length) {
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
                    'profile.winPercentage': player.winPercentage,
                    'profile.points': player.points
                },
                $inc: {
                    'career.wins': player.win,
                    'career.loses': player.lost,
                    'career.points': player.points,
                    'career.total': player.total
                }
            });
        });

        if (playerCount.length <= 0) {
            _.each(Meteor.users.find().fetch(), function(player) {
                Meteor.users.update({ '_id': player._id }, {
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
                    },
                    $inc: {
                        'career.wins': 0,
                        'career.loses': 0,
                        'career.points': 0,
                        'career.total': 0
                    }
                });
            });
        }

        var allPlayersWhoPlayed = Meteor.users.find({ 'profile.total': { $gt: 0 } }).fetch();
        var winTotal = 0.0;
        _.each(allPlayersWhoPlayed, function(player) {
            winTotal += parseFloat(player.profile.winPercentage);
        });

        var avgWin = parseFloat(winTotal / allPlayersWhoPlayed.length);


        _.each(allPlayersWhoPlayed, function(player) {
            // (Wins + constant * Average Win % of all players) / (Wins + Losses + constant)
            var wins = parseInt(player.profile.wins);
            var loses = parseInt(player.profile.loses);
            var constant = 25;
            if (player.profile.total < 8) {
                constant = 5;
            }
            var elo = (wins + constant * avgWin) / (wins + loses + constant);
            if (elo) {
                Meteor.users.update({
                    '_id': player._id
                }, {
                    $set: {
                        'profile.elo': elo.toFixed(3)
                    }
                });
            }
        });


        return {
            players: playerCount,
            newHigh: newHigh,
            newLow: newLow,
            newPlay: newPlay
        };
    },
    getPastTeamData: function() {
        Meteor.users.update({}, { $unset: { 'profile.past': [], 'career': {} } }, { multi: true });
        var seasons = PastSeasons.find().fetch();
        _.each(seasons, function(season, index) {

            var allPlayers = Meteor.users.find().fetch();

            var pastGames = _.sortBy(season.pastTeams, 'when');
            var playerCount = [];

            var winPoints = 3;
            var winPointsBreaker = 2;
            var losePointsBreaker = 1;
            var losePoints = 0;

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
                        if (game.isTie) {
                            found.points += winPointsBreaker;
                        } else {
                            found.points += winPoints;
                        }
                    } else {
                        var p = winPoints;
                        if (game.isTie) {
                            p = winPointsBreaker;
                        }
                        playerCount.push({
                            _id: player._id,
                            name: player.profile.name,
                            win: 1,
                            lost: 0,
                            winningStreak: 1,
                            losingStreak: 0,
                            playingStreak: 0,
                            total: 1,
                            points: p
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
                        if (game.isTie) {
                            found.points += losePointsBreaker;
                        } else {
                            found.points += losePoints;
                        }
                    } else {
                        var p = losePoints;
                        if (game.isTie) {
                            p = losePointsBreaker;
                        }
                        playerCount.push({
                            _id: player._id,
                            name: player.profile.name,
                            lost: 1,
                            win: 0,
                            winningStreak: 0,
                            losingStreak: 1,
                            playingStreak: 0,
                            total: 1,
                            points: p
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
                    }
                });

            });

            _.each(playerCount, function(player) {
                var stats = {
                    'season': index,
                    'winningStreak': player.winningStreak,
                    'losingStreak': player.losingStreak,
                    'total': player.total,
                    'playingStreak': player.playingStreak,
                    'wins': player.win,
                    'loses': player.lost,
                    'winPercentage': player.winPercentage,
                    'points': player.points
                }

                Meteor.users.update({
                    '_id': player._id,
                }, {
                    $addToSet: { 'profile.past': stats },
                    $inc: {
                        'career.wins': player.win,
                        'career.loses': player.lost,
                        'career.points': player.points,
                        'career.total': player.total
                    }
                });
            });


            // var allPlayersWhoPlayed = Meteor.users.find({'profile.total': {$gt: 0}}).fetch();
            // var winTotal = 0.0;
            // _.each(allPlayersWhoPlayed, function(player){
            //     winTotal += parseFloat(player.profile.winPercentage);
            // });

            // var avgWin = parseFloat(winTotal / allPlayersWhoPlayed.length);


            // _.each(allPlayersWhoPlayed, function(player) {
            //     // (Wins + constant * Average Win % of all players) / (Wins + Losses + constant)
            //     var wins = parseInt(player.profile.wins);
            //     var loses = parseInt(player.profile.loses);
            //     var constant = 25;
            //     if (player.profile.total < 8){
            //         constant = 5;
            //     }
            //     console.log(player.profile.name + ' = ' + constant);
            //     var elo = (wins + constant * avgWin) / (wins + loses + constant);
            //     if (elo){
            //         Meteor.users.update({
            //             '_id': player._id
            //         }, {
            //             $set: {
            //                 'profile.elo': elo.toFixed(3)
            //             }
            //         });
            //     }
            // });
        });

        return PastSeasons.find().fetch();
    },
    addToHome: function(userId) {
        if (isAdmin()) {
            var foundPlayer = Meteor.users.find({ '_id': userId }).fetch()[0];

            var count = 0;
            var team1Percentage = 0.0;

            var team1 = Team1.find().fetch()[0];

            if (team1) {
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
    addToAway: function(userId) {
        if (isAdmin()) {
            var foundPlayer = Meteor.users.find({ '_id': userId }).fetch()[0];

            var count = 0;
            var team2Percentage = 0.0;

            var team2 = Team2.find().fetch()[0];

            if (team2) {
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
    retire: function(userId) {
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
});
