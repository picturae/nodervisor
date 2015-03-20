/*
 * GET supervisord page
 */

exports.supervisord = function(params) {
	var config = params.config;
	return function(req, res) {

		if (!req.session.loggedIn) {
			res.redirect('/login');
		}

		res.render('supervisord', {
			title: 'Nodervisor - All Hosts',
			session: req.session,
			maxLogs: config.options.maxLogs
		});
	};
};