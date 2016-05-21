Team1 = new Mongo.Collection("team1");
Team2 = new Mongo.Collection("team2");
PastTeams = new Mongo.Collection("pastTeams");
PlayingStreak = new Mongo.Collection("playingStreak");
WinningStreak = new Mongo.Collection("winningStreak");
LosingStreak = new Mongo.Collection("losingStreak");
PastSeasons = new Mongo.Collection('pastSeasons');
Logs = new Mongo.Collection('logs');

if (Meteor.isClient) {
    Meteor.subscribe("team1");
    Meteor.subscribe("team2");
    Meteor.subscribe("pastTeams");
    Meteor.subscribe("playingStreak");
    Meteor.subscribe("winningStreak");
    Meteor.subscribe("losingStreak");
    Meteor.subscribe('pastSeasons');
    Meteor.subscribe('logs');
}

if (Meteor.isServer) {
    Meteor.publish(null, function() {
        return Meteor.roles.find({});
    });

    Meteor.publish('userData', function() {
        return Meteor.users.find({}, {
            fields: {
                'profile': 1,
                'wins': 1,
                'services.google.picture': 1
            }
        });
    });

    Meteor.publish("team1", function() {
        return Team1.find();
    });
    Meteor.publish("team2", function() {
        return Team2.find();
    });
    Meteor.publish("pastTeams", function() {
        return PastTeams.find();
    });
    Meteor.publish("playingStreak", function() {
        return PlayingStreak.find();
    });
    Meteor.publish("winningStreak", function() {
        return WinningStreak.find();
    });
    Meteor.publish("losingStreak", function() {
        return LosingStreak.find();
    });
    Meteor.publish('pastSeasons', function() {
        return PastSeasons.find();
    });
}
