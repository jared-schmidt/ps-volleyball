Meteor.startup(function() {
    Meteor.subscribe('userData');
});


Template.hello.helpers({
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

    isActive: function() {
        return Meteor.user().profile.active;
    },
    
});




Template.hello.events({
    'click #WeatherBtn' : function(e){
        $('#weatherModal').openModal();
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
