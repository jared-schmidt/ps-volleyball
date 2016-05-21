Meteor.methods({
	unretire: function(userId){
	    Meteor.users.update({
	        '_id': userId
	    }, {
	        $set: {
	            'profile.retired': false,
	            'profile.active': false
	        }
	    });
	    return true;
	}
});