/* ==============================================
   智能密码工具箱 v9.0 - 密码工具模块
   ============================================== */

const CryptoModule = {
    // 密钥生成
    generateKey() {
        const type = document.getElementById('keyType')?.value || 'random';
        const length = parseInt(document.getElementById('keyLength')?.value) || 32;
        
        let result = '';
        switch(type) {
            case 'random':
                result = window.CryptoHelpers.generateRandomString(length);
                break;
            case 'passphrase':
                const words = ['secure', 'password', 'crypto', 'key', 'secret', 'random', 'encrypt', 'decrypt', 'safe', 'lock'];
                for (let i = 0; i < 4; i++) {
                    result += words[Math.floor(Math.random() * words.length)];
                    if (i < 3) result += '-';
                }
                break;
            case 'uuid':
                result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                break;
            case 'otp':
                for (let i = 0; i < 6; i++) {
                    result += Math.floor(Math.random() * 10);
                }
                break;
            case 'mnemonic':
                const mnemonicWords = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honey', 'ice', 'juice'];
                for (let i = 0; i < 12; i++) {
                    result += mnemonicWords[Math.floor(Math.random() * mnemonicWords.length)];
                    if (i < 11) result += ' ';
                }
                break;
        }
        
        CryptoApp.setOutput(`🔑 生成的 ${type} 密钥:\n${result}\n\n长度: ${result.length} 字符\n类型: ${type}\n\n⚠️ 请妥善保存此密钥！`);
        CryptoApp.showToast(`${type} 密钥生成完成`);
    },
    
    saveKey() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入要保存的密钥', 'warning'); return; }
        const name = prompt('请输入密钥名称:', 'my-key-' + Date.now());
        if (!name) return;
        
        const keys = JSON.parse(localStorage.getItem('cryptoKeys') || '{}');
        keys[name] = { value: text, type: 'saved', time: new Date().toLocaleString('zh-CN') };
        localStorage.setItem('cryptoKeys', JSON.stringify(keys));
        
        CryptoApp.setOutput(`💾 密钥已保存\n\n名称: ${name}\n值: ${text.substring(0, 20)}...\n时间: ${keys[name].time}\n\n已保存密钥列表:\n${Object.keys(keys).map(k => `• ${k} (${keys[k].time})`).join('\n')}`);
        CryptoApp.showToast(`密钥 "${name}" 已保存`);
    },
    
    // 随机数生成
    generateRandom() {
        const min = parseInt(document.getElementById('randomMin')?.value) || 0;
        const max = parseInt(document.getElementById('randomMax')?.value) || 100;
        const count = parseInt(document.getElementById('randomCount')?.value) || 10;
        
        if (min >= max) {
            CryptoApp.showToast('最小值必须小于最大值', 'warning');
            return;
        }
        
        let result = `🎲 随机数生成结果\n`;
        result += `══════════════════\n\n`;
        result += `范围: ${min} - ${max}\n`;
        result += `数量: ${count}\n\n`;
        result += `随机数列表:\n`;
        
        const numbers = [];
        for (let i = 0; i < count; i++) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.push(num);
            result += `${i+1}. ${num}\n`;
        }
        
        result += `\n统计:\n`;
        result += `最小值: ${Math.min(...numbers)}\n`;
        result += `最大值: ${Math.max(...numbers)}\n`;
        result += `平均值: ${(numbers.reduce((a, b) => a + b, 0) / count).toFixed(2)}\n`;
        result += `中位数: ${numbers.sort((a, b) => a - b)[Math.floor(count/2)]}`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('随机数生成完成');
    },
    
    testRandomness() {
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要测试的内容', 'warning');
            return;
        }
        
        let result = `🔬 随机性测试报告\n`;
        result += `══════════════════\n\n`;
        result += `数据长度: ${text.length} 字符\n`;
        result += `字符集大小: ${new Set(text).size} 种\n\n`;
        result += `测试结果:\n`;
        result += `• 熵值: ${this.calculateEntropy(text).toFixed(4)} bits/字符\n`;
        result += `• 重复率: ${(this.calculateRepeatRate(text) * 100).toFixed(2)}%\n`;
        result += `• 模式检测: ${this.detectPatterns(text) ? '检测到模式' : '无明显模式'}\n`;
        result += `• 随机性评估: ${this.evaluateRandomness(text)}`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('随机性测试完成');
    },
    
    calculateEntropy(text) {
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
        return entropy;
    },
    
    calculateRepeatRate(text) {
        if (text.length < 2) return 0;
        let repeats = 0;
        for (let i = 1; i < text.length; i++) {
            if (text[i] === text[i-1]) repeats++;
        }
        return repeats / (text.length - 1);
    },
    
    detectPatterns(text) {
        if (text.length < 4) return false;
        const patterns = ['1234', 'abcd', 'qwerty', 'asdf', 'zxcv'];
        const lowerText = text.toLowerCase();
        return patterns.some(pattern => lowerText.includes(pattern));
    },
    
    evaluateRandomness(text) {
        const entropy = this.calculateEntropy(text);
        if (entropy > 4.5) return '✅ 优秀 (高熵值)';
        if (entropy > 3.5) return '🟡 良好';
        if (entropy > 2.5) return '🟡 一般';
        return '🔴 较差 (低熵值)';
    },
    
    // 文本处理
    textToUpper() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要处理的文本', 'warning');
            return;
        }
        CryptoApp.setOutput(text.toUpperCase());
        CryptoApp.showToast('已转换为大写');
        CryptoApp.addHistory('转大写', text, text.toUpperCase());
    },
    
    textToLower() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要处理的文本', 'warning');
            return;
        }
        CryptoApp.setOutput(text.toLowerCase());
        CryptoApp.showToast('已转换为小写');
        CryptoApp.addHistory('转小写', text, text.toLowerCase());
    },
    
    textReverse() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要处理的文本', 'warning');
            return;
        }
        const reversed = text.split('').reverse().join('');
        CryptoApp.setOutput(reversed);
        CryptoApp.showToast('文本已反转');
        CryptoApp.addHistory('反转文本', text, reversed);
    },
    
    textShuffle() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要处理的文本', 'warning');
            return;
        }
        const shuffled = text.split('').sort(() => Math.random() - 0.5).join('');
        CryptoApp.setOutput(shuffled);
        CryptoApp.showToast('文本已随机重排');
        CryptoApp.addHistory('随机重排', text, shuffled);
    },
    
    removeSpaces() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要处理的文本', 'warning');
            return;
        }
        const noSpaces = text.replace(/\s+/g, '');
        CryptoApp.setOutput(noSpaces);
        CryptoApp.showToast('已移除所有空格');
        CryptoApp.addHistory('移除空格', text, noSpaces);
    },
    
    removeDuplicates() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要处理的文本', 'warning');
            return;
        }
        const unique = [...new Set(text.split(''))].join('');
        CryptoApp.setOutput(unique);
        CryptoApp.showToast('已移除重复字符');
        CryptoApp.addHistory('去重', text, unique);
    },
    
    // 数字操作
    decToHex() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入十进制数字', 'warning');
            return;
        }
        
        const num = parseInt(text);
        if (isNaN(num)) {
            CryptoApp.showToast('请输入有效的十进制数字', 'error');
            return;
        }
        
        CryptoApp.setOutput(num.toString(16).toUpperCase());
        CryptoApp.showToast('十进制转十六进制完成');
        CryptoApp.addHistory('DEC→HEX', text, num.toString(16).toUpperCase());
    },
    
    hexToDec() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入十六进制数字', 'warning');
            return;
        }
        
        const num = parseInt(text, 16);
        if (isNaN(num)) {
            CryptoApp.showToast('请输入有效的十六进制数字', 'error');
            return;
        }
        
        CryptoApp.setOutput(num.toString());
        CryptoApp.showToast('十六进制转十进制完成');
        CryptoApp.addHistory('HEX→DEC', text, num.toString());
    },
    
    decToBin() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入十进制数字', 'warning');
            return;
        }
        
        const num = parseInt(text);
        if (isNaN(num)) {
            CryptoApp.showToast('请输入有效的十进制数字', 'error');
            return;
        }
        
        CryptoApp.setOutput(num.toString(2));
        CryptoApp.showToast('十进制转二进制完成');
        CryptoApp.addHistory('DEC→BIN', text, num.toString(2));
    },
    
    binToDec() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入二进制数字', 'warning');
            return;
        }
        
        const num = parseInt(text, 2);
        if (isNaN(num)) {
            CryptoApp.showToast('请输入有效的二进制数字', 'error');
            return;
        }
        
        CryptoApp.setOutput(num.toString());
        CryptoApp.showToast('二进制转十进制完成');
        CryptoApp.addHistory('BIN→DEC', text, num.toString());
    },
    
    decToBase() {
        const base = prompt('请输入目标进制 (2-36):', '16');
        if (!base) return;
        
        const baseNum = parseInt(base);
        if (isNaN(baseNum) || baseNum < 2 || baseNum > 36) {
            CryptoApp.showToast('请输入2-36之间的有效进制', 'warning');
            return;
        }
        
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入十进制数字', 'warning');
            return;
        }
        
        const num = parseInt(text);
        if (isNaN(num)) {
            CryptoApp.showToast('请输入有效的十进制数字', 'error');
            return;
        }
        
        CryptoApp.setOutput(num.toString(baseNum).toUpperCase());
        CryptoApp.showToast(`十进制转${baseNum}进制完成`);
        CryptoApp.addHistory(`DEC→BASE${baseNum}`, text, num.toString(baseNum).toUpperCase());
    },
    
    baseToDec() {
        const base = prompt('请输入当前进制 (2-36):', '16');
        if (!base) return;
        
        const baseNum = parseInt(base);
        if (isNaN(baseNum) || baseNum < 2 || baseNum > 36) {
            CryptoApp.showToast('请输入2-36之间的有效进制', 'warning');
            return;
        }
        
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入需要转换的数字', 'warning');
            return;
        }
        
        const num = parseInt(text, baseNum);
        if (isNaN(num)) {
            CryptoApp.showToast('请输入有效的数字', 'error');
            return;
        }
        
        CryptoApp.setOutput(num.toString());
        CryptoApp.showToast(`${baseNum}进制转十进制完成`);
        CryptoApp.addHistory(`BASE${baseNum}→DEC`, text, num.toString());
    },
    
    // 编码检测
    detectEncoding() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要检测的内容', 'warning');
            return;
        }
        
        const result = window.CryptoHelpers.detectEncoding(text);
        CryptoApp.setOutput(`🔍 编码检测结果:\n${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\n\n检测结果: ${result}\n\n建议: 使用"编码转换"模块进行转换`);
        CryptoApp.showToast(`检测到: ${result}`);
    },
    
    detectBase() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入需要检测的内容', 'warning');
            return;
        }
        
        let result = `🔢 进制检测结果\n`;
        result += `══════════════════\n\n`;
        result += `输入: ${text}\n\n`;
        
        const bases = {
            '二进制': /^[01]+$/,
            '八进制': /^[0-7]+$/,
            '十进制': /^[0-9]+$/,
            '十六进制': /^[0-9a-fA-F]+$/,
            'Base64': /^[A-Za-z0-9+/=]+$/
        };
        
        let detected = false;
        for (const [base, pattern] of Object.entries(bases)) {
            if (pattern.test(text)) {
                result += `✅ 可能是: ${base}\n`;
                detected = true;
            }
        }
        
        if (!detected) {
            result += `❓ 无法识别进制\n`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('进制检测完成');
    },
    
    detectPattern() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要检测的内容', 'warning'); return; }
        
        let result = '🔍 模式检测报告\n══════════════════\n\n';
        const patterns = [
            { name: '连续数字', regex: /\d{3,}/g, desc: '检测到连续数字序列' },
            { name: '连续字母', regex: /[a-zA-Z]{4,}/g, desc: '检测到连续字母序列' },
            { name: '重复字符', regex: /(.)\1{2,}/g, desc: '检测到重复字符' },
            { name: '重复模式', regex: /(.{2,})\1+/g, desc: '检测到重复模式' },
            { name: '邮箱地址', regex: /[\w.-]+@[\w.-]+\.\w+/g, desc: '检测到邮箱格式' },
            { name: 'URL地址', regex: /https?:\/\/[^\s]+/gi, desc: '检测到URL格式' },
            { name: 'IP地址', regex: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, desc: '检测到IP格式' },
            { name: '手机号码', regex: /1[3-9]\d{9}/g, desc: '检测到手机号格式' },
            { name: '十六进制', regex: /0x[0-9a-fA-F]+/g, desc: '检测到十六进制数' },
            { name: 'Base64', regex: /[A-Za-z0-9+/]{20,}={0,2}/g, desc: '可能为Base64编码' }
        ];
        
        let found = false;
        for (const p of patterns) {
            const matches = text.match(p.regex);
            if (matches && matches.length > 0) {
                result += `✅ ${p.name}: ${matches.length}处\n`;
                result += `   示例: ${matches[0].substring(0, 50)}\n\n`;
                found = true;
            }
        }
        if (!found) result += '✅ 未检测到特殊模式\n';
        
        result += `\n数据特征:\n`;
        result += `• 长度: ${text.length}\n`;
        result += `• 唯一字符: ${new Set(text).size}\n`;
        result += `• 数字占比: ${((text.match(/\d/g) || []).length / text.length * 100).toFixed(1)}%\n`;
        result += `• 字母占比: ${((text.match(/[a-zA-Z]/g) || []).length / text.length * 100).toFixed(1)}%`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('模式检测完成');
    },
    
    analyzeFrequency() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (!text) { CryptoApp.showToast('请输入需要分析的文本', 'warning'); return; }
        
        const freq = {};
        for (const c of text) freq[c] = (freq[c] || 0) + 1;
        const total = text.length;
        const englishFreq = {'E':12.7,'T':9.1,'A':8.2,'O':7.5,'I':7.0,'N':6.7,'S':6.3,'H':6.1,'R':6.0,'D':4.3,'L':4.0,'C':2.8,'U':2.8,'M':2.4,'W':2.4,'F':2.2,'G':2.0,'Y':2.0,'P':1.9,'B':1.5,'V':1.0,'K':0.8,'J':0.2,'X':0.2,'Q':0.1,'Z':0.1};
        
        let result = '📈 频率分析报告\n══════════════════\n\n';
        result += `总字母数: ${total}\n\n`;
        result += '字母  次数  占比    英文标准  差异\n';
        result += '──── ───── ─────── ──────── ──────\n';
        
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        for (const [letter, count] of sorted) {
            const pct = (count / total * 100).toFixed(1);
            const eng = englishFreq[letter] || 0;
            const diff = (pct - eng).toFixed(1);
            const bar = '█'.repeat(Math.floor(pct / 1.5));
            result += `  ${letter}   ${String(count).padStart(4)}  ${pct.padStart(5)}%  ${String(eng).padStart(6)}%  ${diff > 0 ? '+' : ''}${diff}%  ${bar}\n`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('频率分析完成');
    },
    
    entropyAnalysis() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要分析的内容', 'warning'); return; }
        
        const freq = {};
        for (const c of text) freq[c] = (freq[c] || 0) + 1;
        let entropy = 0;
        for (const c in freq) { const p = freq[c] / text.length; entropy -= p * Math.log2(p); }
        const maxEntropy = Math.log2(new Set(text).size) || 1;
        const efficiency = (entropy / maxEntropy * 100).toFixed(1);
        
        let result = '📊 熵分析报告\n══════════════════\n\n';
        result += `数据长度: ${text.length} 字符\n`;
        result += `唯一字符: ${new Set(text).size} 种\n`;
        result += `信息熵: ${entropy.toFixed(4)} bits/字符\n`;
        result += `最大熵: ${maxEntropy.toFixed(4)} bits/字符\n`;
        result += `熵效率: ${efficiency}%\n`;
        result += `总信息量: ${(entropy * text.length / 8).toFixed(0)} 字节\n\n`;
        result += `评估:\n`;
        if (entropy > 4.5) result += '🔴 高熵 → 可能是加密数据/压缩数据/随机字符串\n';
        else if (entropy > 3.0) result += '🟡 中等熵 → 可能是代码/结构化数据\n';
        else result += '🟢 低熵 → 可能是自然语言文本/规律数据\n';
        
        const redun = ((1 - entropy / (Math.log2(128) || 7)) * 100).toFixed(1);
        result += `冗余度: ${redun}%`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('熵分析完成');
    },
    
    // 时间工具
    timestampToDate() {
        const timestamp = document.getElementById('unixTimestamp')?.value || CryptoApp.dom.inputText.value.trim();
        if (!timestamp) {
            CryptoApp.showToast('请输入Unix时间戳', 'warning');
            return;
        }
        
        const ts = parseInt(timestamp);
        if (isNaN(ts)) {
            CryptoApp.showToast('请输入有效的时间戳', 'error');
            return;
        }
        
        const date = new Date(ts * 1000);
        const formatted = date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        CryptoApp.setOutput(`⏰ 时间戳转日期\n\n时间戳: ${ts}\n\n转换结果:\n${formatted}\n\nISO格式: ${date.toISOString()}\nUTC时间: ${date.toUTCString()}`);
        CryptoApp.showToast('时间戳转日期完成');
        CryptoApp.addHistory('时间戳转日期', timestamp, formatted);
    },
    
    dateToTimestamp() {
        const dateInput = document.getElementById('datetimeInput')?.value || CryptoApp.dom.inputText.value.trim();
        if (!dateInput) {
            CryptoApp.showToast('请输入日期时间', 'warning');
            return;
        }
        
        let date;
        if (dateInput.includes('T')) {
            date = new Date(dateInput);
        } else {
            date = new Date(dateInput);
        }
        
        if (isNaN(date.getTime())) {
            CryptoApp.showToast('请输入有效的日期时间', 'error');
            return;
        }
        
        const timestamp = Math.floor(date.getTime() / 1000);
        
        CryptoApp.setOutput(`📅 日期转时间戳\n\n日期: ${date.toLocaleString('zh-CN')}\n\n转换结果:\nUnix时间戳: ${timestamp}\n毫秒时间戳: ${date.getTime()}\n\nISO格式: ${date.toISOString()}`);
        CryptoApp.showToast('日期转时间戳完成');
        CryptoApp.addHistory('日期转时间戳', dateInput, timestamp.toString());
    },
    
    currentTimestamp() {
        const now = new Date();
        const timestamp = Math.floor(now.getTime() / 1000);
        
        CryptoApp.setOutput(`🕐 当前时间戳\n\n当前时间: ${now.toLocaleString('zh-CN')}\nUnix时间戳: ${timestamp}\n毫秒时间戳: ${now.getTime()}\n\nISO格式: ${now.toISOString()}\nUTC时间: ${now.toUTCString()}`);
        CryptoApp.showToast('已获取当前时间戳');
        CryptoApp.addHistory('当前时间戳', '', timestamp.toString());
    },
    
    formatTime() {
        const text = CryptoApp.dom.inputText.value.trim();
        let date;
        
        if (!text) {
            date = new Date();
        } else {
            const ts = parseInt(text);
            if (!isNaN(ts)) {
                date = new Date(ts * 1000);
            } else {
                date = new Date(text);
            }
        }
        
        if (isNaN(date.getTime())) {
            CryptoApp.showToast('无法解析时间', 'error');
            return;
        }
        
        const formats = {
            '本地时间': date.toLocaleString('zh-CN'),
            'ISO格式': date.toISOString(),
            'UTC时间': date.toUTCString(),
            '日期部分': date.toLocaleDateString('zh-CN'),
            '时间部分': date.toLocaleTimeString('zh-CN'),
            '时间戳': Math.floor(date.getTime() / 1000)
        };
        
        let result = `📊 时间格式化结果\n`;
        result += `══════════════════\n\n`;
        
        for (const [format, value] of Object.entries(formats)) {
            result += `${format}: ${value}\n`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('时间格式化完成');
    },
    
    // 数学计算工具
    calculatePrime() {
        const n = parseInt(CryptoApp.dom.inputText.value);
        if (isNaN(n) || n < 2) { CryptoApp.showToast('请输入≥2的整数', 'warning'); return; }
        
        const isPrime = (x) => { if (x < 2) return false; if (x === 2) return true; if (x % 2 === 0) return false; for (let i = 3; i <= Math.sqrt(x); i += 2) { if (x % i === 0) return false; } return true; };
        const sieve = (max) => { const p = Array(max + 1).fill(true); p[0] = p[1] = false; for (let i = 2; i * i <= max; i++) { if (p[i]) for (let j = i * i; j <= max; j += i) p[j] = false; } return p.map((v, i) => v ? i : null).filter(Boolean); };
        
        let result = `🔢 质数计算\n══════════════════\n\n`;
        result += `输入: ${n}\n`;
        result += `是否为质数: ${isPrime(n) ? '✅ 是' : '❌ 否'}\n`;
        
        if (!isPrime(n)) {
            const factors = [];
            let tmp = n;
            for (let i = 2; i <= tmp; i++) { while (tmp % i === 0) { factors.push(i); tmp /= i; } }
            result += `质因数分解: ${factors.join(' × ')}\n`;
        }
        
        const primes = sieve(Math.min(n, 10000));
        result += `\n≤${n}的质数个数: ${primes.length}\n`;
        result += `最近的质数: ${primes.filter(p => p <= n).pop()}`;
        if (primes.some(p => p > n)) result += ` / 下一个质数: ${primes.find(p => p > n)}`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('质数计算完成');
    },
    
    calculateGcd() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入两个数(用空格或逗号分隔)', 'warning'); return; }
        const nums = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        if (nums.length < 2) { CryptoApp.showToast('请输入至少两个数', 'warning'); return; }
        
        const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
        const result = nums.reduce(gcd);
        
        CryptoApp.setOutput(`🔢 最大公约数 (GCD)\n══════════════════\n\n输入: ${nums.join(', ')}\nGCD = ${result}\n\n过程: ${nums.join(', ')} → GCD = ${result}\n\n互质判断: ${result === 1 ? '✅ 互质' : '❌ 不互质'}`);
        CryptoApp.showToast(`GCD = ${result}`);
        CryptoApp.addHistory('GCD计算', text, result.toString());
    },
    
    calculateLcm() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入两个数(用空格或逗号分隔)', 'warning'); return; }
        const nums = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0);
        if (nums.length < 2) { CryptoApp.showToast('请输入至少两个正整数', 'warning'); return; }
        
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const lcm = (a, b) => a / gcd(a, b) * b;
        const result = nums.reduce(lcm);
        
        CryptoApp.setOutput(`🔢 最小公倍数 (LCM)\n══════════════════\n\n输入: ${nums.join(', ')}\nLCM = ${result}\n\n验证: ${nums.map(n => `${result}÷${n}=${result/n}`).join(', ')}`);
        CryptoApp.showToast(`LCM = ${result}`);
        CryptoApp.addHistory('LCM计算', text, result.toString());
    },
    
    calculateMod() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入 a 和 n (求 a mod n)，用空格分隔', 'warning'); return; }
        const [a, n] = text.split(/[\s,]+/).map(Number);
        if (isNaN(a) || isNaN(n) || n === 0) { CryptoApp.showToast('请输入有效数字且n≠0', 'warning'); return; }
        const result = ((a % n) + Math.abs(n)) % Math.abs(n);
        
        CryptoApp.setOutput(`🔢 模运算\n══════════════════\n\n${a} mod ${n} = ${result}\n\n商: ${Math.floor(a / n)}\n余数: ${result}\n验证: ${Math.floor(a / n)} × ${n} + ${result} = ${Math.floor(a / n) * n + result}`);
        CryptoApp.showToast(`${a} mod ${n} = ${result}`);
    },
    
    calculatePow() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入底数和指数(空格分隔)，可选模数', 'warning'); return; }
        const parts = text.split(/[\s,]+/).map(Number);
        const [base, exp, mod] = parts;
        if (isNaN(base) || isNaN(exp)) { CryptoApp.showToast('请输入有效的底数和指数', 'warning'); return; }
        
        let result, label;
        if (!isNaN(mod) && mod > 0) {
            // 模幂运算
            result = 1n; let b = BigInt(base) % BigInt(mod); let e = BigInt(exp);
            while (e > 0n) { if (e & 1n) result = result * b % BigInt(mod); b = b * b % BigInt(mod); e >>= 1n; }
            label = `${base}^${exp} mod ${mod}`;
            CryptoApp.setOutput(`🔢 模幂运算\n══════════════════\n\n${base}^${exp} mod ${mod} = ${result}\n\n⚠️ 使用快速幂算法`);
        } else {
            if (exp > 1000) { CryptoApp.showToast('指数过大，请加模数', 'warning'); return; }
            result = BigInt(base) ** BigInt(exp);
            const str = result.toString();
            label = `${base}^${exp}`;
            CryptoApp.setOutput(`🔢 幂运算\n══════════════════\n\n${base}^${exp} = ${str.length > 500 ? str.substring(0, 500) + '...' : str}\n\n位数: ${str.length}`);
        }
        CryptoApp.showToast(`${label} 计算完成`);
    },
    
    calculateSqrt() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入数字', 'warning'); return; }
        const n = parseFloat(text);
        if (isNaN(n) || n < 0) { CryptoApp.showToast('请输入非负数', 'warning'); return; }
        
        const result = Math.sqrt(n);
        const isInt = Number.isInteger(result);
        CryptoApp.setOutput(`🔢 平方根计算\n══════════════════\n\n√${n} = ${result}\n\n${isInt ? `✅ 完全平方数: ${n} = ${Math.round(result)}²` : `❌ 非完全平方数\n近似整数根: ${Math.floor(result)} (余: ${(n - Math.floor(result)**2).toFixed(4)})`}\n\n其他根:\n• ³√${n} = ${Math.cbrt(n).toFixed(6)}\n• ⁴√${n} = ${Math.pow(n, 0.25).toFixed(6)}`);
        CryptoApp.showToast(`√${n} = ${result.toFixed(4)}`);
    },
    
    // 文件工具（浏览器端仅演示）
    splitFile() {
        CryptoApp.setOutput('📂 文件分割\n══════════════════\n\n⚠️ 浏览器端文件操作受限\n\n使用方法:\n1. 点击"选择文件"上传文件\n2. 设置分块大小（如 1MB）\n3. 自动分割为多个分块\n4. 下载各分块文件\n\n命令行替代:\nsplit -b 1M largefile.bin part_\ncopy /b part_* merged.bin  (Windows合并)');
        CryptoApp.showToast('文件分割需要文件输入支持', 'info');
    },
    
    mergeFile() {
        CryptoApp.setOutput('📂 文件合并\n══════════════════\n\n⚠️ 浏览器端文件操作受限\n\n使用方法:\n1. 按顺序选择多个分块文件\n2. 自动合并为完整文件\n3. 下载合并后的文件\n\n命令行替代:\nLinux/Mac: cat part_* > merged.bin\nWindows:  copy /b part_* merged.bin');
        CryptoApp.showToast('文件合并需要文件输入支持', 'info');
    },
    
    compressFile() {
        CryptoApp.setOutput('📦 文件压缩\n══════════════════\n\n⚠️ 浏览器端压缩受限\n\n推荐工具:\n• zip / unzip\n• gzip / gunzip\n• 7z (7-Zip)\n• tar.gz\n\n前端压缩库:\n• pako.js (gzip/deflate)\n• JSZip (ZIP格式)\n• fflate (高性能)');
        CryptoApp.showToast('文件压缩需要第三方库', 'info');
    },
    
    decompressFile() {
        CryptoApp.setOutput('📦 文件解压\n══════════════════\n\n⚠️ 浏览器端解压受限\n\n推荐工具:\n• unzip\n• gunzip\n• 7z\n\n前端解压库:\n• pako.js (gzip/deflate)\n• JSZip (ZIP格式)\n• fflate (高性能)');
        CryptoApp.showToast('文件解压需要第三方库', 'info');
    },
    
    encryptFile() {
        CryptoApp.setOutput('🔐 文件加密\n══════════════════\n\n⚠️ 浏览器端文件加密需要读取文件\n\n支持的方案:\n• AES-256-GCM (推荐)\n• ChaCha20-Poly1305\n• AES-256-CBC\n\n使用方法:\n1. 选择文件\n2. 输入密码\n3. 选择加密算法\n4. 下载加密文件\n\n命令行替代:\nopenssl enc -aes-256-cbc -salt -in file.txt -out file.enc');
        CryptoApp.showToast('文件加密需要文件输入', 'info');
    },
    
    decryptFile() {
        CryptoApp.setOutput('🔓 文件解密\n══════════════════\n\n⚠️ 浏览器端文件解密需要读取文件\n\n命令行替代:\nopenssl enc -aes-256-cbc -d -in file.enc -out file.txt');
        CryptoApp.showToast('文件解密需要文件输入', 'info');
    },
    
    // 网络工具
    ipConvert() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入IP地址或整数', 'warning'); return; }
        
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(text)) {
            const parts = text.split('.').map(Number);
            const num = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0;
            const binary = parts.map(p => p.toString(2).padStart(8, '0')).join('.');
            const hex = parts.map(p => p.toString(16).padStart(2, '0')).join('.');
            const octal = parts.map(p => p.toString(8).padStart(3, '0')).join('.');
            
            CryptoApp.setOutput(`🌐 IP地址转换\n══════════════════\n\n输入: ${text}\n\n十进制: ${num}\n二进制: ${binary}\n十六进制: ${hex}\n八进制: ${octal}\n\n特殊格式:\n• http://${num}/ (十进制URL)\n• 0x${(num >>> 0).toString(16)} (十六进制)`);
        } else {
            const num = parseInt(text);
            if (isNaN(num)) { CryptoApp.showToast('请输入有效的IP或数字', 'error'); return; }
            const ip = [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
            CryptoApp.setOutput(`🌐 IP地址转换\n══════════════════\n\n整数: ${num}\nIP地址: ${ip}\n十六进制: 0x${(num >>> 0).toString(16)}`);
        }
        CryptoApp.showToast('IP转换完成');
    },
    
    macConvert() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入MAC地址', 'warning'); return; }
        
        const clean = text.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
        if (clean.length !== 12) { CryptoApp.showToast('MAC地址应为12个十六进制字符', 'warning'); return; }
        
        const formats = {
            '冒号分隔': clean.match(/.{2}/g).join(':'),
            '短横分隔': clean.match(/.{2}/g).join('-'),
            '点分隔': clean.match(/.{4}/g).join('.'),
            '无分隔': clean,
            'Cisco格式': clean.match(/.{4}/g).join('.').toLowerCase()
        };
        
        let result = `🔗 MAC地址转换\n══════════════════\n\n`;
        for (const [fmt, val] of Object.entries(formats)) result += `${fmt}: ${val}\n`;
        result += `\nOUI(厂商标识): ${clean.substring(0, 6)}`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('MAC转换完成');
    },
    
    urlParse() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入URL', 'warning'); return; }
        try {
            const url = new URL(text.startsWith('http') ? text : 'https://' + text);
            let result = `🔗 URL解析结果\n══════════════════\n\n`;
            result += `协议: ${url.protocol}\n`;
            result += `主机: ${url.hostname}\n`;
            result += `端口: ${url.port || '(默认)'}\n`;
            result += `路径: ${url.pathname}\n`;
            result += `查询: ${url.search || '(无)'}\n`;
            result += `哈希: ${url.hash || '(无)'}\n`;
            result += `完整: ${url.href}\n`;
            if (url.searchParams.toString()) {
                result += `\n查询参数:\n`;
                for (const [k, v] of url.searchParams) result += `• ${k} = ${v}\n`;
            }
            CryptoApp.setOutput(result);
            CryptoApp.showToast('URL解析完成');
        } catch (e) {
            CryptoApp.setOutput(`URL解析失败: ${e.message}`);
            CryptoApp.showToast('解析失败', 'error');
        }
    },
    
    dnsLookup() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入域名', 'warning'); return; }
        CryptoApp.setOutput(`🌐 DNS查询\n══════════════════\n\n域名: ${text}\n\n⚠️ 浏览器无法直接进行DNS查询\n\n在线工具:\n• nslookup.io\n• dnsdumpster.com\n• viewdns.info\n\n命令行:\n• nslookup ${text}\n• dig ${text}\n• host ${text}`);
        CryptoApp.showToast('DNS查询需要命令行工具', 'info');
    },
    
    whois() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入域名或IP', 'warning'); return; }
        CryptoApp.setOutput(`🔍 Whois查询\n══════════════════\n\n查询目标: ${text}\n\n⚠️ 浏览器无法直接Whois查询\n\n在线工具:\n• whois.domaintools.com\n• whois.com\n• icann.org/lookup\n\n命令行:\n• whois ${text}`);
        CryptoApp.showToast('Whois需要在线工具', 'info');
    },
    
    // 密码学工具
    oneTimePad() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要加密的文本', 'warning'); return; }
        const bytes = new TextEncoder().encode(text);
        const key = new Uint8Array(bytes.length);
        crypto.getRandomValues(key);
        
        const encrypted = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) encrypted[i] = bytes[i] ^ key[i];
        
        const keyHex = Array.from(key).map(b => b.toString(16).padStart(2, '0')).join(' ');
        const encHex = Array.from(encrypted).map(b => b.toString(16).padStart(2, '0')).join(' ');
        
        CryptoApp.setOutput(`🔐 一次一密 (OTP)\n══════════════════\n\n明文: ${text}\n\n密钥 (Hex):\n${keyHex}\n\n密文 (Hex):\n${encHex}\n\n⚠️ 密钥与明文等长，仅使用一次！\n请安全保存密钥用于解密。`);
        CryptoApp.showToast('一次一密加密完成');
    },
    
    steganography() {
        CryptoApp.setOutput('🕵️ 隐写术工具\n══════════════════\n\n请使用"隐写分析"模块\n支持:\n• 零宽字符隐写\n• 空格隐写\n• Tab隐写\n• LSB图片隐写 (需图片)');
        CryptoApp.showToast('请使用隐写分析模块', 'info');
    },
    
    watermark() {
        CryptoApp.setOutput('💧 数字水印\n══════════════════\n\n数字水印类型:\n• 可见水印 - 直接叠加\n• 不可见水印 - LSB/DCT/DWT\n• 鲁棒水印 - 抗攻击\n• 脆弱水印 - 完整性验证\n\n建议: 使用专业水印工具');
        CryptoApp.showToast('数字水印需要专业库', 'info');
    },
    
    digitalSignature() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要签名的内容', 'warning'); return; }
        const signature = Array.from(new Uint8Array(32)).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
        
        CryptoApp.setOutput(`✍️ 数字签名\n══════════════════\n\n消息: ${text.substring(0, 50)}...\n算法: HMAC-SHA256\n签名: ${signature}\n\n⚠️ 此为演示签名，非真实数字签名\n真实签名需要RSA/ECDSA私钥`);
        CryptoApp.showToast('数字签名演示完成');
    },
    
    certificate() {
        CryptoApp.setOutput('📜 数字证书工具\n══════════════════\n\n证书格式:\n• PEM (Base64编码)\n• DER (二进制)\n• P12/PFX (含私钥)\n• P7B (证书链)\n\n常用命令:\nopenssl x509 -in cert.pem -text -noout\nopenssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out cert.pem\nopenssl pkcs12 -export -out cert.pfx -inkey key.pem -in cert.pem');
        CryptoApp.showToast('证书工具信息', 'info');
    },
    
    qrCode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入二维码内容', 'warning'); return; }
        CryptoApp.setOutput(`📱 二维码生成\n══════════════════\n\n内容: ${text}\n长度: ${text.length} 字符\n\n⚠️ 浏览器端可使用qrcode.js库生成\n\n在线工具:\n• qr-code-generator.com\n• the-qrcode-generator.com\n\n推荐库:\n• qrcode.js\n• qr-code-styling`);
        CryptoApp.showToast('二维码需要第三方库', 'info');
    },
    
    barcode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入条形码内容', 'warning'); return; }
        CryptoApp.setOutput(`📊 条形码生成\n══════════════════\n\n内容: ${text}\n\n常见编码:\n• EAN-13 (商品条码, 13位)\n• Code 128 (通用, ASCII)\n• Code 39 (字母数字)\n• UPC-A (美国商品)\n\n推荐库: JsBarcode`);
        CryptoApp.showToast('条形码需要第三方库', 'info');
    },
    
    checksum() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算校验和的内容', 'warning'); return; }
        const bytes = new TextEncoder().encode(text);
        
        // 计算多种校验和
        let sum8 = 0, sum16 = 0, sum32 = 0;
        for (let i = 0; i < bytes.length; i++) {
            sum8 = (sum8 + bytes[i]) & 0xFF;
            if (i % 2 === 0 && i + 1 < bytes.length) sum16 = (sum16 + (bytes[i] << 8 | bytes[i + 1])) & 0xFFFF;
            sum32 = (sum32 + bytes[i]) >>> 0;
        }
        sum8 = (~sum8 + 1) & 0xFF;
        
        // CRC32
        let crc = 0xFFFFFFFF;
        const table = [];
        for (let i = 0; i < 256; i++) { let c = i; for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; table[i] = c; }
        for (const b of bytes) crc = table[(crc ^ b) & 0xFF] ^ (crc >>> 8);
        crc = (crc ^ 0xFFFFFFFF) >>> 0;
        
        CryptoApp.setOutput(`✔️ 校验和计算\n══════════════════\n\n输入长度: ${text.length} 字符 / ${bytes.length} 字节\n\n校验和:\n• Checksum8:  0x${sum8.toString(16).toUpperCase().padStart(2, '0')}\n• Checksum16: 0x${sum16.toString(16).toUpperCase().padStart(4, '0')}\n• Checksum32: 0x${sum32.toString(16).toUpperCase().padStart(8, '0')}\n• CRC32:      0x${crc.toString(16).toUpperCase().padStart(8, '0')}\n• XOR:        0x${bytes.reduce((a, b) => a ^ b, 0).toString(16).toUpperCase().padStart(2, '0')}`);
        CryptoApp.showToast('校验和计算完成');
    },
    
    dataSize() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入数字(可选单位)', 'warning'); return; }
        
        const match = text.match(/^([\d.]+)\s*([KMGTPE]?B|B|b|KB|MB|GB|TB|PB)?$/i);
        if (!match) { CryptoApp.showToast('格式: 数字[单位] 如 1024MB', 'warning'); return; }
        
        const value = parseFloat(match[1]);
        const unit = (match[2] || 'B').toUpperCase();
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
        const base = unit.endsWith('B') && unit !== 'B' ? 1024 : 1;
        const unitIdx = units.indexOf(unit);
        const bytes = value * Math.pow(1024, unitIdx >= 0 ? unitIdx : 0);
        
        let result = `📏 数据大小转换\n══════════════════\n\n输入: ${value} ${unit}\n\n`;
        for (const u of units) {
            const v = bytes / Math.pow(1024, units.indexOf(u));
            if (v >= 0.01 && v < 1024 * 1024) result += `${u.padEnd(3)}: ${v.toFixed(v < 1 ? 4 : 2)}\n`;
        }
        result += `\n位(bit): ${(bytes * 8).toFixed(0)}`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('数据大小转换完成');
    },
    
    colorConvert() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入颜色值 (HEX/RGB/HSL)', 'warning'); return; }
        
        let r, g, b;
        if (/^#?[0-9a-fA-F]{6}$/.test(text.replace('#', ''))) {
            const hex = text.replace('#', '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (/^rgb/i.test(text)) {
            const m = text.match(/(\d+)/g);
            if (m && m.length >= 3) { r = parseInt(m[0]); g = parseInt(m[1]); b = parseInt(m[2]); }
        } else {
            CryptoApp.showToast('格式: #RRGGBB 或 rgb(r,g,b)', 'warning'); return;
        }
        
        if (r === undefined) { CryptoApp.showToast('无法解析颜色', 'error'); return; }
        
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2 / 255;
        let h = 0, s = 0;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (510 - max - min) : d / (max + min);
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            else if (max === g) h = ((b - r) / d + 2) / 6;
            else h = ((r - g) / d + 4) / 6;
        }
        
        CryptoApp.setOutput(`🎨 颜色转换\n══════════════════\n\n预览: ■ RGB(${r},${g},${b})\n\nHEX: #${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)\n\n十进制: ${r*65536+g*256+b}\nCMYK: C:${((255-r)/255*100).toFixed(0)}% M:${((255-g)/255*100).toFixed(0)}% Y:${((255-b)/255*100).toFixed(0)}% K:${(min/255*100).toFixed(0)}%\n\nCSS: rgb(${r} ${g} ${b})`);
        CryptoApp.showToast('颜色转换完成');
    }
};

// 导出到全局 - 使用 cryptoTools 避免覆盖浏览器原生 window.crypto (Web Crypto API)
window.cryptoTools = CryptoModule;