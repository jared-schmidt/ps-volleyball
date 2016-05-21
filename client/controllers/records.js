Template.records.events({

});

Template.records.helpers({
    records: function() {
        var currectPlaying = PlayingStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];
        var currectWinning = WinningStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];
        var currectLosing = LosingStreak.find({}, {
            sort: {
                'score': -1
            }
        }).fetch()[0];
        return {
            playing: currectPlaying,
            winning: currectWinning,
            losing: currectLosing
        };
    }
});
