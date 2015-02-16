$(function() {
  $('.ui.checkbox')
    .checkbox();
});

$(function() {
    $('#btn-start').click(function() {
        $("#time").countdown(afterFinished, 120);
    });
})

$.fn.countdown = function (callback, duration) {
    var min = 1;
    var sec = 59;
    var container = $(this).html(pad(min, 2) + ':' + pad(sec--, 2));

    var countdown = setInterval(function () {
        if (--duration) {
            console.log(duration);

            container.html(pad(min, 2) + ':' + pad(sec--, 2));
            if(sec == -1) {
                min--;
                sec = 59;
            }
        } else {
            clearInterval(countdown);
            callback.call(container);   
        }
    }, 1000);
};

function pad(num, n) {  
    var len = num.toString().length;  
    while(len < n) {  
        num = "0" + num;  
        len++;  
    }  
    return num;  
}  

function afterFinished() {
    alert('Finished a tomato!');

    // Initial time
    $('#time').html("02:00");

    // Enable start button

    // Hide corrupt button

    // Add finished tomato to list

}