pad = (num, n) ->
    len = num.toString().length
    while len < n
        num = "0" + num
        len++
    num

$.fn.countdown = (callback, duration) ->
    duration--
    min = Math.floor duration / 61
    sec = duration % 60 || 59
    countdown = setInterval ->
        console.log "sec:#{sec}, duration:#{duration}"
        $("time").html pad min, 2
        if duration
            sec--
            if sec is -1
                min--
                sec = 59
            duration--
        else
            clearInterval countdown
            callback.call()
            return
       , 1000

$ ->
    app = new AppView();
    return
