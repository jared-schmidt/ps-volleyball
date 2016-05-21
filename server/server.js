

function isOdd(num) {
    return num % 2;
}

function elo(w, l, avg, c){return (w + c * avg)/(w + l + c)}

Meteor.publish('userData', function() {
    if (!this.userId) return null;
    return Meteor.users.find(this.userId, {
        fields: {
            wins: 1,
        }
    });
});

function isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'default-group');
}

function isSuperAdmin(){
    return Roles.userIsInRole(Meteor.userId(), ['super-admin'], 'default-group');
}

function multiplemax(arr, compare) {
    var max = _.max(arr, function(v) {
        return v[compare];
    });
    return _.filter(arr, function(v) {
        return v[compare] == max[compare];
    });
}

function playerExists(team, playerId) {
  var status = false;
  _.each(team, function(player) {
    if (player._id == playerId) {
      status = true;
    }
  });
  return status;
}

Meteor.methods({
    log: function(did){
        Logs.insert({
            'user': Meteor.user()._id,
            'did': did,
            'when': new Date()
        });
    },
    markTeam1Win: function(isTie) {
        if (isAdmin()) {
            var team = Team1.findOne({});
            if (team && team.team.length > 0) {
                _.each(team.team, function(player) {
                    Meteor.users.update({
                        '_id': player._id
                    }, {
                        $inc: {
                            'profile.wins': 1
                        }
                    });
                });

                PastTeams.insert({
                    winningTeam: Team1.findOne({}),
                    losingTeam: Team2.findOne({}),
                    when: new Date(),
                    side: 'Home',
                    isTie: isTie
                });

                Team1.remove({});
                Team2.remove({});
            }
            Meteor.call('fixTotalGamesPlayer');
        }
    },
    markTeam2Win: function(isTie) {
        if (isAdmin()) {
            var team = Team2.findOne({});
            if (team && team.team.length > 0) {
                _.each(team.team, function(player) {
                    Meteor.users.update({
                        '_id': player._id
                    }, {
                        $inc: {
                            'profile.wins': 1
                        }
                    });
                });

                PastTeams.insert({
                    winningTeam: Team2.findOne({}),
                    losingTeam: Team1.findOne({}),
                    when: new Date(),
                    side: 'Away',
                    isTie: isTie
                });

                Team1.remove({});
                Team2.remove({});
            }
            Meteor.call('fixTotalGamesPlayer');
        }
    }
});
