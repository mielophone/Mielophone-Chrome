class Track
    constructor: (title, artist, @duration, @url, pluginId) ->
        @title = @htmlDecode(title)
        @artist = @htmlDecode(artist)
        @id = @title+@artist+pluginId
        return true

    htmlDecode: (input) ->
        e = document.createElement('div')
        e.innerHTML = input
        return if e.childNodes.length == 0 then "" else e.childNodes[0].nodeValue


window.Track = Track