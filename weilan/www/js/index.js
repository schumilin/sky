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

// AVOS init
AV.initialize("2uu9d14470rpv39bb1178vsddmkdfgis13zfr2be0vyeuog8", "o33s1rvaukqedeforme8f10wegjv69rdw0wjoei2cuka4u9q");

// important for chart
var pm25Array = [];

// get one day chart data from AVOS DB
var getDayChart = function () {
    var father = AV.Object.extend("aqiChart");
    var son = new AV.Query(father);
    son.descending("createdAt");
    son.limit(1);
    son.find({
        success: function(results) {
            var obj = results[0];

            pm25Array = obj.get('data');

            renderChart();
        },
        error: function(error) {
            // alert("avos error");
        }
    });
};

// get guess data from AVOS DB
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

// get live number from pm25.in
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

            var shareUrl = '';

            $('.aqi-number').html(aqiObj.aqi);
            $('.pm10-number').html(aqiObj.pm10);
            $('.pm25-number').html(aqiObj.pm2_5);
            $('.no2-number').html(aqiObj.no2);
            $('.level').html(aqiObj.quality);
            $('.time').html(time);
            $('.date').html(date);

            shareUrl = 'http://service.weibo.com/share/share.php?appkey=1483181040&relateUid=1727978503&title=' + encodeURIComponent('今天北京空气污染指数' + aqiObj.aqi + '，快使用蔚蓝一起查看最新的空气污染指数吧~') + '&url=&pic=';
            $('.share-btn').attr('href', shareUrl);

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

// highchart config
var renderChart = function () {

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
    var bigTitle = '过去 24 小时空气污染指数趋势图';
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
            valuePrefix: 'AQI:',
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