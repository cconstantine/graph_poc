function AjaxGraph(doc, url, totalPoints, updateInterval) {
    // setup plot
    var options = {
	series: { shadowSize: 0 },
	xaxis: {
	    mode: 'time',
	    twelveHourClock: true
	},
	updater: {
	    updateInterval: updateInterval,
	    totalPoints: totalPoints,
	    ajax: {
		params: {'hi' :1 },
		url: 'api'
	    }

	},
	    
    };
    $.plot(doc, [  ], options);
}