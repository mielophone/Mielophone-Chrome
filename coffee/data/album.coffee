class Album
    constructor: (@id, @title, @image, @year, @country = "", @styles = [], @genres = []) ->
        return true

window.Album = Album
