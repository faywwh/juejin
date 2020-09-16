window.onload = function () {
  // 初始化首页
  getHomePageList(200);
  // 初始化话题页
  getTopic();
  // 初始化小册页
  getBrochure();
};

// 打开主菜单时设置相应菜单显示和隐藏
function openMainMenu(event) {
  var topic = document.querySelector('.content-container .topic-box');
  var homepage = document.querySelector('.content-container .content-box');
  var brochure = document.querySelector('.content-container .brochure-box');
  var ad = document.querySelector('.content-container .ad-box');
  var homePageSubtitleBox = document.querySelector(
    '.header-box .homepage-sub-title'
  );
  var brochureSubtitleBox = document.querySelector(
    '.header-box .brochure-sub-title'
  );
  var titles = document.querySelectorAll('.header-box .title-list li');
  var container = document.querySelector('.container');
  var addGroup = document.querySelector('.title-list .add-group');

  var classNameArr = ['home-page', 'topic', 'brochure'];
  if (event.target.className) {
    var e = event.target;
  } else {
    e = event.target.parentNode;
  }
  var className = e.className;
  if (className && classNameArr.indexOf(className) >= 0) {
    titles.forEach(function (item) {
      item.classList.remove('active');
    });
    topic.style.display = 'none';
    ad.style.display = 'none';
    homepage.style.display = 'none';
    brochureSubtitleBox.style.display = 'none';
    homePageSubtitleBox.style.display = 'none';
    brochure.style.display = 'none';
    if (className == 'home-page') {
      ad.style.display = 'block';
      homepage.style.display = 'block';
      homePageSubtitleBox.style.display = 'block';
      addGroup.innerText = '写文章';
      e.classList.add('active');
    }
    if (className == 'topic') {
      topic.style.display = 'block';
      document.body.background = '#fff';
      addGroup.innerText = '发沸点';
      e.classList.add('active');
    }
    if (className == 'brochure') {
      brochureSubtitleBox.style.display = 'block';
      brochure.style.display = 'block';
      addGroup.innerText = '写文章';
      e.classList.add('active');
    }
  }
}

// 打开子菜单
function openSubMenu(sort_type, e) {
  var lis = document.querySelectorAll('.content-title li');
  getHomePageList(sort_type);
  lis.forEach(function (item) {
    item.classList.remove('active');
  });
  e.target.classList.add('active');
}

