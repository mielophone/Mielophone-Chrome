class Discogs
    urlBase = "http://api.discogs.com/"
    artistUrlBase = "http://api.discogs.com/artists/"
    searchUrlBase = "http://api.discogs.com/database/search"


    constructor: () ->
        return true


    search: (query, callback) ->
        url = searchUrlBase + "?q="+encodeURI(query)

        $.getJSON url, (data) ->
            results = []
            for res in data.results
                switch res.type
                    when 'artist'
                        results.push(new Artist(res.id, res.title, res.thumb))
                    when 'master', 'release'
                        results.push(new Album(res.id, res.title, res.thumb, res.year, res.type, res.country, res.style, res.genre))

            callback(results)


    getDiscography: (artistId, callback) ->
        url = artistUrlBase + artistId + "/releases"

        pages = 0
        page = 0

        parseData = (data) ->
            pages = data.pagination.pages
            page = data.pagination.page

            results = []
            for res in data.releases
                results.push(new Album(res.id, res.title, res.thumb, res.year, res.type))

            if page < pages
                page++
                nextUrl = url + "?page="+page
                $.getJSON nextUrl, parseData
            else
                callback(results)

        $.getJSON url, parseData

        return true


    getAlbumTracklist: (albumId, albumType, artist, callback) ->
        type = ""
        if albumType == "master"
            type = "masters"
        else if albumType == "release"
            type = "releases"

        url = urlBase + type + "/" + albumId

        $.getJSON url, (data) ->
            results = []
            for res in data.tracklist
                results.push(new Track(res.title, artist, res.duration))

            callback(results)


# export
window.Discogs = Discogs