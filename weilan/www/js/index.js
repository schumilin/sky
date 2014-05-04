// cordova init
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

        // console.log('Received Event: ' + id);
    }
};

app.initialize();

// iscroll init
var childConfig = {
    hScrollbar: false,
    vScrollbar: false,
    lockDirection: true
};
var iscrollInit = function () {

    var wrapperWidth = 0;
    var pageNumber = 4;
    var startPage = 0;
    
    var parentConfig = {
        snap: true,
        momentum: false,
        hScrollbar: false,
        vScrollbar: false,
        lockDirection: true
    };

    var myScroll = new iScroll('pageWrapper', parentConfig);

    wrapperWidth = $('#pageWrapper').width();

    $('#pageScroller').css('width', wrapperWidth * pageNumber);
    $('.page').css('width', wrapperWidth);

    myScroll.refresh();
    myScroll.scrollToPage(startPage, 0, 0);

    var s1 = new iScroll('wrapper1', childConfig);
};

iscrollInit();

// Change bg
var changeBg = function () {
    var number = Math.floor(Math.random() * 10);
    if (number > 5) {
        number = Math.floor(number/2);
    }
    $('body').css('background-image', 'url(img/bg' + number + '.png)');
};
changeBg();

/* main logic start */

// important for chart
var pm25Array = [];

var getAqiChart = function () {
    var father = AV.Object.extend("aqiChart");
    var son = new AV.Query(father);
    son.descending("createdAt");
    son.limit(1);
    son.find({
        success: function(results) {
            var obj = results[0];

            pm25Array = obj.get('data');
            renderDayChart();

            var usNumber = obj.get('data').pop();
            var usQuality = '--';

            if (usNumber <= 50) {
                usQuality = '良好';
            } else if (usNumber > 50 & usNumber <= 100) {
                usQuality = '中等';
            } else if (usNumber > 100 & usNumber <= 150) {
                usQuality = '对敏感人群不健康';
            } else if (usNumber > 150 & usNumber <= 200) {
                usQuality = '不健康';
            } else if (usNumber > 200 & usNumber <= 300) {
                usQuality = '非常不健康';
            } else if (usNumber > 300) {
                usQuality = '有毒害';
            }

            $('.us').find('.number').html(usNumber);
            $('.us').find('.title2').html(usQuality);
        },
        error: function(error) {
            // alert("avos error");
        }
    });
};

var getGuessData = function () {
    var father = AV.Object.extend("guess");
    var son = new AV.Query(father);
    son.descending("createdAt");
    son.limit(1);
    son.find({
        success: function(results) {
            var obj = results[0];
            $('.main-guess').html(obj.get('first'));
            $('.sub-guess').html(obj.get('second'));
        },
        error: function(error) {
            // alert("avos error");
        }
    });
};

var getWeatherData = function () {
    var father = AV.Object.extend("weather");
    var son = new AV.Query(father);
    son.descending("createdAt");
    son.limit(1);
    son.find({
        success: function(results) {
            var obj = results[0];
            var weatherObj = obj.get('weatherObj');
            $('.day-temperature').html(weatherObj.temp + '℃');
            $('.humidity').html(weatherObj.SD);
            $('.wind-direction').html(weatherObj.WD);
            $('.wind-level').html(weatherObj.WS);
        },
        error: function(error) {
            // alert("avos error");
        }
    });
};

