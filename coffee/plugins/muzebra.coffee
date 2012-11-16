class MuzebraPlugin
    constructor: () ->
        @id = "muzebra_plugin"
        return @init()

    init: () ->
        console.log "muzebra plugin inited"
        return true

    query: (query, callback) ->
        url = "http://muzebra.com/search/?q="+encodeURIComponent(query)
        $.get url, (data) =>
            re = /<a class="info".+?data-link="(.+?)".+?data-duration="(.+?)">(.+?)<\/a>/gim
            data = data.replace(/[\n\t\r]/gm, "")
            res = re.exec(data)

            @songs = []
            i = 0
            while res != null
                if res[1].indexOf("http") != -1
                    name = res[3].split(" - ")
                    dur = @secondsToString(res[2])
                    @songs[i] = new Track(name[1], name[0], dur, res[1], @id)
                res = re.exec(data)
                i++

            callback(@songs)
            return true

    secondsToString: (totalseconds) ->
        totalseconds = parseInt(totalseconds)
        mins = Math.floor(totalseconds / 60)
        secs = totalseconds - mins * 60
        time = if mins < 10 then "0" + mins else "" + mins
        time += ":"
        time += if secs < 10 then "0" + secs else "" + secs
        return time

    getStreamUrl: (url, callback) ->
        $.post "http://muzebra.com/service/user/playerparams/", {}, (data) ->
            data = $.parseJSON(data)
            url = "http://savestreaming.com/t/"+url+"_"+data.hash+"/"
            callback(url)
            return true

window.plugins.push new MuzebraPlugin()