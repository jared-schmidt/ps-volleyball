Template.floatingButton.events({
    'click #endSeasonModalBtn': function(e) {
        e.preventDefault();
        $('#endSeasonModal').openModal();
    },
    'click #teamsModal': function(e) {
        e.preventDefault();
        $('#modal1').openModal();
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
    }
});

Template.floatingButton.helpers({

});