var getAirData = function () {
    var father = AV.Object.extend("nowData");
    var son = new AV.Query(father);
    son.descending("createdAt");
    son.limit(1);
    son.find({
        success: function(results) {
            $('.loading-wrap').hide();

            var obj = results[0];
            var aqiObj = obj.get('dataObj');
            
            var date = aqiObj.time_point.slice(0,10);
            var time = aqiObj.time_point.slice(11,16);

            // var shareUrl = '';

            // render summary
            $('.aqi-number').html(aqiObj.aqi);
            $('.pm10-number').html(aqiObj.pm10);
            $('.pm25-number').html(aqiObj.pm2_5);
            $('.no2-number').html(aqiObj.no2);
            $('.level').html(aqiObj.quality);
            $('.time').html(time);
            $('.date').html(date);
            $('.footer-time').append(date + '&nbsp;&nbsp;' + time);

            // render detail
            $('.china').find('.number').html(aqiObj.aqi);
            $('.china').find('.title2').html(aqiObj.quality);
            $('.pm25-title').find('.number').html(aqiObj.pm2_5);
            $('.pm10-title').find('.number').html(aqiObj.pm10);
            $('.so2-title').find('.number').html(aqiObj.so2);
            $('.no2-title').find('.number').html(aqiObj.no2);
            // shareUrl = 'http://service.weibo.com/share/share.php?appkey=1483181040&relateUid=1727978503&title=' + encodeURIComponent('今天北京空气污染指数' + aqiObj.aqi + '，快使用蔚蓝一起查看最新的空气污染指数吧~') + '&url=&pic=';
            // $('.share-btn').attr('href', shareUrl);

            // enter animation
            setTimeout(function () {
                $('.top-bar').addClass('complete');
            },0);
            setTimeout(function () {
                $('.aqi-number').addClass('complete').css('opacity','1');
            },500);
            setTimeout(function () {
                $('.threesome').addClass('complete');
            },1200);
            setTimeout(function () {
                $('.guess').addClass('complete');
                $('#aqiChart').addClass('complete');
                $('.weather-info').addClass('complete');
            },1600);
        },
        error: function(error) {
            // alert("avos error");
        }
    });
};

var getPointsData = function () {
    var father = AV.Object.extend("pointsData");
    var son = new AV.Query(father);
    son.descending("createdAt");
    son.limit(1);
    son.find({
        success: function(results) {

            var obj = results[0];
            var aqiObj = obj.get('dataObj');
            var html = '';
            var cObj;
            var render = function (name, one, two, three) {
                return '<tr><td>' + name + '</td><td>' + one + '</td><td>' + two + '</td><td style="font-weight: bold;font-size: 14px;">' + three + '</td></tr>';
            };

            for (var i = 0; i < aqiObj.length; i++) {
                cObj = aqiObj[i];
                html += render(cObj.position_name, cObj.pm2_5, cObj.pm10, cObj.aqi);
            }

            $('.points-table').append(html);
            var s3 = new iScroll('wrapper3', childConfig);
        },
        error: function(error) {
            // alert("avos error");
        }
    });
};

var getCitysData = function () {
    var father = AV.Object.extend("citysData");
    var son = new AV.Query(father);
    son.descending("createdAt");
    son.limit(1);
    son.find({
        success: function(results) {
            var obj = results[0];
            var aqiObj = obj.get('dataObj');
            var html = '';
            var cObj;
            var render = function (name, one, two, three) {
                return '<tr><td>' + name + '</td><td>' + one + '</td><td>' + two + '</td><td style="font-weight: bold;font-size: 14px;">' + three + '</td></tr>';
            };
            
            for (var i = 0; i < 20; i++) {
                cObj = aqiObj[i];
                html += render(cObj.area, cObj.pm2_5, cObj.pm10, cObj.aqi);
            }

            $('.citys-table').append(html);
            var s4 = new iScroll('wrapper4', childConfig);

            for (var j = 0; j < aqiObj.length; j++) {
                if (aqiObj[j].area == '北京') {
                    $('.mycity-rank').find('b').html(j + 1);
                    $('.mycity-aqi').find('b').html(aqiObj[j].aqi);
                }
            };
        },
        error: function(error) {
            // alert("avos error");
        }
    });
};

