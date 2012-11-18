// Generated by CoffeeScript 1.3.3
(function() {
  var Track;

  Track = (function() {

    function Track(title, artist, duration, url, pluginId) {
      this.duration = duration;
      this.url = url != null ? url : null;
      if (pluginId == null) {
        pluginId = "noplugin";
      }
      this.title = this.htmlDecode(title);
      this.artist = this.htmlDecode(artist);
      this.id = this.title + this.artist + pluginId;
      return true;
    }

    Track.prototype.htmlDecode = function(input) {
      var e;
      e = document.createElement('div');
      e.innerHTML = input;
      if (e.childNodes.length === 0) {
        return "";
      } else {
        return e.childNodes[0].nodeValue;
      }
    };

    return Track;

  })();

  window.Track = Track;

}).call(this);
