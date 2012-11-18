class Album
    constructor: (@id, @title, @image, @year, @type, @country = "", @styles = [], @genres = []) ->
        return true

window.Album = Album
