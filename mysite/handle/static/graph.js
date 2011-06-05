function AjaxGraph(doc, url) {
    // setup plot
    var options = {
	series: { shadowSize: 0,
		  lines: { show: true },
		  points: { show: true }
        },
	xaxis: {
	    mode: 'time',
	    twelveHourClock: true
	},
	ticks: 10,
	updater: {
	    updateInterval: 1000,
	    totalPoints: 50,
	    ajax: {
		url: 'api',
		timeout: 2000,
		method: 'GET',
		data: {hi : 1}
	    }

	},
	    
    };
    $.plot(doc, [  ], options);
}