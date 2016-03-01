Meteor.startup(function() {
    Meteor.subscribe('userData');
});

Session.setDefault('team1', []);
Session.setDefault('team2', []);
Session.setDefault('stats', []);
Session.setDefault('pastTeams', []);
Session.setDefault('records', {});

Template.hello.rendered = function(){
    var clipboard = new Clipboard('.btn-copy');
    clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        Materialize.toast('Copied to clipboard!', 4000);
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
        Materialize.toast('Error coping!', 4000);
    });
}

Template.hello.helpers({
    isCordova: function(){
        return Meteor.isCordova;
    },
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
    dateFormat: function() {
        return moment(this.when).format('LL');
    },
    players: function() {
        return Meteor.users.find({
            'profile.retired': false
        }, {
            sort: {
                'profile.name': -1
            }
        }).fetch();
    },
    retiredPlayers: function() {
        return Meteor.users.find({
            'profile.retired': true
        }, {
            sort: {
                'profile.name': -1,
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
    isAdmin: function() {
        return Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'default-group');
    },
    isSuperAdmin: function() {
        return Roles.userIsInRole(Meteor.userId(), ['super-admin'], 'default-group');
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
    pastTeams: function() {
        var pastGames = PastTeams.find({}, {
            sort: {
                'when': 1
            }
        }).fetch();
        return pastGames;
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
    'click #getPastData': function(e){
        alert('LOOK IN JAVASCRIPT CONSOLE');
        console.log(Meteor.users.find({}, {fields: {'profile.past': 1, 'profile.name': 1}}).fetch());
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
    'click #team1Clear': function(e) {
        Meteor.call('clearTeam1', function(err, status) {
            if (err) {
                Materialize.toast('Error!', 4000);
                console.error(err);
            } else {
                if (status) {
                    Materialize.toast('Clear Home Team!', 4000);
                } else {
                    Materialize.toast('Did nothing...', 4000);
                }
            }
        });
    },
    'click #team2Clear': function(e) {
        Meteor.call('clearTeam2', function(err, status) {
            if (err) {
                Materialize.toast('Error!', 4000);
                console.error(err);
            } else {
                if (status) {
                    Materialize.toast('Clear Away Team!', 4000);
                } else {
                    Materialize.toast('Did nothing...', 4000);
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
    'click #removePlayer': function(e) {
        e.preventDefault();
        var teamId = $(e.currentTarget).attr("team-id");
        Meteor.call('removePlayer', {
            'id': this._id,
            'teamId': teamId
        }, function(err, status) {
            if (err) {
                Materialize.toast('Error!', 4000);
            }
            if (status) {
                Materialize.toast('Player Removed!', 4000);
            } else {
                Materialize.toast('Shit if I number...', 4000);
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
    // 'change .input-field' : function(e){
    //     e.preventDefault();
    //     var newValue = $(e.target).val();
    //     Meteor.call('changeUserTitle', newValue, this._id);
    // },
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
    'click #team1Win': function(e) {
        e.preventDefault();
        Meteor.call('markTeam1Win');
        Materialize.toast('Home Team Won!', 4000);
    },
    'click #team2Win': function(e) {
        e.preventDefault();
        Meteor.call('markTeam2Win');
        Materialize.toast('Away Team Won!', 4000);
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

    }

});
