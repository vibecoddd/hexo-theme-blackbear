/**
 * Hexo Theme Blackbear - Performance Utilities
 * 包含防抖、节流等性能优化函数
 */

/**
 * 防抖函数 - 在事件停止触发后才执行
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait, immediate) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

/**
 * 节流函数 - 限制函数的执行频率
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 优化的滚动监听
 * @param {Function} callback - 滚动回调函数
 * @param {number} delay - 节流延迟时间（默认16ms，约60fps）
 * @returns {Function} 取消监听的函数
 */
function optimizedScroll(callback, delay = 16) {
  const throttledCallback = throttle(callback, delay);
  
  window.addEventListener('scroll', throttledCallback, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', throttledCallback);
  };
}

/**
 * 优化的窗口大小变化监听
 * @param {Function} callback - 窗口变化回调函数
 * @param {number} delay - 防抖延迟时间（默认250ms）
 * @returns {Function} 取消监听的函数
 */
function optimizedResize(callback, delay = 250) {
  const debouncedCallback = debounce(callback, delay);
  
  window.addEventListener('resize', debouncedCallback);
  
  return () => {
    window.removeEventListener('resize', debouncedCallback);
  };
}

/**
 * 优化的Intersection Observer
 * @param {Function} callback - 交叉观察回调函数
 * @param {Object} options - Intersection Observer选项
 * @returns {IntersectionObserver} 观察者实例
 */
function createOptimizedObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target, entry);
      }
    });
  }, defaultOptions);
  
  return observer;
}

/**
 * 懒加载图片
 * @param {string} selector - 图片选择器
 */
function lazyLoadImages(selector = 'img[data-src]') {
  const images = document.querySelectorAll(selector);
  
  if ('IntersectionObserver' in window) {
    const imageObserver = createOptimizedObserver((img) => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // 降级处理
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

/**
 * 预加载关键资源
 * @param {Array<string>} urls - 要预加载的URL数组
 */
function preloadResources(urls) {
  if (!urls || !urls.length) return;
  
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = url.match(/\.(css)$/) ? 'style' : 
               url.match(/\.(js)$/) ? 'script' : 
               url.match(/\.(woff|woff2|ttf|otf)$/) ? 'font' : 'fetch';
    
    if (link.as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
}

/**
 * 优化的事件委托
 * @param {Element} container - 容器元素
 * @param {string} selector - 目标选择器
 * @param {string} eventType - 事件类型
 * @param {Function} handler - 事件处理函数
 */
function delegateEvent(container, selector, eventType, handler) {
  container.addEventListener(eventType, (e) => {
    const target = e.target.closest(selector);
    if (target && container.contains(target)) {
      handler.call(target, e);
    }
  });
}

/**
 * 批量优化DOM操作
 * @param {Function} operations - DOM操作函数
 * @param {number} batchSize - 批量大小（默认100）
 */
function batchDOMOperations(operations, batchSize = 100) {
  const items = Array.from(document.querySelectorAll('[data-batch-process]'));
  
  function processBatch(startIndex) {
    const endIndex = Math.min(startIndex + batchSize, items.length);
    
    requestAnimationFrame(() => {
      for (let i = startIndex; i < endIndex; i++) {
        operations(items[i]);
      }
      
      if (endIndex < items.length) {
        setTimeout(() => processBatch(endIndex), 0);
      }
    });
  }
  
  if (items.length > 0) {
    processBatch(0);
  }
}

/**
 * 内存优化的动画帧管理
 */
class AnimationFrameManager {
  constructor() {
    this.rafId = null;
    this.callbacks = new Set();
  }
  
  add(callback) {
    this.callbacks.add(callback);
    this.start();
    return () => this.remove(callback);
  }
  
  remove(callback) {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }
  
  start() {
    if (this.rafId) return;
    
    const loop = () => {
      this.callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Animation frame callback error:', error);
        }
      });
      
      if (this.callbacks.size > 0) {
        this.rafId = requestAnimationFrame(loop);
      }
    };
    
    this.rafId = requestAnimationFrame(loop);
  }
  
  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  clear() {
    this.callbacks.clear();
    this.stop();
  }
}

// 创建全局动画帧管理器实例
const animationManager = new AnimationFrameManager();

// 导出所有工具函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    optimizedScroll,
    optimizedResize,
    createOptimizedObserver,
    lazyLoadImages,
    preloadResources,
    delegateEvent,
    batchDOMOperations,
    AnimationFrameManager,
    animationManager
  };
} else {
  // 浏览器环境，挂载到全局对象
  window.BlackbearUtils = {
    debounce,
    throttle,
    optimizedScroll,
    optimizedResize,
    createOptimizedObserver,
    lazyLoadImages,
    preloadResources,
    delegateEvent,
    batchDOMOperations,
    AnimationFrameManager,
    animationManager
  };
}