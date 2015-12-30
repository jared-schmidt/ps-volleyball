Meteor.startup(function() {
    Meteor.subscribe('userData');
});

Session.setDefault('team1', []);
Session.setDefault('team2', []);
Session.setDefault('stats', []);
Session.setDefault('pastTeams', []);
Session.setDefault('records', {});


Template.hello.helpers({
    onSuccess: function () {
        var id = this._id;
        return function (res, val) {
            Meteor.call('changeUserTitle', val, id, function(err, data){
                if(err){
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
        return Meteor.users.find({}, {
            sort: {
                'profile.wins': -1
            }
        }).fetch();
    },
    team1: function() {
        var team = Team1.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')) {
            if (_.findWhere(team[0].team, {
                    _id: Meteor.userId()
                })) {
            } else {
            }
            return {
                'team': team[0].team,
                'teamPercentage': team[0].teamPercentage,
                'random': team[0].random
            };
        } else {
            return {
                'team': [],
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
                })) {
            } else {
            }
            return {
                'team': team[0].team,
                'teamPercentage': team[0].teamPercentage,
                'random': team[0].random
            };
        } else {
            return {
                'team': [],
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
    isSuperAdmin: function(){
        return Roles.userIsInRole(Meteor.userId(), ['super-admin'], 'default-group');
    },
    isActive: function() {
        return Meteor.user().profile.active;
    },
    stats: function() {
        return Meteor.users.find({});
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
    'click #makeHome': function(e){
        e.preventDefault();
        Meteor.call('addToHome', this._id, function(err, status){
            if (err){
                Materialize.toast('Error!', 4000);
                console.error(err);
            }

            if (status){
                Materialize.toast('Added to Home!', 4000);
            } else {
                Materialize.toast('Did nothing...', 4000);
            }
        });
    },
    'click #makeAway': function(e){
        e.preventDefault();
        Meteor.call('addToAway', this._id, function(err, status){
            if (err){
                Materialize.toast('Error!', 4000);
                console.error(err);
            }

            if (status){
                Materialize.toast('Added to Home!', 4000);
            } else {
                Materialize.toast('Did nothing...', 4000);
            }
        });
    },
    'click #removePlayer': function(e) {
      e.preventDefault();
      var teamId = $(e.currentTarget).attr("team-id");
      Meteor.call('removePlayer', {'id': this._id, 'teamId': teamId}, function(err, status) {
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
    'click #endSeason': function(e){
        e.preventDefault();
        Meteor.call('endSeason', function(err, status){
            if (err){
                Materialize.toast('Error!', 4000);
                console.error(err);
            }

            if (status){
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
    'change .user-active-toggle' : function(e) {
        e.preventDefault();
        var newValue = $(e.target).is(":checked");
        Meteor.call('changeUserStatus', newValue, this._id);
    },
    // 'change .input-field' : function(e){
    //     e.preventDefault();
    //     var newValue = $(e.target).val();
    //     Meteor.call('changeUserTitle', newValue, this._id);
    // },
    'click #teamsModal': function(e){
        e.preventDefault();
        $('#modal1').openModal();
    },
    'click #endSeasonModalBtn': function(e){
        e.preventDefault();
        $('#endSeasonModal').openModal();
    },
    'click #createTeams': function(e) {
        e.preventDefault();
        if (Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'default-group')) {
            Meteor.call('createTeams', function(){
                Materialize.toast('Created Teams!', 4000);
            });
        } else {
            Materialize.toast('Need to be an admin', 4000);
        }
    },
    'click #createTeamsOptimized': function(e){
        e.preventDefault();
        if (Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'default-group')) {
            Meteor.call('createTeamsOptimized', function(){
                Materialize.toast('Created Optimized Teams!', 4000);
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
        Meteor.call('fixTotalGamesPlayer', function(err, data){
            if (err){
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
