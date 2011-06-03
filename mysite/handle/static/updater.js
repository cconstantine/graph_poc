function AjaxGraph(doc, url, totalPoints, updateInterval) {
    // setup plot
    var options = {
	series: { shadowSize: 0 },
	xaxis: {
	    mode: 'time',
	    twelveHourClock: true
	}
    };
    
    var plot = null;

    var datas = {};

    function updateData(resp) {
	if (plot == null)
	    plot = $.plot(doc, [  ], options);
	d = resp['datas'];
	    
	for(key in d) {
	    if (datas.hasOwnProperty(key)) {
		datas[key] = datas[key].concat(d[key]);
	    } else {
		datas[key] = d[key];
	    }

	    if (datas[key].length > totalPoints) {
		datas[key] = datas[key].slice(datas[key].length - totalPoints );
	    }
	}
	data = [];
	for (key in datas) {
	    data.push({'label' : key,
			'data' : datas[key]});
	}

	plot.setData(data);
	plot.setupGrid();
	plot.draw();
    }
    
    function update(first) {
	try {
	    if (first) {
		params = {
		    'totalPoints': totalPoints,
		    'updateInterval': updateInterval
		};
	    } else {
		params = null;
	    }
	    $.ajax({    url: url,
			data : params,
			method: 'GET',
			dataType: 'json',
			success: updateData
			});
	} catch (err) { }
	setTimeout(update, updateInterval);	   
    }
    update(1);
}

(function ($) {
    function init(plot) {
	var datas = {};
	var plot = plot;

	var updateInterval;
	var totalPoints;

	var url;
	var params = {};

	function updateData(resp) {
	    if (plot == null)
		plot = $.plot(doc, [  ], options);
	    d = resp['datas'];
	    
	    for(key in d) {
		if (datas.hasOwnProperty(key)) {
		    datas[key] = datas[key].concat(d[key]);
		} else {
		    datas[key] = d[key];
		}
			
		if (datas[key].length > totalPoints) {
		    datas[key] = datas[key].slice(datas[key].length - totalPoints );
		}
	    }
	    data = [];
	    for (key in datas) {
			data.push({'label' : key,
				    'data' : datas[key]});
	    }
	    
	    plot.setData(data);
	    plot.setupGrid();
	    plot.draw();
	}

	function update(first) {
	    try {
		if (first) {
		    params.totalPoints = totalPoints;
		    params.updateInterval = updateInterval;
		} else {
		    delete params['totalPoints'];
		    delete params['updateInterval'];
		}
		    
		$.ajax({    url: url,
			    data : params,
			    method: 'GET',
			    dataType: 'json',
			    success: updateData
			    });
	    } catch (err) { }
		    setTimeout(update, updateInterval);	   
	}


	function processOptions(plot, options) {
	    if (options.updater) {
		updater = options.updater;
		updateInterval = updater.updateInterval;
		totalPoints = updater.totalPoints;
		console.log(updater);
		if (updater.ajax.params){
		    params = updater.ajax.params;
		}

		url = updater.ajax.url;

		update( 1);
	    }
	}
	plot.hooks.processOptions.push(processOptions);
    }
    
    var options = { updater: 0 };
    
    $.plot.plugins.push({
	    init: init,
		options: options,
		name: "updater",
		version: "0.1"
		});
})(jQuery);