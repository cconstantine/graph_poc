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

    totalPoints = request.GET['totalPoints']
    updateInterval = request.GET['updateInterval']
    
    totalPoints = int(totalPoints)
    updateInterval = float(updateInterval) 
    delta = datetime.timedelta(milliseconds=updateInterval)
    
    now_int = time.mktime(now.timetuple())
    begin = now_int - (totalPoints * updateInterval / 1000)

    begin = datetime.datetime.fromtimestamp(begin)
    data = []

    i = 0
    while i < totalPoints and begin <= now:
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

    result = {'views' : data}
    
    return HttpResponse(simplejson.dumps(result), mimetype='application/json')
