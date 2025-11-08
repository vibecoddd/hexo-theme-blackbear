(function (window) {
  'use strict';

  function Even(config) {
    this.config = config;
  }

  Even.prototype.setup = function() {
    var leancloud = this.config.leancloud;

    this.navbar();
    this.responsiveTable();

    if (this.config.toc) {
      this.scrollToc();
      this.tocFollow();
    }
    if (this.config.fancybox) {
      this.fancybox();
    }
    if (leancloud.app_id && leancloud.app_key) {
      this.recordReadings();
    }
    if(this.config.latex) {
      this.renderLaTeX();
    }
    // 初始化语法高亮
    this.initPrismHighlight();
    this.backToTop();
  };

  Even.prototype.navbar = function () {
    var $nav = $('#mobile-navbar');
    var $navIcon = $('.mobile-navbar-icon');

    var slideout = new Slideout({
      'panel': document.getElementById('mobile-panel'),
      'menu': document.getElementById('mobile-menu'),
      'padding': 180,
      'tolerance': 70
    });
    slideout.disableTouch();

    $navIcon.click(function () {
      slideout.toggle();
    });

    slideout.on('beforeopen', function () {
      $nav.addClass('fixed-open');
      $navIcon.addClass('icon-click').removeClass('icon-out');
    });

    slideout.on('beforeclose', function () {
      $nav.removeClass('fixed-open');
      $navIcon.addClass('icon-out').removeClass('icon-click');
    });

    $('#mobile-panel').on('touchend', function () {
      slideout.isOpen() && $navIcon.click();
    });
  };

  Even.prototype.responsiveTable = function () {
    var tables = $('.post-content > table')
    tables.wrap('<div class="table-responsive">')
  };

  Even.prototype.scrollToc = function () {
    var SPACING = 20;
    var $toc = $('.post-toc');
    var $footer = $('.post-footer');

    if ($toc.length) {
      var minScrollTop = $toc.offset().top - SPACING;
      
      // 使用节流优化滚动性能
      var throttledScrollHandler = BlackbearUtils.throttle(function () {
        var tocState = {
          start: {
            'position': 'absolute',
            'top': minScrollTop
          },
          process: {
            'position': 'fixed',
            'top': SPACING
          }
        }
        var scrollTop = $(window).scrollTop();
        if (scrollTop < minScrollTop) {
          $toc.css(tocState.start);
        } else {
          $toc.css(tocState.process);
          
          if($(".post-toc").css("display") != "none"){
            var maxTocTop = $footer.offset().top - $toc.height() - SPACING;
            var tocCenterThreshold = document.documentElement.scrollTop + window.innerHeight / 2;
            if ($(".toc-link.active").offset() != undefined && $(".toc-link.active").offset().top > tocCenterThreshold) {
              var distanceBetween = $(".post-toc").offset().top - $(".toc-link.active").offset().top;
              $(".post-toc").offset({
                  top: Math.min(maxTocTop, tocCenterThreshold + distanceBetween),
              });
            }
            if (maxTocTop < $(".post-toc").offset().top) {
              $(".post-toc").offset({ top: maxTocTop });
            }
          }
        }
      }, 16); // 约60fps
      
      BlackbearUtils.optimizedScroll(throttledScrollHandler);
    }
  };

  Even.prototype.tocFollow = function () {
    var HEADERFIX = 30;
    var $toclink = $('.toc-link'),
      $headerlink = $('.headerlink');

    // 使用节流优化目录跟随性能
    var throttledScrollHandler = BlackbearUtils.throttle(function () {
      var headerlinkTop = $.map($headerlink, function (link) {
        return $(link).offset().top;
      });
      var scrollTop = $(window).scrollTop();

      for (var i = 0; i < $toclink.length; i++) {
        var isLastOne = i + 1 === $toclink.length,
          currentTop = headerlinkTop[i] - HEADERFIX,
          nextTop = isLastOne ? Infinity : headerlinkTop[i + 1] - HEADERFIX;

        if (currentTop < scrollTop && scrollTop <= nextTop) {
          $($toclink[i]).addClass('active');
        } else {
          $($toclink[i]).removeClass('active');
        }
      }
    }, 16); // 约60fps
    
    BlackbearUtils.optimizedScroll(throttledScrollHandler);
  };

  Even.prototype.fancybox = function () {
    if ($.fancybox) {
      $('.post').each(function () {
        $(this).find('img').each(function () {
          var href = 'href="' + this.src + '"';
          var title = 'title="' + this.alt + '"';
          $(this).wrap('<a class="fancybox" ' + href + ' ' + title + '></a>');
        });
      });

      $('.fancybox').fancybox({
        openEffect: 'elastic',
        closeEffect: 'elastic'
      });
    }
  };

  Even.prototype.recordReadings = function () {
    if (typeof AV !== 'object') return;

    var $visits = $('.post-visits');
    var Counter = AV.Object.extend('Counter');
    if ($visits.length === 1) {
      addCounter(Counter);
    } else {
      showTime(Counter);
    }

    function updateVisits(dom, time) {
      var readText = dom.text().replace(/(\d+)/i, time)
      dom.text(readText);
    }

    function addCounter(Counter) {
      var query = new AV.Query(Counter);

      var url = $visits.data('url').trim();
      var title = $visits.data('title').trim();

      query.equalTo('url', url);
      query.find().then(function (results) {
        if (results.length > 0) {
          var counter = results[0];
          counter.save(null, {
            fetchWhenSave: true
          }).then(function (counter) {
            counter.increment('time', 1);
            return counter.save();
          }).then(function (counter) {
            updateVisits($visits, counter.get('time'));
          });
        } else {
          var newcounter = new Counter();
          newcounter.set('title', title);
          newcounter.set('url', url);
          newcounter.set('time', 1);

          var acl = new AV.ACL();
          acl.setWriteAccess('*', true)
          acl.setReadAccess('*', true)
          newcounter.setACL(acl)

          newcounter.save().then(function () {
            updateVisits($visits, newcounter.get('time'));
          });
        }
      }, function (error) {
        // eslint-disable-next-line
        console.log('Error:' + error.code + ' ' + error.message);
      });
    }

    function showTime(Counter) {
      let index = 0;
      $visits.each(function () {
        var $this = $(this);
        setTimeout(
          function() {
            var query = new AV.Query(Counter);
            var url = $this.data('url').trim();
    
            query.equalTo('url', url);
            query.find().then(function (results) {
              if (results.length === 0) {
                updateVisits($this, 0);
              } else {
                var counter = results[0];
                updateVisits($this, counter.get('time'));
              }
            }, function (error) {
              // eslint-disable-next-line
              console.log('Error:' + error.code + ' ' + error.message);
            });
          }, 100*(index++));     
      })
    }
  };

  Even.prototype.backToTop = function () {
    var $backToTop = $('#back-to-top');

    // 使用节流优化回到顶部按钮显示性能
    var throttledScrollHandler = BlackbearUtils.throttle(function () {
      if ($(window).scrollTop() > 100) {
        $backToTop.fadeIn();
      } else {
        $backToTop.fadeOut();
      }
    }, 16); // 约60fps

    BlackbearUtils.optimizedScroll(throttledScrollHandler);

    $backToTop.on('click', function () {
      $('body,html').animate({ scrollTop: 0 });
    });
  };

  Even.prototype.renderLaTeX = function () {
    var loopID = setInterval(function () {
      if(window.MathJax) {
        var jax = window.MathJax;
        jax.Hub.Config({ tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] }});
        jax.Hub.Queue(['Typeset', jax.Hub, $(document.body)[0]]);
        clearInterval(loopID);
      }
    }, 500);
  }

  Even.prototype.initPrismHighlight = function () {
    // 初始化Prism语法高亮
    if (window.Prism && this.config.prism && this.config.prism.enable) {
      // 等待DOM加载完成后初始化
      $(document).ready(function() {
        // 重新高亮所有代码块
        Prism.highlightAll();
        
        // 为shell/bash类型的代码块添加特定的语言标识
        $('pre code[class*="language-"]').each(function() {
          var $code = $(this);
          var className = $code.attr('class');
          
          // 如果包含shell相关关键词，确保正确识别
          if (className && (className.includes('shell') || className.includes('sh') || className.includes('bash'))) {
            // 确保Prism能正确识别这些语言
            if (!className.includes('language-bash') && !className.includes('language-shell')) {
              $code.addClass('language-bash');
            }
          }
        });
        
        // 再次高亮以确保新添加的语言类生效
        Prism.highlightAll();
      });
    }
  };

  var config = window.config;
  var even = new Even(config);
  even.setup();
}(window))