// 获取首页数据
// 热门sort_type=200，最新sort_type=300，热榜sort_type=3，
function getHomePageList(sort_type) {
  var obj = {
    client_type: 2608,
    cursor: '0',
    id_type: 2,
    limit: 20,
    sort_type: sort_type,
  };
  $.ajax({
    url: 'http://127.0.0.1:3000/api/juejin/getRecommend',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    success: function (result) {
      init(result.data);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// 首页初始化
function init(data) {
  if (data.length > 0) {
    var ul = '<ul class="content-list-ul">';
    data.forEach(function (item, index) {
      if (item.item_type == 2) {
        var author_user_info = item.item_info.author_user_info;
        var article_info = item.item_info.article_info;
        var category = '';
        var cover_image = '';
        item.item_info.tags.forEach(function (tagItem) {
          var tag_name =
            '<a class="tagname" target="_blank" href="https://juejin.im/tag/' +
            tagItem.tag_name +
            '">' +
            tagItem.tag_name +
            '</a>';
          category += tag_name;
        });
        if (article_info.cover_image) {
          cover_image =
            '<div style="background-image:url(' +
            article_info.cover_image +
            ')" class="cover-image"><a target="_blank" href="https://juejin.im/post/' +
            article_info.article_id +
            '"></a></div>';
        }
        var li =
          '<a target="_blank" href="https://juejin.im/post/' +
          article_info.article_id +
          '"><object>' +
          '<li class="content-list">' +
          '<div class="detail-list">' +
          '<div class="left-box">' +
          '<div class="detail-title">' +
          '<ul><li>' +
          '<a target="_blank" href="https://juejin.im/user/' +
          article_info.user_id +
          '">' +
          author_user_info.user_name +
          '</a></li><li>' +
          dayjs(parseInt(article_info.ctime + '000')).fromNow() +
          '</li><li>' +
          category +
          '</li></ul></div><div class="detail-content">' +
          '<a target="_blank" href="https://juejin.im/post/' +
          article_info.article_id +
          '">' +
          article_info.title +
          '</a></div><div class="detail-action">' +
          '<ul><li><a href="">' +
          '<i class="iconfont icon-good"></i>' +
          '<span>' +
          article_info.digg_count +
          '</span></a></li><li><a href="">' +
          '<i class="iconfont icon-message-reply"></i>' +
          '<span>' +
          article_info.comment_count +
          '</span></a></li><li class="share"><a href="">' +
          '<i class="iconfont icon-share"></i>' +
          '</a></li></ul></div></div><div class="right-box">' +
          cover_image +
          '</div></div></li></object></a>';
        ul += li;
      }
    });
    ul += '</ul>';
    document.querySelector('.content-box .content').innerHTML = ul;
  }
}

// 获取话题数据
function getTopic() {
  var obj = {
    cursor: '0',
    limit: 21,
    sort_type: 7,
  };
  $.ajax({
    url: 'http://127.0.0.1:3000/api/juejin/getTopic',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    success: function (result) {
      initTopic(result.data);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// 初始化话题页
function initTopic(data) {
  if (data.length > 0) {
    var topicBox =
      '<div class="topic-box-div">' +
      '<div class="topic-content">' +
      '<div class="topic-title">全部话题</div>' +
      '<div class="topic-list">';
    data.forEach(function (item) {
      var topicItem =
        '<div class="topic-item">' +
        '<div class="pic" style="background-image: url(' +
        item.topic.icon +
        ')">' +
        '<a target="_blank" href="https://juejin.im/topic/' +
        item.topic.topic_id +
        '"></a>' +
        '</div>' +
        '<div class="detail">' +
        '<a target="_blank" href="https://juejin.im/topic/' +
        item.topic.topic_id +
        '">' +
        item.topic.title +
        '</a>' +
        '<span>' +
        item.topic.follower_count +
        ' 关注 · ' +
        item.topic.msg_count +
        ' 沸点</span>' +
        '<span> + 关注 </span>' +
        '</div>' +
        '</div>';

      topicBox += topicItem;
    });
    document.querySelector(
      '.content-container .topic-box'
    ).innerHTML = topicBox;
  }
}

// 获取小册数据
function getBrochure() {
  var obj = {
    cursor: '0',
    limit: 20,
    category_id: '0',
  };
  $.ajax({
    url: 'http://127.0.0.1:3000/api/juejin/listbycategory',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    success: function (result) {
      initBrochure(result.data);
    },
    error: function (err) {
      console.log(err);
    },
  });
}

// 初始化小册页
function initBrochure(data) {
  var brochureList = '';
  data.forEach(function (item) {
    var info = item.base_info;
    var userInfo = item.user_info;
    var presell = '';
    var levelPic = '';
    var tooltip = '';
    var levelArr = [1, 2, 3, 4, 5];
    if (info.is_finished == 0) {
      presell = '<span class="presell">预售</span>';
    }
    if (levelArr.indexOf(userInfo.level) >= 0) {
      levelPic =
        '<a target="_blank" href="https://juejin.im/book/6844733795329900551/section/6844733795371843597" class="rank"><img src="./img/lv' +
        userInfo.level +
        '.svg" alt="" /></a>';
    }
    if (userInfo.company) {
      userInfo.company = ' @ ' + userInfo.company;
    }
    if (item.event_discount) {
      var endTime = item.event_discount.end_time * 1000;
      countdown(endTime);
      var tooltip =
        '<div class="tooltip">' +
        '<span class="pre-text">' +
        '<img src="//s3.pstatp.com/toutiao/xitu_juejin_web/img/gift.9a8f3aa.png" alt=""/>' +
        '<span class="time-limit-price">限时优惠价 ' +
        (info.price / 1000) * item.event_discount.discount_rate +
        ' 元</span></span>' +
        '<span class="counnt-down">' +
        '<span class="endTime">' +
        '</span>' +
        '</span>' +
        '</div>';
    }
    var brochureItem =
      '<a target="_blank" href="https://juejin.im/book/' +
      item.booklet_id +
      '"><object>' +
      '<div class="brochure-item">' +
      '<div class="pic" style="background-image: url(' +
      info.cover_img +
      ');"></div>' +
      '<div class="content">' +
      '<div class="title">' +
      presell +
      '<span class="title-detail">' +
      info.title +
      '</span>' +
      '</div>' +
      '<div class="detail">' +
      info.summary +
      '</div>' +
      '<div class="author">' +
      '<div class="author-info"><a target="_blank" href="https://juejin.im/user/' +
      userInfo.user_id +
      '"><div class="profile-photo" style="' +
      'background-image: url(' +
      userInfo.avatar_large +
      ');"></div>' +
      '<a class="author-name" target="_blank" href="http://juejin.im/user/' +
      userInfo.user_id +
      '">' +
      userInfo.user_name +
      '</a>' +
      levelPic +
      '</a>' +
      '</div>' +
      '<div class="author-desc">' +
      '<span>' +
      userInfo.job_title +
      userInfo.company +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="other">' +
      '<div class="price">' +
      '<a href="https://juejin.im/books/payment/' +
      item.booklet_id +
      '">' +
      '<div class="price-text">￥' +
      parseInt(info.price) / 100 +
      '</div>' +
      '</a>' +
      tooltip +
      '</div>' +
      '<div class="messages">' +
      '<span class="message">' +
      '<span>' +
      info.section_count +
      '小节</span>' +
      '</span>' +
      '<span class="message">' +
      '<span>' +
      ' ' +
      info.buy_count +
      '</span>' +
      '<span> 人已购买</span>' +
      '</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</object></a>';
    brochureList += brochureItem;
  });
  document.querySelector('.brochure-list').innerHTML = brochureList;
}

// 倒计时
function countdown(endTime) {
  var time;
  var timer = setInterval(function () {
    const msec = endTime - +new Date();
    if (msec > 0) {
      // 计算时分秒数
      let day = parseInt(msec / 1000 / 60 / 60 / 24);
      let hr = parseInt((msec / 1000 / 60 / 60) % 24);
      let min = parseInt((msec / 1000 / 60) % 60);
      let sec = parseInt((msec / 1000) % 60);
      let minsec = parseInt((msec % 1000) / 10);
      // 个位数前补零
      hr = hr > 9 ? hr : '0' + hr;
      min = min > 9 ? min : '0' + min;
      sec = sec > 9 ? sec : '0' + sec;
      minsec = minsec > 9 ? minsec : '0' + minsec;
      time = day + '天 ' + hr + ':' + min + ':' + sec + '.' + minsec;
      document.querySelector('.endTime').innerText = '倒计时 ' + time;
    } else {
      clearInterval(timer);
    }
  }, 10);
}

// 监听滚动条
function initScroll() {
  if (document.documentElement.scrollTop > 660) {
    document.querySelector('.header-box').classList.add('visible');
    document.querySelector('.content-container').classList.add('top');
  } else {
    document.querySelector('.header-box').classList.remove('visible');
    document.querySelector('.content-container').classList.remove('top');
  }
}
