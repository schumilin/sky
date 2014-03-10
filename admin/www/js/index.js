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

$('.fuck').on('click', function () {
    fuckData();
});

function fuckData () {
    var array = [];
    var domArray = $('#alonso').contents().find('.gr2');

    domArray.each(function (index, el) {
        array.unshift(parseInt($(el).text()));
    });

    var father = AV.Object.extend('aqiChart');
    var son = new father();

    son.set('data', array);

    son.save(null, {
        success: function(data) {
            $('.car').html('数据爬取成功,并已经存入数据库.');
        },
        error: function(data, error) {
            $('.car').html('数据爬取失败.');
        }
    });
}

function createIframe () {
    $('iframe').remove();
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'alonso');
    iframe.src = 'http://www.young-0.com/airquality/index.php';
    iframe.onload = function(){
        fuckData();
    };
    document.body.appendChild(iframe);
}

setInterval(function () {
    createIframe();
}, 1200000);

$(document).ready(function() {
    createIframe();
});