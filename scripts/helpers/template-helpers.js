/**
 * Hexo Theme Blackbear - Template Helpers
 * 将业务逻辑从EJS模板中分离，提高可维护性
 */

/**
 * 获取页面标题
 * @param {Object} page - 页面对象
 * @param {Object} config - 配置对象
 * @returns {string} 页面标题
 */
function getPageTitle(page, config) {
  if (is_home()) {
    return config.title;
  }
  
  if (page.archive) {
    return getArchiveTitle(page, config);
  }
  
  if (is_category()) {
    return `${page.category} · ${config.title}`;
  }
  
  if (is_tag()) {
    return `${page.tag} · ${config.title}`;
  }
  
  if (is_page() && page.title) {
    const menuTitle = getMenuTitle(page.title);
    return `${menuTitle} · ${config.title}`;
  }
  
  return `${page.title} - ${config.title}`;
}

/**
 * 获取归档页面标题
 * @param {Object} page - 页面对象
 * @param {Object} config - 配置对象
 * @returns {string} 归档标题
 */
function getArchiveTitle(page, config) {
  const baseTitle = __('menu.archives');
  
  if (is_month()) {
    return `${baseTitle} - ${page.year}/${page.month} · ${config.title}`;
  }
  
  if (is_year()) {
    return `${baseTitle} - ${page.year} · ${config.title}`;
  }
  
  return `${baseTitle} · ${config.title}`;
}

/**
 * 获取菜单项标题
 * @param {string} name - 菜单项名称
 * @returns {string} 本地化后的标题
 */
function getMenuTitle(name) {
  const translationKey = `menu.${name.toLowerCase()}`;
  const translation = __(translationKey);
  
  // 如果翻译不存在，返回原始名称
  return translation === translationKey ? name : translation;
}

/**
 * 获取文章摘要
 * @param {Object} post - 文章对象
 * @returns {string} 文章摘要
 */
function getPostExcerpt(post) {
  if (post.description) {
    return `<p>${post.description}</p>`;
  }
  
  if (post.excerpt) {
    return post.excerpt;
  }
  
  return '';
}

/**
 * 判断是否应该显示文章摘要
 * @param {Object} post - 文章对象
 * @returns {boolean} 是否显示摘要
 */
function shouldShowExcerpt(post) {
  return !!(post.description || post.excerpt);
}

/**
 * 获取社交链接配置
 * @param {Object} theme - 主题配置
 * @returns {Array} 社交链接数组
 */
function getSocialLinks(theme) {
  if (!theme.social) return [];
  
  return Object.entries(theme.social)
    .filter(([key, value]) => value && value.trim() !== '')
    .map(([key, value]) => ({
      name: key,
      url: value,
      icon: getSocialIcon(key)
    }));
}

/**
 * 获取社交媒体图标类名
 * @param {string} platform - 平台名称
 * @returns {string} 图标类名
 */
function getSocialIcon(platform) {
  const iconMap = {
    'github': 'icon-github',
    'twitter': 'icon-twitter',
    'facebook': 'icon-facebook',
    'linkedin': 'icon-linkedin',
    'email': 'icon-email',
    'weibo': 'icon-weibo',
    'zhihu': 'icon-zhihu',
    'douban': 'icon-douban'
  };
  
  return iconMap[platform] || 'icon-link';
}

/**
 * 检查当前页面是否激活
 * @param {string} path - 菜单路径
 * @returns {boolean} 是否激活
 */
function isMenuActive(path) {
  const currentPath = window.location.pathname;
  return currentPath === path || currentPath === path + 'index.html';
}

/**
 * 获取主题颜色配置
 * @param {Object} theme - 主题配置
 * @returns {Object} 颜色配置对象
 */
function getThemeColors(theme) {
  const colorMap = {
    'default': { primary: '#c05b4d', secondary: '#f8f5ec' },
    'mint green': { primary: '#16982B', secondary: '#f5f5f5' },
    'cobalt blue': { primary: '#0047AB', secondary: '#f0f2f5' },
    'hot pink': { primary: '#FF69B4', secondary: '#f8f5f5' },
    'dark violet': { primary: '#9932CC', secondary: '#f5f4fa' }
  };
  
  const themeColor = theme.color?.toLowerCase() || 'default';
  return colorMap[themeColor] || colorMap['default'];
}

/**
 * 判断是否应该显示TOC
 * @param {Object} content - 页面内容
 * @param {Object} theme - 主题配置
 * @returns {boolean} 是否显示TOC
 */
function shouldShowToc(content, theme) {
  if (is_home()) return false;
  if (!theme.toc) return false;
  if (!content) return false;
  
  // 检查内容中是否有标题
  const hasHeadings = /<h[1-6][^>]*>/.test(content);
  return hasHeadings;
}

/**
 * 获取分页信息
 * @param {Object} page - 页面对象
 * @returns {Object} 分页信息
 */
function getPaginationInfo(page) {
  if (!page.prev && !page.next) {
    return null;
  }
  
  return {
    hasPrev: !!page.prev,
    hasNext: !!page.next,
    prevLink: page.prev ? url_for(page.prev.path) : null,
    nextLink: page.next ? url_for(page.next.path) : null,
    prevTitle: page.prev ? page.prev.title : null,
    nextTitle: page.next ? page.next.title : null
  };
}

/**
 * 获取文章元信息
 * @param {Object} post - 文章对象
 * @returns {Object} 元信息对象
 */
function getPostMeta(post) {
  return {
    date: full_date(post.date, 'YYYY-MM-DD'),
    author: post.author || config.author,
    categories: post.categories?.data || [],
    tags: post.tags?.data || [],
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    readingTime: Math.ceil((post.content ? post.content.split(/\s+/).length : 0) / 200)
  };
}

/**
 * 判断是否应该显示评论
 * @param {Object} theme - 主题配置
 * @param {Object} page - 页面对象
 * @returns {boolean} 是否显示评论
 */
function shouldShowComments(theme, page) {
  if (is_home()) return false;
  if (!theme.comments?.enable) return false;
  if (page.comments === false) return false; // 页面级别禁用
  
  return true;
}

/**
 * 获取可用的评论系统
 * @param {Object} theme - 主题配置
 * @returns {Array} 可用评论系统数组
 */
function getAvailableComments(theme) {
  const systems = [];
  
  if (theme.disqus?.shortname) {
    systems.push({ type: 'disqus', config: theme.disqus });
  }
  
  if (theme.gitalk?.enable) {
    systems.push({ type: 'gitalk', config: theme.gitalk });
  }
  
  if (theme.utterances?.enable) {
    systems.push({ type: 'utterances', config: theme.utterances });
  }
  
  if (theme.changyan?.appid && theme.changyan?.appkey) {
    systems.push({ type: 'changyan', config: theme.changyan });
  }
  
  return systems;
}

// 导出所有助手函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getPageTitle,
    getArchiveTitle,
    getMenuTitle,
    getPostExcerpt,
    shouldShowExcerpt,
    getSocialLinks,
    getSocialIcon,
    isMenuActive,
    getThemeColors,
    shouldShowToc,
    getPaginationInfo,
    getPostMeta,
    shouldShowComments,
    getAvailableComments
  };
}