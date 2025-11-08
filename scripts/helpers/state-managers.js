/**
 * Hexo Theme Blackbear - Template State Manager
 * 统一管理模板状态，避免重复条件判断
 */

/**
 * 评论系统状态管理器
 */
class CommentStateManager {
  constructor(theme, page) {
    this.theme = theme;
    this.page = page;
    this._availableSystems = null;
  }

  /**
   * 检查是否应该显示评论
   */
  shouldShowComments() {
    return this.page.comments && !is_home();
  }

  /**
   * 获取可用的评论系统
   */
  getAvailableSystems() {
    if (this._availableSystems !== null) {
      return this._availableSystems;
    }

    const systems = [];
    const theme = this.theme;

    // Disqus
    if (theme.disqus_shortname) {
      systems.push({
        type: 'disqus',
        id: 'disqus_thread',
        config: { shortname: theme.disqus_shortname }
      });
    }

    // LiveRe
    if (theme.livere_datauid) {
      systems.push({
        type: 'livere',
        id: 'lv-container',
        config: { datauid: theme.livere_datauid }
      });
    }

    // Gitalk
    if (theme.gitalk && theme.gitalk.enable) {
      systems.push({
        type: 'gitalk',
        id: 'gitalk-container',
        config: theme.gitalk
      });
    }

    // Utterances
    if (theme.utterances && theme.utterances.enable) {
      systems.push({
        type: 'utterances',
        id: 'utterances-container',
        config: theme.utterances
      });
    }

    // Cusdis
    if (theme.cusdis && theme.cusdis.app_id) {
      systems.push({
        type: 'cusdis',
        id: 'cusdis_thread',
        config: theme.cusdis
      });
    }

    this._availableSystems = systems;
    return systems;
  }

  /**
   * 获取首选的评论系统
   */
  getPreferredSystem() {
    const available = this.getAvailableSystems();
    return available.length > 0 ? available[0] : null;
  }

  /**
   * 获取评论系统优先级列表
   */
  getSystemPriority() {
    return [
      'disqus',
      'livere', 
      'gitalk',
      'utterances',
      'cusdis'
    ];
  }
}

/**
 * TOC状态管理器
 */
class TocStateManager {
  constructor(theme, page, content) {
    this.theme = theme;
    this.page = page;
    this.content = content;
    this._shouldShow = null;
  }

  /**
   * 检查是否应该显示TOC
   */
  shouldShowToc() {
    if (this._shouldShow !== null) {
      return this._shouldShow;
    }

    // 首页不显示TOC
    if (is_home()) {
      this._shouldShow = false;
      return false;
    }

    // 检查页面级别设置
    if (this.page.toc === false) {
      this._shouldShow = false;
      return false;
    }

    // 检查主题设置
    if (!this.theme.toc) {
      this._shouldShow = false;
      return false;
    }

    // 检查内容中是否有标题
    if (!this.content || !/<h[1-6][^>]*>/.test(this.content)) {
      this._shouldShow = false;
      return false;
    }

    this._shouldShow = true;
    return true;
  }

  /**
   * 获取TOC配置
   */
  getTocConfig() {
    return {
      title: __('posts.toc'),
      content: this.content,
      options: this.theme.toc || {}
    };
  }
}

/**
 * 社交媒体状态管理器
 */
class SocialStateManager {
  constructor(theme) {
    this.theme = theme;
    this._links = null;
  }

  /**
   * 获取可用的社交链接
   */
  getAvailableLinks() {
    if (this._links !== null) {
      return this._links;
    }

    const links = [];
    const social = this.theme.social || {};

    const platformConfig = {
      github: { icon: 'icon-github', url: 'https://github.com/' },
      twitter: { icon: 'icon-twitter', url: 'https://twitter.com/' },
      facebook: { icon: 'icon-facebook', url: 'https://facebook.com/' },
      linkedin: { icon: 'icon-linkedin', url: 'https://linkedin.com/in/' },
      email: { icon: 'icon-email', url: 'mailto:' },
      weibo: { icon: 'icon-weibo', url: 'https://weibo.com/' },
      zhihu: { icon: 'icon-zhihu', url: 'https://zhihu.com/people/' },
      douban: { icon: 'icon-douban', url: 'https://douban.com/people/' }
    };

    Object.entries(social).forEach(([platform, username]) => {
      if (username && username.trim() !== '') {
        const config = platformConfig[platform];
        if (config) {
          links.push({
            platform,
            username,
            icon: config.icon,
            url: config.url + username,
            title: platform.charAt(0).toUpperCase() + platform.slice(1)
          });
        }
      }
    });

    this._links = links;
    return links;
  }

