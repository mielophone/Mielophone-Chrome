class Artist
    constructor: (@id, @name, @image) ->
        @type = "artist"
        return true

window.Artist = Artist