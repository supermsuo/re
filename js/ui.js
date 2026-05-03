/* ==============================================
   智能密码工具箱 v9.0 - 用户界面模块
   ============================================== */

const UIModule = {
    // 拖拽滚动状态
    _dragState: { isDragging: false, startX: 0, scrollLeft: 0, hasMoved: false },

    // 初始化UI组件
    init() {
        this.setupTabs();
        this.setupResultTabs();
        this.setupEventListeners();
        this.setupTabsDragScroll();
        this.updateThemeIcon();
    },
    
    // 设置标签页切换（仅处理拖拽拦截，切换逻辑由 CryptoApp 管理）
    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // 如果拖拽过，阻止点击切换
                if (this._dragState.hasMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                // 确保active tab可见（自动滚动到可视区）
                this.scrollToTab(tab);
            });
        });
    },
    
    // 滚动到指定tab使其可见
    scrollToTab(tab) {
        const nav = tab.closest('.tabs-nav');
        if (!nav) return;
        const tabRect = tab.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        if (tabRect.left < navRect.left) {
            nav.scrollLeft -= (navRect.left - tabRect.left + 20);
        } else if (tabRect.right > navRect.right) {
            nav.scrollLeft += (tabRect.right - navRect.right + 20);
        }
    },
    
    // 设置Tab导航拖拽滚动
    setupTabsDragScroll() {
        const tabsNav = document.querySelector('.tabs-nav');
        if (!tabsNav) return;
        
        const state = this._dragState;
        
        // 鼠标按下
        tabsNav.addEventListener('mousedown', (e) => {
            state.isDragging = true;
            state.hasMoved = false;
            state.startX = e.pageX - tabsNav.offsetLeft;
            state.scrollLeft = tabsNav.scrollLeft;
            tabsNav.classList.add('dragging');
        });
        
        // 鼠标移动
        tabsNav.addEventListener('mousemove', (e) => {
            if (!state.isDragging) return;
            e.preventDefault();
            const x = e.pageX - tabsNav.offsetLeft;
            const walk = (x - state.startX) * 1.5;
            if (Math.abs(walk) > 3) {
                state.hasMoved = true;
            }
            tabsNav.scrollLeft = state.scrollLeft - walk;
        });
        
        // 鼠标释放
        const stopDrag = () => {
            state.isDragging = false;
            tabsNav.classList.remove('dragging');
            // 延迟重置hasMoved，让click事件先判断
            setTimeout(() => { state.hasMoved = false; }, 50);
        };
        tabsNav.addEventListener('mouseup', stopDrag);
        tabsNav.addEventListener('mouseleave', stopDrag);
        
        // 触摸支持
        tabsNav.addEventListener('touchstart', (e) => {
            state.isDragging = true;
            state.hasMoved = false;
            state.startX = e.touches[0].pageX - tabsNav.offsetLeft;
            state.scrollLeft = tabsNav.scrollLeft;
        }, { passive: true });
        
        tabsNav.addEventListener('touchmove', (e) => {
            if (!state.isDragging) return;
            const x = e.touches[0].pageX - tabsNav.offsetLeft;
            const walk = (x - state.startX) * 1.5;
            if (Math.abs(walk) > 3) state.hasMoved = true;
            tabsNav.scrollLeft = state.scrollLeft - walk;
        }, { passive: true });
        
        tabsNav.addEventListener('touchend', stopDrag);
        
        // 鼠标滚轮横向滚动
        tabsNav.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                tabsNav.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    },
    
    // 设置结果标签页
    setupResultTabs() {
        const resultTabs = document.querySelectorAll('.result-tab');
        
        resultTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const format = tab.getAttribute('data-result');
                
                // 移除所有激活状态
                resultTabs.forEach(t => t.classList.remove('active'));
                
                // 添加激活状态
                tab.classList.add('active');
                
                // 更新输出格式
                this.updateOutputFormat(format);
            });
        });
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 点击任何地方关闭所有下拉菜单
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                if (!e.target.closest('.dropdown')) {
                    dropdown.style.display = 'none';
                }
            });
        });
        
        // 窗口大小改变事件
        window.addEventListener('resize', () => {
            this.updateResponsiveLayout();
        });
    },
    
    // 更新输出格式
    updateOutputFormat(format) {
        const outputText = document.getElementById('outputText');
        if (!outputText) return;
        
        const currentText = outputText.value;
        
        switch(format) {
            case 'hex':
                // 文本转十六进制
                let hex = '';
                for (let i = 0; i < currentText.length; i++) {
                    hex += currentText.charCodeAt(i).toString(16).padStart(2, '0');
                }
                outputText.value = hex;
                break;
                
            case 'binary':
                // 文本转二进制
                let binary = '';
                for (let i = 0; i < currentText.length; i++) {
                    binary += currentText.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
                }
                outputText.value = binary;
                break;
                
            case 'json':
                // 文本转JSON格式
                try {
                    const json = JSON.parse(currentText);
                    outputText.value = JSON.stringify(json, null, 2);
                } catch (e) {
                    outputText.value = currentText;
                }
                break;
                
            default:
                // 保持原文本
                break;
        }
        
        CryptoApp.updateOutputInfo();
    },
    
    // 更新响应式布局
    updateResponsiveLayout() {
        const isMobile = window.innerWidth <= 768;
        
        // 根据屏幕尺寸调整元素样式
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            if (isMobile) {
                appContainer.style.padding = 'var(--spacing-md)';
            } else {
                appContainer.style.padding = 'var(--spacing-xl)';
            }
        }
        
        // 调整标签页样式
        const tabsContainer = document.querySelector('.tabs-container');
        if (tabsContainer) {
            if (isMobile) {
                tabsContainer.style.overflowX = 'auto';
                tabsContainer.style.scrollbarWidth = 'none';
            } else {
                tabsContainer.style.overflowX = 'visible';
            }
        }
    },
    
    // 更新主题图标
    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = CryptoApp.state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    },
    
    // 显示模态框
    showModal(title, content) {
        // 创建模态框元素
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4>${title}</h4>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary modal-ok">确定</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 添加事件监听器
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.hideModal(modal);
        });
        
        modal.querySelector('.modal-ok').addEventListener('click', () => {
            this.hideModal(modal);
        });
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });
    },
    
    // 隐藏模态框
    hideModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    },
    
    // 显示加载动画
    showLoading(container) {
        if (!container) return;
        
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="spinner"></div><p>处理中...</p>';
        
        container.appendChild(loading);
    },
    
    // 隐藏加载动画
    hideLoading(container) {
        if (!container) return;
        
        const loading = container.querySelector('.loading');
        if (loading) {
            loading.parentNode.removeChild(loading);
        }
    },
    
    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // 添加事件监听器
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // 自动关闭
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    },
    
    // 隐藏通知
    hideNotification(notification) {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },
    
    // 获取通知图标
    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    },
    
    // 更新进度条
    updateProgress(percent) {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const fill = progressBar.querySelector('.progress-fill');
            if (fill) {
                fill.style.width = `${percent}%`;
            }
        }
    },
    
    // 显示提示
    showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 5}px`;
        tooltip.style.left = `${rect.left}px`;
        
        document.body.appendChild(tooltip);
        
        // 2秒后自动隐藏
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 2000);
    },
    
    // 显示确认对话框
    showConfirm(message, onConfirm, onCancel = () => {}) {
        // 创建确认对话框元素
        const confirm = document.createElement('div');
        confirm.className = 'confirm-dialog';
        confirm.innerHTML = `
            <div class="confirm-content">
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="btn btn-primary confirm-yes">确定</button>
                    <button class="btn btn-secondary confirm-no">取消</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirm);
        
        // 添加事件监听器
        confirm.querySelector('.confirm-yes').addEventListener('click', () => {
            onConfirm();
            this.hideConfirm(confirm);
        });
        
        confirm.querySelector('.confirm-no').addEventListener('click', () => {
            onCancel();
            this.hideConfirm(confirm);
        });
        
        // 点击对话框外部关闭
        confirm.addEventListener('click', (e) => {
            if (e.target === confirm) {
                this.hideConfirm(confirm);
                onCancel();
            }
        });
    },
    
    // 隐藏确认对话框
    hideConfirm(confirm) {
        confirm.style.opacity = '0';
        setTimeout(() => {
            if (confirm.parentNode) {
                confirm.parentNode.removeChild(confirm);
            }
        }, 300);
    },
    
    // 更新字符统计

    updateCharStats(text) {
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(w => w).length;
        const lineCount = text.split('\n').length;
        const spaceCount = (text.match(/ /g) || []).length;
        
        const stats = {
            charCount,
            wordCount,
            lineCount,
            spaceCount
        };
        
        return stats;
    },
    
    // 格式化时间
    formatTime(date) {
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    },
    
    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
};

// 导出到全局
window.ui = UIModule;