// highchart config
var renderDayChart = function () {

    var grey1 = 'rgba(255,255,255,0.20)';
    var grey2 = 'rgba(255,255,255,0.85)';
    var grey3 = 'rgba(255,255,255,0.95)';
    var grey4 = 'rgba(255,255,255,0.65)';
    var grey5 = 'rgba(255,255,255,0.40)';
    var calendar = new Date();
    var year = calendar.getYear();
    var month = calendar.getMonth();
    var date = calendar.getDate();
    var hour = calendar.getHours();
    var bigTitle = '过去 24 小时 PM2.5 污染指数趋势图 (美使馆)';
    var subTitle = null;

    $('#aqiChart').highcharts({
        chart: {
            type: 'areaspline',
            backgroundColor: 'transparent'
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        colors: [
           grey4
        ],
        title: {
            text: bigTitle,
            style: {
                    color: grey3,
                    fontSize: '13px'
                }
        },
        subtitle: {
            text: subTitle,
            style: {
                    color: grey3
                }
        },
        xAxis: {
            type: 'datetime',
            lineColor: grey5,
            tickColor: grey5,
            tickInterval: 3600 * 1000 * 6,
            labels: {
                style: {
                    color: grey2
                }
            }
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                style: {
                    color: grey2
                }
            },
            gridLineColor: grey1,
            min: 0,
            max: 500,
            tickInterval: 100
        },
        legend: {
            enabled: false,
            borderWidth: 0,
            itemStyle: {
                color: '#fff',
                fontWeight: 'bold'
            }
        },
        plotOptions: {
            series: {
                connectNulls: true,
                fillColor: grey1,
                lineWidth: 2,
                marker: {
                    radius: 1.5
                },
                pointStart: Date.UTC(year, month, date, (hour-24)),
                pointInterval: 3600 * 1000
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderColor: 'rgba(0,0,0,0.2)',
            shadow: false,
            pointFormat: '{point.y}',
            valuePrefix: '指数:',
            xDateFormat: '%H:00',
            style: {
                color: grey3
            }
        },
        series: [{
            name: 'pm2.5',
            data: pm25Array
        }]
    });
};

var renderMonthChart = function () {

    var grey1 = 'rgba(255,255,255,0.20)';
    var grey2 = 'rgba(255,255,255,0.85)';
    var grey3 = 'rgba(255,255,255,0.95)';
    var grey4 = 'rgba(255,255,255,0.65)';
    var grey5 = 'rgba(255,255,255,0.40)';
    var calendar = new Date();
    var year = calendar.getYear();
    var month = calendar.getMonth() - 1;
    var date = calendar.getDate();
    var hour = calendar.getHours();
    var bigTitle = '过去 30 天 PM2.5 污染指数趋势图 (美使馆)';
    var subTitle = null;

    $('#monthChart').highcharts({
        chart: {
            type: 'areaspline',
            backgroundColor: 'transparent'
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        colors: [
           grey4
        ],
        title: {
            text: bigTitle,
            style: {
                    color: grey3,
                    fontSize: '13px'
                }
        },
        subtitle: {
            text: subTitle,
            style: {
                    color: grey3
                }
        },
        xAxis: {
            type: 'datetime',
            lineColor: grey5,
            tickColor: grey5,
            tickInterval: 3600 * 1000 * 24 * 6,
            labels: {
                style: {
                    color: grey2
                }
            }
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                style: {
                    color: grey2
                }
            },
            gridLineColor: grey1,
            min: 0,
            max: 500,
            tickInterval: 100
        },
        legend: {
            enabled: false,
            borderWidth: 0,
            itemStyle: {
                color: '#fff',
                fontWeight: 'bold'
            }
        },
        plotOptions: {
            series: {
                connectNulls: true,
                fillColor: grey1,
                lineWidth: 2,
                marker: {
                    radius: 1.5
                },
                pointStart: Date.UTC(year, month, date),
                pointInterval: 3600 * 1000 * 24
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderColor: 'rgba(0,0,0,0.2)',
            shadow: false,
            pointFormat: '{point.y}',
            valuePrefix: '指数:',
            xDateFormat: '%m-%d',
            style: {
                color: grey3
            }
        },
        series: [{
            name: 'pm2.5',
            data: [70,150,220,200,190,180,190,200,280,180,150,180,200,150,160,140,160,180,170,190,110,150,160,180,190,200,100,150,100,120]
        }]
    });

    var s2 = new iScroll('wrapper2', childConfig);
};

// AVOS init
AV.initialize("2uu9d14470rpv39bb1178vsddmkdfgis13zfr2be0vyeuog8", "o33s1rvaukqedeforme8f10wegjv69rdw0wjoei2cuka4u9q");

getAirData();
getGuessData();
getAqiChart();
getWeatherData();
getPointsData();
getCitysData();
renderMonthChart();