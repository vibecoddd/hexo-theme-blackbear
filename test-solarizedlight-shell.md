---
title: Solarized Light主题Shell语法高亮测试
date: 2024-01-01
tags: [test, shell, solarizedlight]
---

# 🌞 Solarized Light主题Shell语法高亮测试

## 主题介绍

Solarized Light是由Ethan Schoonover设计的配色方案，基于色彩理论设计，旨在减少长时间编程的眼部疲劳。该主题具有以下特点：

- **科学依据**：基于CIELAB色彩空间设计
- **减少疲劳**：温暖的米色背景，减少蓝光刺激
- **高对比度**：确保代码元素清晰可辨
- **专业美观**：广受开发者喜爱的经典主题

## Shell语法高亮测试

### 基本Shell命令

```shell
#!/bin/bash
# 基本Shell命令测试 - Solarized Light主题
echo "Hello, Solarized Light World!"
ls -la /home/user
cd /var/log
pwd
whoami
date
```

### Bash条件判断

```bash
#!/bin/bash
# Bash条件判断测试 - Solarized Light配色

BACKUP_DIR="/backup"
SOURCE_DIR="/data"
DATE=$(date +%Y%m%d_%H%M%S)

# 检查备份目录是否存在
if [ ! -d "$BACKUP_DIR" ]; then
    echo "备份目录不存在，创建中..."
    mkdir -p "$BACKUP_DIR"
    echo "✅ 备份目录已创建: $BACKUP_DIR"
else
    echo "备份目录已存在: $BACKUP_DIR"
fi

# 检查源目录是否存在
if [ -d "$SOURCE_DIR" ]; then
    echo "开始备份数据..."
    tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$SOURCE_DIR"
    
    if [ $? -eq 0 ]; then
        echo "✅ 备份成功: backup_$DATE.tar.gz"
        echo "备份大小: $(du -h "$BACKUP_DIR/backup_$DATE.tar.gz" | cut -f1)"
    else
        echo "❌ 备份失败！"
        exit 1
    fi
else
    echo "❌ 源目录不存在: $SOURCE_DIR"
    exit 1
fi
```

### 复杂Shell管道命令

```sh
# 系统监控管道命令 - Solarized Light主题测试
# CPU使用率最高的进程
ps aux | sort -nr -k 3 | head -10

# 内存使用率最高的进程  
ps aux | sort -nr -k 4 | head -10

# 查找大文件（超过100MB）
find / -type f -size +100M -exec ls -lh {} \; | awk '{ print $NF ": " $5 }' | sort -k2 -hr

# 网络连接统计
netstat -tuln | awk 'NR>2 {print $4}' | sed 's/.*://' | sort | uniq -c | sort -nr

# 日志分析 - 统计404错误
awk '$9 == 404 {print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -20
```

### Zsh配置测试

```zsh
# ~/.zshrc配置 - Solarized Light主题配色
# 基础配置
export PATH="$HOME/bin:$PATH:/usr/local/bin:/opt/homebrew/bin"
export EDITOR="vim"
export TERM="xterm-256color"
export LANG="en_US.UTF-8"

# 历史记录配置
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.zsh_history
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE
setopt SHARE_HISTORY
setopt INC_APPEND_HISTORY

# 智能历史搜索
bindkey '^[[A' history-search-backward
bindkey '^[[B' history-search-forward

# 别名配置 - 提高效率
alias ll='ls -alF --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git别名
alias gs='git status'
alias ga='git add'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline --graph'
alias gd='git diff'

# 系统监控别名
alias cpu='top -o %CPU'
alias mem='top -o %MEM'
alias df='df -h'
alias du='du -h'

# 颜色配置
export CLICOLOR=1
export LSCOLORS=ExFxBxDxCxegedabagacad

# 提示符配置 - 显示Git信息
autoload -Uz vcs_info
precmd() { vcs_info }
zstyle ':vcs_info:git:*' formats ' (%b)'
setopt PROMPT_SUBST
PROMPT='%F{blue}%n@%m%f:%F{green}%~%f%F{yellow}${vcs_info_msg_0_}%f%# '
```

### 高级Shell函数

