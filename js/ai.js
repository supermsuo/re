/* ==============================================
   智能密码工具箱 v9.0 - AI智能模块
   ============================================== */

const AIModule = {
    // 检测类型
    detectTypes: {
        base64: { name: 'Base64', pattern: /^[a-z0-9+/]+={0,2}$/i, test: (t) => { try { atob(t); return true; } catch { return false; } } },
        hex: { name: 'Hex', pattern: /^[a-f0-9]+$/i, test: (t) => t.length % 2 === 0 },
        url: { name: 'URL编码', pattern: /%[0-9a-f]{2}/i },
        unicode: { name: 'Unicode', pattern: /\\u[0-9a-f]{4}/i },
        morse: { name: '摩斯密码', pattern: /^[.\-\s]+$/ },
        binary: { name: '二进制', pattern: /^[01\s]+$/ },
        octal: { name: '八进制', pattern: /^[0-7\s]+$/ },
        decimal: { name: '十进制', pattern: /^\d+$/ },
        caesar: { name: '凯撒密码', pattern: /^[A-Za-z\s]+$/, test: (t) => t.length > 3 },
        rot13: { name: 'ROT13', pattern: /^[A-Za-z\s]+$/, test: (t) => t.length > 3 },
        t9: { name: '手机九键', pattern: /^[2-9\s]+$/ },
        dangpu: { name: '当铺密码', pattern: /[当铺三四五六七八九十]/ },
        braille: { name: '盲文', pattern: /[⠁-⠿]/ },
        zeroWidth: { name: '零宽字符', pattern: /[\u200b\u200c\u200d\u2060]/ },
        controlChars: { name: '控制字符', pattern: /[\u0000-\u001F\u007F-\u009F]/ },
        md5: { name: 'MD5', pattern: /^[a-f0-9]{32}$/i },
        sha1: { name: 'SHA1', pattern: /^[a-f0-9]{40}$/i },
        sha256: { name: 'SHA256', pattern: /^[a-f0-9]{64}$/i },
        sha512: { name: 'SHA512', pattern: /^[a-f0-9]{128}$/i },
        json: { name: 'JSON', pattern: /^[\s\n\r]*[{\[]/, test: (t) => { try { JSON.parse(t); return true; } catch { return false; } } },
        xml: { name: 'XML', pattern: /^<\?xml|^<[a-z]+>/i },
        html: { name: 'HTML', pattern: /^<[a-z][^>]*>/i }
    },
    
    // 完整分析
    fullAnalysis() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入需要分析的内容', 'warning');
            return;
        }
        
        CryptoApp.state.isProcessing = true;
        CryptoApp.updateProcessStatus();
        
        // 显示进度
        this.showProgress('正在分析...', 0);
        
        // 模拟分析过程
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            this.updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                CryptoApp.state.isProcessing = false;
                CryptoApp.updateProcessStatus();
                this.showAnalysisResult(text);
            }
        }, 50);
    },
    
    // 显示进度
    showProgress(message, percent) {
        const progressHtml = `
            <div class="progress-container">
                <div class="progress-message">${message}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
        
        CryptoApp.dom.aiResultContent.innerHTML = progressHtml;
    },
    
    // 更新进度
    updateProgress(percent) {
        const fill = CryptoApp.dom.aiResultContent.querySelector('.progress-fill');
        if (fill) {
            fill.style.width = `${percent}%`;
        }
    },
    
    // 显示分析结果
    showAnalysisResult(text) {
        const results = this.analyzeText(text);
        const suggestions = this.generateSuggestions(results);
        
        let resultHtml = '<div class="analysis-result">';
        resultHtml += '<h4>🔍 分析结果</h4>';
        
        // 基本信息
        resultHtml += '<div class="basic-info">';
        resultHtml += `<p>📊 长度: ${text.length} 字符</p>`;
        resultHtml += `<p>📄 行数: ${text.split('\n').length} 行</p>`;
        resultHtml += `<p>💾 字节: ${new TextEncoder().encode(text).length} 字节</p>`;
        resultHtml += '</div>';
        
        // 检测到的类型
        if (results.detectedTypes.length > 0) {
            resultHtml += '<div class="detected-types">';
            resultHtml += '<h5>✅ 检测到的类型:</h5>';
            resultHtml += '<ul>';
            results.detectedTypes.forEach(type => {
                resultHtml += `<li>${type.name} (置信度: ${type.confidence}%)</li>`;
            });
            resultHtml += '</ul>';
            resultHtml += '</div>';
        }
        
        // 字符统计
        resultHtml += '<div class="char-stats">';
        resultHtml += '<h5>📈 字符统计:</h5>';
        resultHtml += '<pre>' + this.getCharStats(text) + '</pre>';
        resultHtml += '</div>';
        
        // 熵分析
        resultHtml += '<div class="entropy-analysis">';
        resultHtml += `<h5>🧮 信息熵: ${results.entropy.toFixed(3)} bits/字符</h5>`;
        resultHtml += `<p>最大熵: ${results.maxEntropy.toFixed(3)} bits/字符</p>`;
        resultHtml += `<p>随机性: ${results.randomness.toFixed(1)}%</p>`;
        resultHtml += '</div>';
        
        resultHtml += '</div>';
        
        CryptoApp.dom.aiResultContent.innerHTML = resultHtml;
        
        // 显示建议
        this.showSuggestions(suggestions);
        
        // 更新输出
        const outputText = this.formatAnalysisReport(results, text);
        CryptoApp.setOutput(outputText);
        
        CryptoApp.showToast('分析完成', 'success');
        CryptoApp.addHistory('AI智能分析', text, outputText);
    },
    
    // 分析文本
    analyzeText(text) {
        const results = {
            detectedTypes: [],
            charStats: {},
            entropy: 0,
            maxEntropy: 0,
            randomness: 0,
            suggestions: []
        };
        
        // 检测类型
        for (const [key, detector] of Object.entries(this.detectTypes)) {
            if (detector.pattern.test(text)) {
                if (!detector.test || detector.test(text)) {
                    const confidence = this.calculateConfidence(text, detector);
                    if (confidence > 30) { // 置信度阈值
                        results.detectedTypes.push({
                            type: key,
                            name: detector.name,
                            confidence: Math.min(confidence, 100)
                        });
                    }
                }
            }
        }
        
        // 字符统计
        results.charStats = this.calculateCharStats(text);
        
        // 计算熵
        results.entropy = this.calculateEntropy(text);
        results.maxEntropy = Math.log2(Object.keys(results.charStats).length || 1);
        results.randomness = (results.entropy / results.maxEntropy) * 100;
        
        return results;
    },
    
    // 计算置信度
    calculateConfidence(text, detector) {
        let confidence = 50; // 基础置信度
        
        // 根据长度调整
        if (text.length > 10) confidence += 10;
        if (text.length > 50) confidence += 10;
        if (text.length > 100) confidence += 10;
        
        // 根据模式匹配度调整
        const match = text.match(detector.pattern);
        if (match) {
            const matchRatio = match[0].length / text.length;
            confidence += matchRatio * 20;
        }
        
        return Math.min(confidence, 100);
    },
    
    // 计算字符统计
    calculateCharStats(text) {
        const stats = {};
        const cleanText = text.replace(/\s/g, '');
        
        for (const char of cleanText) {
            stats[char] = (stats[char] || 0) + 1;
        }
        
        return stats;
    },
    
    // 获取字符统计文本
    getCharStats(text) {
        const stats = this.calculateCharStats(text);
        const sorted = Object.entries(stats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);
        
        let result = '字符  次数  频率\n';
        result += '────────────────\n';
        
        sorted.forEach(([char, count]) => {
            const percent = ((count / text.replace(/\s/g, '').length) * 100).toFixed(1);
            const displayChar = char === ' ' ? '␣' : 
                               char === '\n' ? '↵' : 
                               char === '\t' ? '⇥' : 
                               char;
            result += `${displayChar.padEnd(4)} ${count.toString().padEnd(6)} ${percent}%\n`;
        });
        
        return result;
    },
    
    // 计算熵
    calculateEntropy(text) {
        const stats = this.calculateCharStats(text);
        const total = text.replace(/\s/g, '').length;
        
        if (total === 0) return 0;
        
        let entropy = 0;
        for (const count of Object.values(stats)) {
            const p = count / total;
            entropy -= p * Math.log2(p);
        }
        
        return entropy;
    },
    
    // 生成建议
    generateSuggestions(results) {
        const suggestions = [];
        
        // 根据检测到的类型生成建议
        results.detectedTypes.forEach(type => {
            switch(type.type) {
                case 'base64':
                    suggestions.push({
                        title: 'Base64解码',
                        action: 'encode.base64Decode()',
                        description: '尝试解码Base64编码的内容',
                        icon: 'fa-code'
                    });
                    break;
                    
                case 'hex':
                    suggestions.push({
                        title: 'Hex解码',
                        action: 'encode.hexDecode()',
                        description: '尝试解码十六进制编码的内容',
                        icon: 'fa-hashtag'
                    });
                    break;
                    
                case 'url':
                    suggestions.push({
                        title: 'URL解码',
                        action: 'encode.urlDecode()',
                        description: '尝试解码URL编码的内容',
                        icon: 'fa-globe'
                    });
                    break;
                    
                case 'caesar':
                    suggestions.push({
                        title: '凯撒密码破解',
                        action: 'classic.caeCrack()',
                        description: '尝试破解凯撒密码',
                        icon: 'fa-unlock'
                    });
                    break;
                    
                case 'md5':
                case 'sha1':
                case 'sha256':
                    suggestions.push({
                        title: '哈希识别',
                        action: 'hash.identify()',
                        description: '识别哈希类型并尝试破解',
                        icon: 'fa-fingerprint'
                    });
                    break;
                    
                case 'json':
                    suggestions.push({
                        title: 'JSON格式化',
                        action: 'utils.jsonFormat()',
                        description: '格式化JSON数据',
                        icon: 'fa-code'
                    });
                    break;
            }
        });
        
        // 如果没有检测到特定类型，提供通用建议
        if (suggestions.length === 0) {
            suggestions.push(
                {
                    title: '自动解密',
                    action: 'ai.autoDecode()',
                    description: '尝试自动解密未知格式',
                    icon: 'fa-bolt'
                },
                {
                    title: '深度分析',
                    action: 'ai.deepAnalysis()',
                    description: '进行更深入的分析',
                    icon: 'fa-search'
                },
                {
                    title: '编码尝试',
                    action: 'encode.autoDecode()',
                    description: '尝试多种编码解码',
                    icon: 'fa-cogs'
                }
            );
        }
        
        return suggestions;
    },
    
    // 显示建议
    showSuggestions(suggestions) {
        let html = '';
        
        suggestions.forEach(suggestion => {
            html += `
                <div class="suggestion-card" onclick="${suggestion.action}">
                    <div class="suggestion-icon">
                        <i class="fas ${suggestion.icon}"></i>
                    </div>
                    <div class="suggestion-content">
                        <h5>${suggestion.title}</h5>
                        <p>${suggestion.description}</p>
                    </div>
                </div>
            `;
        });
        
        CryptoApp.dom.aiSuggestions.innerHTML = html;
    },
    
    // 自动解密
    autoDecode() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        CryptoApp.state.isProcessing = true;
        CryptoApp.updateProcessStatus();
        
        // 尝试各种解密方法
        const results = [];
        
        // 1. Base64
        try {
            if (/^[a-z0-9+/]+={0,2}$/i.test(text)) {
                const decoded = atob(text);
                if (!/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(decoded)) {
                    results.push({
                        type: 'Base64',
                        result: decoded,
                        confidence: 90
                    });
                }
            }
        } catch {}
        
        // 2. Hex
        try {
            if (/^[a-f0-9]+$/i.test(text) && text.length % 2 === 0) {
                const hex = text.replace(/\s/g, '');
                let decoded = '';
                for (let i = 0; i < hex.length; i += 2) {
                    decoded += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                }
                if (!/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(decoded)) {
                    results.push({
                        type: 'Hex',
                        result: decoded,
                        confidence: 85
                    });
                }
            }
        } catch {}
        
        // 3. URL
        try {
            if (/%/.test(text)) {
                const decoded = decodeURIComponent(text);
                if (decoded !== text) {
                    results.push({
                        type: 'URL',
                        result: decoded,
                        confidence: 80
                    });
                }
            }
        } catch {}
        
        // 4. ROT13
        if (/^[A-Za-z\s]+$/.test(text)) {
            const rot13 = text.replace(/[A-Z]/gi, c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                    return String.fromCharCode((code - 65 + 13) % 26 + 65);
                } else if (code >= 97 && code <= 122) {
                    return String.fromCharCode((code - 97 + 13) % 26 + 97);
                }
                return c;
            });
            if (rot13 !== text) {
                results.push({
                    type: 'ROT13',
                    result: rot13,
                    confidence: 70
                });
            }
        }
        
        // 5. 凯撒密码
        if (/^[A-Za-z\s]+$/.test(text)) {
            for (let shift = 1; shift <= 25; shift++) {
                const decoded = text.replace(/[A-Za-z]/g, c => {
                    const code = c.charCodeAt(0);
                    if (code >= 65 && code <= 90) {
                        return String.fromCharCode((code - 65 - shift + 26) % 26 + 65);
                    } else if (code >= 97 && code <= 122) {
                        return String.fromCharCode((code - 97 - shift + 26) % 26 + 97);
                    }
                    return c;
                });
                
                // 简单英语单词检测
                const englishWords = ['the', 'and', 'for', 'you', 'that', 'this'];
                const hasEnglish = englishWords.some(word => 
                    decoded.toLowerCase().includes(word)
                );
                
                if (hasEnglish) {
                    results.push({
                        type: `凯撒(位移${shift})`,
                        result: decoded,
                        confidence: 75
                    });
                }
            }
        }
        
        CryptoApp.state.isProcessing = false;
        CryptoApp.updateProcessStatus();
        
        // 显示结果
        if (results.length > 0) {
            // 按置信度排序
            results.sort((a, b) => b.confidence - a.confidence);
            
            let output = '🔓 自动解密结果\n';
            output += '═══════════════\n\n';
            
            results.forEach((result, index) => {
                output += `${index + 1}. ${result.type} (置信度: ${result.confidence}%)\n`;
                output += `${result.result.substring(0, 100)}${result.result.length > 100 ? '...' : ''}\n\n`;
            });
            
            // 自动选择最佳结果
            const bestResult = results[0];
            CryptoApp.setOutput(bestResult.result);
            CryptoApp.dom.aiResultContent.innerHTML = `
                <div class="auto-decode-result">
                    <h4>✅ 自动解密成功</h4>
                    <p><strong>类型:</strong> ${bestResult.type}</p>
                    <p><strong>置信度:</strong> ${bestResult.confidence}%</p>
                    <pre>${bestResult.result}</pre>
                </div>
            `;
            
            CryptoApp.showToast(`找到 ${results.length} 个可能结果`, 'success');
            CryptoApp.addHistory('自动解密', text, bestResult.result);
        } else {
            CryptoApp.showToast('自动解密失败，未识别出可解密的格式', 'warning');
            CryptoApp.dom.aiResultContent.innerHTML = `
                <div class="auto-decode-result">
                    <h4>❌ 自动解密失败</h4>
                    <p>未识别出可解密的格式，请尝试其他方法。</p>
                </div>
            `;
        }
    },
    
    // 深度分析
    deepAnalysis() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入需要分析的内容', 'warning');
            return;
        }
        
        // 这里可以扩展更深入的分析
        const analysis = this.analyzeText(text);
        const patterns = this.findPatterns(text);
        
        let output = '🧠 深度分析报告\n';
        output += '═══════════════\n\n';
        
        output += '📊 基础分析:\n';
        output += `   长度: ${text.length} 字符\n`;
        output += `   行数: ${text.split('\n').length} 行\n`;
        output += `   字节: ${new TextEncoder().encode(text).length} 字节\n\n`;
        
        output += '📈 字符统计:\n';
        output += this.getCharStats(text) + '\n';
        
        output += '🧮 信息熵分析:\n';
        output += `   信息熵: ${analysis.entropy.toFixed(3)} bits/字符\n`;
        output += `   最大熵: ${analysis.maxEntropy.toFixed(3)} bits/字符\n`;
        output += `   随机性: ${analysis.randomness.toFixed(1)}%\n\n`;
        
        output += '🔍 模式检测:\n';
        patterns.forEach(pattern => {
            output += `   - ${pattern}\n`;
        });
        
        if (patterns.length === 0) {
            output += '   未发现明显模式\n';
        }
        
        output += '\n💡 分析建议:\n';
        if (analysis.entropy > 4) {
            output += '   - 熵值较高，可能为随机数据或加密数据\n';
        }
        if (text.length < 10) {
            output += '   - 文本过短，难以进行有效分析\n';
        }
        if (/[A-Z]{3,}/.test(text)) {
            output += '   - 包含连续大写字母，可能是密码或缩写\n';
        }
        
        CryptoApp.setOutput(output);
        CryptoApp.dom.aiResultContent.innerHTML = `
            <div class="deep-analysis-result">
                <h4>🧠 深度分析完成</h4>
                <p><strong>信息熵:</strong> ${analysis.entropy.toFixed(3)} bits/字符</p>
                <p><strong>随机性:</strong> ${analysis.randomness.toFixed(1)}%</p>
                <p><strong>检测到 ${patterns.length} 种模式</strong></p>
                <pre>${this.getCharStats(text)}</pre>
            </div>
        `;
        
        CryptoApp.showToast('深度分析完成');
        CryptoApp.addHistory('深度分析', text, output);
    },
    
    // 查找模式
    findPatterns(text) {
        const patterns = [];
        
        // 重复模式
        const repeats = text.match(/(.{3,})\1+/g);
        if (repeats) {
            repeats.forEach(repeat => {
                patterns.push(`重复模式: "${repeat.substring(0, 10)}..."`);
            });
        }
        
        // 递增/递减模式
        if (/123|234|345|456|567|678|789/.test(text)) {
            patterns.push('数字递增模式');
        }
        
        // 对称模式
        if (text.length > 5 && text === text.split('').reverse().join('')) {
            patterns.push('回文模式');
        }
        
        // 常见格式
        if (/^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/.test(text)) {
            patterns.push('信用卡号格式');
        }
        if (/^\d{3}[-\s]?\d{2}[-\s]?\d{4}$/.test(text)) {
            patterns.push('社会安全号格式');
        }
        if (/^[A-Z0-9]{6}$/.test(text)) {
            patterns.push('验证码格式');
        }
        
        return patterns;
    },
    
    // 生成报告
    generateReport() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入需要生成报告的内容', 'warning');
            return;
        }
        
        const analysis = this.analyzeText(text);
        const report = this.formatAnalysisReport(analysis, text);
        
        CryptoApp.downloadFile('crypto_analysis_report.txt', report);
        CryptoApp.showToast('分析报告已生成');
        CryptoApp.addHistory('生成报告', text, '报告已保存');
    },
    
    // 格式化分析报告
    formatAnalysisReport(results, text) {
        let report = '='.repeat(50) + '\n';
        report += '           智能密码分析报告\n';
        report += '='.repeat(50) + '\n\n';
        
        report += '📅 生成时间: ' + new Date().toLocaleString() + '\n';
        report += '🔢 版本: v9.0\n';
        report += '─'.repeat(50) + '\n\n';
        
        report += '📋 分析对象:\n';
        report += '   长度: ' + text.length + ' 字符\n';
        report += '   行数: ' + text.split('\n').length + ' 行\n';
        report += '   字节: ' + new TextEncoder().encode(text).length + ' 字节\n\n';
        
        if (results.detectedTypes.length > 0) {
            report += '✅ 检测到的类型:\n';
            results.detectedTypes.forEach(type => {
                report += `   • ${type.name} (置信度: ${type.confidence}%)\n`;
            });
            report += '\n';
        }
        
        report += '📈 字符统计:\n';
        report += this.getCharStats(text) + '\n';
        
        report += '🧮 信息熵分析:\n';
        report += `   信息熵: ${results.entropy.toFixed(3)} bits/字符\n`;
        report += `   最大熵: ${results.maxEntropy.toFixed(3)} bits/字符\n`;
        report += `   随机性: ${results.randomness.toFixed(1)}%\n\n`;
        
        report += '💡 分析结论:\n';
        if (results.entropy > 4.5) {
            report += '   - 熵值较高，可能为加密数据或随机数据\n';
        } else if (results.entropy < 2) {
            report += '   - 熵值较低，可能为结构化数据或重复模式\n';
        }
        
        if (results.detectedTypes.length === 0) {
            report += '   - 未识别出已知密码类型\n';
        }
        
        report += '\n' + '='.repeat(50) + '\n';
        report += '报告生成完成\n';
        report += '='.repeat(50);
        
        return report;
    }
};

// 导出到全局
window.ai = AIModule;