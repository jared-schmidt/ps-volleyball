Meteor.startup(function() {
    Meteor.subscribe('userData');
});


Template.hello.helpers({
    settings: function() {
        return {
            rowsPerPage: 15,
            showFilter: false,
            showNavigationRowsPerPage: false,
            showRowCount: false,
            showNavigation: 'auto',
            fields: [
                {
                    key: 'profile.name',
                    label: 'Name'
                },
                {
                    key: 'profile.wins',
                    label: 'Wins'
                },
                {
                    key: 'profile.loses',
                    label: 'Loses'
                },
                {
                    key: 'profile.winPercentage',
                    label: 'Win %',
                    sortOrder: 1, sortDirection: 'desc'
                },
                {
                    key: 'profile.elo',
                    label: 'Elo'
                },
                {

                    key: 'profile.points',
                    label: 'Points'
                },
                {
                    key: 'profile.winningStreak',
                    label: 'Winning Streak'
                },
                {
                    key: 'profile.losingStreak',
                    label: 'Losing Streak'
                },
                {
                    key: 'profile.playingStreak',
                    label: 'Playing Streak'
                },
                {
                    key: 'profile.total',
                    label: 'Total Games'
                }
            ]
        };
    },
    onSuccess: function() {
        var id = this._id;
        return function(res, val) {
            Meteor.call('changeUserTitle', val, id, function(err, data) {
                if (err) {
                    console.error(err);
                    Materialize.toast('Error!', 4000);
                }
                Materialize.toast('Changed title', 4000);
            });
        }
    },

    activePlayers: function(){
        return Meteor.users.find({
            'profile.retired': false,
            'profile.active': true
        }).count();
    },
    players: function() {
        return Meteor.users.find({
            'profile.retired': false
        }, {
            sort: {
                'profile.name': 1
            }
        }).fetch();
    },

    team1: function() {
        var team = Team1.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')) {
            if (_.findWhere(team[0].team, {
                    _id: Meteor.userId()
                })) {} else {}
            return {
                'team': team[0].team,
                'points': team[0].points,
                'teamPercentage': team[0].teamPercentage,
                'random': team[0].random
            };
        } else {
            return {
                'team': [],
                'points': 0,
                'teamPercentage': 0,
                'random': null
            };
        }
    },
    team2: function() {
        var team = Team2.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')) {
            if (_.findWhere(team[0].team, {
                    _id: Meteor.userId()
                })) {} else {}
            return {
                'team': team[0].team,
                'points': team[0].points,
                'teamPercentage': team[0].teamPercentage,
                'random': team[0].random
            };
        } else {
            return {
                'team': [],
                'points': 0,
                'teamPercentage': 0,
                'random': null
            };
        }
    },
    booleanToString: function(v) {
        return v ? 'Yes' : 'No';
    },
    isActive: function() {
        return Meteor.user().profile.active;
    },
    stats: function() {
        return Meteor.users.find({
            'profile.retired': false
        }, {
            sort: {
                'profile.name': -1
            }
        }).fetch();
    },

    records: function() {
        var currectPlaying = PlayingStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];
        var currectWinning = WinningStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];
        var currectLosing = LosingStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];
        return {
            playing: currectPlaying,
            winning: currectWinning,
            losing: currectLosing
        };
    }
});










