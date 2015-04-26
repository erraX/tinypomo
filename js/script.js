/*jslint browser: true*/
/*global $, jQuery, alert*/

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
 * @description 获取当前的时间
 * @param {String} YMD 获取年份、月份、还是天的参数
 * @return {String} 返回时间的字符串，比如2013-01-01
*/
function getCurrentTime(YMD) {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;
  var day = currentDate.getDate();
  var hours = currentDate.getHours();
  var min = currentDate.getMinutes();
  var sec = currentDate.getSeconds();
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

/**
* @descrption 把完成的番茄添加到已完成的列表中
*
*/
function addToFanqieList(text, finishTime) {
  var $finishedList = $("#seg-finished");
  var $item = $('<div class="item"> <div class="content"> <div class="middle-header"><i class="checkmark icon"></i></div></div></div>');
  $item.find(".middle-header").append(finishTime + " ").append(text);
  $finishedList.append($item);
}


/**
* @description 把勾选的checkbox label变成灰色
* @param {Checkbox} ckbox 勾选的Checkbox
*/
function switchCheckboxStatus(ckbox) {
  if (ckbox.checkbox("is unchecked")) {
    ckbox.siblings(".ckbox-label")
    .css("color", "grey")
    .css("text-decoration", "line-through");
  } else {
    ckbox.siblings(".ckbox-label")
    .css("color", "rgba(0,0,0,.8)")
    .css("text-decoration", "none");
  }
}

/**
* @description 把土豆的名称填入要完成的番茄中
* @param {Label} label 土豆名字
*/
function addToFanqieInput(label) {
  var text = label.text();
  $('#input-todo').val(text);
}

/**
* @description 增加一个土豆
* @param {String} planName 土豆名字
*/
function addToTudouList(planName) {
  var $target = $("#seg-plan");
  // var $todo = $("#input-todo");
  var $item = $('<div class="item"> <div class="content"> <div class="ui checkbox"> <input type="checkbox"> <label></label> </div> <div class="ckbox-label"></div> </div> </div>');
  $item.find(".ckbox-label")
    .append(planName)
    .click(function() {
      addToFanqieInput($(this));
    });

  $item.find(".ui.checkbox").click(function() {
      switchCheckboxStatus($(this));
    });

  $item.find(".ui.checkbox").checkbox();

  $target.append($item);
}


// 初始化UI
$(function() {
  $(".content .ui.checkbox").click(function() {
    switchCheckboxStatus($(this));
  });

  $(".ui.checkbox")
  .checkbox();

  $(".ckbox-label").click(function() {
    addToFanqieInput($(this));
  });
});

// 开始一个番茄
$(function() {
  $("#btn-start").click(function() {
    var duration = 2;
    var $todo = $("#input-todo");
    var pomoText = $todo.val();
    var $time = $("#time");

    $("#time").html(pad(Math.floor(duration / 60), 2) + ":" + pad(duration % 60, 2));
    if (!pomoText) {
      alert("请输入一个番茄：你想完成的事");
    } else {
      $todo.attr("disabled", true);
      $(this).addClass("disabled");

      $time.countdown(function() {
        alert("成功完成了一个番茄!");
        $time.html(pad(Math.floor(duration / 60), 2) + ":" + pad(duration % 60, 2));
        // Enable start button
        $todo.attr("disabled", false);
        $("#btn-start").removeClass("disabled");
        // Add finished tomato to list
        addToFanqieList(pomoText, "12:00");
        $todo.val("");

      }, duration);
    }
  });
});

// 增加一个土豆
$(function() {
  $("#btn-addplan").click(function() {
    var planName = $("#input-newplan").val();
    console.log(planName);
    if (!planName) {
      alert("请输入一个土豆：想要完成的计划。");
      return;
    }
    addToTudouList(planName);
  });
});
