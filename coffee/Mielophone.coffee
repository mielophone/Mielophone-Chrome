class Mielophone
	constructor: () ->
        require ['../mielophone/services/Discogs'], () =>
            @discogs = new Discogs

        # init plugins array
        window.plugins = []

    queryDatabase: (query, callback) ->
        @discogs.search(query, callback)

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
    # find query string in all active plugins
    ###
    findAllResults: (query, callback) ->
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



window.Mielophone = new Mielophone