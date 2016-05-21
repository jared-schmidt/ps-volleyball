Template.stats.events({
    'click #getPastData': function(e) {
        alert('LOOK IN JAVASCRIPT CONSOLE');
        console.log(Meteor.users.find({}, { fields: { 'profile.past': 1, 'profile.name': 1 } }).fetch());
    }
});

Template.stats.helpers({
    stats: function() {
        return Meteor.users.find({
            'profile.retired': false
        }, {
            sort: {
                'profile.name': -1
            }
        }).fetch();
    },
    settings: function() {
        return {
            rowsPerPage: 15,
            showFilter: false,
            showNavigationRowsPerPage: false,
            showRowCount: false,
            showNavigation: 'auto',
            fields: [{
                key: 'profile.name',
                label: 'Name'
            }, {
                key: 'profile.wins',
                label: 'Wins'
            }, {
                key: 'profile.loses',
                label: 'Loses'
            }, {
                key: 'profile.winPercentage',
                label: 'Win %',
                sortOrder: 1,
                sortDirection: 'desc'
            }, {
                key: 'profile.elo',
                label: 'Elo'
            }, {

                key: 'profile.points',
                label: 'Points'
            }, {
                key: 'profile.winningStreak',
                label: 'Winning Streak'
            }, {
                key: 'profile.losingStreak',
                label: 'Losing Streak'
            }, {
                key: 'profile.playingStreak',
                label: 'Playing Streak'
            }, {
                key: 'profile.total',
                label: 'Total Games'
            }]
        };
    }
});
