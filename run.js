/*global phantom:true, require:true, console:true, JSHINT:true */
(function () {
	// print help / options
	function print_help_and_exit() {
		console.log('Usage: phantomjs run.js file_to_lint.js [-p]');
		console.log('');
		console.log('Options:');
		console.log('');
		console.log('  -h      Print error messages human readable');
		console.log('  -j      Print error messages in json');
		phantom.exit(1000);
	}

	// var declarations
	var fs = require('fs');
	var filename, printFormat = false;
	var options;

	// default options
	options = {
		curly: true,	// require curly braces for if/while/for
		forin: true,	// require check for hasOwnProperty in for .. in loops
		newcap: true,	// require constructor function names to start with a Capital character
		browser: true,	// allow the use of browser globals (document, window, etc)
		devel: false,	// disallow use of development globals (console, debugger, alert)
		jquery: true,	// allow use of query globals ($, jQuery)
		trailing: true,	// dont allow trailing spaces, they can screw up multi-line strings
		undef: true		// require that variables are defined unless they have a  /*global ... */ comment
	};

	// process arguments
	for (var i = 0; i < phantom.args.length; i++) {
		if (phantom.args[i] === '-h' || phantom.args[i] === '-j') {
			if (printFormat) {
				console.log('Cannot output multiple formats');
				phantom.exit(1000);
			}
			printFormat = phantom.args[i];
		} else if (filename) {
			print_help_and_exit();
		} else {
			filename = phantom.args[i];
		}
	}

	// load JSHint
	if (!fs.isFile('jshint.js')) {
		console.log('jshint.js is required in the save directory as this script');
		phantom.exit(1000);
	} else {
		phantom.injectJs('jshint.js');
	}

	// load file and de-lint it
	if (!fs.isFile(filename) || !fs.isReadable(filename)) {
		print_help_and_exit();
	} else {
		var file = fs.read(filename);
		var hintPassed = JSHINT(file, options);

		// print results
		if (!printFormat || printFormat == '-h') {
			console.log(JSHINT.errors.length+(JSHINT.errors.length == 1 ? ' Error' : ' Errors'));
			if (JSHINT.errors.length > 0) { console.log(''); } // new line if there were errors
			JSHINT.errors.forEach(function(e) {
				// if the error is null, then we could not continue (too many errors)
				if (e === null) {
					console.log("Stopping, unable to continue.");
					return;
				}

				// get the raw error data
				var raw = e.raw;

				// do some formatting if the error data is available
				if ("undefined" !== typeof raw) {
					console.log(
						[
							'Line ', e.line,
							", Column ", e.character, ": ",
							e.reason
						].join("")
					);
						/*raw.replace("{a}", e.a).
							replace("{b}", e.b).
							replace("{c}", e.c).
							replace("{d}", e.d)].join(""));*/
				}
			});
		}
		else {
			var output = {
				passed: hintPassed,
				count: JSHINT.errors.length,
				errors: []
			};
			JSHINT.errors.forEach(function(e) {
				if (e !== null) { output.errors.push(e); }
			});
			console.log(JSON.stringify(output));
		}
		phantom.exit(JSHINT.errors.length);
	}
})();