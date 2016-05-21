Meteor.methods({
	removePlayer: function(user) {
	  if (isAdmin()) {
	    // var foundPlayer = Meteor.users.find({'_id': user.id}).fetch()[0];
	    var team;
	    if (user.teamId == 1) {
	      team = Team1.find().fetch()[0].team;
	    } else if (user.teamId == 2) {
	      team = Team2.find().fetch()[0].team;
	    } else {
	      return false;
	    }
	    var count = 0;
	    var teamPercentage = 0.0;
	    for (var i = 0; i < team.length; i++) {
	      var player = team[i];
	      if (player._id === user.id) {
	        team.splice(i, 1);
	        i--;
	      } else {
	        count += 1;
	        teamPercentage += parseFloat(player.profile.winPercentage);
	      }
	    }
	    if (user.teamId == 1) {
	      Team1.remove({});
	      Team1.insert({
	          'team': team,
	          'teamPercentage': teamPercentage.toFixed(3),
	          'created': new Date(),
	          'random': false
	      });
	    } else {
	      Team2.remove({});
	      Team2.insert({
	          'team': team,
	          'teamPercentage': teamPercentage.toFixed(3),
	          'created': new Date(),
	          'random': false
	      });
	    }
	    return true;
	  }
	},
	clearTeam1: function(){
	    Team1.remove({});
	    return true;
	},
	clearTeam2: function(){
	    Team2.remove({});
	    return true;
	},
});