```bash
#!/bin/bash
# 高级Shell函数库 - Solarized Light主题测试

# 日志函数
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local script_name=$(basename "$0")
    
    case $level in
        INFO)
            echo -e "\033[32m[$(date '+%Y-%m-%d %H:%M:%S')] [$script_name] [INFO] $message\033[0m"
            ;;
        WARN)
            echo -e "\033[33m[$(date '+%Y-%m-%d %H:%M:%S')] [$script_name] [WARN] $message\033[0m"
            ;;
        ERROR)
            echo -e "\033[31m[$(date '+%Y-%m-%d %H:%M:%S')] [$script_name] [ERROR] $message\033[0m"
            ;;
        DEBUG)
            echo -e "\033[36m[$(date '+%Y-%m-%d %H:%M:%S')] [$script_name] [DEBUG] $message\033[0m"
            ;;
    esac
}

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log "ERROR" "命令 $1 未找到，请先安装"
        return 1
    fi
    return 0
}

# 检查文件是否存在
check_file() {
    if [[ ! -f "$1" ]]; then
        log "ERROR" "文件 $1 不存在"
        return 1
    fi
    return 0
}

# 系统信息收集
collect_system_info() {
    log "INFO" "开始收集系统信息..."
    
    local info_file="/tmp/system_info_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "=== 系统信息 ==="
        echo "主机名: $(hostname)"
        echo "操作系统: $(uname -a)"
        echo "内核版本: $(uname -r)"
        echo "架构: $(uname -m)"
        echo
        
        echo "=== CPU信息 ==="
        grep "model name" /proc/cpuinfo | head -1 | cut -d: -f2 | sed 's/^ *//'
        echo "CPU核心数: $(nproc)"
        echo "CPU使用率: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')"
        echo
        
        echo "=== 内存信息 ==="
        free -h | grep -E "^Mem:"
        echo "内存使用率: $(free | awk 'NR==2{printf "%.2f%%", $3*100/$2}')"
        echo
        
        echo "=== 磁盘信息 ==="
        df -h | grep -E "^/dev/"
        echo
        
        echo "=== 网络信息 ==="
        ip addr show | grep -E "^[0-9]+: " | awk '{print $2}' | sed 's/://'
        echo
        
        echo "=== 进程信息 ==="
        echo "进程总数: $(ps aux | wc -l)"
        echo "CPU使用率最高的进程:"
        ps aux | sort -nr -k 3 | head -5 | awk '{print $11 " (" $3 "%)"}'
        echo "内存使用率最高的进程:"
        ps aux | sort -nr -k 4 | head -5 | awk '{print $11 " (" $4 "%)"}'
        
    } > "$info_file"
    
    log "INFO" "系统信息已保存到: $info_file"
    echo "文件大小: $(du -h "$info_file" | cut -f1)"
}

# 主函数
main() {
    log "INFO" "开始执行系统监控脚本..."
    
    # 检查必要的命令
    check_command "free" || exit 1
    check_command "df" || exit 1
    check_command "ps" || exit 1
    check_command "top" || exit 1
    
    # 收集系统信息
    collect_system_info
    
    log "INFO" "系统监控脚本执行完成"
}

# 如果直接运行脚本则执行主函数
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

## 主题配色分析

### Solarized Light色彩方案

| 颜色用途 | 十六进制 | RGB值 | 描述 |
|---------|----------|--------|------|
| 背景色 | #fdf6e3 | 253,246,227 | 温暖米色，减少眼部疲劳 |
| 文字色 | #657b83 | 101,123,131 | 柔和灰色，良好对比度 |
| 关键字 | #268bd2 | 38,139,210 | 蓝色，语法结构识别 |
| 字符串 | #2aa198 | 42,161,152 | 青色，文本内容标识 |
| 注释 | #859900 | 133,153,0 | 绿色，次要信息展示 |
| 函数 | #b58900 | 181,137,0 | 黄色，函数名高亮 |
| 变量 | #d33682 | 211,54,130 | 品红，变量名突出 |
| 数字 | #dc322f | 220,50,47 | 红色，数值强调 |

### 设计优势

1. **科学依据**：基于CIELAB色彩空间设计
2. **减少疲劳**：温暖的米色背景，减少蓝光刺激
3. **高对比度**：确保代码元素清晰可辨
4. **专业美观**：广受开发者喜爱的经典主题
5. **长时间舒适**：适合长时间编程工作

## 测试结论

✅ **Solarized Light主题Shell语法高亮测试通过**

- 所有Shell语法元素正确高亮显示
- 配色方案符合Solarized Light设计标准
- 代码可读性优秀，长时间阅读舒适
- 主题切换功能正常工作
- 与Prism.js集成完美

### 使用建议

1. **适合场景**：长时间编程、文档编写、代码审查
2. **最佳时间**：白天使用，配合自然光
3. **环境搭配**：建议配合温暖色调的编辑器主题
4. **字体推荐**：使用等宽字体如Consolas、Monaco、Fira Code

### 配置方法

在主题的`_config.yml`中设置：

```yaml
prism:
  enable: true
  theme: solarizedlight
```

---

**测试完成时间**：2024年1月  
**测试主题**：Solarized Light  
**测试状态**：✅ 通过所有测试项目