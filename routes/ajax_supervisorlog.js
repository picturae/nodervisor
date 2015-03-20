/*
 * GET downloadctl page.
 */

exports.ajax_supervisorlog = function(params) {
	var config = params.config;
	var supervisordapi = params.supervisordapi;

	return function(req, res) {

		if (!req.session.loggedIn) {
			res.send({error: 'Not logged in'});
		} else {
			var host = req.param('host');
			var process = req.param('process');
			var offset = parseInt(req.param('offset'), 10);
			var length = 16384;

			if (config.hosts[host] !== undefined) {
				var supclient = supervisordapi.connect(config.hosts[host].Url);

                if (req.param('type') === 'err') {
                    supclient.tailProcessStderrLog(process, offset, length, function(err, data){
                        if (!err) {
                            // For some reason it doesnt use the length properly, so trim it to expected length now
                            length = data[1] - offset;
                            var log = data[0];
                            data[0] = log.substr(length * -1);
                            res.send({result: 'success', data: data});
                        } else {
                            res.send({result: 'error', error: err});
                        }
                    });
                } else {
                    supclient.tailProcessStdoutLog(process, offset, length, function(err, data){
                        if (!err) {
                            // For some reason it doesnt use the length properly, so trim it to expected length now
                            length = data[1] - offset;
                            var log = data[0];
                            data[0] = log.substr(length * -1);
                            res.send({result: 'success', data: data});
                        } else {
                            res.send({result: 'error', error: err});
                        }
                    });
                }
			} else {
				res.send({result: 'error', message: 'Host not found'});
			}
		}
	};
};