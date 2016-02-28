jQuery.extend(jQuery.fn, {
  twitchtv: function (name) {
    var id = $(this),
    autoplay = true,
    infos = {
      online: false,
      video_banner: "asset/img/TwitchTv.jpg",
      viewers: 0,
      views: 0,
      followers: 0,
      game: "...",
      title: "...",
    },
    protocol = document.location.protocol,
    refreshTime = 30000,
    timer;

    function getStreamInfos (callback) {
      $.get(protocol + '//api.twitch.tv/kraken/streams', {channel: name}).done(function(data) {
        if (data.streams[0]) {
          data = data.streams[0];
          infos.preview = data['preview']['large'];
          infos.title = data['channel']['status'];
          infos.game = data['game'];
          infos.viewers = data['viewers'].toLocaleString();
          infos.followers = data['channel']['followers'].toLocaleString();
          infos.views = data['channel']['views'].toLocaleString();
          infos.video_banner = data['channel']['video_banner'];
          infos.created_at = data['created_at'];
          infos.logo = data['channel']['logo'];
          infos.name = name;
          infos.display_name = data['channel']['display_name'];
          infos.online = true;
        } else {
          infos.online = false;
        }

        if (callback) {
          callback(infos);
        } else if (infos.online) {
          loadInfos();
        } else {
          loadBanner();
        }
      }).fail(function() {
        if (callback) {
          infos.online = true;
          callback(infos);
        }
      });
    }

    function getChannelInfos (callback) {
      $.get(protocol + '//api.twitch.tv/kraken/channels/' + name).done(function (data) {
        infos.video_banner = data.video_banner;
        infos.logo = data.logo;
        infos.followers = data.followers.toLocaleString();
        infos.views = data.views.toLocaleString();
        infos.display_name = data.display_name;
        infos.name = name;
        infos.viewers = 0;
        infos.online = false;
        infos.title = data.status;
        infos.game = data.game;
        callback (infos);
      });
    }

    function showLoader () {
      var loaderDOM = id.find('.loader');
      loaderDOM.show();
    }

    function hideLoader () {
      var loaderDOM = id.find('.loader');
      loaderDOM.hide();
    }

    function loadStream () {
      var streamDOM = id.find('.stream'),
      player = protocol + "//player.twitch.tv/?autoplay=" + autoplay + "&channel=" + name;
      var iframe = $("<iframe>").attr("src", player).attr("width", "100%").attr("height", "100%").css("border", 0);
      streamDOM.html(iframe);
    }

    function loadBanner () {
      var streamDOM = id.find('.stream'),
      image = $("<img>").attr("src", infos.video_banner).attr("width", "100%").attr("height", "100%").css("border", 0);
      streamDOM.html(image);
    }

    function loadChat () {
      var chatDOM = id.find('.chat'),
      chat = protocol + "//www.twitch.tv/" + name + "/chat";
      var iframe = $("<iframe>").attr("src", chat).attr("width", "100%").attr("height", "100%").attr("scrolling", "no").css("border", 0);
      chatDOM.html(iframe);
    }

    function loadInfos () {
      id.find('.game').html(infos.game);
      id.find('.title').html(infos.title);
      id.find('.views').html(infos.views);
      id.find('.followers').html(infos.followers);
      id.find('.viewers').html(infos.viewers);
    }

    function refresh () {
        getStreamInfos();
        loadInfos();
    }

    loadBanner();
    loadInfos();
    loadChat();
    hideLoader();
    getStreamInfos(function (data) {
      if(infos.online) {
        loadStream();
        refresh();
        timer = setInterval(refresh, refreshTime);
      } else {
        showLoader();
        getChannelInfos(function () {
          loadBanner();
          loadInfos();
          hideLoader();
        });
      }
    });
  }
});