Template.hello.events({
    'click #WeatherBtn' : function(e){
        $('#weatherModal').openModal();
    },
    'click #getPastData': function(e){
        alert('LOOK IN JAVASCRIPT CONSOLE');
        console.log(Meteor.users.find({}, {fields: {'profile.past': 1, 'profile.name': 1}}).fetch());
        // clippyAgent.speak('That is some past data!');
    },
    'click #pastData': function(e){
        Meteor.call('getPastTeamData', function(err, status){
            if (err) {
                Materialize.toast('Error!', 4000);
                console.error(err);
            } else {
                if (status) {
                    Materialize.toast('Fixed Past!', 4000);
                }
            }
        });
    },
    'click #makeHome': function(e) {
        e.preventDefault();
        Meteor.call('addToHome', this._id, function(err, status) {
            if (err) {
                Materialize.toast('Error!', 4000);
                console.error(err);
            }

            if (status) {
                Materialize.toast('Added to Home!', 4000);
            } else {
                Materialize.toast('Did nothing...', 4000);
            }
        });
    },
    'click #makeAway': function(e) {
        e.preventDefault();
        Meteor.call('addToAway', this._id, function(err, status) {
            if (err) {
                Materialize.toast('Error!', 4000);
                console.error(err);
            }

            if (status) {
                Materialize.toast('Added to Home!', 4000);
            } else {
                Materialize.toast('Did nothing...', 4000);
            }
        });
    },
    'click #retire': function(e) {
        e.preventDefault();
        Meteor.call('retire', this._id, function(err, status) {
            if (err) {
                Materialize.toast('Error!', 4000);
                console.error(err);
            }

            if (status) {
                Materialize.toast('Retired!', 4000);
            } else {
                Materialize.toast('Did nothing...', 4000);
            }
        });
    },
    'click #unretire': function(e){
        e.preventDefault();
        Meteor.call('unretire', this._id, function(err, status) {
            if (err) {
                Materialize.toast('Error!', 4000);
                console.error(err);
            }

            if (status) {
                Materialize.toast('OUT OF RETIREMENT!', 4000);
            } else {
                Materialize.toast('Did nothing...', 4000);
            }
        });
    },

    'click #endSeason': function(e) {
        e.preventDefault();
        Meteor.call('endSeason', function(err, status) {
            if (err) {
                Materialize.toast('Error!', 4000);
                console.error(err);
            }

            if (status) {
                Materialize.toast('Cleared everything!', 4000);
            } else {
                Materialize.toast('Did nothing...', 4000);
            }
        });
    },
    'click #highest': function(e) {
        e.preventDefault();
    },
    'change #activeSelect': function(e) {
        e.preventDefault();
        var newValue = $(e.target).is(":checked");
        Meteor.call('changeStatus', newValue);
    },
    'change .user-active-toggle': function(e) {
        e.preventDefault();
        var newValue = $(e.target).is(":checked");
        Meteor.call('changeUserStatus', newValue, this._id);
    },
    'click #teamsModal': function(e) {
        e.preventDefault();
        $('#modal1').openModal();
    },
    'click #endSeasonModalBtn': function(e) {
        e.preventDefault();
        $('#endSeasonModal').openModal();
    },
    'click #createTeams': function(e) {
        e.preventDefault();
        if (Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'default-group')) {
            Meteor.call('createTeams', function(err, message) {
                if (err) {
                    Materialize.toast('error', 4000);
                    console.error(err);
                } else {
                    Materialize.toast(message, 4000);
                }
            });
        } else {
            Materialize.toast('Need to be an admin', 4000);
        }
    },
    'click #createTeamsOptimized': function(e) {
        e.preventDefault();
        if (Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'default-group')) {
            Meteor.call('createTeamsOptimized', function(err, message) {
                if (err) {
                    Materialize.toast('error', 4000);
                    console.error(err);
                } else {
                    Materialize.toast(message, 4000);
                }
            });
        } else {
            Materialize.toast('Need to be an admin', 4000);
        }
    },
    'click #fix': function(e) {
        e.preventDefault();
        Materialize.toast('Trying to fix!', 2000);
        Meteor.call('fixTotalGamesPlayer', function(err, data) {
            if (err) {
                Materialize.toast('Error fixing', 4000);
                console.error(err);
            } else {
                Materialize.toast('Should be fixed!', 4000);
            }
        });
    },
    'click #pastTeamsBtn': function(e) {
        e.preventDefault();
    },
    'click .winningWay': function(e){
        e.preventDefault();
        var winningTeam = Session.get('winner');
        var isTie = $(e.currentTarget).attr("data-tie").toLowerCase() === 'true';
        if (winningTeam === 1) {
            Meteor.call('markTeam1Win', isTie, function(){
                Materialize.toast('Home Team Won!', 4000);
            });
        } else if (winningTeam === 2) {
            Meteor.call('markTeam2Win', isTie, function(){
                Materialize.toast('Away Team Won!', 4000);
            });
        }
    }

});
