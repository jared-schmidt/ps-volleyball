Meteor.startup(function() {
    Meteor.subscribe('userData');
});

Session.setDefault('team1', []);
Session.setDefault('team2', []);

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function isOdd(num) { return num % 2;}


Template.hello.helpers({
    players: function() {
        return Meteor.users.find({}, {sort: {'profile.wins': -1}}).fetch();
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
    },
    isAdmin: function(){
        if (Meteor.user()){
            return Meteor.user().profile.name === 'Jared Schmidt' || Meteor.user().profile.name === 'Chris Scott' || Meteor.user().profile.name === 'Jonathan Savage';
        }
        return '';
    },
    isActive: function(){
        return Meteor.user().profile.active;
    },
    stats: function(){
        return Session.get('stats')
    }
});

Template.hello.events({
    'change #activeSelect': function(e){
      var newValue = $(e.target).is(":checked");
      Meteor.call('changeStatus', newValue);
    },
    'click #createTeams': function() {
        if (Meteor.user().profile.name === 'Jared Schmidt' || Meteor.user().profile.name === 'Chris Scott' || Meteor.user().profile.name === 'Jonathan Savage'){
            if (confirm("Create New Teams?")){
                var mixed = shuffle(Meteor.users.find({'profile.active': true}).fetch());

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
        } else {
            alert("Need to be an admin");
        }
    },
    'click #team1Win': function(){
        Meteor.call('markTeam1Win');
    },
    'click #team2Win': function(){
        Meteor.call('markTeam2Win');
    },
    'click #fix': function(e){
        e.preventDefault();
        Meteor.call('fixTotalGamesPlayer', function(err, data){
            console.log(data);
            Session.set('stats', data);
            $('#stats').show();
            // console.log('NAME --- WIN --- LOST --- TOTAL');
            // _.each(data, function(d){
            //     console.log(d.name + ' --- ' + d.win + ' --- ' + d.lost + ' --- ' + d.total);
            // });
            // alert('check javascript console');
        });
    }

});
