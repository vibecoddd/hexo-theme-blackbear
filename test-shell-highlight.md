---
title: Shell语法高亮测试
---

# Shell语法高亮功能测试

## 基本Shell命令

```shell
#!/bin/bash
# 这是一个基本的shell脚本
echo "Hello, World!"
ls -la /home/user
cd /var/log
pwd
```

## Bash脚本示例

```bash
#!/bin/bash
# 自动备份脚本

BACKUP_DIR="/backup"
SOURCE_DIR="/data"
DATE=$(date +%Y%m%d_%H%M%S)

# 检查备份目录是否存在
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    echo "创建备份目录: $BACKUP_DIR"
fi

# 执行备份
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$SOURCE_DIR"

if [ $? -eq 0 ]; then
    echo "备份成功: backup_$DATE.tar.gz"
else
    echo "备份失败！"
    exit 1
fi
```

## Shell单行命令

```sh
# 进程管理
ps aux | grep nginx | awk '{print $2}' | xargs kill -9

# API调用
curl -s https://api.github.com/users/octocat | jq '.name'

# 磁盘使用
df -h | grep -E "(sda|nvme)" | sort -k4 -hr
```

## Zsh配置

```zsh
# ~/.zshrc配置
export PATH="$HOME/bin:$PATH"
export EDITOR="vim"

# 别名设置
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'

# 提示符配置
PROMPT='%n@%m:%~%# '

# 历史记录
HISTSIZE=10000
SAVEHIST=10000
setopt HIST_IGNORE_DUPS
```

## 测试说明

本测试文件用于验证Hexo主题中的语法高亮功能，特别是Shell脚本的语法高亮效果。

### 支持的Shell类型

- `shell` - 通用shell脚本
- `bash` - Bash特定脚本  
- `sh` - Shell命令
- `zsh` - Zsh配置

### 预期效果

1. 注释应该显示为灰色
2. 字符串应该显示为绿色
3. 关键字（如if、then、else等）应该显示为紫色
4. 函数名应该显示为橙色
5. 变量（如$VAR、${VAR}）应该显示为特殊颜色

### 技术实现

语法高亮通过以下方式实现：

1. **引擎切换**：从highlight.js切换到Prism.js
2. **CDN加载**：使用jsDelivr CDN加载Prism.js库
3. **主题配置**：支持tomorrow主题（深色）
4. **语言支持**：添加shell、bash、sh、zsh语言支持
5. **插件集成**：包含toolbar和copy-to-clipboard插件

### 配置方法

在主题的`_config.yml`中添加：

```yaml
prism:
  enable: true
  theme: tomorrow
```

### 浏览器兼容性

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### 性能优化

- 使用CDN加速资源加载
- 按需加载语言文件
- 异步初始化Prism.js
- 缓存机制优化