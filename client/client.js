Session.setDefault('team1', []);
Session.setDefault('team2', []);

var players = [
    'Jon Savage',
    'Pete Kohlway',
    'Randy Neatrour',
    'Dave Bodenschatz',
    'Chris Scott',
    'Jared Schmidt',
    'Lou Wolford'
];

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


Template.hello.helpers({
    players: function() {
        return players;
    },
    team1: function() {
        return Session.get('team1');
    },
    team2: function() {
        return Session.get('team2');
    }
});

Template.hello.events({
    'click button': function() {
        var mixed = shuffle(players);
        Session.set('team1', mixed.slice(0, 3));
        Session.set('team2', mixed.slice(3, players.length));
    }
});
