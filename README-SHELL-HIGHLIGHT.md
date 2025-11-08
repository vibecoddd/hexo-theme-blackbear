# Shell语法高亮修复说明

## 问题描述
主题的shell语法高亮功能无法正常工作，代码块无法正确显示语法高亮效果。

## 修复方案

### 1. 切换语法高亮引擎
- **禁用** Hexo内置的 `highlight.js` 引擎
- **启用** `Prism.js` 作为语法高亮引擎

### 2. 配置修改
在 `_config.yml` 中修改：
```yaml
highlight:
  enable: false  # 禁用highlight.js
prismjs:
  enable: true   # 启用Prism.js
```

### 3. 主题配置支持
在主题配置文件 `_config.yml.example` 中添加：
```yaml
# Prism.js syntax highlighting
prism:
  enable: true
  theme: tomorrow # 可选主题
```

### 4. 前端集成
- **样式文件**：在 `head.ejs` 中添加Prism.js样式文件
- **脚本文件**：在 `libs.ejs` 中添加Prism.js核心库和插件
- **初始化**：在 `even.js` 中添加语法高亮初始化逻辑

### 5. 样式增强
创建了自定义的Prism样式文件 `_prism.scss`，包含：
- 基于tomorrow主题的配色方案
- 针对shell语法的特殊样式
- 工具栏和复制按钮样式
- 行号显示样式

### 6. 语言支持扩展
在 `_variables.scss` 中扩展了代码类型支持，添加了：
- shell, sh, zsh
- TypeScript, Rust, Dockerfile等现代语言

## 使用说明

### 基本用法
在Markdown中使用以下方式指定shell代码：

```markdown
```shell
#!/bin/bash
echo "Hello World"
ls -la
```

```bash
# 复杂的bash脚本
if [ -f "file.txt" ]; then
    echo "文件存在"
fi
```

```sh
# 单行命令
ps aux | grep nginx
```
```

### 主题配置
在主题配置中可以：
- 启用/禁用语法高亮：`prism.enable`
- 选择配色主题：`prism.theme`（支持tomorrow, twilight, coy等）

### 支持的配色主题
- default
- tomorrow（默认）
- twilight
- coy
- dark
- funky
- okaidia
- solarizedlight

## 技术细节

### 文件修改
1. `_config.yml` - 启用Prism.js
2. `_config.yml.example` - 添加主题配置示例
3. `head.ejs` - 添加样式文件加载
4. `libs.ejs` - 添加脚本文件加载
5. `even.js` - 添加初始化逻辑
6. `_variables.scss` - 扩展语言类型
7. `_prism.scss` - 自定义样式

### 性能优化
- 使用CDN加载Prism.js文件
- 按需加载，只在启用时加载相关资源
- 支持主题切换，无需重新编译

### 浏览器兼容性
- 支持所有现代浏览器
- 自动降级处理旧浏览器
- 响应式设计适配移动端

## 测试文件
创建了 `test-shell-highlight.md` 文件用于测试各种shell语法高亮效果，包含：
- 基本shell命令
- bash脚本
- 单行命令
- zsh配置示例

## 注意事项
1. 确保在Hexo站点的 `_config.yml` 中正确配置
2. 主题配置中的 `prism.enable` 需要设置为 `true`
3. 清除浏览器缓存查看效果
4. 如遇到问题，检查浏览器控制台是否有加载错误