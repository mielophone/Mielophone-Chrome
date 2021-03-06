// Generated by CoffeeScript 1.3.3
(function() {
  var Discogs;

  Discogs = (function() {
    var artistUrlBase, searchUrlBase, urlBase;

    urlBase = "http://api.discogs.com/";

    artistUrlBase = "http://api.discogs.com/artists/";

    searchUrlBase = "http://api.discogs.com/database/search";

    function Discogs() {
      return true;
    }

    Discogs.prototype.search = function(query, callback) {
      var url;
      url = searchUrlBase + "?q=" + encodeURI(query);
      return $.getJSON(url, function(data) {
        var res, results, _i, _len, _ref;
        results = [];
        _ref = data.results;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          res = _ref[_i];
          switch (res.type) {
            case 'artist':
              results.push(new Artist(res.id, res.title, res.thumb));
              break;
            case 'master':
            case 'release':
              results.push(new Album(res.id, res.title, res.thumb, res.year, res.type, res.country, res.style, res.genre));
          }
        }
        return callback(results);
      });
    };

    Discogs.prototype.getDiscography = function(artistId, callback) {
      var page, pages, parseData, url;
      url = artistUrlBase + artistId + "/releases";
      pages = 0;
      page = 0;
      parseData = function(data) {
        var nextUrl, res, results, _i, _len, _ref;
        pages = data.pagination.pages;
        page = data.pagination.page;
        results = [];
        _ref = data.releases;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          res = _ref[_i];
          results.push(new Album(res.id, res.title, res.thumb, res.year, res.type));
        }
        if (page < pages) {
          page++;
          nextUrl = url + "?page=" + page;
          return $.getJSON(nextUrl, parseData);
        } else {
          return callback(results);
        }
      };
      $.getJSON(url, parseData);
      return true;
    };

    Discogs.prototype.getAlbumTracklist = function(albumId, albumType, artist, callback) {
      var type, url;
      type = "";
      if (albumType === "master") {
        type = "masters";
      } else if (albumType === "release") {
        type = "releases";
      }
      url = urlBase + type + "/" + albumId;
      return $.getJSON(url, function(data) {
        var res, results, _i, _len, _ref;
        results = [];
        _ref = data.tracklist;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          res = _ref[_i];
          results.push(new Track(res.title, artist, res.duration));
        }
        return callback(results);
      });
    };

    return Discogs;

  })();

  window.Discogs = Discogs;

}).call(this);
