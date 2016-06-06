Template.retiredPlayers.events({
    'click #unretire': function(e) {
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
    }
});

Template.retiredPlayers.helpers({
    retiredPlayers: function() {
        return Meteor.users.find({
            'profile.retired': true
        }, {
            sort: {
                'profile.name': 1,
            }
        }).fetch();
    },
    winPercentage: function(){
        return (this.career.wins/this.career.total).toFixed(2)
    }
});
