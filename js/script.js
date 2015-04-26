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
    $('#time').html(pad(min, 2) + ':' + pad(sec, 2));
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
* @description 把土豆的名称填入要完成的番茄中
* @param {Label} label 土豆名字
*/
function addToToDoListField(label) {
  var text = label.text();
  $('#input-todo').val(text);
}

/**
* @description 把勾选的checkbox label变成灰色
* @param {Checkbox} ckbox 勾选的Checkbox
*/
function finishPlan(ckbox) {
  if (ckbox.checkbox('is unchecked')) {
    ckbox.siblings(".ckbox-label")
    .css("color", "grey")
    .css("text-decoration", "line-through");
  } else {
    ckbox.siblings(".ckbox-label")
    .css("color", "rgba(0,0,0,.8)")
    .css("text-decoration", "none");
  }
}

// 初始化UI
$(function() {
  $('.content .ui.checkbox').click(function() {
    finishPlan($(this));
  });

  $('.ui.checkbox')
  .checkbox();

  $('.ckbox-label').click(function() {
    addToToDoListField($(this));
  });
});

// 开始一个番茄
$(function() {
  $('#btn-start').click(function() {
    var duration = 2;
    var pomoText = $('#input-todo').val();
    var $time = $('#time');
    var $todo = $('#input-todo');

    $('#time').html(pad(Math.floor(duration / 60), 2) + ":" + pad(duration % 60, 2));
    if (!pomoText) {
      alert("请输入一个番茄：你想完成的事");
    } else {
      $todo.attr("disabled", true);
      $(this).addClass("disabled");

      $time.countdown(function() {
        alert('成功完成了一个番茄!');

        $time.html(pad(Math.floor(duration / 60), 2) + ":" + pad(duration % 60, 2));

        // Enable start button
        $todo.attr("disabled", false);
        $('#btn-start').removeClass("disabled");

        // Hide corrupt button

        // Add finished tomato to list

      }, duration);
    }
  });
});

// 增加一个土豆
$(function() {
  $('#btn-addplan').click(function() {
    var planName = $('#input-newplan').val();
    console.log(planName);
    if (!planName) {
      alert("请输入一个土豆：想要完成的计划。");
      return;
    }

    var $target = $('#seg-plan').find('.ui.divided.list');
    var $content = $('<div class="content"></div>')
                      .appendTo($('<div class="item"></div>'));
    var $ckbox = $('<div class="ui checkbox"></div>')
                    .append($('<input type="checkbox" >'))
                    .click(function() {
                      finishPlan($(this));
                    });
    var $label = $('<div class="ckbox-label"></div>')
                    .text(planName)
                    .click(function() {
                      addToToDoListField($(this));
                    });

    $content.append($ckbox).append($label);
    $content.parent('.item').appendTo($target);
    $ckbox.checkbox();
  });
});
