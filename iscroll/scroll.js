var wrapperWidth = 0;
var pageNumber = 2;
var startPage = 1;

var myScroll = new iScroll('pageWrapper', {
                    snap: true,
                    momentum: false,
                    hScrollbar: false,
                    vScrollbar: false,
                    lockDirection: true
                });

wrapperWidth = $('#pageWrapper').width();

$('#pageScroller').css('width', wrapperWidth * pageNumber);
$('.page').css('width', wrapperWidth);

myScroll.refresh();
myScroll.scrollToPage(startPage, 0, 0);

var s1 = new iScroll('wrapper1', {
                        hScrollbar: false,
                        vScrollbar: false,
                        lockDirection: true
                    });
var s2 = new iScroll('wrapper2', {
                        hScrollbar: false,
                        vScrollbar: false,
                        lockDirection: true
                    });