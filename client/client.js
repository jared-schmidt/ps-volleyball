Meteor.startup(function() {
    Meteor.subscribe('userData');
});

Session.setDefault('team1', []);
Session.setDefault('team2', []);
Session.setDefault('stats', []);
Session.setDefault('pastTeams', []);
Session.setDefault('records', {});


Template.hello.helpers({
    dateFormat: function() {
        return moment(this.when).format('LL');
    },
    players: function() {
        console.log(Meteor.users.find({}).fetch());
        return Meteor.users.find({}, {
            sort: {
                'profile.wins': -1
            }
        }).fetch();
    },
    team1: function() {
        console.log("getting team 1");
        var team = Team1.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')) {
            if (_.findWhere(team[0].team, {
                    _id: Meteor.userId()
                })) {
            } else {
                console.log("not home");
            }
            console.log("found team 1");
            return {
                'team': team[0].team,
                'teamPercentage': team[0].teamPercentage
            };
        } else {
            console.log("no team 1 found");
            return {
                'team': [],
                'teamPercentage': 0
            };
        }
    },
    team2: function() {
        console.log("getting team 2");
        var team = Team2.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')) {
            if (_.findWhere(team[0].team, {
                    _id: Meteor.userId()
                })) {
            } else {
                console.log("not away");
            }
            console.log("found team 2");
            return {
                'team': team[0].team,
                'teamPercentage': team[0].teamPercentage
            };
        } else {
            console.log("no team 2 found");
            return {
                'team': [],
                'teamPercentage': 0
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
        console.log("checking is active");
        return Meteor.user().profile.active;
    },
    stats: function() {
        console.log(Meteor.users.find({}));
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
    'change .input-field' : function(e){
        e.preventDefault();
        var newValue = $(e.target).val();
        Meteor.call('changeUserTitle', newValue, this._id);
    },
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
        Meteor.call('fixTotalGamesPlayer');
    },
    'click #pastTeamsBtn': function(e) {
        e.preventDefault();

    }

});
