# Create your views here.
from django.http import HttpResponse
import simplejson
from django.shortcuts import render_to_response
import time
import random

import pymongo
import datetime
import math

db = pymongo.Connection().test
col = db['counts']

col.ensure_index('date')

def index(request):
    return render_to_response('index.html')

def api(request):
    print request.GET
    col.insert({
                "date": datetime.datetime.utcnow()})
    t = time.time()

    window = datetime.timedelta(seconds=60)
    now = datetime.datetime.utcnow()

    try:
        totalPoints = request.GET['totalPoints']
        updateInterval = request.GET['updateInterval']

        totalPoints = int(totalPoints)
        updateInterval = float(updateInterval) 
        delta = datetime.timedelta(milliseconds=updateInterval)

        now_int = time.mktime(now.timetuple())
        begin = now_int - (totalPoints * updateInterval / 1000)

        begin = datetime.datetime.fromtimestamp(begin)
        data = []
        data2 = []
        i = 0
        while begin <= now:
            print begin, i
            i+=1
            selector = {
            'date' : {
                '$gt' : begin - window,
                '$lte': begin
                }
            }
            data.append([time.mktime(begin.timetuple())*1000, 
                         col.find(selector).count()])
            begin += delta
    except:

        selector = {
            'date' : {
                '$gte' : now - window
                }
            }
        time_t = time.mktime(now.timetuple())*1000
        data = [[time_t,
                 col.find(selector).count()]]
        data2 = [[time_t,
                  20*math.sin(col.find(selector).count())]]

    result = {'datas': {'views' : data,
                        'sin': data2}}
    
    return HttpResponse(simplejson.dumps(result), mimetype='application/json')
