class OlolofmPlugin
    constructor: () ->
        @id = "ololofm_plugin"
        return @init()

    init: () ->
        console.log "ololofm plugin inited"
        return true

    query: (query, callback) ->
        url = "http://ololo.fm/search/?x=0&y=0&query="+encodeURIComponent(query)
        $.get url, (data) =>
            re = /<a href="\/song\/(.+?)".+?<span>(.+?)<\/span><br.*?\/>(.+?)<\/a><dfn>(.+?)<\/dfn>/gim
            data = data.replace(/[\n\t\r]/gm, "")
            res = re.exec(data)

            @songs = []
            i = 0
            while res != null
                @songs[i] = new Track(res[2], res[3], res[4], "http://ololo.fm/save/"+res[1], @id)
                res = re.exec(data)
                i++

            callback(@songs)
            return true

    getStreamUrl: (url, callback) ->
        $.get url, (data) ->
            re = /<a href="(.+?)".+?>Сохранить в нормальном формате MP3<\/a>/gim
            res = re.exec(data);
            url = "http://ololo.fm"+res[1];
            callback(url)
            return true

window.plugins.push new OlolofmPlugin()