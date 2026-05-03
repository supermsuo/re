/* ==============================================
   智能密码工具箱 v9.0 - 应用初始化
   ============================================== */

// 应用初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化核心应用
    CryptoApp.init();
    
    // 初始化UI模块（Tab切换、拖拽滚动等）
    if (window.ui && typeof window.ui.init === 'function') {
        window.ui.init();
    }
    
    // 添加CSS类用于动画
    document.body.classList.add('loaded');
    
    // 初始化工具提示
    initTooltips();
    
    // 初始化模态框
    initModals();
    
    // 添加键盘快捷键说明
    addKeyboardShortcutsHelp();
    
    // 更新最后更新时间
    updateLastUpdateTime();
    
    // 添加样式到DOM
    addDynamicStyles();
    
    console.log('智能密码工具箱 v9.0 初始化完成');
});

// 初始化工具提示
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.position = 'fixed';
            tooltip.style.zIndex = '10000';
            tooltip.style.padding = '6px 12px';
            tooltip.style.background = 'var(--text-color)';
            tooltip.style.color = 'var(--bg-color)';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.whiteSpace = 'nowrap';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            
            this._tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// 初始化模态框
function initModals() {
    // 这里可以添加模态框初始化逻辑
    console.log('模态框系统已就绪');
}

// 添加快捷键帮助
function addKeyboardShortcutsHelp() {
    const shortcuts = [
        { key: 'Ctrl + Enter', desc: '快速分析' },
        { key: 'Ctrl + C', desc: '复制输出' },
        { key: 'Ctrl + S', desc: '保存输出' },
        { key: 'Ctrl + Shift + T', desc: '切换主题' },
        { key: 'Esc', desc: '取消操作' }
    ];
    
    // 可以在适当位置添加快捷键说明
    // 例如在帮助文档中
}

// 更新最后更新时间
function updateLastUpdateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = now.toLocaleDateString('zh-CN', options);
    }
}

// 添加动态样式
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 加载动画 */
        body.loaded .app-container {
            animation: fadeIn 0.5s ease;
        }
        
        /* 按钮点击效果 */
        .btn:active {
            transform: scale(0.98);
        }
        
        /* 输入框聚焦效果 */
        textarea:focus {
            box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.2);
        }
        
        /* 标签页切换动画 */
        .tab-pane {
            transition: opacity 0.3s ease;
        }
        
        /* 进度条动画 */
        @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
        }
        
        .progress-fill {
            animation: progress 2s ease-in-out infinite;
            background: linear-gradient(90deg, 
                var(--primary-color) 0%, 
                var(--secondary-color) 50%, 
                var(--primary-color) 100%);
            background-size: 200% 100%;
        }
        
        /* 悬停效果 */
        .suggestion-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        
        /* 历史记录项悬停 */
        .history-item:hover {
            background-color: rgba(var(--primary-color), 0.1);
        }
    `;
    
    document.head.appendChild(style);
}

// 全局辅助函数
window.CryptoHelpers = {
    // 格式化文本
    formatText(text, type = 'text') {
        switch(type) {
            case 'json':
                try {
                    return JSON.stringify(JSON.parse(text), null, 2);
                } catch {
                    return text;
                }
            case 'xml':
                // 简单的XML格式化
                return text.replace(/(>)(<)(\/*)/g, '$1\n$2$3');
            default:
                return text;
        }
    },
    
    // 计算文本哈希
    async calculateHash(text, algorithm = 'SHA-256') {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest(algorithm, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('哈希计算失败:', error);
            return null;
        }
    },
    
    // 检测编码类型
    detectEncoding(text) {
        if (/^[a-z0-9+/]+={0,2}$/i.test(text)) {
            try {
                atob(text);
                return 'base64';
            } catch {}
        }
        
        if (/^[a-f0-9]+$/i.test(text) && text.length % 2 === 0) {
            return 'hex';
        }
        
        if (/%[0-9a-f]{2}/i.test(text)) {
            return 'url';
        }
        
        if (/\\u[0-9a-f]{4}/i.test(text)) {
            return 'unicode';
        }
        
        return 'unknown';
    },
    
    // 生成随机字符串
    generateRandomString(length = 16, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    },
    
    // 复制到剪贴板
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('复制失败:', error);
            return false;
        }
    },
    
    // 下载文件
    downloadFile(filename, content, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // 显示加载状态
    showLoading(element, message = '加载中...') {
        if (element) {
            element.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <div class="loading-message">${message}</div>
                </div>
            `;
        }
    },
    
    // 隐藏加载状态
    hideLoading(element, originalContent = '') {
        if (element) {
            element.innerHTML = originalContent;
        }
    },
    
    // 防抖函数
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 添加全局错误处理
window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
    
    // 显示用户友好的错误消息
    if (CryptoApp && CryptoApp.showToast) {
        CryptoApp.showToast('发生错误，请检查控制台', 'error');
    }
});

// 添加未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
    
    if (CryptoApp && CryptoApp.showToast) {
        CryptoApp.showToast('异步操作失败', 'error');
    }
});

// 导出全局函数
window.formatInput = function() {
    const text = CryptoApp.dom.inputText.value;
    if (!text.trim()) {
        CryptoApp.showToast('输入为空，无法格式化', 'warning');
        return;
    }
    
    // 尝试JSON格式化
    try {
        const obj = JSON.parse(text);
        CryptoApp.dom.inputText.value = JSON.stringify(obj, null, 2);
        CryptoApp.updateInputStats();
        CryptoApp.showToast('JSON格式化完成');
        return;
    } catch {}
    
    // 尝试Base64解码
    if (/^[a-z0-9+/]+={0,2}$/i.test(text)) {
        try {
            const decoded = atob(text);
            CryptoApp.dom.inputText.value = decoded;
            CryptoApp.updateInputStats();
            CryptoApp.showToast('Base64解码完成');
            return;
        } catch {}
    }
    
    // 默认格式化：去除多余空行和空格
    const formatted = text.split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n');
    
    CryptoApp.dom.inputText.value = formatted;
    CryptoApp.updateInputStats();
    CryptoApp.showToast('文本格式化完成');
};

window.encodeInput = function() {
    CryptoApp.setOutput('编码功能: 请使用编码转换标签页');
    CryptoApp.showToast('请使用编码转换功能', 'info');
};

window.decodeInput = function() {
    CryptoApp.setOutput('解码功能: 请使用编码转换标签页');
    CryptoApp.showToast('请使用解码功能', 'info');
};

window.aiDetect = function() {
    ai.fullAnalysis();
};

window.quickDecode = function() {
    ai.autoDecode();
};

window.advancedAnalyze = function() {
    ai.deepAnalysis();
};