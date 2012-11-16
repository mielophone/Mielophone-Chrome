class Discogs
    searchUrlBase = "http://api.discogs.com/database/search"

    constructor: () ->

    search: (query, callback) ->
        url = searchUrlBase + "?q="+encodeURI(query)

        $.getJSON url, (data) ->
            results = []
            for res in data.results
                switch res.type
                    when 'artist'
                        results.push(new Artist(res.id, res.title, res.thumb))
                    when 'master', 'release'
                        results.push(new Album(res.id, res.title, res.thumb, res.year, res.country, res.style, res.genre))

            callback(results)


# export
window.Discogs = Discogs