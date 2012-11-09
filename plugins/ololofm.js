// Generated by CoffeeScript 1.3.3
(function() {
  var OlolofmPlugin;

  OlolofmPlugin = (function() {

    function OlolofmPlugin() {
      this.id = "ololofm_plugin";
      return this.init();
    }

    OlolofmPlugin.prototype.init = function() {
      console.log("ololofm plugin inited");
      return true;
    };

    OlolofmPlugin.prototype.query = function(query, callback) {
      var url,
        _this = this;
      url = "http://ololo.fm/search/?x=0&y=0&query=" + encodeURIComponent(query);
      return $.get(url, function(data) {
        var i, re, res;
        re = /<a href="\/song\/(.+?)".+?<span>(.+?)<\/span><br.*?\/>(.+?)<\/a><dfn>(.+?)<\/dfn>/gim;
        data = data.replace(/[\n\t\r]/gm, "");
        res = re.exec(data);
        _this.songs = [];
        i = 0;
        while (res !== null) {
          _this.songs[i] = new Track(res[2], res[3], res[4], "http://ololo.fm/save/" + res[1], _this.id);
          res = re.exec(data);
          i++;
        }
        callback(_this.songs);
        return true;
      });
    };

    OlolofmPlugin.prototype.getStreamUrl = function(url, callback) {
      return $.get(url, function(data) {
        var re, res;
        re = /<a href="(.+?)".+?>Сохранить в нормальном формате MP3<\/a>/gim;
        res = re.exec(data);
        url = "http://ololo.fm" + res[1];
        callback(url);
        return true;
      });
    };

    return OlolofmPlugin;

  })();

  window.plugins.push(new OlolofmPlugin());

}).call(this);
