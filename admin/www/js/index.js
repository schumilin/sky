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

var timer = 0;

var fuckWeather = function () {
    $.ajax({
        dataType: "json",
        url: 'http://www.weather.com.cn/data/sk/101010100.html'
    }).done(function(data) {
        var weatherObj = data.weatherinfo;

        var father = AV.Object.extend('weather');
        var son = new father();

        son.set('weatherObj', weatherObj);

        son.save(null, {
            success: function(data) {
                $('.car').append('<br>weather 爬取成功,并已经存入数据库.');
            },
            error: function(data, error) {
                $('.car').append('<br>weather 存入数据库失败.');
            }
        });

    }).fail(function() {
        $('.car').append('<br>weather 爬取失败.');
    });
};

var fuckPm25in = function () {
    $.ajax({
        dataType: "jsonp",
        url: 'http://www.pm25.in/api/querys/aqi_details.json',
        data: {
            city: 'beijing',
            token: 'e7HnxFo18ZxJS5q6qHJN'
        }
    }).done(function(data) {
        var aqiObj = data.pop();

        var father = AV.Object.extend('nowData');
        var son = new father();

        son.set('dataObj', aqiObj);

        son.save(null, {
            success: function(data) {
                $('.car').append('<br>nowData 爬取成功,并已经存入数据库.');
            },
            error: function(data, error) {
                $('.car').append('<br>nowData 存入数据库失败.');
            }
        });

        var father2 = AV.Object.extend('pointsData');
        var son2 = new father2();
        son2.set('dataObj', data);

        son2.save(null, {
            success: function(data) {
                $('.car').append('<br>points 爬取成功,并已经存入数据库.');
            },
            error: function(data, error) {
                $('.car').append('<br>points 存入数据库失败.');
            }
        });

    }).fail(function() {
        $('.car').append('<br>nowData & points 爬取失败.');
    });
};

var fuckCitys = function () {
    $.ajax({
        dataType: "jsonp",
        url: 'http://www.pm25.in/api/querys/aqi_ranking.json',
        data: {
            token: 'e7HnxFo18ZxJS5q6qHJN'
        }
    }).done(function(data) {

        var father = AV.Object.extend('citysData');
        var son = new father();
        son.set('dataObj', data);

        son.save(null, {
            success: function(data) {
                $('.car').append('<br>citys 爬取成功,并已经存入数据库.');
            },
            error: function(data, error) {
                $('.car').append('<br>citys 存入数据库失败.');
            }
        });

    }).fail(function() {
        $('.car').append('<br>citys 爬取失败.');
    });
};

var writedAverage = false;
var fuckY0 = function () {
    var array = [];
    var table = $('#alonso').contents().find('table');
    var levelDomArray = table.find('td:nth-child(3)');
    var concentration = table.find('tr:last-child').find('td:last-child').text();
    var bArray = $('#alonso').contents().find('b');

    if (levelDomArray.length !== 0) {

        levelDomArray.each(function (index, el) {
            array.push(parseInt($(el).text(), 10));
        });

        var father = AV.Object.extend('aqiChart');
        var son = new father();

        son.set('data', array);
        son.set('concentration', parseInt(concentration, 10));
        
        son.save(null, {
            success: function(data) {
                $('.car').append('<br>young-0 爬取成功,并已经存入数据库.');
            },
            error: function(data, error) {
                $('.car').append('<br>young-0 存入数据库失败.');
            }
        });
        // crawl daily average number 
        var time = bArray[1].textContent;
        
        if (time.match(/00:00/g) && !writedAverage) {

            var average = parseInt(bArray[4].textContent, 10);

            var father2 = AV.Object.extend('averageChart');
            var son2 = new father2();
            son2.set('data', average);
            son2.save(null, {
                success: function(data) {
                    writedAverage = true;
                    $('.car').append('<br>Average 爬取成功,并已经存入数据库.');
                },
                error: function(data, error) {
                    $('.car').append('<br>Average 存入数据库失败.');
                }
            });
        } else if (time.match(/01:00/g) && writedAverage) {
            writedAverage = false;
        }
    }
};

var crawl = function () {

    $('iframe').remove();
    $('.car').html('Console:');

    var iframe = document.createElement('iframe');

    document.body.appendChild(iframe);
    iframe.setAttribute('id', 'alonso');
    // iframe.src = 'http://www.young-0.com/airquality/index.php';
    iframe.src = 'http://www.young-0.com/airquality/index.php?action=2&cn=1';

    iframe.onload = function(){
        fuckY0();
    };

    fuckPm25in();
    fuckWeather();
    fuckCitys();
};

var initCrawlerTimer = function () {

    crawl();

    clearInterval(timer);
    timer = 0;

    timer = setInterval(function () {
        crawl();
    }, 1200000);
};

$(document).ready(function() {

    $('.save-guess').on('click', function () {
        var first = $('.first').val();
        var second = $('.second').val();
        var pointsSuggest = $('.points-suggest').val() || '暂无分析及建议';

        var father = AV.Object.extend('guess');
        var son = new father();
        son.set('first', first);
        son.set('second', second);
        son.set('pointsSuggest', pointsSuggest);
        son.save(null, {
            success: function(data) {
            $('.car').append('<br>预测数据保存成功.');
            },
            error: function(data, error) {
            $('.car').append('<br>预测数据保存失败.');
            }
        });
    });

    $('.fuck').on('click', function () {
        initCrawlerTimer();
    });
});

// [{
//     name: '优',
//     data: [2, 0, 1, 1, 1, 0]
// }, {
//     name: '良',
//     data: [6, 7, 5, 4, 7, 3]
// }, {
//     name: '不健康',
//     data: [16, 17, 13, 13, 12, 24]
// }, {
//     name: '非常不健康',
//     data: [5, 5, 10, 1, 9, 3]
// }, {
//     name: '有毒害',
//     data: [1, 2, 2, 9, 2, 0]
// }];