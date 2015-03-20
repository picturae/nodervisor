/*
 * GET log page
 */

exports.log = function(params) {
	var config = params.config;
	return function(req, res) {

		if (!req.session.loggedIn) {
			res.redirect('/login');
		}

        var processes = [], error = null;
		if (req.params.host && req.params.process) {
			if (config.hosts[req.params.host] === undefined) {
				error = "Host not found";
			} else {
                processes = [{
                    host: req.params.host,
                    process: req.params.process
                }];
            }
		} else if (req.query.ids) {
            req.query.ids.forEach(function(id) {
                var host = id.replace(/^.*@([^@]+)$/, '$1');
                var process = id.replace(/^(.*)@[^@]+$/, '$1');
                if (config.hosts[host] === undefined) {
                    error = "Host not found";
                } else if (!error && id.indexOf('@')) {
                    processes.push({
                        host: host,
                        process: process
                    });
                }
            });
        } else {
            return;
        }
        res.render('log', {
            title: 'Nodervisor - Log',
            session: req.session,
            error: error,
            hosts: config.hosts,
            processes: processes,
            type: req.params.type || 'out',
            url: req.originalUrl,
            split: parseInt(req.params.split)
        });
	};
};