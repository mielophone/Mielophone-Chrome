class Mielophone
	constructor: () ->
        require ['../mielophone/services/Discogs'], () =>
            @discogs = new Discogs

        # init plugins array
        window.plugins = []

    queryAll: (query, callback) ->
        @discogs.search query, (resultsDisc) =>
            results = resultsDisc
            @findAllMp3s query, (resultsMp3) ->
                results = results.concat(resultsMp3)
                callback(results)

    ###
    # fetch stream url from plugin by song id
    ###
    getStreamUrl: (id, callback) ->
        # find song & plugin
        found = false
        for plugin in window.plugins
            for item in plugin.songs
                if item.id == id
                    found = true
                    break
            if found then break

        # fetch url from plugin
        plugin.getStreamUrl item.url, (streamUrl) ->
            callback(streamUrl)
            return true

    ###
    # find stream for given song
    ###
    findStream: (name, duration, callback) ->
        # init result item
        result = null

        # count all plugins
        allPlugins = window.plugins.length
        currentPlugin = 0

        # parse data
        parseData = (data) ->
            if data != null
                currentPlugin.getStreamUrl result.url, (streamUrl) ->
                    callback(streamUrl)
            else
                currentPlugin++
                nextPlugin()

        # go through all plugins
        nextPlugin = () ->
            if currentPlugin >= allPlugins
                callback(false)

            plugin = window.plugins[currentPlugin]
            plugin.findStream name, duration, parseData

        # fetch first one
        nextPlugin()

        return true

    ###
    # find query string in all active plugins
    ###
    findAllMp3s: (query, callback) ->
        # reset results array
        results = []

        # count all plugins
        allPlugins = window.plugins.length

        # go through all plugins
        for plugin in window.plugins
            plugin.query query, (data) ->
                for item in data
                    results.push(item)

                allPlugins--
                if allPlugins <= 0
                    callback(results)
                
                return true

    ###
    # get artist discography
    ###
    getDiscography: (id, callback) ->
        @discogs.getDiscography(id, callback)

    ###
    # get artist discography
    ###
    getAlbumTracklist: (albumId, albumType, artist, callback) ->
        @discogs.getAlbumTracklist(albumId, albumType, artist, callback)



window.Mielophone = new Mielophone