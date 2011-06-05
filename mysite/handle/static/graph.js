function AjaxGraph(doc, url, totalPoints, updateInterval) {
    // setup plot
    var options = {
	series: { shadowSize: 0 },
	xaxis: {
	    mode: 'time',
	    twelveHourClock: true
	},
	ticks: 10,
	updater: {
	    updateInterval: updateInterval,
	    totalPoints: totalPoints,
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