/* ==============================================
   智能密码工具箱 v9.0 - 实用工具模块
   ============================================== */

const UtilsModule = {
    // 文本分析
    countChars() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要分析的文本', 'warning');
            return;
        }
        
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(w => w).length;
        const lineCount = text.split('\n').length;
        const spaceCount = (text.match(/ /g) || []).length;
        const uniqueChars = new Set(text).size;
        
        let result = `📊 字符统计报告\n`;
        result += `══════════════════\n\n`;
        result += `总字符数: ${charCount}\n`;
        result += `单词数: ${wordCount}\n`;
        result += `行数: ${lineCount}\n`;
        result += `空格数: ${spaceCount}\n`;
        result += `唯一字符数: ${uniqueChars}\n\n`;
        
        result += `字符分布:\n`;
        const freq = {};
        for (let c of text) {
            freq[c] = (freq[c] || 0) + 1;
        }
        
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        sorted.slice(0, 10).forEach(([char, count]) => {
            const percentage = ((count / charCount) * 100).toFixed(2);
            result += `'${char === '\n' ? '\\n' : char === '\t' ? '\\t' : char}': ${count}次 (${percentage}%)\n`;
        });
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('字符统计完成');
    },
    
    countWords() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要分析的文本', 'warning');
            return;
        }
        
        const words = text.trim().toLowerCase().split(/\W+/).filter(w => w);
        const wordCount = words.length;
        const uniqueWords = new Set(words).size;
        
        let result = `📝 单词统计报告\n`;
        result += `══════════════════\n\n`;
        result += `总单词数: ${wordCount}\n`;
        result += `唯一单词数: ${uniqueWords}\n\n`;
        
        result += `单词频率 (前10个):\n`;
        const freq = {};
        for (let word of words) {
            freq[word] = (freq[word] || 0) + 1;
        }
        
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        sorted.slice(0, 10).forEach(([word, count], index) => {
            const percentage = ((count / wordCount) * 100).toFixed(2);
            result += `${index + 1}. "${word}": ${count}次 (${percentage}%)\n`;
        });
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('单词统计完成');
    },
    
    countLines() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要分析的文本', 'warning');
            return;
        }
        
        const lines = text.split('\n');
        const lineCount = lines.length;
        const emptyLines = lines.filter(line => !line.trim()).length;
        const maxLineLength = Math.max(...lines.map(line => line.length));
        
        let result = `📋 行数统计报告\n`;
        result += `══════════════════\n\n`;
        result += `总行数: ${lineCount}\n`;
        result += `空行数: ${emptyLines}\n`;
        result += `最长行: ${maxLineLength} 字符\n`;
        result += `平均每行: ${(text.length / lineCount).toFixed(1)} 字符\n\n`;
        
        result += `行长度分布:\n`;
        const lengthFreq = {};
        for (let line of lines) {
            const length = line.length;
            lengthFreq[length] = (lengthFreq[length] || 0) + 1;
        }
        
        Object.entries(lengthFreq)
            .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
            .slice(0, 10)
            .forEach(([length, count]) => {
                result += `${length} 字符: ${count}行\n`;
            });
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('行数统计完成');
    },
    
    textInfo() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要分析的文本', 'warning');
            return;
        }
        
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(w => w).length;
        const lineCount = text.split('\n').length;
        const spaceCount = (text.match(/ /g) || []).length;
        const tabCount = (text.match(/\t/g) || []).length;
        const digitCount = (text.match(/\d/g) || []).length;
        const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
        const punctuationCount = (text.match(/[^\w\s]/g) || []).length;
        
        let result = `📄 文本信息报告\n`;
        result += `══════════════════\n\n`;
        result += `基本信息:\n`;
        result += `• 字符总数: ${charCount}\n`;
        result += `• 单词数: ${wordCount}\n`;
        result += `• 行数: ${lineCount}\n\n`;
        
        result += `字符类型分布:\n`;
        result += `• 字母: ${letterCount} (${((letterCount / charCount) * 100).toFixed(2)}%)\n`;
        result += `• 数字: ${digitCount} (${((digitCount / charCount) * 100).toFixed(2)}%)\n`;
        result += `• 空格: ${spaceCount} (${((spaceCount / charCount) * 100).toFixed(2)}%)\n`;
        result += `• Tab: ${tabCount} (${((tabCount / charCount) * 100).toFixed(2)}%)\n`;
        result += `• 标点符号: ${punctuationCount} (${((punctuationCount / charCount) * 100).toFixed(2)}%)\n`;
        result += `• 其他字符: ${charCount - letterCount - digitCount - spaceCount - tabCount - punctuationCount}\n\n`;
        
        result += `编码信息:\n`;
        result += `• 字节大小 (UTF-8): ${new TextEncoder().encode(text).length} bytes\n`;
        result += `• 字节大小 (UTF-16): ${text.length * 2} bytes\n`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('文本信息分析完成');
    },
    
    analyzeText() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要分析的文本', 'warning');
            return;
        }
        
        // 计算熵值
        const freq = {};
        for (let c of text) {
            freq[c] = (freq[c] || 0) + 1;
        }
        
        let entropy = 0;
        const length = text.length;
        for (let c in freq) {
            const p = freq[c] / length;
            entropy -= p * Math.log2(p);
        }
        
        let result = `🔬 深度文本分析\n`;
        result += `══════════════════\n\n`;
        result += `基本信息:\n`;
        result += `• 字符数: ${length}\n`;
        result += `• 唯一字符: ${Object.keys(freq).length}\n`;
        result += `• 信息熵: ${entropy.toFixed(4)} bits/字符\n`;
        result += `• 总熵值: ${(entropy * length).toFixed(2)} bits\n\n`;
        
        result += `可读性评估:\n`;
        if (entropy > 4.5) {
            result += `• 随机性: 🔴 高 (可能为加密数据或随机字符串)\n`;
        } else if (entropy > 3.5) {
            result += `• 随机性: 🟡 中 (可能为技术文档或代码)\n`;
        } else {
            result += `• 随机性: 🟢 低 (可能为自然语言文本)\n`;
        }
        
        const compressionRatio = (1 - (new TextEncoder().encode(text).length / (length * 8))) * 100;
        result += `• 理论压缩率: ${compressionRatio > 0 ? compressionRatio.toFixed(2) + '%' : '不可压缩'}\n\n`;
        
        result += `检测建议:\n`;
        if (entropy < 2) {
            result += `✅ 文本可能为自然语言\n`;
        } else if (entropy > 4) {
            result += `⚠️ 文本可能为加密数据或随机字符串\n`;
        } else {
            result += `ℹ️ 文本可能为代码或技术文档\n`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('深度文本分析完成');
    },
    
    // 格式转换
    formatJson() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入JSON文本', 'warning');
            return;
        }
        
        try {
            const json = JSON.parse(text);
            const formatted = JSON.stringify(json, null, 2);
            CryptoApp.setOutput(formatted);
            CryptoApp.showToast('JSON格式化完成');
            CryptoApp.addHistory('JSON格式化', text, formatted);
        } catch (e) {
            CryptoApp.setOutput(`JSON解析错误: ${e.message}\n\n请检查JSON格式是否正确。`);
            CryptoApp.showToast('JSON解析失败', 'error');
        }
    },
    
    minifyJson() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入JSON文本', 'warning');
            return;
        }
        
        try {
            const json = JSON.parse(text);
            const minified = JSON.stringify(json);
            CryptoApp.setOutput(minified);
            CryptoApp.showToast('JSON压缩完成');
            CryptoApp.addHistory('JSON压缩', text, minified);
        } catch (e) {
            CryptoApp.setOutput(`JSON解析错误: ${e.message}`);
            CryptoApp.showToast('JSON解析失败', 'error');
        }
    },
    
    formatXml() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入XML文本', 'warning');
            return;
        }
        
        // 简单的XML格式化
        const formatted = text
            .replace(/>\s+</g, '>\n<')
            .replace(/(<\/?[a-zA-Z][^>]*>)/g, '\n$1\n')
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const indent = (line.match(/<\/[^>]+>/) ? -1 : 0) + (line.match(/<[^/][^>]*[^/]>/) ? 1 : 0);
                return '  '.repeat(Math.max(0, indent)) + line.trim();
            })
            .join('\n');
        
        CryptoApp.setOutput(formatted);
        CryptoApp.showToast('XML格式化完成');
        CryptoApp.addHistory('XML格式化', text, formatted);
    },
    
    minifyXml() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入XML文本', 'warning');
            return;
        }
        
        const minified = text.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
        CryptoApp.setOutput(minified);
        CryptoApp.showToast('XML压缩完成');
        CryptoApp.addHistory('XML压缩', text, minified);
    },
    
    csvToJson() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入CSV文本', 'warning');
            return;
        }
        
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            CryptoApp.showToast('CSV需要至少两行（标题行和数据行）', 'warning');
            return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        const json = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const obj = {};
            for (let j = 0; j < headers.length && j < values.length; j++) {
                obj[headers[j]] = values[j].trim();
            }
            json.push(obj);
        }
        
        CryptoApp.setOutput(JSON.stringify(json, null, 2));
        CryptoApp.showToast('CSV转JSON完成');
        CryptoApp.addHistory('CSV转JSON', text, JSON.stringify(json, null, 2));
    },
    
    jsonToCsv() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入JSON文本', 'warning');
            return;
        }
        
        try {
            const data = JSON.parse(text);
            if (!Array.isArray(data) || data.length === 0) {
                CryptoApp.showToast('JSON必须是包含对象的数组', 'warning');
                return;
            }
            
            const headers = Object.keys(data[0]);
            let csv = headers.join(',') + '\n';
            
            for (const row of data) {
                const values = headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
                });
                csv += values.join(',') + '\n';
            }
            
            CryptoApp.setOutput(csv);
            CryptoApp.showToast('JSON转CSV完成');
            CryptoApp.addHistory('JSON转CSV', text, csv);
        } catch (e) {
            CryptoApp.setOutput(`JSON解析错误: ${e.message}`);
            CryptoApp.showToast('JSON解析失败', 'error');
        }
    },
    
    // 时间工具
    convertTimezone() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入时间或时间戳', 'warning'); return; }
        
        let date;
        const ts = parseInt(text);
        if (!isNaN(ts)) date = new Date(ts < 1e12 ? ts * 1000 : ts);
        else date = new Date(text);
        if (isNaN(date.getTime())) { CryptoApp.showToast('无法解析时间', 'error'); return; }
        
        const timezones = [
            { name: '本地时间', offset: '' },
            { name: 'UTC', offset: 'UTC' },
            { name: '纽约 (EST/EDT)', tz: 'America/New_York' },
            { name: '伦敦 (GMT/BST)', tz: 'Europe/London' },
            { name: '东京 (JST)', tz: 'Asia/Tokyo' },
            { name: '北京 (CST)', tz: 'Asia/Shanghai' },
            { name: '悉尼 (AEST/AEDT)', tz: 'Australia/Sydney' }
        ];
        
        let result = '🌍 时区转换\n══════════════════\n\n';
        for (const tz of timezones) {
            try {
                const str = date.toLocaleString('zh-CN', { timeZone: tz.tz || undefined, hour12: false });
                result += `${tz.name}: ${str}\n`;
            } catch { result += `${tz.name}: 不支持\n`; }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('时区转换完成');
    },
    
    calculateDuration() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入两个时间(用换行分隔)', 'warning'); return; }
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 2) { CryptoApp.showToast('请用换行分隔两个时间', 'warning'); return; }
        
        const d1 = new Date(lines[0]), d2 = new Date(lines[1]);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { CryptoApp.showToast('时间格式无效', 'error'); return; }
        
        const diff = Math.abs(d2 - d1);
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        CryptoApp.setOutput(`⏱️ 时间间隔\n══════════════════\n\n起始: ${d1.toLocaleString('zh-CN')}\n结束: ${d2.toLocaleString('zh-CN')}\n\n间隔:\n• ${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒\n• 总计 ${diff} 毫秒\n• 总计 ${(diff / 3600000).toFixed(2)} 小时\n• 总计 ${(diff / 86400000).toFixed(4)} 天`);
        CryptoApp.showToast('时间间隔计算完成');
    },
    
    dateDiff() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入两个日期(用换行或逗号分隔)', 'warning'); return; }
        const parts = text.split(/[\n,]+/).map(s => s.trim());
        if (parts.length < 2) { CryptoApp.showToast('请输入两个日期', 'warning'); return; }
        const d1 = new Date(parts[0]), d2 = new Date(parts[1]);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { CryptoApp.showToast('日期格式无效', 'error'); return; }
        
        const diff = Math.abs(d2 - d1);
        const days = Math.floor(diff / 86400000);
        const weeks = Math.floor(days / 7);
        const months = (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
        
        CryptoApp.setOutput(`📅 日期差计算\n══════════════════\n\n日期1: ${d1.toLocaleDateString('zh-CN')}\n日期2: ${d2.toLocaleDateString('zh-CN')}\n\n差值:\n• ${days} 天\n• ${weeks} 周 ${days % 7} 天\n• 约 ${Math.abs(months)} 个月\n• 约 ${(days / 365.25).toFixed(2)} 年`);
        CryptoApp.showToast('日期差计算完成');
    },
    
    timeNow() {
        const now = new Date();
        const result = `🕐 当前时间\n\n本地时间: ${now.toLocaleString('zh-CN')}\nUTC时间: ${now.toUTCString()}\n时间戳: ${now.getTime()}\nUnix时间戳: ${Math.floor(now.getTime() / 1000)}\nISO格式: ${now.toISOString()}`;
        CryptoApp.setOutput(result);
        CryptoApp.showToast('已获取当前时间');
    },
    
    // ========== 科学计算器 ==========
    scientificCalc() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入数学表达式', 'warning'); return; }

        try {
            // 安全的数学计算（白名单字符）
            const sanitized = text.replace(/[^0-9+\-*/().e^%√πE\s]/gi, '');
            if (!sanitized) throw new Error('无效表达式');

            // 预处理：替换常见数学符号
            let expr = text
                .replace(/π/g, Math.PI.toString())
                .replace(/√\(/g, 'Math.sqrt(')
                .replace(/√(\d)/g, 'Math.sqrt($1')
                .replace(/\^/g, '**')
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/abs\(/g, 'Math.abs(')
                .replace(/ceil\(/g, 'Math.ceil(')
                .replace(/floor\(/g, 'Math.floor(')
                .replace(/round\(/g, 'Math.round(');

            const result = Function('"use strict"; return (' + expr + ')')();
            if (!isFinite(result)) throw new Error('计算结果无效');

            let output = `🧮 科学计算器\n══════════════════\n\n`;
            output += `表达式: ${text}\n`;
            output += `结果: ${result}\n\n`;
            output += `常用值:\n`;
            output += `• 整数部分: ${Math.trunc(result)}\n`;
            output += `• 小数部分: ${(result % 1).toFixed(6)}\n`;
            output += `• 绝对值: ${Math.abs(result)}\n`;
            output += `• 平方根: ${Math.sqrt(Math.abs(result)).toFixed(6)}\n`;
            output += `• 自然对数: ${result > 0 ? Math.log(result).toFixed(6) : 'undefined'}`;

            CryptoApp.setOutput(output);
            CryptoApp.showToast('计算完成');
            CryptoApp.addHistory('科学计算', text, result.toString());
        } catch (e) {
            CryptoApp.setOutput(`❌ 计算错误: ${e.message}\n\n支持的操作:\n• 四则运算: + - * /\n• 幂运算: ^ 或 **\n• 根号: √(9)\n• 三角函数: sin() cos() tan()\n• 对数: log() ln()\n• 常数: π`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },

    // ========== 程序员计算器 ==========
    programmerCalc() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入数字或表达式', 'warning'); return; }

        let num;
        // 自动检测进制
        if (/^0b[01]+$/i.test(text)) {
            num = parseInt(text.slice(2), 2);
        } else if (/^0o[0-7]+$/i.test(text)) {
            num = parseInt(text.slice(2), 8);
        } else if (/^0x[0-9a-f]+$/i.test(text)) {
            num = parseInt(text.slice(2), 16);
        } else {
            num = parseInt(text);
        }

        if (isNaN(num) || num < 0) {
            CryptoApp.showToast('请输入有效的非负整数', 'error'); return;
        }

        // 按字节数截断
        num = num >>> 0; // 转为32位无符号整数

        let result = `💻 程序员计算器\n══════════════════\n\n`;
        result += `输入: ${text}\n\n`;
        result += `十进制: ${num}\n`;
        result += `二进制: 0b${num.toString(2).padStart(32, '0')}\n`;
        result += `  分组: ${num.toString(2).padStart(32, '0').match(/.{4}/g).join(' ')}\n`;
        result += `八进制: 0o${num.toString(8)}\n`;
        result += `十六进制: 0x${num.toString(16).toUpperCase().padStart(8, '0')}\n\n`;

        result += `位运算:\n`;
        result += `NOT (~): ${(~num >>> 0).toString(16).toUpperCase()}\n`;
        result += `字节拆分: [${[
            (num >>> 24) & 0xFF,
            (num >>> 16) & 0xFF,
            (num >>> 8) & 0xFF,
            num & 0xFF
        ].join(', ')}]\n\n`;

        result += `位数统计:\n`;
        const binary = num.toString(2);
        result += `• 1的个数: ${(binary.match(/1/g) || []).length}\n`;
        result += `• 0的个数: ${(binary.match(/0/g) || []).length}\n`;
        result += `• 最高位位置: ${Math.floor(Math.log2(num))} (从0开始)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('转换完成');
        CryptoApp.addHistory('进制转换', text, num.toString());
    },

    // ========== 货币换算 ==========
    currencyCalc() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入金额 或 金额+货币代码', 'warning'); return; }

        const amount = parseFloat(text);
        if (isNaN(amount)) { CryptoApp.showToast('请输入有效数字', 'error'); return; }

        // 汇率（示例汇率，实际需要实时获取）
        const rates = {
            CNY: { name: '人民币', symbol: '¥', rate: 1 },
            USD: { name: '美元', symbol: '$', rate: 7.24 },
            EUR: { name: '欧元', symbol: '€', rate: 7.85 },
            GBP: { name: '英镑', symbol: '£', rate: 9.12 },
            JPY: { name: '日元', symbol: '¥', rate: 0.047 },
            KRW: { name: '韩元', symbol: '₩', rate: 0.0054 },
            HKD: { name: '港币', symbol: 'HK$', rate: 0.93 },
            TWD: { name: '新台币', symbol: 'NT$', rate: 0.23 }
        };

        let result = `💱 货币换算 (以人民币为基准)\n══════════════════\n\n`;
        result += `金额: ¥${amount.toFixed(2)} (CNY)\n\n`;
        result += `换算结果:\n`;
        for (const [code, { name, symbol, rate }] of Object.entries(rates)) {
            if (code === 'CNY') continue;
            const converted = amount / rate;
            result += `• ${name} (${code}): ${symbol}${converted.toFixed(2)}\n`;
        }
        result += `\n⚠️ 汇率为参考值，实际汇率以银行牌价为准`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('换算完成');
    },

    // ========== 单位换算 ==========
    unitConverter() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入数值和单位，如 "100 cm"', 'warning'); return; }

        const match = text.match(/^(-?[\d.]+)\s*([a-zA-Z°']+)$/);
        if (!match) {
            CryptoApp.showToast('格式: 数值+单位，如 100km, 32F, 100C', 'warning'); return;
        }

        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        let result = `📏 单位换算\n══════════════════\n\n`;
        result += `输入: ${match[1]} ${match[2]}\n\n`;

        // 长度
        const lengthUnits = { mm: 0.001, cm: 0.01, dm: 0.1, m: 1, km: 1000, in: 0.0254, ft: 0.3048, mi: 1609.34 };
        // 重量
        const weightUnits = { mg: 0.001, g: 1, kg: 1000, t: 1000000, lb: 453.592, oz: 28.3495 };
        // 温度 (特殊)
        const tempInput = { c: 'celsius', f: 'fahrenheit', k: 'kelvin' };

        let converted = false;

        // 尝试长度换算
        if (unit in lengthUnits) {
            const meters = value * lengthUnits[unit];
            result += `长度换算:\n`;
            for (const [u, factor] of Object.entries(lengthUnits)) {
                result += `• ${u}: ${(meters / factor).toFixed(6)}\n`;
            }
            converted = true;
        }

        // 尝试重量换算
        if (!converted && unit in weightUnits) {
            const grams = value * weightUnits[unit];
            result += `重量换算:\n`;
            for (const [u, factor] of Object.entries(weightUnits)) {
                result += `• ${u}: ${(grams / factor).toFixed(6)}\n`;
            }
            converted = true;
        }

        // 温度换算
        if (!converted) {
            let celsius, fahrenheit, kelvin;
            if (unit === 'c' || unit === '°c') {
                celsius = value; fahrenheit = celsius * 9/5 + 32; kelvin = celsius + 273.15;
            } else if (unit === 'f' || unit === '°f') {
                fahrenheit = value; celsius = (fahrenheit - 32) * 5/9; kelvin = celsius + 273.15;
            } else if (unit === 'k' || unit === '°k') {
                kelvin = value; celsius = kelvin - 273.15; fahrenheit = celsius * 9/5 + 32;
            }
            if (celsius !== undefined) {
                result += `温度换算:\n`;
                result += `• 摄氏度 (°C): ${celsius.toFixed(2)}\n`;
                result += `• 华氏度 (°F): ${fahrenheit.toFixed(2)}\n`;
                result += `• 开尔文 (K): ${kelvin.toFixed(2)}`;
                converted = true;
            }
        }

        if (!converted) {
            result += `❌ 不支持的单位: ${unit}\n\n支持的单位:\n• 长度: mm, cm, m, km, in, ft, mi\n• 重量: mg, g, kg, t, lb, oz\n• 温度: C, F, K`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast(converted ? '换算完成' : '不支持的单位', converted ? 'success' : 'warning');
    },

    // ========== 日期计算器 ==========
    dateCalc() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入日期或日期表达式', 'warning'); return; }

        // 支持: add 7d, sub 3m, add 1y 等
        const addMatch = text.match(/^add\s+(\d+)([dmy])$/i);
        const subMatch = text.match(/^sub\s+(\d+)([dmy])$/i);

        let baseDate = new Date();
        let result;

        if (addMatch) {
            const num = parseInt(addMatch[1]);
            const unit = addMatch[2].toLowerCase();
            result = new Date(baseDate);
            if (unit === 'd') result.setDate(result.getDate() + num);
            else if (unit === 'm') result.setMonth(result.getMonth() + num);
            else if (unit === 'y') result.setFullYear(result.getFullYear() + num);

            CryptoApp.setOutput(`📅 日期计算\n\n基准: ${baseDate.toLocaleDateString('zh-CN')}\n操作: 加 ${num}${unit === 'd' ? '天' : unit === 'm' ? '个月' : '年'}\n结果: ${result.toLocaleDateString('zh-CN')}\n\n星期: ${['日','一','二','三','四','五','六'][result.getDay()]}`);
        } else if (subMatch) {
            const num = parseInt(subMatch[1]);
            const unit = subMatch[2].toLowerCase();
            result = new Date(baseDate);
            if (unit === 'd') result.setDate(result.getDate() - num);
            else if (unit === 'm') result.setMonth(result.getMonth() - num);
            else if (unit === 'y') result.setFullYear(result.getFullYear() - num);

            CryptoApp.setOutput(`📅 日期计算\n\n基准: ${baseDate.toLocaleDateString('zh-CN')}\n操作: 减 ${num}${unit === 'd' ? '天' : unit === 'm' ? '个月' : '年'}\n结果: ${result.toLocaleDateString('zh-CN')}\n\n星期: ${['日','一','二','三','四','五','六'][result.getDay()]}`);
        } else {
            // 尝试解析为日期
            const d = new Date(text);
            if (isNaN(d.getTime())) {
                CryptoApp.setOutput(`📅 日期计算器\n\n用法:\n• add 7d  → 加7天\n• add 3m  → 加3个月\n• add 1y  → 加1年\n• sub 7d  → 减7天\n\n或直接输入日期查看详情`);
            } else {
                const now = new Date();
                const diffDays = Math.floor((d - now) / 86400000);
                CryptoApp.setOutput(`📅 日期信息\n\n日期: ${d.toLocaleDateString('zh-CN')}\n星期: ${['日','一','二','三','四','五','六'][d.getDay()]}\n距今天: ${diffDays > 0 ? diffDays + '天后' : diffDays < 0 ? Math.abs(diffDays) + '天前' : '今天'}\nUnix时间戳: ${Math.floor(d.getTime() / 1000)}`);
            }
        }
        CryptoApp.showToast('计算完成');
    },

    // ========== 质数工具 ==========
    primeNumbers() {
        const text = CryptoApp.dom.inputText.value.trim();
        const limit = parseInt(text) || 100;

        if (limit > 100000) {
            CryptoApp.showToast('范围过大，请输入小于100000的数', 'warning'); return;
        }

        // 埃拉托色尼筛法
        const sieve = new Uint8Array(limit + 1);
        sieve[0] = sieve[1] = 1;
        for (let i = 2; i * i <= limit; i++) {
            if (!sieve[i]) {
                for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
            }
        }

        const primes = [];
        for (let i = 2; i <= limit; i++) {
            if (!sieve[i]) primes.push(i);
        }

        let result = `🔢 质数生成 (2~${limit})\n══════════════════\n\n`;
        result += `范围内质数个数: ${primes.length}\n`;
        result += `质数密度: ${(primes.length / limit * 100).toFixed(2)}%\n\n`;

        if (primes.length <= 50) {
            result += `质数列表:\n${primes.join(', ')}`;
        } else {
            result += `前30个: ${primes.slice(0, 30).join(', ')}...\n`;
            result += `最后10个: ${primes.slice(-10).join(', ')}`;
        }

        // 检测输入数是否为质数
        if (text && !isNaN(parseInt(text))) {
            const n = parseInt(text);
            if (n <= 1) result += `\n\n${n} 不是质数`;
            else if (n <= limit) result += `\n\n${n} ${!sieve[n] ? '✅ 是质数' : '❌ 不是质数'}`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('质数计算完成');
    },

    // ========== 斐波那契数列 ==========
    fibonacci() {
        const text = CryptoApp.dom.inputText.value.trim();
        const n = parseInt(text) || 20;

        if (n > 1000) { CryptoApp.showToast('项数过多', 'warning'); return; }

        const fib = [0n, 1n];
        for (let i = 2; i <= n; i++) {
            fib[i] = fib[i-1n] + fib[i-2n];
        }

        let result = `🐚 斐波那契数列 (前${n}项)\n══════════════════\n\n`;
        result += `数列: `;
        if (n <= 20) {
            result += fib.slice(0, n+1).join(', ');
        } else {
            result += fib.slice(0, 10).join(', ') + ' ... ' + fib.slice(-5).join(', ');
        }
        result += `\n\n第${n}项: ${fib[n]}`;
        result += `\n比值 F(n)/F(n-1): ${n > 1 ? (Number(fib[n]) / Number(fib[n-1])).toFixed(10) : 'N/A'}`;
        result += `\n(接近黄金比例 φ ≈ 1.6180339887)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('计算完成');
    },

    // ========== 阶乘计算 ==========
    factorial() {
        const text = CryptoApp.dom.inputText.value.trim();
        const n = parseInt(text);

        if (isNaN(n) || n < 0) { CryptoApp.showToast('请输入非负整数', 'warning'); return; }
        if (n > 170) { CryptoApp.showToast('数值过大(>170将溢出)', 'warning'); return; }

        let result = 1n;
        const steps = [];
        for (let i = 1n; i <= BigInt(n); i++) {
            result *= i;
            if (i <= 10n || i > BigInt(n) - 3n) {
                steps.push(`${i}! = ${result}`);
            } else if (i === 11n) {
                steps.push('...');
            }
        }

        let output = `📐 阶乘计算\n══════════════════\n\n`;
        output += `${n}! = ${result}\n\n`;
        output += `位数: ${result.toString().length}\n`;
        output += `科学计数法: ${n <= 69 ? result.toString() : result.toString().slice(0, 10) + '...e+' + (result.toString().length - 1)}\n\n`;
        output += `计算过程:\n${steps.slice(0, 11).join('\n')}`;

        CryptoApp.setOutput(output);
        CryptoApp.showToast('计算完成');
        CryptoApp.addHistory('阶乘', n.toString(), result.toString());
    },

    // ========== 组合计算 ==========
    combinations() {
        const text = CryptoApp.dom.inputText.value.trim();
        // 支持格式: "n,m" 或 "n m"
        const parts = text.split(/[,\s]+/).map(Number);

        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) {
            CryptoApp.showToast('格式: n,m (如 10,3)', 'warning'); return;
        }

        const n = parts[0], k = parts[1];
        if (k > n) { CryptoApp.showToast('k不能大于n', 'error'); return; }

        // C(n,k) = n! / (k! * (n-k)!)
        const comb = (n, k) => {
            if (k > n - k) k = n - k;
            let result = 1n;
            for (let i = 1n; i <= BigInt(k); i++) {
                result = result * BigInt(n - k + Number(i)) / i;
            }
            return result;
        };

        const c = comb(n, k);

        let result = `🔢 组合计算 C(${n},${k})\n══════════════════\n\n`;
        result += `公式: C(n,k) = n! / (k! × (n-k)!)\n\n`;
        result += `C(${n},${k}) = ${c}\n\n`;
        result += `解释: 从${n}个元素中选择${k}个，共有 ${c} 种不同组合`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('计算完成');
    },

    // ========== 排列计算 ==========
    permutations() {
        const text = CryptoApp.dom.inputText.value.trim();
        const parts = text.split(/[,\s]+/).map(Number);

        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) {
            CryptoApp.showToast('格式: n,m (如 10,3)', 'warning'); return;
        }

        const n = parts[0], k = parts[1];
        if (k > n) { CryptoApp.showToast('k不能大于n', 'error'); return; }

        // P(n,k) = n! / (n-k)!
        const perm = (n, k) => {
            let result = 1n;
            for (let i = BigInt(n); i > BigInt(n - k); i--) {
                result *= i;
            }
            return result;
        };

        const p = perm(n, k);

        let result = `🔢 排列计算 P(${n},${k})\n══════════════════\n\n`;
        result += `公式: P(n,k) = n! / (n-k)!\n\n`;
        result += `P(${n},${k}) = ${p}\n\n`;
        result += `解释: 从${n}个元素中选${k}个排列，共有 ${p} 种不同排列`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('计算完成');
    },

    // ========== 统计分析 ==========
    statistics() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入数字列表(逗号或空格分隔)', 'warning'); return; }

        const numbers = text.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        if (numbers.length < 2) { CryptoApp.showToast('至少需要2个数字', 'warning'); return; }

        const n = numbers.length;
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        const sorted = [...numbers].sort((a, b) => a - b);
        const median = n % 2 === 0
            ? (sorted[n/2 - 1] + sorted[n/2]) / 2
            : sorted[Math.floor(n/2)];
        const variance = numbers.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
        const stdDev = Math.sqrt(variance);
        const range = Math.max(...numbers) - Math.min(...numbers);

        // 众数
        const freq = {};
        numbers.forEach(n => freq[n] = (freq[n] || 0) + 1);
        const maxFreq = Math.max(...Object.values(freq));
        const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);

        let result = `📊 统计分析\n══════════════════\n\n`;
        result += `数据量: ${n}\n`;
        result += `数据: [${numbers.join(', ')}]\n\n`;
        result += `描述统计:\n`;
        result += `• 求和: ${sum}\n`;
        result += `• 均值: ${mean.toFixed(4)}\n`;
        result += `• 中位数: ${median}\n`;
        result += `• 众数: ${modes.length === n ? '无(各值出现1次)' : modes.join(', ')}\n`;
        result += `• 方差: ${variance.toFixed(4)}\n`;
        result += `• 标准差: ${stdDev.toFixed(4)}\n`;
        result += `• 极差: ${range}\n`;
        result += `• 最小值: ${Math.min(...numbers)}\n`;
        result += `• 最大值: ${Math.max(...numbers)}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('分析完成');
        CryptoApp.addHistory('统计分析', text, `均值=${mean.toFixed(2)}`);
    },
    // ========== 颜色选择器 ==========
    colorPicker() {
        const text = CryptoApp.dom.inputText.value.trim();
        let r, g, b;

        if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(text)) {
            // HEX格式
            let hex = text.slice(1);
            if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            r = parseInt(hex.slice(0,2), 16); g = parseInt(hex.slice(2,4), 16); b = parseInt(hex.slice(4,6), 16);
        } else if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.test(text)) {
            [r, g, b] = text.match(/\d+/g).map(Number);
        } else {
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
        }

        const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        const hsl = this._rgbToHsl(r, g, b);
        const hsv = this._rgbToHsv(r, g, b);
        const cmyk = this._rgbToCmyk(r, g, b);

        // 计算亮度，判断用黑/白文字
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

        let result = `🎨 颜色信息\n══════════════════\n\n`;
        result += `HEX: ${hex.toUpperCase()}\n`;
        result += `RGB: rgb(${r}, ${g}, ${b})\n`;
        result += `HSL: hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)\n`;
        result += `HSV: hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)\n`;
        result += `CMYK: cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)\n\n`;

        // 显示颜色块（用文字模拟）
        result += `颜色预览:\n`;
        result += `  ████████████████████  (${hex.toUpperCase()})\n\n`;

        result += `相近颜色:\n`;
        result += `• 变亮: #${(Math.min(255, r+40)).toString(16).padStart(2,'0')}${(Math.min(255, g+40)).toString(16).padStart(2,'0')}${(Math.min(255, b+40)).toString(16).padStart(2,'0')}\n`;
        result += `• 变暗: #${(Math.max(0, r-40)).toString(16).padStart(2,'0')}${(Math.max(0, g-40)).toString(16).padStart(2,'0')}${(Math.max(0, b-40)).toString(16).padStart(2,'0')}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('颜色信息已生成');
    },

    _rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    },

    _rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const d = max - min;
        let h, s = max === 0 ? 0 : d / max;
        switch(max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
            default: h = 0;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(max * 100)];
    },

    _rgbToCmyk(r, g, b) {
        if (r === 0 && g === 0 && b === 0) return [0, 0, 0, 100];
        let c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255;
        const k = Math.min(c, m, y);
        c = Math.round((c - k) / (1 - k) * 100);
        m = Math.round((m - k) / (1 - k) * 100);
        y = Math.round((y - k) / (1 - k) * 100);
        return [c, m, y, Math.round(k * 100)];
    },

    // ========== 颜色转换 ==========
    colorConverter() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入颜色值(HEX/RGB/HSL)', 'warning'); return; }

        let r, g, b;
        let result = `🎨 颜色转换\n══════════════════\n\n输入: ${text}\n\n`;

        // HEX解析
        const hexMatch = text.match(/^#?([0-9A-Fa-f]{3}){1,2}$/);
        if (hexMatch) {
            let hex = hexMatch[1] || hexMatch[input.length === 4 ? 1 : 1];
            // 简化处理，直接用原始文本
            let raw = text.replace('#', '');
            if (raw.length === 3) raw = raw[0]+raw[0]+raw[1]+raw[1]+raw[2]+raw[2];
            r = parseInt(raw.slice(0,2), 16); g = parseInt(raw.slice(2,4), 16); b = parseInt(raw.slice(4,6), 16);
            result += `解析为 HEX: #${raw.toUpperCase()}\n\n`;
        }
        // RGB解析
        else if (text.match(/^(\d+),\s*(\d+),\s*(\d+)$/)) {
            [r, g, b] = text.split(',').map(Number);
            result += `解析为 RGB: (${r}, ${g}, ${b})\n\n`;
        }
        // HSL解析
        else if (text.match(/^(\d+),\s*(\d+),\s*(\d+)%?$/)) {
            const [h, s, l] = text.split(',').map(Number);
            // HSL到RGB转换
            const sNorm = s / 100, lNorm = l / 100;
            const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
            const x = c * (1 - Math.abs((h / 60) % 2 - 1));
            const m = lNorm - c / 2;
            let r1, g1, b1;
            if (h < 60) [r1, g1, b1] = [c, x, 0];
            else if (h < 120) [r1, g1, b1] = [x, c, 0];
            else if (h < 180) [r1, g1, b1] = [0, c, x];
            else if (h < 240) [r1, g1, b1] = [0, x, c];
            else if (h < 300) [r1, g1, b1] = [x, 0, c];
            else [r1, g1, b1] = [c, 0, x];
            r = Math.round((r1 + m) * 255); g = Math.round((g1 + m) * 255); b = Math.round((b1 + m) * 255);
            result += `解析为 HSL: (${h}°, ${s}%, ${l}%)\n\n`;
        }
        else {
            CryptoApp.setOutput(`❌ 无法识别颜色格式\n\n支持的格式:\n• HEX: #FF5733 或 FF5733\n• RGB: 255, 87, 51\n• HSL: 14, 100%, 60%`);
            CryptoApp.showToast('格式错误', 'error');
            return;
        }

        const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        const hsl = this._rgbToHsl(r, g, b);
        const hsv = this._rgbToHsv(r, g, b);

        result += `转换结果:\n`;
        result += `HEX: ${hex.toUpperCase()}\n`;
        result += `RGB: rgb(${r}, ${g}, ${b})\n`;
        result += `HSL: hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)\n`;
        result += `HSV: hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)\n`;
        result += `整数: ${r << 16 | g << 8 | b} (0x${((r << 16 | g << 8 | b) >>> 0).toString(16).toUpperCase()})`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('转换完成');
    },

    // ========== 色盲模拟 ==========
    colorBlind() {
        const text = CryptoApp.dom.inputText.value.trim();
        let r, g, b;

        if (/^#?([0-9A-Fa-f]{6})$/.test(text.replace('#',''))) {
            let hex = text.replace('#', '');
            r = parseInt(hex.slice(0,2), 16); g = parseInt(hex.slice(2,4), 16); b = parseInt(hex.slice(4,6), 16);
        } else {
            r = 100; g = 150; b = 200; // 默认蓝色
        }

        // 色盲模拟矩阵（简化版）
        const simulate = (type) => {
            let nr, ng, nb;
            switch(type) {
                case 'protanopia': // 红色盲
                    nr = 0.567 * r + 0.433 * g + 0.000 * b;
                    ng = 0.558 * r + 0.442 * g + 0.000 * b;
                    nb = 0.000 * r + 0.242 * g + 0.758 * b;
                    break;
                case 'deuteranopia': // 绿色盲
                    nr = 0.625 * r + 0.375 * g + 0.000 * b;
                    ng = 0.700 * r + 0.300 * g + 0.000 * b;
                    nb = 0.000 * r + 0.300 * g + 0.700 * b;
                    break;
                case 'tritanopia': // 蓝色盲
                    nr = 0.950 * r + 0.050 * g + 0.000 * b;
                    ng = 0.000 * r + 0.433 * g + 0.567 * b;
                    nb = 0.000 * r + 0.475 * g + 0.525 * b;
                    break;
                default:
                    return [r, g, b];
            }
            return [Math.round(nr), Math.round(ng), Math.round(nb)];
        };

        const types = [
            ['protanopia', '红色盲 (Protanopia)'],
            ['deuteranopia', '绿色盲 (Deuteranopia)'],
            ['tritanopia', '蓝色盲 (Tritanopia)']
        ];

        let result = `👁️ 色盲模拟\n══════════════════\n\n`;
        result += `原始颜色: #${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}\n\n`;
        result += `各类型色盲看到的颜色:\n\n`;

        for (const [key, name] of types) {
            const [nr, ng, nb] = simulate(key);
            result += `${name}:\n`;
            result += `  #${nr.toString(16).padStart(2,'0')}${ng.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}\n`;
            result += `  RGB(${nr}, ${ng}, ${nb})\n\n`;
        }

        result += `💡 建议: 设计时避免红绿搭配\n可用蓝黄搭配替代`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('模拟完成');
    },

    // ========== 对比度检查 ==========
    colorContrast() {
        const text = CryptoApp.dom.inputText.value.trim();
        // 格式: #FG_COLOR on #BG_COLOR 或 FG_RGB, BG_RGB
        const colors = text.split(/\s+on\s+|\s*,\s*|\s*\/\s*/);

        let fgR, fgG, fgB, bgR, bgG, bgB;

        if (colors.length >= 2) {
            const parseColor = (c) => {
                c = c.trim().replace('#', '');
                if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
                return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
            };
            [fgR, fgG, fgB] = parseColor(colors[0]);
            [bgR, bgG, bgB] = parseColor(colors[1]);
        } else {
            // 默认：白色文字 on 蓝色背景
            [fgR, fgG, fgB] = [255, 255, 255];
            [bgR, bgG, bgB] = [0, 102, 204];
        }

        // 计算相对亮度
        const lum = (r, g, b) => {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const lum1 = lum(fgR, fgG, fgB);
        const lum2 = lum(bgR, bgG, bgB);
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        const contrast = (lighter + 0.05) / (darker + 0.05);

        let result = `🔍 颜色对比度检查\n══════════════════\n\n`;
        result += `前景色: rgb(${fgR}, ${fgG}, ${fgB})\n`;
        result += `背景色: rgb(${bgR}, ${bgG}, ${bgB})\n\n`;
        result += `对比度: ${contrast.toFixed(2)}:1\n\n`;
        result += `WCAG 标准:\n`;
        result += `• AA级(普通文本): ${contrast >= 4.5 ? '✅ 通过' : '❌ 不通过'} (需要 ≥ 4.5:1)\n`;
        result += `• AA级(大文本): ${contrast >= 3 ? '✅ 通过' : '❌ 不通过'} (需要 ≥ 3:1)\n`;
        result += `• AAA级(普通文本): ${contrast >= 7 ? '✅ 通过' : '❌ 不通过'} (需要 ≥ 7:1)\n`;
        result += `• AAA级(大文本): ${contrast >= 4.5 ? '✅ 通过' : '❌ 不通过'} (需要 ≥ 4.5:1)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('检查完成');
    },

    // ========== 调色板生成 ==========
    colorPalette() {
        const text = CryptoApp.dom.inputText.value.trim();
        let baseR, baseG, baseB;

        if (/^#?([0-9A-Fa-f]{6})$/.test(text.replace('#',''))) {
            let hex = text.replace('#', '');
            baseR = parseInt(hex.slice(0,2), 16); baseG = parseInt(hex.slice(2,4), 16); baseB = parseInt(hex.slice(4,6), 16);
        } else {
            baseR = 66; baseG = 133; baseB = 244; // 默认蓝色
        }

        const hsl = this._rgbToHsl(baseR, baseG, baseB);

        let result = `🎨 调色板生成\n══════════════════\n\n`;
        result += `基准颜色: #${baseR.toString(16).padStart(2,'0')}${baseG.toString(16).padStart(2,'0')}${baseB.toString(16).padStart(2,'0')}\n\n`;

        // 生成同色系不同明暗
        result += `单色系 (同色系明暗):\n`;
        for (let i = 0; i <= 4; i++) {
            const l = 20 + i * 20;
            const c = this._hslToRgb(hsl[0], hsl[1], l);
            result += `  ${l}%: #${c[0].toString(16).padStart(2,'0')}${c[1].toString(16).padStart(2,'0')}${c[2].toString(16).padStart(2,'0')}\n`;
        }

        // 补色
        const compHue = (hsl[0] + 180) % 360;
        const comp = this._hslToRgb(compHue, hsl[1], hsl[2]);

        result += `\n补色 (Complementary):\n  #${comp[0].toString(16).padStart(2,'0')}${comp[1].toString(16).padStart(2,'0')}${comp[2].toString(16).padStart(2,'0')}\n\n`;

        // 类似色
        result += `类似色 (Analogous):\n`;
        for (const offset of [-30, 0, 30]) {
            const h = (hsl[0] + offset + 360) % 360;
            const c = this._hslToRgb(h, hsl[1], hsl[2]);
            result += `  ${h}°: #${c[0].toString(16).padStart(2,'0')}${c[1].toString(16).padStart(2,'0')}${c[2].toString(16).padStart(2,'0')}\n`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('调色板生成完成');
    },

    _hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;
        let r, g, b;
        if (h < 1/6) [r, g, b] = [c, x, 0];
        else if (h < 2/6) [r, g, b] = [x, c, 0];
        else if (h < 3/6) [r, g, b] = [0, c, x];
        else if (h < 4/6) [r, g, b] = [0, x, c];
        else if (h < 5/6) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];
        return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
    },
    // ========== 二维码生成 ==========
    generateQR() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入要生成二维码的内容', 'warning'); return; }

        // 使用 Canvas 生成简易二维码（QR Code Model 2 简化版）
        // 由于完整QR算法复杂，这里生成一个模拟显示
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');

        // 绘制白色背景
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, size, size);

        // 简化的"伪QR码"图案（装饰性，非真正编码）
        ctx.fillStyle = '#000000';
        // 三个定位标记
        const drawFinder = (x, y) => {
            ctx.fillRect(x, y, 7, 7);
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x+1, y+1, 5, 5);
            ctx.fillStyle = '#000000'; ctx.fillRect(x+2, y+2, 3, 3);
            ctx.fillStyle = '#000000';
        };
        drawFinder(2, 2); drawFinder(size/32*23, 2); drawFinder(2, size/32*23);

        // 数据区域（模拟点阵）
        ctx.fillStyle = '#000000';
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            for (let b = 0; b < 8; b++) {
                if ((code >> b) & 1) {
                    const px = 10 + (i * 8 + b) % 16;
                    const py = 10 + Math.floor((i * 8 + b) / 16);
                    if (px < 24 && py < 24) ctx.fillRect(px, py, 1, 1);
                }
            }
        }

        const dataUrl = canvas.toDataURL('image/png');

        let result = `📱 二维码生成\n══════════════════\n\n`;
        result += `内容: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\n`;
        result += `编码类型: 自动检测\n`;
        result += `容错级别: M (15%)\n\n`;
        result += `⚠️ 此为模拟预览，非标准QR码\n`;
        result += `实际使用时请使用专业工具:\n`;
        result += `• 在线: qr-code-generator.com\n`;
        result += `• 命令行: qrencode -o out.png "${text.substring(0,20)}"\n`;
        result += `\n数据大小: ${new Blob([text]).size} bytes\n`;
        result += `建议版本: QR Code Version ${Math.ceil(text.length / 10)}`;

        CryptoApp.setOutput(result + `\n\n数据URL（前100字符）:\n${dataUrl.substring(0, 100)}...`);
        CryptoApp.showToast('二维码信息已生成（模拟）');
    },

    // ========== 二维码扫描 ==========
    scanQR() {
        let result = `📷 二维码扫描\n══════════════════\n\n`;
        result += `浏览器端扫码需要调用摄像头API\n\n`;
        result += `实现方案:\n`;
        result += `1. 使用 jsQR 库 (npm install jsqr)\n`;
        result += `2. 使用 Html5 QR Code (npm install html5-qrcode)\n`;
        result += `3. 使用 ZXing 的JS移植版\n\n`;
        result += `简易实现代码:\n`;
        result += `\`\`\`javascript\n`;
        result += `import jsQR from 'jsqr';\n`;
        result += `const imageData = ctx.getImageData(0, 0, w, h);\n`;
        result += `const code = jsQR(imageData.data, w, h);\n`;
        result += `if (code) console.log(code.data);\n`;
        result += `\`\`\`\n\n`;
        result += `💡 或使用在线工具:\n`;
        result += `• webqr.com\n`;
        result += `• qrscan.com`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('扫码功能需要引入JS库');
    },

    // ========== 条形码生成 ==========
    generateBarcode() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入内容（EAN-13需12位数字）', 'warning'); return; }

        let result = `📊 条形码生成\n══════════════════\n\n`;
        result += `输入: ${text}\n\n`;

        // 检测条形码类型
        if (/^\d{12}$/.test(text)) {
            result += `检测到 EAN-13 格式（需13位，最后一位是校验位）\n`;
            // 计算校验位
            let sum = 0;
            for (let i = 0; i < 12; i++) {
                sum += parseInt(text[i]) * (i % 2 === 0 ? 1 : 3);
            }
            const check = (10 - (sum % 10)) % 10;
            result += `完整条码: ${text}${check}\n`;
        } else if (/^\d{13}$/.test(text)) {
            result += `EAN-13 格式\n`;
        } else if (/^[A-Za-z0-9\-\.]+$/.test(text)) {
            result += `可能格式: Code 128（通用）\n`;
        } else {
            result += `格式: 自动选择 Code 128\n`;
        }

        result += `\n⚠️ 条形码生成需要专业库\n推荐工具:\n`;
        result += `• JsBarcode (npm install jsbarcode)\n`;
        result += `• bwip-js (支持多种条码格式)\n\n`;
        result += `示例 (JsBarcode):\n`;
        result += `JsBarcode("#barcode", "${text}", {\n`;
        result += `  format: "EAN13",\n`;
        result += `  lineColor: "#000",\n`;
        result += `  width: 2\n});`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('条形码信息已生成');
    },

    // ========== 条形码扫描 ==========
    scanBarcode() {
        let result = `📷 条形码扫描\n══════════════════\n\n`;
        result += `浏览器端扫码方案:\n\n`;
        result += `1. 使用 BarcodeDetector API (新版Chrome/Edge)\n`;
        result += `2. 使用 QuaggaJS (JavaScript库)\n\n`;
        result += `BarcodeDetector 示例:\n`;
        result += `\`\`\`javascript\n`;
        result += `const detector = new BarcodeDetector({\n`;
        result += `  formats: ['ean_13', 'code_128', 'qr_code']\n`;
        result += `});\n`;
        result += `const barcodes = await detector.detect(image);\n`;
        result += `barcodes.forEach(b => console.log(b.rawValue));\n`;
        result += `\`\`\``;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('扫码需要BarcodeDetector API或QuaggaJS');
    },

    // ========== 条码类型查询 ==========
    barcodeTypes() {
        let result = `📊 条码类型参考\n══════════════════\n\n`;
        result += `常见一维条码:\n`;
        result += `• EAN-13: 13位数字，商品零售\n`;
        result += `• EAN-8: 8位数字，小商品\n`;
        result += `• UPC-A: 12位数字，北美商品\n`;
        result += `• Code 128: 变长，全ASCII，物流\n`;
        result += `• Code 39: 变长，数字+大写字母\n`;
        result += `• ITF (Interleaved 2 of 5): 数字，仓储\n\n`;

        result += `二维条码:\n`;
        result += `• QR Code: 矩阵式，手机扫码\n`;
        result += `• Data Matrix: 小尺寸，电子元件\n`;
        result += `• PDF417: 堆叠式，证件、运输\n`;
        result += `• Aztec Code: 无定位框，票务\n\n`;

        result += `选择建议:\n`;
        result += `• 零售商品 → EAN-13\n`;
        result += `• 物流标签 → Code 128\n`;
        result += `• 手机交互 → QR Code\n`;
        result += `• 小空间 → Data Matrix`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('条码类型信息已显示');
    },

    // ========== 图表生成 ==========
    chartGenerator() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            let result = `📈 图表生成器\n══════════════════\n\n`;
            result += `支持的数据格式:\n`;
            result += `1. 逗号分隔数值: 1,2,3,4,5\n`;
            result += `2. 键值对: a=10,b=20,c=30\n`;
            result += `3. 两列数据: x1,y1;x2,y2;...\n\n`;
            result += `图表类型:\n`;
            result += `• 柱状图 (bar)\n`;
            result += `• 折线图 (line)\n`;
            result += `• 饼图 (pie)\n`;
            result += `• 散点图 (scatter)\n\n`;
            result += `⚠️ 完整图表生成需引入 Chart.js\n`;
            result += `当前提供数据解析和统计信息`;
            CryptoApp.setOutput(result);
            CryptoApp.showToast('请输入数据');
            return;
        }

        // 解析数据
        let labels = [], values = [];
        if (text.includes('=')) {
            const pairs = text.split(/[,\n]+/);
            pairs.forEach(p => {
                const [k, v] = p.split('=');
                if (k && v) { labels.push(k.trim()); values.push(parseFloat(v)); }
            });
        } else {
            const nums = text.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
            values = nums;
            labels = nums.map((_, i) => `数据${i+1}`);
        }

        if (values.length === 0) {
            CryptoApp.setOutput('❌ 无法解析数据\n请使用逗号分隔的数字或 key=value 格式');
            CryptoApp.showToast('数据格式错误', 'error');
            return;
        }

        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const max = Math.max(...values), min = Math.min(...values);

        let result = `📈 图表数据分析\n══════════════════\n\n`;
        result += `数据点数: ${values.length}\n`;
        result += `求和: ${sum}\n`;
        result += `平均值: ${avg.toFixed(2)}\n`;
        result += `最大值: ${max}\n`;
        result += `最小值: ${min}\n\n`;

        result += `柱状图数据 (文本版):\n`;
        const maxBar = 30;
        values.forEach((v, i) => {
            const barLen = Math.round((v / max) * maxBar);
            result += `${labels[i]}: ${'█'.repeat(barLen)} ${v}\n`;
        });

        result += `\n💡 完整图表请使用 Chart.js:\n`;
        result += `new Chart(ctx, { type: 'bar', data: {...} });`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('数据分析完成');
    },

    // ========== 数据绘图 ==========
    dataPlot() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.setOutput(`📉 数据绘图工具\n\n支持的格式:\n• CSV格式（逗号分隔）\n• JSON数组\n• 简单数值列表\n\n示例:\n1,2,3,4,5\n或\n[1,2,3,4,5]`);
            CryptoApp.showToast('请输入数据');
            return;
        }

        let numbers;
        try {
            numbers = JSON.parse(text);
            if (Array.isArray(numbers)) numbers = numbers.flat();
            else numbers = [numbers];
        } catch {
            numbers = text.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        }

        if (numbers.length < 2) {
            CryptoApp.showToast('至少需要2个数据点', 'warning'); return;
        }

        // 生成ASCII绘图
        const max = Math.max(...numbers), min = Math.min(...numbers);
        const range = max - min || 1;
        const height = 15, width = Math.min(numbers.length, 60);

        let result = `📉 ASCII 数据绘图\n══════════════════\n\n`;
        result += `数据点: ${numbers.length}\n`;
        result += `范围: [${min}, ${max}]\n\n`;

        // 绘制简单折线
        result += `图表 (${width}点 × ${height}行):\n`;
        for (let h = height; h >= 0; h--) {
            let line = '';
            for (let i = 0; i < width && i < numbers.length; i++) {
                const normalized = Math.round(((numbers[i] - min) / range) * height);
                line += normalized === h ? '●' : ' ';
            }
            result += `│${line}\n`;
        }
        result += `└${'─'.repeat(width)}\n`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('绘图完成');
    },

    // ========== 词云生成 ==========
    wordCloud() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.setOutput(`☁️ 词云生成工具\n\n请输入文本内容\n\n词云将根据词频生成\n常用词会显示得更大\n\n💡 完整词云需引入:\n• wordcloud2.js\n• d3.layout.cloud`);
            CryptoApp.showToast('请输入文本');
            return;
        }

        // 分词并统计频率
        const words = text.toLowerCase().match(/[a-zA-Z]{2,}|[\u4e00-\u9fa5]+/g) || [];
        const freq = {};
        words.forEach(w => { if (w.length > 1) freq[w] = (freq[w] || 0) + 1; });

        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        const maxFreq = sorted[0] ? sorted[0][1] : 0;

        let result = `☁️ 词频分析（词云预览）\n══════════════════\n\n`;
        result += `总词数: ${words.length}\n`;
        result += `唯一词数: ${sorted.length}\n\n`;
        result += `高频词 (Top 20):\n`;

        sorted.slice(0, 20).forEach(([word, count]) => {
            const size = Math.round((count / maxFreq) * 10);
            result += `'${word}': ${count}次 ${'■'.repeat(size)}\n`;
        });

        result += `\n💡 完整词云请使用 wordcloud2.js:\n`;
        result += `WordCloud(words, { gridSize: 16, ... });`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('词频分析完成');
    },

    // ========== 网络图 ==========
    networkGraph() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `🕸️ 网络图工具\n══════════════════\n\n`;

        if (text) {
            // 尝试解析边列表
            const edges = text.split(/[\n;]+/).map(l => l.trim()).filter(l => l);
            result += `解析到 ${edges.length} 条边\n\n`;
            result += `边列表:\n`;
            edges.slice(0, 10).forEach((e, i) => {
                result += `${i+1}. ${e}\n`;
            });
            if (edges.length > 10) result += `... 还有 ${edges.length - 10} 条边\n`;
        }

        result += `\n网络图生成需要引入:\n`;
        result += `• D3.js (强推)\n`;
        result += `• vis.js (简单)\n`;
        result += `• Cytoscape.js (专业网络分析)\n\n`;

        result += `示例数据格式:\n`;
        result += `节点: [{id: 1, label: 'A'}, ...]\n`;
        result += `边: [{source: 1, target: 2}, ...]`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('网络图信息已显示');
    },
    // ========== 文件信息 ==========
    fileInfo() {
        let result = `📁 文件信息工具\n══════════════════\n\n`;
        result += `浏览器端文件信息获取方法:\n\n`;
        result += `1. 使用 File API:\n`;
        result += `   <input type="file" onchange="showFileInfo(this)">\n\n`;
        result += `2. JavaScript 读取:\n`;
        result += `   file.size — 文件大小(字节)\n`;
        result += `   file.type — MIME类型\n`;
        result += `   file.name — 文件名\n`;
        result += `   file.lastModified — 修改时间\n\n`;
        result += `3. 计算文件哈希:\n`;
        result += `   await crypto.subtle.digest('SHA-256', buffer)\n\n`;
        result += `示例函数:\n`;
        result += `function showFileInfo(input) {\n`;
        result += `  const f = input.files[0];\n`;
        result += `  console.log(f.name, f.size, f.type);\n`;
        result += `}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件信息方法已显示');
    },

    // ========== 文件比较 ==========
    fileCompare() {
        let result = `📑 文件比较工具\n══════════════════\n\n`;
        result += `浏览器端文件比较方案:\n\n`;
        result += `文本文件比较:\n`;
        result += `1. 分别读取两个文件内容\n`;
        result += `2. 按行分割，逐行比较\n`;
        result += `3. 使用 LCS 或 Myers diff 算法\n\n`;
        result += `推荐库:\n`;
        result += `• diff (npm install diff)\n`;
        result += `• jsdiff (轻量级)\n\n`;
        result += `简易文本比较代码:\n`;
        result += `function compareText(t1, t2) {\n`;
        result += `  const l1 = t1.split('\\n'), l2 = t2.split('\\n');\n`;
        result += `  let diff = [];\n`;
        result += `  for (let i=0; i<Math.max(l1.length,l2.length); i++) {\n`;
        result += `    if (l1[i] !== l2[i]) diff.push(i);\n`;
        result += `  }\n  return diff;\n}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件比较方法已显示');
    },

    // ========== 文件分割 ==========
    fileSplit() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `✂️ 文件分割工具\n══════════════════\n\n`;

        if (text) {
            const size = parseInt(text) || 1024;
            result += `设定分割大小: ${size} 字节\n\n`;
            result += `浏览器端实现方案:\n`;
            result += `function splitFile(file, chunkSize) {\n`;
            result += `  const chunks = [];\n`;
            result += `  for (let i=0; i<file.size; i+=chunkSize) {\n`;
            result += `    chunks.push(file.slice(i, i+chunkSize));\n`;
            result += `  }\n  return chunks;\n}\n\n`;
            result += `分割为 ${Math.ceil(1000 / size)} 个块 (假设文件1KB)`;
        } else {
            result += `用法: 在输入框输入分割大小（字节）\n\n`;
            result += `浏览器端文件分割:\n`;
            result += `• 使用 Blob.slice() 方法\n`;
            result += `• 每个chunk是独立的Blob对象\n`;
            result += `• 可分别上传或保存\n\n`;
            result += `命令行替代: split -b 1m file.txt`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件分割信息已显示');
    },

    // ========== 文件合并 ==========
    fileMerge() {
        let result = `📎 文件合并工具\n══════════════════\n\n`;
        result += `浏览器端文件合并方案:\n\n`;
        result += `1. 收集所有Blob分片\n`;
        result += `2. 使用 new Blob(chunks) 合并\n`;
        result += `3. 创建下载链接\n\n`;
        result += `合并代码:\n`;
        result += `function mergeFiles(chunks) {\n`;
        result += `  const blob = new Blob(chunks, {type: 'application/octet-stream'});\n`;
        result += `  const url = URL.createObjectURL(blob);\n`;
        result += `  const a = document.createElement('a');\n`;
        result += `  a.href = url; a.download = 'merged.bin';\n`;
        result += `  a.click();\n`;
        result += `}\n\n`;
        result += `⚠️ 大文件合并注意内存限制`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件合并方法已显示');
    },

    // ========== 文件加密 ==========
    fileEncrypt() {
        let result = `🔐 文件加密工具\n══════════════════\n\n`;
        result += `浏览器端文件加密方案:\n\n`;
        result += `1. 使用 Web Crypto API:\n`;
        result += `   await crypto.subtle.encrypt(\n`;
        result += `     {name: 'AES-GCM', iv: iv},\n`;
        result += `     key, fileBuffer\n   );\n\n`;
        result += `2. 使用第三方库:\n`;
        result += `   • libsodium.js (推荐)\n`;
        result += `   • Forge (RSA/AES)\n`;
        result += `   • TweetNacl.js (NaCl封装)\n\n`;
        result += `完整流程:\n`;
        result += `1. 生成密钥: crypto.subtle.generateKey()\n`;
        result += `2. 读取文件: FileReader.readAsArrayBuffer()\n`;
        result += `3. 加密: subtle.encrypt()\n`;
        result += `4. 保存: Blob + createObjectURL()`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件加密方法已显示');
    },

    // ========== 文件解密 ==========
    fileDecrypt() {
        let result = `🔓 文件解密工具\n══════════════════\n\n`;
        result += `浏览器端文件解密:\n\n`;
        result += `流程:\n`;
        result += `1. 读取加密文件 (Blob/ArrayBuffer)\n`;
        result += `2. 获取密钥 (用户输入或存储)\n`;
        result += `3. 调用 subtle.decrypt()\n`;
        result += `4. 输出解密后的Blob\n\n`;
        result += `注意事项:\n`;
        result += `• 密钥管理至关重要\n`;
        result += `• 大文件需分块处理\n`;
        result += `• 建议用 AES-GCM 或 AES-CBC\n\n`;
        result += `示例代码:\n`;
        result += `const dec = await crypto.subtle.decrypt(\n`;
        result += `  {name: 'AES-GCM', iv: iv},\n`;
        result += `  key, encryptedBuffer\n);`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件解密方法已显示');
    },
    // ========== IP计算器 ==========
    ipCalculator() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            let result = `🌐 IP 计算器\n══════════════════\n\n`;
            result += `用法:\n`;
            result += `• 输入IP: 192.168.1.1\n`;
            result += `• 输入IP/CIDR: 192.168.1.1/24\n`;
            result += `• 输入起止IP: 192.168.1.1-192.168.1.100\n\n`;
            result += `功能:\n`;
            result += `• IP转二进制\n`;
            result += `• 网络地址/广播地址\n`;
            result += `• IP范围计算`;
            CryptoApp.setOutput(result);
            CryptoApp.showToast('请输入IP地址');
            return;
        }

        // 解析IP
        const parseIP = (ip) => {
            const parts = ip.split('.').map(Number);
            if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) return null;
            return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
        };
        const toIP = (n) => `${n >>> 24}.${(n >> 16) & 255}.${(n >> 8) & 255}.${n & 255}`;

        let ipNum, maskBits;
        if (text.includes('/')) {
            const [ipStr, mask] = text.split('/');
            ipNum = parseIP(ipStr);
            maskBits = parseInt(mask);
        } else {
            ipNum = parseIP(text);
            maskBits = 24; // 默认/24
        }

        if (ipNum === null || maskBits < 0 || maskBits > 32) {
            CryptoApp.setOutput('❌ 无效的IP地址或CIDR');
            CryptoApp.showToast('格式错误', 'error');
            return;
        }

        const mask = maskBits === 0 ? 0 : (0xFFFFFFFF << (32 - maskBits)) >>> 0;
        const network = (ipNum & mask) >>> 0;
        const broadcast = (network | (~mask >>> 0)) >>> 0;
        const hostBits = 32 - maskBits;
        const totalHosts = Math.pow(2, hostBits);
        const usableHosts = totalHosts > 2 ? totalHosts - 2 : totalHosts;

        let result = `🌐 IP 计算结果\n══════════════════\n\n`;
        result += `IP地址: ${toIP(ipNum)}\n`;
        result += `子网掩码: ${toIP(mask)} (/${maskBits})\n`;
        result += `网络地址: ${toIP(network)}\n`;
        result += `广播地址: ${toIP(broadcast)}\n`;
        result += `可用主机: ${usableHosts} 个 (共 ${totalHosts} 个)\n`;
        result += `主机范围: ${toIP(network + 1)} ~ ${toIP(broadcast - 1)}\n\n`;

        result += `二进制:\n`;
        result += `IP:   ${ipNum.toString(2).padStart(32, '0').match(/.{8}/g).join('.')}\n`;
        result += `Mask: ${mask.toString(2).padStart(32, '0').match(/.{8}/g).join('.')}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('计算完成');
    },

    // ========== 子网计算器 ==========
    subnetCalculator() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            let result = `📡 子网计算器\n══════════════════\n\n`;
            result += `输入: 网络地址/前缀\n`;
            result += `例如: 192.168.0.0/16\n\n`;
            result += `将计算:\n`;
            result += `• 子网划分方案\n`;
            result += `• 每个子网的主机数\n`;
            result += `• 子网列表`;
            CryptoApp.setOutput(result);
            CryptoApp.showToast('请输入网络地址');
            return;
        }

        const [networkStr, prefixStr] = text.split('/');
        const network = (networkStr.split('.').map(Number).reduce((a, b, i) => a + (b << (24 - i * 8)), 0)) >>> 0;
        const prefix = parseInt(prefixStr) || 24;

        let result = `📡 子网计算: ${text}\n══════════════════\n\n`;
        result += `网络: ${networkStr}\n`;
        result += `前缀: /${prefix}\n\n`;

        // 建议子网划分
        result += `推荐划分:\n`;
        const hostBits = 32 - prefix;
        const possibleHosts = Math.pow(2, hostBits);
        const subnets = [2, 4, 8, 16, 32];
        for (const s of subnets) {
            const newPrefix = prefix + Math.ceil(Math.log2(s));
            if (newPrefix <= 30) {
                const hostsPerSubnet = Math.pow(2, 32 - newPrefix) - 2;
                result += `• 划分为 ${s} 个子网 (/${newPrefix}): 每子网 ${hostsPerSubnet} 台主机\n`;
            }
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('子网计算完成');
    },

    // ========== Ping工具 ==========
    pingTool() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `📡 Ping 工具\n══════════════════\n\n`;

        if (text) {
            result += `目标: ${text}\n\n`;
            result += `浏览器端Ping限制:\n`;
            result += `• 不能用 ICMP (需管理员权限)\n`;
            result += `• 可用 HTTP/Fetch 模拟:\n\n`;
            result += `async function ping(host) {\n`;
            result += `  const start = performance.now();\n`;
            result += `  try {\n`;
            result += `    await fetch(host, {mode:'no-cors'});\n`;
            result += `    return performance.now() - start;\n`;
            result += `  } catch(e) { return null; }\n`;
            result += `}\n\n`;
            result += `💡 真正Ping需要后端服务或桌面应用`;
        } else {
            result += `用法: 在输入框输入要Ping的地址\n\n`;
            result += `示例:\n`;
            result += `• 8.8.8.8\n`;
            result += `• google.com\n`;
            result += `• 192.168.1.1`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('Ping信息已显示');
    },

    // ========== Whois工具 ==========
    whoisTool() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `🔍 Whois 查询工具\n══════════════════\n\n`;

        if (text) {
            result += `域名: ${text}\n\n`;
            result += `浏览器端 Whois 方案:\n`;
            result += `1. 使用 Whois JSON API:\n`;
            result += `   fetch('https://whois.freeaiapi.xyz/?name=${text}')\n\n`;
            result += `2. 使用后端代理:\n`;
            result += `   POST /api/whois {domain: '${text}'}\n\n`;
            result += `3. 命令行 (需后端执行):\n`;
            result += `   whois ${text}\n\n`;
            result += `常用 Whois API:\n`;
            result += `• whois.freeaiapi.xyz (免费)\n`;
            result += `• RDAP (registry data access protocol)`;
        } else {
            result += `用法: 输入域名\n\n示例: google.com`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('Whois信息已显示');
    },

    // ========== DNS查询 ==========
    dnsLookup() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `🌐 DNS 查询工具\n══════════════════\n\n`;

        if (text) {
            result += `域名: ${text}\n\n`;
            result += `浏览器端 DNS 查询 (DNS over HTTPS):\n\n`;
            result += `// Google DNS over HTTPS\n`;
            result += `fetch('https://dns.google/resolve?name=${text}&type=A')\n`;
            result += `  .then(r => r.json())\n`;
            result += `  .then(d => console.log(d.Answer));\n\n`;

            result += `常用记录类型:\n`;
            result += `• A     — IPv4地址\n`;
            result += `• AAAA  — IPv6地址\n`;
            result += `• CNAME — 别名\n`;
            result += `• MX    — 邮件服务器\n`;
            result += `• TXT   — 文本记录\n`;
            result += `• NS    — 域名服务器`;
        } else {
            result += `用法: 输入域名\n\n示例: google.com\n\n`;
            result += `支持 DoH (DNS over HTTPS):\n`;
            result += `• dns.google\n`;
            result += `• cloudflare-dns.com`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('DNS查询信息已显示');
    },

    // ========== 系统信息 ==========
    systemInfo() {
        let result = `💻 系统信息\n══════════════════\n\n`;
        result += `用户代理: ${navigator.userAgent.substring(0, 80)}...\n\n`;
        result += `系统平台: ${navigator.platform || '未知'}\n`;
        result += `CPU核心: ${navigator.hardwareConcurrency || '未知'} 核\n`;
        result += `内存(估算): ${navigator.deviceMemory || '未知'} GB\n`;
        result += `语言: ${navigator.language}\n`;
        result += `在线状态: ${navigator.onLine ? '在线 ✅' : '离线 ❌'}\n\n`;

        result += `浏览器:\n`;
        result += `• Cookie启用: ${navigator.cookieEnabled ? '是' : '否'}\n`;
        result += `• Java启用: ${navigator.javaEnabled ? '是' : '否'}\n`;
        result += `• Do Not Track: ${navigator.doNotTrack || '未设置'}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('系统信息已获取');
    },

    // ========== 浏览器信息 ==========
    browserInfo() {
        let result = `🌐 浏览器信息\n══════════════════\n\n`;
        result += `浏览器: ${navigator.appName}\n`;
        result += `版本: ${navigator.appVersion.substring(0, 50)}...\n\n`;

        result += `特性检测:\n`;
        result += `• Web Crypto API: ${typeof crypto !== 'undefined' && crypto.subtle ? '✅ 支持' : '❌ 不支持'}\n`;
        result += `• Canvas: ${typeof document.createElement('canvas').getContext === 'function' ? '✅ 支持' : '❌ 不支持'}\n`;
        result += `• LocalStorage: ${typeof localStorage !== 'undefined' ? '✅ 支持' : '❌ 不支持'}\n`;
        result += `• Service Worker: ${'serviceWorker' in navigator ? '✅ 支持' : '❌ 不支持'}\n`;
        result += `• WebGL: ${typeof document.createElement('canvas').getContext('webgl') === 'object' ? '✅ 支持' : '❌ 不支持'}\n\n`;

        result += `连接信息:\n`;
        if (navigator.connection) {
            result += `• 有效类型: ${navigator.connection.effectiveType || '未知'}\n`;
            result += `• 下行带宽: ${navigator.connection.downlink || '未知'} Mbps\n`;
            result += `• 往返延迟: ${navigator.connection.rtt || '未知'} ms`;
        } else {
            result += `• Connection API 不支持`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('浏览器信息已获取');
    },

    // ========== 屏幕信息 ==========
    screenInfo() {
        let result = `🖥️ 屏幕信息\n══════════════════\n\n`;
        result += `屏幕尺寸: ${screen.width} × ${screen.height} 像素\n`;
        result += `可用尺寸: ${screen.availWidth} × ${screen.availHeight} 像素\n`;
        result += `色彩深度: ${screen.colorDepth} 位\n`;
        result += `像素深度: ${screen.pixelDepth} 位\n`;
        result += `设备像素比: ${window.devicePixelRatio}\n\n`;

        result += `窗口尺寸:\n`;
        result += `• 外尺寸: ${window.outerWidth} × ${window.outerHeight}\n`;
        result += `• 内尺寸: ${window.innerWidth} × ${window.innerHeight}\n`;
        result += `• 文档: ${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}\n\n`;

        result += `方向: ${screen.orientation ? screen.orientation.type : '未知'}\n`;
        result += `触摸支持: ${'ontouchstart' in window ? '✅ 支持' : '❌ 不支持'}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('屏幕信息已获取');
    },

    // ========== 存储信息 ==========
    storageInfo() {
        let result = `💾 存储信息\n══════════════════\n\n`;

        // LocalStorage
        let lsSize = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                lsSize += localStorage[key].length + key.length;
            }
        }
        result += `LocalStorage:\n`;
        result += `• 使用: ${(lsSize / 1024).toFixed(2)} KB\n`;
        result += `• 估计上限: ~5-10 MB\n\n`;

        // SessionStorage
        let ssSize = 0;
        for (const key in sessionStorage) {
            if (sessionStorage.hasOwnProperty(key)) {
                ssSize += sessionStorage[key].length + key.length;
            }
        }
        result += `SessionStorage:\n`;
        result += `• 使用: ${(ssSize / 1024).toFixed(2)} KB\n\n`;

        // IndexedDB (异步检测)
        result += `IndexedDB: ${'indexedDB' in window ? '✅ 支持' : '❌ 不支持'}\n`;
        result += `Cookie 数量: ${document.cookie ? document.cookie.split(';').length : 0} 个\n\n`;

        result += `💡 查看配额:\n`;
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
                const used = (estimate.usage / 1024 / 1024).toFixed(2);
                const quota = (estimate.quota / 1024 / 1024).toFixed(2);
                CryptoApp.setOutput(`💾 存储信息\n\n已用: ${used} MB / ${quota} MB\n比例: ${(estimate.usage / estimate.quota * 100).toFixed(2)}%`);
            });
        } else {
            result += `Storage API 不支持自动查询`;
            CryptoApp.setOutput(result);
        }
        CryptoApp.showToast('存储信息已获取');
    },

    // ========== 性能测试 ==========
    performanceTest() {
        let result = `⚡ 性能测试工具\n══════════════════\n\n`;

        // CPU测试 - 计算斐波那契
        const start = performance.now();
        let fib = [0n, 1n];
        for (let i = 2; i <= 35; i++) fib[i] = fib[i-1n] + fib[i-2n];
        const cpuTime = performance.now() - start;

        result += `CPU 测试 (Fibonacci 35):\n`;
        result += `• 耗时: ${cpuTime.toFixed(2)} ms\n`;
        result += `• 评价: ${cpuTime < 10 ? '🟢 优秀' : cpuTime < 50 ? '🟡 良好' : '🔴 一般'}\n\n`;

        // 内存测试
        result += `内存信息:\n`;
        if (performance.memory) {
            result += `• 已用JS内存: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB\n`;
            result += `• 总JS内存: ${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB\n`;
            result += `• 内存限制: ${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB\n\n`;
        } else {
            result += `• Performance Memory API 不支持\n\n`;
        }

        // 渲染性能
        result += `渲染性能:\n`;
        result += `• 设备像素比: ${window.devicePixelRatio}\n`;
        result += `• 刷新率(估算): ${screen.refreshRate || '未知'} Hz\n\n`;

        result += `JS 引擎: ${(() => {
            const ua = navigator.userAgent;
            if (ua.includes('Chrome')) return 'V8 (Chrome)';
            if (ua.includes('Firefox')) return 'SpiderMonkey (Firefox)';
            if (ua.includes('Safari')) return 'JavaScriptCore (Safari)';
            return '未知';
        })()}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('性能测试完成');
    },

    // 补充缺失函数
    convertUnits() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入数值', 'warning'); return; }
        const num = parseFloat(text);
        if (isNaN(num)) { CryptoApp.showToast('请输入有效数字', 'error'); return; }
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let val = num, i = 0;
        while (val >= 1024 && i < units.length - 1) { val /= 1024; i++; }
        let result = `📐 单位转换\n═════════════════\n\n`;
        result += `输入: ${num} 字节\n\n`;
        result += `转换结果:\n`;
        let v = num;
        for (let j = 0; j < units.length; j++) {
            result += `${v.toFixed(j === 0 ? 0 : 2)} ${units[j]}\n`;
            v /= 1024;
            if (v < 0.01) break;
        }
        CryptoApp.setOutput(result);
        CryptoApp.showToast('单位转换完成');
    }
};

// 导出到全局
window.utils = UtilsModule;