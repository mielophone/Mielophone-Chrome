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
                name = res[3].split(" - ")
                @songs[i] = new Track(name[1], name[0], res[2], res[1], @id)
                res = re.exec(data)
                i++

            callback(@songs)
            return true

    getStreamUrl: (url, callback) ->
        $.post "http://muzebra.com/service/user/playerparams/", {}, (data) ->
            data = $.parseJSON(data)
            url = "http://savestreaming.com/t/"+url+"_"+data.hash+"/"
            callback(url)
            return true

window.plugins.push new MuzebraPlugin()