Template.roster.events({
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
	}
});

Template.roster.helpers({
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
	booleanToString: function(v) {
	    return v ? 'Yes' : 'No';
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
	}
});