Template.team.rendered = function(){

}

Template.team.events({
    'click .removePlayer': function(e) {
        e.preventDefault();
        var teamId = $(e.currentTarget).attr("teamId");
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
    'click #team1Win': function(e) {
        e.preventDefault();
        $('#winningWay').openModal();
        Session.set('winner', 1);
    },
    'click #team2Win': function(e) {
        e.preventDefault();
        $('#winningWay').openModal();
        Session.set('winner', 2);
    }
});
