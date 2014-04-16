var userId = "";

var countSwipe = 0;

var stepCount = 0;

var stepRatio = 3;

var startX = 0;

var startY = 0;

var currX = 0;

var currY = 0;

var RATIOX = 40;

var RATIOY = 20;

var isSwipe = false;

var isStepSuccess = false;

var isWeibo = true;

$(document).ready(function() {
    e(userId);
    function e(p) {
        m();
        i(p);
    }
    function m() {
        var p = $('<div id="loading"><img src="./files/title.png"/></div>');
        p.insertBefore("#content");
        p.bind("ajaxStart", function() {
            $(this).show();
        });
        p.bind("ajaxStop", function() {
            $(this).unbind("ajaxStart ajaxStop");
            d();
        });
    }
    function i(p) {
        $.getJSON("http://843sev.duapp.com/guagua", {
            type:"userLuckytest",

        }, function(q) {
            $("#cardImgae").attr("data-src", "files/" + q.cardURL);
            $("#cardTitle").text(q.cardName);
            $("#txtResult").text(q.result);
            $("#txtResultTips").text(q.tips);
        });
    }
    function d() {
        o();
        l();
    }
    function l() {
        console.log("loadLazyImg");
        $(".lazy").jail({
            loadHiddenImages:true,
            loadOutTheScreen:true,
            callback:function() {
                k();
            }
        });
    }
    function k() {
        $("#loading").hide();
        $("#startTips").addClass("startAnimation");
        $("#content").show();
    }
    function o() {
        document.addEventListener("touchmove", function(q) {
            q.preventDefault();
        }, false);
        var p = $("#touchArea")[0];
        p.addEventListener("touchstart", h, false);
        p.addEventListener("touchend", n, false);
        $(".wrapResult").hide();
        $("#btnWeiBo").click(function(q) {
            if (!isWeibo) {
                $("#btnWeiBo .checkbox").addClass("click");
                isWeibo = true;
            } else {
                $("#btnWeiBo .checkbox").removeClass("click");
                isWeibo = false;
            }
        });
    }
    function h(p) {
        p.preventDefault();
        isStepSuccess = false;
        isSwipe = false;
        if (p.touches.length == 1) {
            startX = p.touches[0].pageX;
            startY = p.touches[0].pageY;
            touchArea.addEventListener("touchmove", a, false);
        }
    }
    function n(p) {
        p.preventDefault();
        stepCount = 0;
        touchArea.removeEventListener("touchmove", a);
        if (isSwipe && !isStepSuccess) {
            countSwipe++;
            if (countSwipe > 2) {
                b();
            } else {
                j(countSwipe);
            }
        }
    }
    function a(r) {
        r.preventDefault();
        currX = r.touches[0].pageX;
        currY = r.touches[0].pageY;
        var q = startX - currX;
        var p = startY - currY;
        if (Math.abs(q) >= RATIOX || Math.abs(p) >= RATIOY) {
            stepCount++;
            if (stepCount > stepRatio) {
                stepCount = 0;
                stepRatio += 2;
                countSwipe++;
                isStepSuccess = true;
                if (countSwipe > 2) {
                    b();
                    return;
                } else {
                    j(countSwipe);
                }
                isSwipe = false;
            } else {
                isSwipe = true;
            }
            startX = currX;
            startY = currY;
        }
    }
    function j(p) {
        if (p == 1) {
            $(".wrapResult").show();
            $("#startTips").hide();
            $(".wrapStatus_0").fadeOut(200);
            $(".wrapStatus_1").show();
            $("#startTips").addClass("stopAnimation");
            $("#startTips").remove();
        } else {
            if (p == 2) {
                $(".wrapStatus_1").fadeOut(200);
                $(".wrapStatus_2").show();
            }
        }
    }
    jQuery.fn.center = function(q, p) {
        this.css("position", "absolute");
        this.css("top", ($(window).height() - this.height() + q) / 2 + $(window).scrollTop() + "px");
        this.css("left", ($(window).width() - (this.width() + p)) / 2 + $(window).scrollLeft() + "px");
        return this;
    };
    var f = $(document).height();
    $(".Disablebox").css("height", f);
    $("#boxModal").center(0, 0);
    function g() {
        $(".Disablebox").show();
        $("#boxModal").show();
        $("#loadContainer").text("Loading...");
        $("#loadContainer").ajaxStart(function() {
            $(this).show();
        }).ajaxStop(function() {});
    }
    function b() {
        touchArea.removeEventListener("touchstart", h, false);
        touchArea.removeEventListener("touchend", n, false);
        $(".wrapStatus_2").fadeOut("fast");
        $("#resultTips").show();
        $("#btnConfirm").addClass("btn_enable");
        $("#btnConfirm").bind("click", function(p) {
            p.preventDefault();
            if (isWeibo) {
               // g();
            } else {
            }
           // window.location = "./index.html";

            ShowWeiXinShareTips('#main')
        });
    }
    function c() {
        $.post("../get.php", {
            type:"shareADD",
            card:"share",
            userid:userId
        }, function(p) {
            window.location = "../card/index.html#openbar";
        });
    }


    function ShowWeiXinShareTips(page) {
        var div = '<div id="WeiXinShareTips"><img src="files/sharetip.png" width="165" height="114"/></div>';
        $(page).append(div);
        $('#WeiXinShareTips').bind('click',function() {$('#WeiXinShareTips').remove();});
        setTimeout(function() {$('#WeiXinShareTips').remove();}, 3000);
    }
});