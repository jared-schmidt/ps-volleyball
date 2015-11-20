Meteor.startup(function() {
    Meteor.subscribe('userData');
});

Session.setDefault('team1', []);
Session.setDefault('team2', []);
Session.setDefault('stats', []);
Session.setDefault('pastTeams', []);
Session.setDefault('records', {});


Template.hello.helpers({
    dateFormat: function() {
        return moment(this.when).format('LL');
    },
    players: function() {
        return Meteor.users.find({}, {
            sort: {
                'profile.wins': -1
            }
        }).fetch();
    },
    team1: function() {
        console.log("getting team 1");
        var team = Team1.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')) {
            if (_.findWhere(team[0].team, {
                    _id: Meteor.userId()
                })) {
            } else {
                console.log("not home")
            }
            console.log("found team 1");
            return team[0].team;
        } else {
            console.log("no team 1 found")
            return [];
        }
    },
    team2: function() {
        console.log("getting team 2");
        var team = Team2.find({}).fetch();
        if (team.length === 1 && team[0].hasOwnProperty('team')) {
            if (_.findWhere(team[0].team, {
                    _id: Meteor.userId()
                })) {
            } else {
                console.log("not away")
            }
            console.log("found team 2")
            return team[0].team;
        } else {
            console.log("no team 2 found");
            return [];
        }
    },
    booleanToString: function(v) {
        return v ? 'Yes' : 'No';
    },
    isAdmin: function() {
        console.log("checking admin")
        if (Meteor.user()) {
            return Meteor.user().profile.name === 'Jared Schmidt' || Meteor.user().profile.name === 'Chris Scott' || Meteor.user().profile.name === 'Jonathan Savage' || Meteor.user().profile.name === 'Peter Kohlway';
        }
        return false;
    },
    isActive: function() {
        console.log("checking is active");
        return Meteor.user().profile.active;
    },
    stats: function() {
        console.log("gettings stats");
        return Session.get('stats');
    },
    pastTeams: function() {
        console.log('getting past teams');
        return Session.get('pastTeams');
    },
    records: function() {
        console.log("gettings records");
        return Session.get('records');
    }
});

Template.hello.events({
    'click #highest': function(e) {
        e.preventDefault();
        Meteor.call('getHighestRecords', function(err, data) {
            console.log(data);
            $('#recordsCard').show();
            Session.set('records', data);
        });
    },
    'change #activeSelect': function(e) {
        e.preventDefault();
        var newValue = $(e.target).is(":checked");
        Meteor.call('changeStatus', newValue);
    },
    'change .user-active-toggle' : function(e) {
        e.preventDefault();
        var newValue = $(e.target).is(":checked");
        Meteor.call('changeUserStatus', newValue, this._id);
    },
    'click #teamsModal': function(e){
        e.preventDefault();
        $('#modal1').openModal();
    },
    'click #createTeams': function(e) {
        e.preventDefault();
        if (Meteor.user().profile.name === 'Jared Schmidt' || Meteor.user().profile.name === 'Chris Scott' || Meteor.user().profile.name === 'Jonathan Savage'  || Meteor.user().profile.name === 'Peter Kohlway') {
            Meteor.call('createTeams', function(){
                Materialize.toast('Created Teams!', 4000);
            });
        } else {
            Materialize.toast('Need to be an admin', 4000);
        }
    },
    'click #team1Win': function(e) {
        e.preventDefault();
        Meteor.call('markTeam1Win');
        Materialize.toast('Home Team Won!', 4000);
    },
    'click #team2Win': function(e) {
        e.preventDefault();
        Meteor.call('markTeam2Win');
        Materialize.toast('Away Team Won!', 4000);
    },
    'click #fix': function(e) {
        e.preventDefault();
        Meteor.call('fixTotalGamesPlayer', function(err, data) {
            console.log(data);
            Session.set('stats', data.players);
            $('#stats').show();
        });
    },
    'click #pastTeamsBtn': function(e) {
        e.preventDefault();
        Meteor.call('pastTeams', function(err, data) {
            console.log(data);
            Session.set('pastTeams', data);
            $('#pastTeams').show();
        });
    }

});
