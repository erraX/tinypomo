/*global _, Backbone, $, jQuery, alert*/
/**
* @description 数字高位补0
* @param {Num} num1 加数
* @param {Num} n 数字的位数
* @return {String} 补0的结果
*/
function pad(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}

/**
* @description 倒计时
* @param {function} callback 倒计时完成回调函数
* @param {Num} duration 倒计时多少秒
*/
$.fn.countdown = function(callback, duration) {
  duration--;
  var min = Math.floor(duration / 61);
  var sec = duration % 60 || 59;
  var countdown = setInterval(function() {
    console.log("sec: " + sec + " duration: " + duration);
    $("#time").html(pad(min, 2) + ':' + pad(sec, 2));
    if (duration) {
      sec--;
      if (sec === -1) {
        min--;
        sec = 59;
      }
      duration--;
    } else {
      clearInterval(countdown);
      callback.call();
    }
  }, 1000);
};

$(function() {
  // var cntDownConfig = new CountDownConfig({duration: 10, going: false});
  var app = new AppView();
});
