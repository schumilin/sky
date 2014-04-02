/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

AV.initialize("2uu9d14470rpv39bb1178vsddmkdfgis13zfr2be0vyeuog8", "o33s1rvaukqedeforme8f10wegjv69rdw0wjoei2cuka4u9q");

function fuckData () {

    var father = AV.Object.extend('newWorld');
    var son = new father();

    // fuck young-0
    var array = [];
    var domArray = $('#alonso').contents().find('.gr2');

    domArray.each(function (index, el) {
        array.unshift(parseInt($(el).text(), 10));
    });

    son.set('chartData', array);

    $('.car').html('young-0 写入完毕');

    // fuck pm25.in
    $.ajax({
        dataType: "jsonp",
        url: 'http://www.pm25.in/api/querys/aqi_details.json',
        data: {
            city: 'beijing',
            token: 'e7HnxFo18ZxJS5q6qHJN'
        }
    }).done(function(data) {

        var aqiObj = data.pop();

        son.set('liveData', aqiObj);

        $('.car').append('<br>pm25.in 写入完毕');

        son.save(null, {
            success: function(data) {
                $('.car').append('<br>数据已经存入数据库.');
            },
            error: function(data, error) {
                $('.car').append('<br>数据保存数据库时失败.');
            }
        });
    }).fail(function() {
        $('.car').append('<br>pm25.in 接口请求失败.');
    });
}

function runCrawler () {

    $('iframe').remove();

    var iframe = document.createElement('iframe');

    document.body.appendChild(iframe);
    iframe.setAttribute('id', 'alonso');
    iframe.src = 'http://www.young-0.com/airquality/index.php';

    iframe.onload = function(){
        fuckData();
    };
}

function initCrawlerTimer () {

    runCrawler();

    setInterval(function () {
        runCrawler();
    }, 1200000);
}

$('.fuck').on('click', function () {
    initCrawlerTimer();
});

// set guess info
$('.save-guess').on('click', function () {
    var first = $('.first').val();
    var second = $('.second').val();

    var father = AV.Object.extend('guess');
    var son = new father();
    son.set('first', first);
    son.set('second', second);
    son.save(null, {
        success: function(data) {
        $('.car').html('预测数据保存成功.');
        },
        error: function(data, error) {
        $('.car').html('预测数据保存失败.');
        }
    });
});