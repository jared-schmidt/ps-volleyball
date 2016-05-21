Template.registerHelper( 'isAdmin', () => {
	return Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'], 'default-group');
});

Template.registerHelper( 'isSuperAdmin', () => {
	return Roles.userIsInRole(Meteor.userId(), ['super-admin'], 'default-group');
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('dateFormat', function () {
	return moment(this.when).format('LL');
});

Template.registerHelper('isActive', function () {
	return Meteor.user().profile.active;
});
