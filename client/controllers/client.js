Meteor.startup(function() {
    Meteor.subscribe('userData');

    var clipboard = new Clipboard('.btn-copy');
    clipboard.on('success', function(e) {
        Materialize.toast('Copied to clipboard!', 4000);
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        Materialize.toast('Error coping!', 4000);
    });
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
    }
});


Template.hello.events({
    'click #WeatherBtn': function(e) {
        $('#weatherModal').openModal();
    },
    'change #activeSelect': function(e) {
        e.preventDefault();
        var newValue = $(e.target).is(":checked");
        Meteor.call('changeStatus', newValue);
    },
    'click .winningWay': function(e) {
        e.preventDefault();
        var winningTeam = Session.get('winner');
        var isTie = $(e.currentTarget).attr("data-tie").toLowerCase() === 'true';
        if (winningTeam === 1) {
            Meteor.call('markTeam1Win', isTie, function() {
                Materialize.toast('Home Team Won!', 4000);
            });
        } else if (winningTeam === 2) {
            Meteor.call('markTeam2Win', isTie, function() {
                Materialize.toast('Away Team Won!', 4000);
            });
        }
    }

});
