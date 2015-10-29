Session.setDefault('team1', []);
Session.setDefault('team2', []);

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function isOdd(num) { return num % 2;}


Template.hello.helpers({
    players: function() {
        return Meteor.users.find({}).fetch();
    },
    team1: function() {
    var team = Team1.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')){
            return team[0].team;
        } else {
            return [];
        }
    },
    team2: function() {
        var team = Team2.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')){
            return team[0].team;
        } else {
            return [];
        }
    }
});

Template.hello.events({
    'click button': function() {
        var mixed = shuffle(Meteor.users.find({}).fetch());

        var oddPerson = null;

        if (isOdd(mixed.length)){
            oddPerson = mixed.pop();
        }

        var halfLength = mixed.length/2;
        var totalLength = mixed.length;

        var team1 = mixed.slice(0, halfLength);
        var team2 = mixed.slice(halfLength, totalLength);

        if (oddPerson){
            if ((Math.floor(Math.random() * 2) === 0)){
                team1.push(oddPerson);
            } else {
                team2.push(oddPerson);
            }
        }

        // Session.set('team1', team1);
        // Session.set('team2', team2);

        Meteor.call('team1', team1);
        Meteor.call('team2', team2);

    }
});

