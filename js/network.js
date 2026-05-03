/* ==============================================
   智能密码工具箱 v9.0 - 网络工具模块
   ============================================== */

const NetworkModule = {
    // URL 工具
    parseUrl() {
        const url = document.getElementById('urlInput')?.value || CryptoApp.dom.inputText.value;
        if (!url) {
            CryptoApp.showToast('请输入URL地址', 'warning');
            return;
        }
        
        try {
            const urlObj = new URL(url);
            
            let result = `🔗 URL 解析结果\n`;
            result += `══════════════════\n\n`;
            result += `完整URL: ${urlObj.href}\n`;
            result += `协议: ${urlObj.protocol}\n`;
            result += `主机名: ${urlObj.hostname}\n`;
            result += `端口: ${urlObj.port || '默认'}\n`;
            result += `路径: ${urlObj.pathname}\n`;
            result += `查询参数: ${urlObj.search || '无'}\n`;
            result += `哈希: ${urlObj.hash || '无'}\n`;
            result += `来源: ${urlObj.origin}\n\n`;
            
            // 解析查询参数
            if (urlObj.search) {
                result += `查询参数详情:\n`;
                const params = new URLSearchParams(urlObj.search);
                for (const [key, value] of params) {
                    result += `  ${key} = ${value}\n`;
                }
            }
            
            CryptoApp.setOutput(result);
            CryptoApp.showToast('URL解析完成');
            CryptoApp.addHistory('URL解析', url, result);
        } catch (e) {
            CryptoApp.setOutput(`URL解析错误: ${e.message}\n\n请检查URL格式是否正确。`);
            CryptoApp.showToast('URL解析失败', 'error');
        }
    },
    
    encodeUrl() {
        const url = document.getElementById('urlInput')?.value || CryptoApp.dom.inputText.value;
        if (!url) {
            CryptoApp.showToast('请输入URL地址', 'warning');
            return;
        }
        
        const encoded = encodeURI(url);
        CryptoApp.setOutput(encoded);
        CryptoApp.showToast('URL编码完成');
        CryptoApp.addHistory('URL编码', url, encoded);
    },
    
    decodeUrl() {
        const url = document.getElementById('urlInput')?.value || CryptoApp.dom.inputText.value;
        if (!url) {
            CryptoApp.showToast('请输入URL地址', 'warning');
            return;
        }
        
        try {
            const decoded = decodeURI(url);
            CryptoApp.setOutput(decoded);
            CryptoApp.showToast('URL解码完成');
            CryptoApp.addHistory('URL解码', url, decoded);
        } catch (e) {
            CryptoApp.setOutput(`URL解码错误: ${e.message}`);
            CryptoApp.showToast('URL解码失败', 'error');
        }
    },
    
    urlComponents() {
        const url = document.getElementById('urlInput')?.value || CryptoApp.dom.inputText.value;
        if (!url) {
            CryptoApp.showToast('请输入URL地址', 'warning');
            return;
        }
        
        let result = `🔧 URL 组件分析\n`;
        result += `══════════════════\n\n`;
        result += `原始URL: ${url}\n\n`;
        
        try {
            const urlObj = new URL(url);
            
            result += `标准组件:\n`;
            result += `• 协议: ${urlObj.protocol}\n`;
            result += `• 用户名: ${urlObj.username || '无'}\n`;
            result += `• 密码: ${urlObj.password ? '***' : '无'}\n`;
            result += `• 主机名: ${urlObj.hostname}\n`;
            result += `• 端口: ${urlObj.port || '默认'}\n`;
            result += `• 路径: ${urlObj.pathname}\n`;
            result += `• 查询: ${urlObj.search || '无'}\n`;
            result += `• 哈希: ${urlObj.hash || '无'}\n\n`;
            
            result += `编码状态:\n`;
            result += `• 是否编码: ${url !== encodeURI(url) ? '是' : '否'}\n`;
            result += `• 编码后: ${encodeURI(url)}\n`;
            result += `• 解码后: ${decodeURI(url)}\n\n`;
            
            result += `安全分析:\n`;
            result += `• 使用HTTPS: ${urlObj.protocol === 'https:' ? '✅ 是' : '⚠️ 否'}\n`;
            result += `• 有效域名: ${this.isValidDomain(urlObj.hostname) ? '✅ 是' : '⚠️ 否'}\n`;
            result += `• 特殊字符: ${this.hasSpecialChars(url) ? '⚠️ 有' : '✅ 无'}`;
            
        } catch (e) {
            result += `解析失败: ${e.message}\n\n`;
            result += `尝试手动分析:\n`;
            result += `• 可能缺少协议 (如 http://)\n`;
            result += `• 可能包含非法字符\n`;
            result += `• 可能格式不正确`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('URL组件分析完成');
    },
    
    isValidDomain(domain) {
        // 简单的域名验证
        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    },
    
    hasSpecialChars(text) {
        const specialChars = /[<>"{}|\\^`]/;
        return specialChars.test(text);
    },
    
    // DNS 工具
    dnsLookup() {
        const domain = CryptoApp.dom.inputText.value.trim();
        if (!domain) {
            CryptoApp.showToast('请输入域名', 'warning');
            return;
        }
        
        let result = `🌐 DNS 查询结果\n`;
        result += `══════════════════\n\n`;
        result += `查询域名: ${domain}\n\n`;
        result += `DNS记录类型:\n`;
        result += `• A记录 (IPv4地址): 模拟查询中...\n`;
        result += `• AAAA记录 (IPv6地址): 模拟查询中...\n`;
        result += `• CNAME记录 (别名): 模拟查询中...\n`;
        result += `• MX记录 (邮件服务器): 模拟查询中...\n`;
        result += `• TXT记录 (文本记录): 模拟查询中...\n`;
        result += `• NS记录 (名称服务器): 模拟查询中...\n\n`;
        result += `注意: 这是模拟查询，实际DNS查询需要网络连接。`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('DNS查询完成（模拟）');
    },
    
    reverseDns() {
        const ip = CryptoApp.dom.inputText.value.trim();
        if (!ip) {
            CryptoApp.showToast('请输入IP地址', 'warning');
            return;
        }
        
        let result = `🔄 反向DNS查询\n`;
        result += `══════════════════\n\n`;
        result += `查询IP: ${ip}\n\n`;
        
        if (this.isValidIP(ip)) {
            result += `IP格式: ✅ 有效\n`;
            result += `反向DNS: 模拟查询中...\n`;
            result += `可能的主机名: unknown.host.local`;
        } else {
            result += `IP格式: ❌ 无效\n`;
            result += `请检查IP地址格式是否正确。`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('反向DNS查询完成（模拟）');
    },
    
    isValidIP(ip) {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    },
    
    // IP 工具
    ipInfo() {
        const ip = document.getElementById('ipAddress')?.value || CryptoApp.dom.inputText.value.trim();
        if (!ip) {
            CryptoApp.showToast('请输入IP地址', 'warning');
            return;
        }
        
        let result = `📡 IP 地址信息\n`;
        result += `══════════════════\n\n`;
        result += `IP地址: ${ip}\n\n`;
        
        if (ip.includes(':')) {
            result += `IP类型: IPv6\n`;
            result += `地址长度: 128位\n`;
            result += `压缩形式: ${this.compressIPv6(ip)}\n`;
            result += `扩展形式: ${this.expandIPv6(ip)}\n`;
        } else {
            result += `IP类型: IPv4\n`;
            result += `地址长度: 32位\n`;
            result += `二进制: ${this.ipToBinary(ip)}\n`;
            result += `十进制: ${this.ipToDecimal(ip)}\n`;
            result += `十六进制: ${this.ipToHex(ip)}\n`;
            
            const ipClass = this.getIPClass(ip);
            result += `IP类别: ${ipClass}\n`;
            result += `私有地址: ${this.isPrivateIP(ip) ? '✅ 是' : '❌ 否'}\n`;
            result += `保留地址: ${this.isReservedIP(ip) ? '✅ 是' : '❌ 否'}\n`;
            result += `多播地址: ${this.isMulticastIP(ip) ? '✅ 是' : '❌ 否'}\n`;
            result += `广播地址: ${this.isBroadcastIP(ip) ? '✅ 是' : '❌ 否'}`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('IP信息分析完成');
    },
    
    compressIPv6(ip) {
        // 简单的IPv6压缩
        return ip.replace(/(^|:)0+([0-9a-fA-F]{1,4})/g, '$1$2').replace(/(^|:)(0(:|$)){2,}/, '::');
    },
    
    expandIPv6(ip) {
        // 简单的IPv6扩展
        const parts = ip.split(':');
        const expanded = parts.map(part => part.padStart(4, '0'));
        return expanded.join(':');
    },
    
    ipToBinary(ip) {
        return ip.split('.').map(octet => parseInt(octet).toString(2).padStart(8, '0')).join('.');
    },
    
    ipToDecimal(ip) {
        const parts = ip.split('.').map(octet => parseInt(octet));
        return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
    },
    
    ipToHex(ip) {
        return ip.split('.').map(octet => parseInt(octet).toString(16).padStart(2, '0')).join(':');
    },
    
    getIPClass(ip) {
        const firstOctet = parseInt(ip.split('.')[0]);
        if (firstOctet <= 127) return 'A类';
        if (firstOctet <= 191) return 'B类';
        if (firstOctet <= 223) return 'C类';
        if (firstOctet <= 239) return 'D类 (多播)';
        return 'E类 (保留)';
    },
    
    isPrivateIP(ip) {
        const parts = ip.split('.').map(octet => parseInt(octet));
        
        // 10.0.0.0 - 10.255.255.255
        if (parts[0] === 10) return true;
        
        // 172.16.0.0 - 172.31.255.255
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
        
        // 192.168.0.0 - 192.168.255.255
        if (parts[0] === 192 && parts[1] === 168) return true;
        
        return false;
    },
    
    isReservedIP(ip) {
        const parts = ip.split('.').map(octet => parseInt(octet));
        
        // 0.0.0.0/8
        if (parts[0] === 0) return true;
        
        // 127.0.0.0/8 (环回地址)
        if (parts[0] === 127) return true;
        
        // 169.254.0.0/16 (链路本地)
        if (parts[0] === 169 && parts[1] === 254) return true;
        
        // 224.0.0.0 - 239.255.255.255 (多播)
        if (parts[0] >= 224 && parts[0] <= 239) return true;
        
        // 240.0.0.0 - 255.255.255.255 (保留)
        if (parts[0] >= 240) return true;
        
        return false;
    },
    
    isMulticastIP(ip) {
        const firstOctet = parseInt(ip.split('.')[0]);
        return firstOctet >= 224 && firstOctet <= 239;
    },
    
    isBroadcastIP(ip) {
        return ip === '255.255.255.255';
    },
    
    // 子网计算器
    subnetCalculator() {
        const ip = document.getElementById('ipAddress')?.value || CryptoApp.dom.inputText.value.trim();
        const mask = document.getElementById('subnetMask')?.value || '255.255.255.0';
        
        if (!ip) {
            CryptoApp.showToast('请输入IP地址', 'warning');
            return;
        }
        
        let result = `🔧 子网计算器\n`;
        result += `══════════════════\n\n`;
        result += `IP地址: ${ip}\n`;
        result += `子网掩码: ${mask}\n\n`;
        
        try {
            const ipParts = ip.split('.').map(Number);
            const maskParts = mask.split('.').map(Number);
            
            // 计算网络地址
            const networkAddr = ipParts.map((part, i) => part & maskParts[i]).join('.');
            
            // 计算广播地址
            const broadcastMask = maskParts.map(part => 255 - part);
            const broadcastAddr = ipParts.map((part, i) => part | broadcastMask[i]).join('.');
            
            // 计算可用主机数
            const zeroBits = maskParts.reduce((count, part) => count + (255 - part).toString(2).split('1').length - 1, 0);
            const hostCount = Math.pow(2, zeroBits) - 2;
            
            // 计算CIDR表示法
            const cidr = maskParts.reduce((sum, part) => sum + part.toString(2).split('1').length - 1, 0);
            
            result += `计算结果:\n`;
            result += `• 网络地址: ${networkAddr}\n`;
            result += `• 广播地址: ${broadcastAddr}\n`;
            result += `• 可用主机数: ${hostCount} 个\n`;
            result += `• CIDR表示法: /${cidr}\n`;
            result += `• 地址范围: ${this.incrementIP(networkAddr, 1)} - ${this.incrementIP(broadcastAddr, -1)}\n`;
            result += `• 子网类型: ${hostCount > 0 ? '有效子网' : '无效子网'}`;
            
        } catch (e) {
            result += `计算错误: ${e.message}`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('子网计算完成');
    },
    
    // IP转换工具
    ipConvert() {
        const ip = CryptoApp.dom.inputText.value.trim();
        if (!ip) {
            CryptoApp.showToast('请输入IP地址', 'warning');
            return;
        }
        
        let result = `🔄 IP 地址转换工具\n`;
        result += `══════════════════\n\n`;
        result += `原始IP: ${ip}\n\n`;
        
        if (this.isValidIP(ip)) {
            // 各种格式转换
            result += `转换结果:\n`;
            result += `• 十进制: ${this.ipToDecimal(ip)}\n`;
            result += `• 十六进制: 0x${this.ipToHex(ip).replace(/:/g, '')}\n`;
            result += `• 二进制: ${this.ipToBinary(ip)}\n`;
            result += `• 八进制: ${this.ipToOctal(ip)}\n`;
            result += `• 反转IP: ${ip.split('.').reverse().join('.')}\n`;
            result += `• 长整型: ${this.ipToLong(ip)}\n`;
            result += `• 压缩形式: ${this.compressIP(ip)}\n`;
            result += `• URL编码: ${encodeURIComponent(ip)}`;
        } else {
            result += `❌ 无效的IP地址格式`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('IP转换完成');
    },
    
    // 协议分析器
    protocolAnalyzer() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入协议数据', 'warning');
            return;
        }
        
        let result = `🔍 协议分析器\n`;
        result += `══════════════════\n\n`;
        result += `输入数据 (前100字符):\n${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n\n`;
        
        result += `分析结果:\n`;
        
        // 检查常见协议特征
        if (text.includes('HTTP/')) {
            result += `• 检测到: HTTP协议\n`;
            if (text.includes('GET ')) result += `  - 请求方法: GET\n`;
            if (text.includes('POST ')) result += `  - 请求方法: POST\n`;
            if (text.includes('Content-Type:')) result += `  - 包含Content-Type头\n`;
        }
        
        if (text.match(/^\d{3}\s/)) {
            result += `• 检测到: HTTP响应代码\n`;
        }
        
        if (text.includes('Host:')) {
            result += `• 检测到: Host头\n`;
        }
        
        if (text.includes('User-Agent:')) {
            result += `• 检测到: User-Agent头\n`;
        }
        
        if (text.includes('<html') || text.includes('<!DOCTYPE')) {
            result += `• 检测到: HTML内容\n`;
        }
        
        if (text.includes('{"') || text.includes('[')) {
            result += `• 可能包含: JSON数据\n`;
        }
        
        if (text.includes('<?xml')) {
            result += `• 检测到: XML数据\n`;
        }
        
        // 数据统计
        result += `\n数据统计:\n`;
        result += `• 总长度: ${text.length} 字符\n`;
        result += `• 行数: ${text.split('\n').length}\n`;
        result += `• 单词数: ${text.split(/\s+/).filter(w => w.length > 0).length}\n`;
        result += `• 特殊字符: ${(text.match(/[^a-zA-Z0-9\s]/g) || []).length} 个`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('协议分析完成');
    },
    
    // HTTP头分析
    httpHeaders() {
        const headers = CryptoApp.dom.inputText.value;
        if (!headers) {
            CryptoApp.showToast('请输入HTTP头部', 'warning');
            return;
        }
        
        let result = `📋 HTTP 头部分析\n`;
        result += `══════════════════\n\n`;
        
        const headerLines = headers.split('\n');
        let headerCount = 0;
        
        result += `解析的头部:\n`;
        for (let line of headerLines) {
            const match = line.match(/^([^:]+):\s*(.*)$/);
            if (match) {
                const [_, key, value] = match;
                result += `• ${key}: ${value}\n`;
                headerCount++;
            }
        }
        
        result += `\n统计信息:\n`;
        result += `• 总头部数: ${headerCount}\n`;
        result += `• 安全相关头部: ${this.checkSecurityHeaders(headers)}\n`;
        result += `• 性能相关头部: ${this.checkPerformanceHeaders(headers)}\n`;
        result += `• 缓存相关头部: ${this.checkCacheHeaders(headers)}`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('HTTP头部分析完成');
    },
    
    // HTTPS检查
    httpsCheck() {
        const url = CryptoApp.dom.inputText.value.trim();
        if (!url) {
            CryptoApp.showToast('请输入URL', 'warning');
            return;
        }
        
        let result = `🔒 HTTPS 安全检查\n`;
        result += `══════════════════\n\n`;
        result += `检查URL: ${url}\n\n`;
        
        try {
            const urlObj = new URL(url);
            
            result += `检查结果:\n`;
            result += `• 协议: ${urlObj.protocol}\n`;
            result += `• 使用HTTPS: ${urlObj.protocol === 'https:' ? '✅ 是' : '❌ 否'}\n`;
            result += `• 主机名: ${urlObj.hostname}\n`;
            result += `• 端口: ${urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80')}\n`;
            
            if (urlObj.protocol === 'https:') {
                result += `\n安全建议:\n`;
                result += `• ✅ 使用HTTPS加密连接\n`;
                result += `• ℹ️ 建议启用HSTS\n`;
                result += `• ℹ️ 确保证书有效\n`;
            } else {
                result += `\n安全警告:\n`;
                result += `• ⚠️ 未使用HTTPS，通信可能被窃听\n`;
                result += `• ⚠️ 建议升级到HTTPS\n`;
                result += `• ⚠️ 避免在此URL上传输敏感信息`;
            }
            
        } catch (e) {
            result += `URL解析错误: ${e.message}`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('HTTPS检查完成');
    },
    
    // 辅助方法
    incrementIP(ip, amount) {
        const parts = ip.split('.').map(Number);
        let value = (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
        value += amount;
        
        return [
            (value >> 24) & 255,
            (value >> 16) & 255,
            (value >> 8) & 255,
            value & 255
        ].join('.');
    },
    
    ipToOctal(ip) {
        return ip.split('.').map(octet => parseInt(octet).toString(8).padStart(3, '0')).join('.');
    },
    
    ipToLong(ip) {
        const parts = ip.split('.').map(octet => parseInt(octet));
        return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
    },
    
    compressIP(ip) {
        // 去除前导零
        return ip.split('.').map(octet => parseInt(octet).toString()).join('.');
    },
    
    checkSecurityHeaders(headers) {
        const securityHeaders = [
            'Strict-Transport-Security',
            'Content-Security-Policy',
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection'
        ];
        
        const found = securityHeaders.filter(header => 
            headers.toLowerCase().includes(header.toLowerCase())
        );
        
        return found.length > 0 ? `✅ ${found.length} 个` : '❌ 无';
    },
    
    checkPerformanceHeaders(headers) {
        const perfHeaders = [
            'Cache-Control',
            'ETag',
            'Last-Modified',
            'Expires'
        ];
        
        const found = perfHeaders.filter(header => 
            headers.toLowerCase().includes(header.toLowerCase())
        );
        
        return found.length > 0 ? `✅ ${found.length} 个` : '❌ 无';
    },
    
    checkCacheHeaders(headers) {
        const cacheHeaders = [
            'Cache-Control',
            'Expires',
            'Pragma'
        ];
        
        const found = cacheHeaders.filter(header => 
            headers.toLowerCase().includes(header.toLowerCase())
        );
        
        return found.length > 0 ? `✅ ${found.length} 个` : '❌ 无';
    },
    
    // 其他工具（简化实现）
    sslCheck() {
        CryptoApp.setOutput(`🔐 SSL/TLS 检查工具\n══════════════════\n\n此功能需要服务器端支持。\n\n建议使用在线SSL检查工具如:\n• SSL Labs SSL Test\n• Qualys SSL Server Test\n\n安全提示:\n• 确保证书有效且未过期\n• 使用强加密算法\n• 启用TLS 1.2及以上版本`);
        CryptoApp.showToast('SSL检查提示', 'info');
    },
    
    certificateInfo() {
        CryptoApp.setOutput(`📄 证书信息工具\n══════════════════\n\n证书信息需要从服务器获取。\n\n常见证书信息包括:\n• 颁发者 (Issuer)\n• 有效期 (Validity)\n• 主题 (Subject)\n• 公钥算法\n• 签名算法\n• 扩展信息\n\n提示: 浏览器开发者工具可查看证书详情`);
        CryptoApp.showToast('证书信息提示', 'info');
    },
    
    pingTool() {
        CryptoApp.setOutput(`🏓 Ping 工具\n══════════════════\n\n前端无法直接执行Ping命令。\n\n替代方案:\n1. 使用系统命令行\n2. 在线Ping工具\n3. 网络诊断工具\n\n模拟结果:\n• 延迟: 25ms\n• 丢包率: 0%\n• TTL: 64\n• 状态: ✅ 可达`);
        CryptoApp.showToast('Ping工具提示', 'info');
    },
    
    // 其他工具提供基本信息
    traceroute() { CryptoApp.setOutput('🛣️ Traceroute工具\n══════════════════\n\n此功能需要服务器端支持。\nTraceroute用于跟踪数据包路径。'); CryptoApp.showToast('Traceroute工具', 'info'); },
    portScan() { CryptoApp.setOutput('🔍 端口扫描工具\n══════════════════\n\n注意: 未经授权的端口扫描可能违法。\n仅扫描自己的网络或获得授权的目标。'); CryptoApp.showToast('端口扫描提示', 'warning'); },
    networkScan() { CryptoApp.setOutput('🌐 网络扫描工具\n══════════════════\n\n网络扫描工具用于发现网络设备。\n需要适当的权限和授权。'); CryptoApp.showToast('网络扫描提示', 'info'); },
    bandwidthTest() { CryptoApp.setOutput('📶 带宽测试工具\n══════════════════\n\n建议使用专业带宽测试网站:\n• Speedtest.net\n• Fast.com\n• 各运营商提供的测试工具'); CryptoApp.showToast('带宽测试提示', 'info'); },
    firewallTest() { CryptoApp.setOutput('🛡️ 防火墙测试工具\n══════════════════\n\n防火墙测试需要专业工具。\n\n常见测试:\n• 端口开放状态\n• 规则有效性\n• 入侵检测\n• 日志分析'); CryptoApp.showToast('防火墙测试提示', 'info'); },
    vpnCheck() { CryptoApp.setOutput('🔒 VPN 检查工具\n══════════════════\n\n检查VPN连接状态:\n• IP地址变化\n• DNS泄漏测试\n• WebRTC泄漏测试\n• 连接速度测试\n\n建议使用专业VPN测试网站'); CryptoApp.showToast('VPN检查提示', 'info'); },
    proxyCheck() { CryptoApp.setOutput('🔄 代理检查工具\n══════════════════\n\n检查代理设置:\n• 代理服务器状态\n• 代理类型\n• 匿名级别\n• 地理位置\n\n提示: 浏览器设置中可查看代理配置'); CryptoApp.showToast('代理检查提示', 'info'); },
    privacyCheck() { CryptoApp.setOutput('👁️ 隐私检查工具\n══════════════════\n\n隐私检查项目:\n• Cookie设置\n• 跟踪器检测\n• 指纹识别\n• 位置信息\n• 浏览器标识\n\n建议使用隐私保护插件'); CryptoApp.showToast('隐私检查提示', 'info'); },
    securityHeaders() { CryptoApp.setOutput('🛡️ 安全头检查工具\n══════════════════\n\n检查网站安全头:\n• Content-Security-Policy\n• X-Frame-Options\n• X-Content-Type-Options\n• Strict-Transport-Security\n• Referrer-Policy\n\n使用浏览器开发者工具查看'); CryptoApp.showToast('安全头检查提示', 'info'); },
    packetSniffer() { CryptoApp.setOutput('📡 数据包嗅探工具\n══════════════════\n\n专业网络分析工具:\n• Wireshark\n• tcpdump\n• Fiddler\n• Charles Proxy\n\n注意: 仅用于授权的网络分析'); CryptoApp.showToast('数据包嗅探提示', 'warning'); },
    trafficAnalyzer() { CryptoApp.setOutput('📊 流量分析工具\n══════════════════\n\n流量分析工具用于:\n• 带宽使用监控\n• 协议分布分析\n• 流量模式识别\n• 异常检测\n\n需要网络监控设备或软件'); CryptoApp.showToast('流量分析提示', 'info'); },
    protocolDecoder() { CryptoApp.setOutput('🔧 协议解码工具\n══════════════════\n\n常见协议解码:\n• HTTP/HTTPS\n• DNS\n• TCP/UDP\n• ICMP\n• SMTP/POP3/IMAP\n\n使用Wireshark等专业工具'); CryptoApp.showToast('协议解码提示', 'info'); },
    networkLog() { CryptoApp.setOutput('📝 网络日志工具\n══════════════════\n\n网络日志包含:\n• 连接记录\n• 错误日志\n• 访问日志\n• 安全事件\n• 性能指标\n\n系统日志位置因操作系统而异'); CryptoApp.showToast('网络日志提示', 'info'); },
    testApi() { CryptoApp.setOutput('⚡ API 测试工具\n══════════════════\n\nAPI测试要点:\n• 端点URL\n• 请求方法\n• 请求头\n• 请求体\n• 响应状态\n• 响应数据\n\n使用Postman或curl进行测试'); CryptoApp.showToast('API测试提示', 'info'); },
    apiDocumentation() { CryptoApp.setOutput('📚 API 文档工具\n══════════════════\n\nAPI文档生成工具:\n• Swagger/OpenAPI\n• Postman Collections\n• API Blueprint\n• RAML\n\n良好的文档应包括:\n• 端点说明\n• 参数说明\n• 示例代码\n• 错误代码'); CryptoApp.showToast('API文档提示', 'info'); },
    applySettings() { CryptoApp.setOutput('⚙️ 网络设置应用\n══════════════════\n\n网络设置包括:\n• IP地址配置\n• DNS服务器\n• 代理设置\n• 防火墙规则\n• 路由表\n\n修改前请备份当前设置'); CryptoApp.showToast('网络设置提示', 'warning'); },
    resetNetwork() { CryptoApp.setOutput('🔄 网络重置工具\n══════════════════\n\n网络重置操作:\n1. 释放IP地址\n2. 刷新DNS缓存\n3. 重置TCP/IP栈\n4. 重启网络服务\n\n警告: 可能导致网络中断'); CryptoApp.showToast('网络重置警告', 'warning'); },
    realTimeTraffic() { CryptoApp.setOutput('📈 实时流量监控\n══════════════════\n\n实时监控工具:\n• iftop (Linux)\n• ntopng\n• NetFlow\n• sFlow\n• PRTG Network Monitor\n\n显示实时带宽使用情况'); CryptoApp.showToast('流量监控提示', 'info'); },
    connectionMonitor() { CryptoApp.setOutput('🔗 连接监控工具\n══════════════════\n\n监控网络连接:\n• 当前连接数\n• 连接状态\n• 进程信息\n• 端口使用\n• 数据传输量\n\n使用netstat或ss命令'); CryptoApp.showToast('连接监控提示', 'info'); },
    performanceMonitor() { CryptoApp.setOutput('📊 性能监控工具\n══════════════════\n\n网络性能指标:\n• 延迟 (Latency)\n• 抖动 (Jitter)\n• 丢包率 (Packet Loss)\n• 吞吐量 (Throughput)\n• 带宽利用率\n\n使用ping, iperf等工具测试'); CryptoApp.showToast('性能监控提示', 'info'); },
    networkReport() { CryptoApp.setOutput('📋 网络报告生成\n══════════════════\n\n网络报告内容:\n• 网络拓扑\n• 设备清单\n• 性能统计\n• 安全事件\n• 问题日志\n• 建议改进\n\n定期生成报告有助于维护'); CryptoApp.showToast('网络报告提示', 'info'); },

    // 补充缺失函数
    dnsRecords() {
        const text = CryptoApp.dom.inputText.value.trim();
        const domain = text || prompt('请输入域名:', 'example.com');
        if (!domain) return;
        CryptoApp.setOutput(`🗂️ DNS记录查询\n═══════════════════\n\n域名: ${domain}\n\n⚠️ 浏览器无法直接查询DNS记录\n需要后端API支持\n\n可用在线工具:\n• https://dns.google/\n• https://www.whatsmydns.net/\n• nslookup命令行\n• dig命令行\n\n常见记录类型:\n• A - IPv4地址\n• AAAA - IPv6地址\n• CNAME - 别名\n• MX - 邮件交换\n• NS - 名称服务器\n• TXT - 文本记录\n• SOA - 起始授权`);
        CryptoApp.showToast('DNS查询需要后端', 'info');
    },

    dnsCache() {
        CryptoApp.setOutput(`💾 DNS缓存\n══════════════════\n\n⚠️ 浏览器DNS缓存无法直接访问\n\n清除方法:\n• Chrome: chrome://net-internals/#dns\n• 命令行: ipconfig /flushdns (Windows)\n• 命令行: sudo systemd-resolve --flush-caches (Linux)\n\n查看方法:\n• Chrome: chrome://net-internals/#dns\n• 命令行: ipconfig /displaydns (Windows)`);
        CryptoApp.showToast('DNS缓存信息', 'info');
    },

    dnsSec() {
        const text = CryptoApp.dom.inputText.value.trim();
        const domain = text || prompt('请输入域名:', 'example.com');
        if (!domain) return;
        CryptoApp.setOutput(`🔐 DNSSEC检测\n═══════════════════\n\n域名: ${domain}\n\n⚠️ 浏览器无法直接验证DNSSEC\n需要后端API或命令行工具\n\n在线验证:\n• https://dnssec-debugger.verisignlabs.com/\n• https://dnsviz.net/\n\n命令行:\n• dig +dnssec ${domain}\n• delv ${domain}\n\nDNSSEC说明:\n• 使用数字签名保护DNS数据\n• 防止DNS欺骗和缓存投毒\n• 验证DNS响应的真实性`);
        CryptoApp.showToast('DNSSEC需要后端', 'info');
    }
};

// 导出到全局
window.network = NetworkModule;