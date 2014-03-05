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

        console.log('Received Event: ' + id);
    }
};

// AVOS
AV.initialize("2uu9d14470rpv39bb1178vsddmkdfgis13zfr2be0vyeuog8", "o33s1rvaukqedeforme8f10wegjv69rdw0wjoei2cuka4u9q");

// important for chart
var pm25Array = [];

// get PM25 Array from AVOS DB
var father = AV.Object.extend("aqiOneday");
var son = new AV.Query(father);
son.descending("createdAt");
son.limit(24);
son.find({
  success: function(results) {
    var obj = null;

    for (var i = 0; i < results.length; i++) {
        obj = results[i];
        pm25Array.unshift(obj.get('aqiArray'));
    }

    renderChart();
  },
  error: function(error) {
    alert("avos error");
  }
});

// get live number from pm25.in
$.ajax({
    dataType: "jsonp",
    url: 'http://www.pm25.in/api/querys/aqis_by_station.json',
    data: {
        station_code: '1005A',
        token: '5j1znBVAsnSf5xQyNQyq'
    }
}).done(function(data) {
    var aqiObj = data[0];
    var date = aqiObj.time_point.slice(0,10);
    var time = aqiObj.time_point.slice(11,16);

    $('.pm25-number').html(aqiObj.aqi);
    $('.pm10-number').html(aqiObj.pm10)
    $('.so2-number').html(aqiObj.so2);
    $('.no2-number').html(aqiObj.no2);
    $('.level').html(aqiObj.quality);
    $('.time').html(time);
    $('.date').html(date);

    // enter animation
    setTimeout(function () {
        $('.top-bar').addClass('complete');
    },0);
    setTimeout(function () {
        $('.pm25-number').addClass('complete').css('opacity','1');
    },500);
    setTimeout(function () {
        $('.threesome').addClass('complete');
    },1200);
    setTimeout(function () {
        $('.guess').addClass('complete');
    },1600);
}).fail(function() {
    alert( "pm25in error" );
});

// highchart config
var renderChart = function () {

    var grey1 = 'rgba(255,255,255,0.15)';
    var grey2 = 'rgba(255,255,255,0.85)';
    var grey3 = 'rgba(255,255,255,0.95)';
    var grey4 = 'rgba(255,255,255,0.65)';
    var calendar = new Date();
    var year = calendar.getYear();
    var month = calendar.getMonth();
    var date = calendar.getDate();
    var hour = calendar.getHours() - 1;
    var bigTitle = null;
    var subTitle = null;

    $('#aqiChart').highcharts({
        chart: {
            type: 'spline',
            backgroundColor: 'transparent'
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
                    color: grey3
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
            gridLineColor: grey4,
            min: 0,
            max: 500
        },
        legend: {
            borderWidth: 0,
            itemStyle: {
                color: '#fff',
                fontWeight: 'bold'
            }
        },
        tooltip: {
            valueSuffix: 'μg/m3'
        },
        plotOptions: {
            series: {
                pointStart: Date.UTC(year, month, date, (hour-23)),
                pointInterval: 3600 * 1000
            }
        },
        series: [{
            name: 'pm2.5',
            data: pm25Array

        }]
    });
}