  /**
   * 检查是否有可用的社交链接
   */
  hasSocialLinks() {
    return this.getAvailableLinks().length > 0;
  }
}

/**
 * 主题状态管理器
 */
class ThemeStateManager {
  constructor(theme, config) {
    this.theme = theme;
    this.config = config;
  }

  /**
   * 获取主题颜色配置
   */
  getThemeColors() {
    const colorMap = {
      'default': { primary: '#c05b4d', secondary: '#f8f5ec' },
      'mint green': { primary: '#16982B', secondary: '#f5f5f5' },
      'cobalt blue': { primary: '#0047AB', secondary: '#f0f2f5' },
      'hot pink': { primary: '#FF69B4', secondary: '#f8f5f5' },
      'dark violet': { primary: '#9932CC', secondary: '#f5f4fa' }
    };

    const themeColor = this.theme.color?.toLowerCase() || 'default';
    return colorMap[themeColor] || colorMap['default'];
  }

  /**
   * 检查是否应该显示Fancybox
   */
  shouldShowFancybox() {
    return !!this.theme.fancybox;
  }

  /**
   * 检查是否应该显示LaTeX支持
   */
  shouldShowLaTeX() {
    return !!this.theme.latex;
  }

  /**
   * 检查是否应该显示LeanCloud统计
   */
  shouldShowLeanCloud() {
    const leancloud = this.theme.leancloud || {};
    return !!(leancloud.app_id && leancloud.app_key);
  }

  /**
   * 获取RSS配置
   */
  getRssConfig() {
    const rss = this.theme.rss;
    
    if (rss === 'default' && this.config.feed && this.config.feed.path) {
      return {
        enabled: true,
        path: this.config.feed.path,
        title: __('rss_feed')
      };
    }
    
    if (rss && rss !== false) {
      return {
        enabled: true,
        path: rss,
        title: __('rss_feed')
      };
    }
    
    return { enabled: false };
  }
}

/**
 * 页面状态管理器
 */
class PageStateManager {
  constructor(page, config) {
    this.page = page;
    this.config = config;
  }

  /**
   * 获取页面标题
   */
  getPageTitle() {
    if (is_home()) {
      return this.config.title;
    }

    if (this.page.archive) {
      return this.getArchiveTitle();
    }

    if (is_category()) {
      return `${this.page.category} · ${this.config.title}`;
    }

    if (is_tag()) {
      return `${this.page.tag} · ${this.config.title}`;
    }

    if (this.page.title) {
      return `${this.page.title} - ${this.config.title}`;
    }

    return this.config.title;
  }

  /**
   * 获取归档标题
   */
  getArchiveTitle() {
    const baseTitle = __('menu.archives');
    
    if (is_month()) {
      return `${baseTitle} - ${this.page.year}/${this.page.month} · ${this.config.title}`;
    }
    
    if (is_year()) {
      return `${baseTitle} - ${this.page.year} · ${this.config.title}`;
    }
    
    return `${baseTitle} · ${this.config.title}`;
  }

  /**
   * 检查是否是文章页面
   */
  isPostPage() {
    return !is_home() && this.page.layout === 'post';
  }

  /**
   * 检查是否应该显示文章元信息
   */
  shouldShowPostMeta() {
    return this.isPostPage();
  }
}

// 创建全局状态管理器工厂函数
function createStateManagers(theme, config, page, content) {
  return {
    comments: new CommentStateManager(theme, page),
    toc: new TocStateManager(theme, page, content),
    social: new SocialStateManager(theme),
    theme: new ThemeStateManager(theme, config),
    page: new PageStateManager(page, config)
  };
}

// 导出状态管理器
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CommentStateManager,
    TocStateManager,
    SocialStateManager,
    ThemeStateManager,
    PageStateManager,
    createStateManagers
  };
} else {
  // 浏览器环境，挂载到全局对象
  window.BlackbearState = {
    CommentStateManager,
    TocStateManager,
    SocialStateManager,
    ThemeStateManager,
    PageStateManager,
    createStateManagers
  };
}