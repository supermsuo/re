/* ==============================================
   智能密码工具箱 v9.0 - 古典密码模块
   ============================================== */

const ClassicModule = {
    // 凯撒密码
    caeEn() {
        const shift = parseInt(document.getElementById('shift')?.value) || 3;
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            if (/[a-z]/.test(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 97 + shift) % 26 + 97);
            } else if (/[A-Z]/.test(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`凯撒加密完成 (位移:${shift})`);
        CryptoApp.addHistory('凯撒加密', text, result);
    },
    
    caeDe() {
        const shift = parseInt(document.getElementById('shift')?.value) || 3;
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            if (/[a-z]/.test(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 97 - shift + 26) % 26 + 97);
            } else if (/[A-Z]/.test(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 65 - shift + 26) % 26 + 65);
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`凯撒解密完成 (位移:${shift})`);
        CryptoApp.addHistory('凯撒解密', text, result);
    },
    
    caeCrack() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要破解的内容', 'warning');
            return;
        }
        
        const commonWords = ["THE", "AND", "FOR", "YOU", "THAT", "THIS", "WITH", "HAVE", "FROM"];
        let results = [];
        
        for (let shift = 1; shift <= 25; shift++) {
            let decrypted = '';
            for (let c of text) {
                decrypted += String.fromCharCode((c.charCodeAt(0) - 65 - shift + 26) % 26 + 65);
            }
            
            let score = 0;
            for (let word of commonWords) {
                if (decrypted.includes(word)) score++;
            }
            
            if (score > 0) {
                results.push({ shift, score, text: decrypted });
            }
        }
        
        results.sort((a, b) => b.score - a.score);
        
        let result = "🔓 凯撒密码智能破解\n";
        result += "══════════════════\n\n";
        
        if (results.length > 0) {
            results.slice(0, 5).forEach((r, i) => {
                result += `${i+1}. 位移 ${r.shift} (匹配度:${r.score}): ${r.text.substring(0, 50)}...\n`;
            });
            CryptoApp.setOutput(results[0].text);
            CryptoApp.showToast(`找到 ${results.length} 个可能结果`);
            CryptoApp.addHistory('凯撒破解', text, results[0].text);
        } else {
            result += "未找到可能的解密结果\n";
            result += "尝试所有位移:\n";
            for (let shift = 1; shift <= 25; shift++) {
                let decrypted = '';
                for (let c of text) {
                    decrypted += String.fromCharCode((c.charCodeAt(0) - 65 - shift + 26) % 26 + 65);
                }
                result += `位移 ${shift}: ${decrypted.substring(0, 30)}...\n`;
            }
            CryptoApp.showToast("未找到匹配结果", "warning");
        }
        
        CryptoApp.setOutput(result);
    },
    
    // 其他古典密码函数
    atbash() {
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要转换的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            if (/[a-z]/.test(c)) {
                result += String.fromCharCode(122 - (c.charCodeAt(0) - 97));
            } else if (/[A-Z]/.test(c)) {
                result += String.fromCharCode(90 - (c.charCodeAt(0) - 65));
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast("Atbash转换完成");
        CryptoApp.addHistory('Atbash转换', text, result);
    },
    
    rot13() {
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要转换的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            if (/[a-z]/.test(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 97 + 13) % 26 + 97);
            } else if (/[A-Z]/.test(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 65 + 13) % 26 + 65);
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast("ROT13转换完成");
        CryptoApp.addHistory('ROT13转换', text, result);
    },
    
    rot47() {
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要转换的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            const code = c.charCodeAt(0);
            if (code >= 33 && code <= 126) {
                result += String.fromCharCode(33 + ((code - 33 + 47) % 94));
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast("ROT47转换完成");
        CryptoApp.addHistory('ROT47转换', text, result);
    },
    
    // 博福特密码（对称：加密=解密）
    beau() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        const key = (document.getElementById('vigenereKey')?.value || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) { CryptoApp.showToast('请输入需要处理的文本', 'warning'); return; }
        if (!key) { CryptoApp.showToast('请输入有效的密钥', 'warning'); return; }
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const keyChar = key.charCodeAt(i % key.length) - 65;
            const textChar = text.charCodeAt(i) - 65;
            result += String.fromCharCode((keyChar - textChar + 26) % 26 + 65);
        }
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`博福特密码处理完成 (密钥:"${key}")`);
        CryptoApp.addHistory('博福特密码', text, result);
    },
    
    // 维吉尼亚密码破解
    vigCrack() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (!text) { CryptoApp.showToast('请输入需要破解的密文', 'warning'); return; }
        if (text.length < 20) { CryptoApp.showToast('密文太短，无法有效分析', 'warning'); return; }
        
        // 使用Kasiski测试估算密钥长度
        const findRepeatedSeqs = (str, len) => {
            const seqs = {};
            for (let i = 0; i <= str.length - len; i++) {
                const seq = str.substring(i, i + len);
                if (!seqs[seq]) seqs[seq] = [];
                seqs[seq].push(i);
            }
            return Object.entries(seqs).filter(([, pos]) => pos.length > 1);
        };
        
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        
        // 收集间距的GCD因子
        const factorCounts = {};
        for (let len = 3; len <= 5; len++) {
            const seqs = findRepeatedSeqs(text, len);
            for (const [, positions] of seqs) {
                for (let i = 1; i < positions.length; i++) {
                    const dist = positions[i] - positions[0];
                    for (let f = 2; f <= Math.min(20, dist); f++) {
                        if (dist % f === 0) {
                            factorCounts[f] = (factorCounts[f] || 0) + 1;
                        }
                    }
                }
            }
        }
        
        // 排序得到最可能的密钥长度
        const keyLengths = Object.entries(factorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([len]) => parseInt(len));
        
        if (keyLengths.length === 0) keyLengths.push(3, 4, 5);
        
        const englishFreq = [0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015,
            0.06094, 0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749,
            0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758,
            0.00978, 0.02360, 0.00150, 0.01974, 0.00074];
        
        const chiSquared = (observed, expected) => {
            let chi = 0;
            for (let i = 0; i < 26; i++) {
                const exp = expected[i] * observed.reduce((a, b) => a + b, 0);
                if (exp > 0) chi += Math.pow(observed[i] - exp, 2) / exp;
            }
            return chi;
        };
        
        const crackWithLength = (keyLen) => {
            const key = [];
            for (let i = 0; i < keyLen; i++) {
                let bestShift = 0, bestChi = Infinity;
                for (let shift = 0; shift < 26; shift++) {
                    const freq = new Array(26).fill(0);
                    for (let j = i; j < text.length; j += keyLen) {
                        const dec = (text.charCodeAt(j) - 65 - shift + 26) % 26;
                        freq[dec]++;
                    }
                    const chi = chiSquared(freq, englishFreq);
                    if (chi < bestChi) { bestChi = chi; bestShift = shift; }
                }
                key.push(String.fromCharCode(bestShift + 65));
            }
            return key.join('');
        };
        
        const decryptVig = (ct, key) => {
            let result = '';
            for (let i = 0; i < ct.length; i++) {
                const t = ct.charCodeAt(i) - 65;
                const k = key.charCodeAt(i % key.length) - 65;
                result += String.fromCharCode((t - k + 26) % 26 + 65);
            }
            return result;
        };
        
        let result = '🔓 维吉尼亚密码破解结果\n══════════════════\n\n';
        
        const commonWords = ["THE", "AND", "FOR", "ARE", "BUT", "NOT", "YOU", "ALL", "CAN", "HER", "WAS", "ONE", "OUR"];
        let bestResults = [];
        
        for (const keyLen of keyLengths.slice(0, 4)) {
            const key = crackWithLength(keyLen);
            const decrypted = decryptVig(text, key);
            let score = 0;
            for (const w of commonWords) { if (decrypted.includes(w)) score++; }
            bestResults.push({ keyLen, key, decrypted, score });
        }
        
        bestResults.sort((a, b) => b.score - a.score);
        
        bestResults.slice(0, 5).forEach((r, i) => {
            result += `${i + 1}. 密钥长度:${r.keyLen} 密钥:"${r.key}" (匹配度:${r.score})\n   ${r.decrypted.substring(0, 60)}...\n\n`;
        });
        
        const best = bestResults[0];
        if (best && best.score > 0) {
            CryptoApp.setOutput(best.decrypted);
            result += `\n✅ 最佳密钥: "${best.key}" (长度:${best.keyLen})`;
            CryptoApp.showToast(`破解成功，密钥可能是 "${best.key}"`);
            CryptoApp.addHistory('维吉尼亚破解', text, best.key);
        } else {
            result += '⚠️ 未找到明确结果，请尝试更长的密文';
            CryptoApp.setOutput(result);
            CryptoApp.showToast('破解结果不确定', 'warning');
        }
    },
    
    // 栅栏密码加密（简单分组型，非曲栅）
    fenceEn() {
        const text = CryptoApp.dom.inputText.value;
        const rails = parseInt(document.getElementById('railFenceRails')?.value) || 3;
        if (!text) { CryptoApp.showToast('请输入需要加密的内容', 'warning'); return; }
        if (rails < 2) { CryptoApp.showToast('栅栏数必须≥2', 'warning'); return; }
        
        // 简单栅栏：按行分组，每行长度=ceil(text.length/rails)
        const cols = Math.ceil(text.length / rails);
        const grid = [];
        for (let r = 0; r < rails; r++) {
            grid.push(text.substring(r * cols, (r + 1) * cols));
        }
        const result = grid.join('');
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`栅栏加密完成 (${rails}栏)`);
        CryptoApp.addHistory('栅栏加密', text, result);
    },
    
    // 栅栏密码解密（简单分组型）
    fenceDe() {
        const text = CryptoApp.dom.inputText.value;
        const rails = parseInt(document.getElementById('railFenceRails')?.value) || 3;
        if (!text) { CryptoApp.showToast('请输入需要解密的内容', 'warning'); return; }
        if (rails < 2) { CryptoApp.showToast('栅栏数必须≥2', 'warning'); return; }
        
        const cols = Math.ceil(text.length / rails);
        const remainder = text.length % rails || rails;
        const rows = [];
        let idx = 0;
        for (let r = 0; r < rails; r++) {
            const len = r < remainder || remainder === rails ? cols : cols - 1;
            rows.push(text.substring(idx, idx + len));
            idx += len;
        }
        
        let result = '';
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rails; r++) {
                if (c < rows[r].length) result += rows[r][c];
            }
        }
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`栅栏解密完成 (${rails}栏)`);
        CryptoApp.addHistory('栅栏解密', text, result);
    },
    
    // 曲栅密码（W形曲栅，加密+解密切换）
    railFence() {
        const text = CryptoApp.dom.inputText.value;
        const rails = parseInt(document.getElementById('railFenceRails')?.value) || 3;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        if (rails < 2) { CryptoApp.showToast('栅栏数必须≥2', 'warning'); return; }
        
        // W形曲栅加密
        const rail = Array.from({ length: rails }, () => []);
        let dir = 1, cur = 0;
        for (const ch of text) {
            rail[cur].push(ch);
            if (cur === 0) dir = 1;
            if (cur === rails - 1) dir = -1;
            cur += dir;
        }
        const result = rail.flat().join('');
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`曲栅加密完成 (${rails}栏)`);
        CryptoApp.addHistory('曲栅加密', text, result);
    },
    
    // 列置换密码
    columnar() {
        const text = CryptoApp.dom.inputText.value;
        const key = (document.getElementById('substitutionKey')?.value || '4312').replace(/\D/g, '');
        if (!text) { CryptoApp.showToast('请输入需要加密的内容', 'warning'); return; }
        if (!key || key.length < 2) { CryptoApp.showToast('请输入数字密钥（如4312）', 'warning'); return; }
        
        const keyLen = key.length;
        const rows = Math.ceil(text.length / keyLen);
        const padded = text.padEnd(rows * keyLen);
        
        // 建立网格
        const grid = [];
        for (let r = 0; r < rows; r++) {
            grid.push(padded.substring(r * keyLen, (r + 1) * keyLen).split(''));
        }
        
        // 按密钥数字顺序读取列
        const order = key.split('').map(Number);
        let result = '';
        const sortedCols = order.map((n, i) => ({ n, i })).sort((a, b) => a.n - b.n);
        for (const { i } of sortedCols) {
            for (let r = 0; r < rows; r++) {
                result += grid[r][i];
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`列置换加密完成 (密钥:"${key}")`);
        CryptoApp.addHistory('列置换加密', text, result);
    },
    
    // 摩斯密码加密
    morseEn() {
        const morseMap = {
            'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....',
            'I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.',
            'Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-',
            'Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
            '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.', ' ':'/'
        };
        const text = CryptoApp.dom.inputText.value.toUpperCase();
        if (!text) { CryptoApp.showToast('请输入需要加密的内容', 'warning'); return; }
        
        const result = text.split('').map(c => morseMap[c] || c).join(' ');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('摩斯密码加密完成');
        CryptoApp.addHistory('摩斯加密', text, result);
    },
    
    // 摩斯密码解密
    morseDe() {
        const morseMap = {
            '.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H',
            '..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P',
            '--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X',
            '-.--':'Y','--..':'Z','-----':'0','.----':'1','..---':'2','...--':'3','....-':'4',
            '.....':'5','-....':'6','--...':'7','---..':'8','----.':'9','/':' '
        };
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入摩斯码', 'warning'); return; }
        
        const result = text.split(/\s+/).map(code => morseMap[code] || '?').join('');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('摩斯密码解密完成');
        CryptoApp.addHistory('摩斯解密', text, result);
    },
    
    // 培根密码加密
    baconEn() {
        const baconMap = {
            'A':'AAAAA','B':'AAAAB','C':'AAABA','D':'AAABB','E':'AABAA','F':'AABAB','G':'AABBA',
            'H':'AABBB','I':'ABAAA','J':'ABAAB','K':'ABABA','L':'ABABB','M':'ABBAA','N':'ABBAB',
            'O':'ABBBA','P':'ABBBB','Q':'BAAAA','R':'BAAAB','S':'BAABA','T':'BAABB','U':'BABAA',
            'V':'BABAB','W':'BABBA','X':'BABBB','Y':'BAAAA','Z':'BAAAB'
        };
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (!text) { CryptoApp.showToast('请输入需要加密的字母', 'warning'); return; }
        
        const result = text.split('').map(c => baconMap[c] || '').join(' ');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('培根密码加密完成');
        CryptoApp.addHistory('培根加密', text, result);
    },
    
    // 培根密码解密
    baconDe() {
        const baconMap = {
            'AAAAA':'A','AAAAB':'B','AAABA':'C','AAABB':'D','AABAA':'E','AABAB':'F','AABBA':'G',
            'AABBB':'H','ABAAA':'I','ABAAB':'J','ABABA':'K','ABABB':'L','ABBAA':'M','ABBAB':'N',
            'ABBBA':'O','ABBBB':'P','BAAAA':'Q','BAAAB':'R','BAABA':'S','BAABB':'T','BABAA':'U',
            'BABAB':'V','BABBA':'W','BABBB':'X','BAAAA':'Y','BAAAB':'Z'
        };
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^AB]/g, '');
        if (!text) { CryptoApp.showToast('请输入培根码（仅含A和B）', 'warning'); return; }
        
        let result = '';
        for (let i = 0; i + 5 <= text.length; i += 5) {
            const code = text.substring(i, i + 5);
            result += baconMap[code] || '?';
        }
        CryptoApp.setOutput(result);
        CryptoApp.showToast('培根密码解密完成');
        CryptoApp.addHistory('培根解密', text, result);
    },
    
    // 棋盘密码（Polybius方阵）
    polybius() {
        const square = [
            ['A','B','C','D','E'],
            ['F','G','H','I','K'],  // I/J 合并
            ['L','M','N','O','P'],
            ['Q','R','S','T','U'],
            ['V','W','X','Y','Z']
        ];
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!text) { CryptoApp.showToast('请输入字母（加密）或数字对（解密）', 'warning'); return; }
        
        // 自动检测：纯字母→加密，含数字→解密
        if (/^[A-Z]+$/.test(text)) {
            // 加密
            let result = '';
            for (const c of text) {
                const ch = c === 'J' ? 'I' : c;
                for (let r = 0; r < 5; r++) {
                    for (let col = 0; col < 5; col++) {
                        if (square[r][col] === ch) {
                            result += (r + 1) + '' + (col + 1) + ' ';
                        }
                    }
                }
            }
            CryptoApp.setOutput(result.trim());
            CryptoApp.showToast('棋盘密码加密完成');
            CryptoApp.addHistory('棋盘加密', text, result.trim());
        } else if (/^[1-5]+$/.test(text) && text.length % 2 === 0) {
            // 解密
            let result = '';
            for (let i = 0; i < text.length; i += 2) {
                const r = parseInt(text[i]) - 1;
                const c = parseInt(text[i + 1]) - 1;
                if (r >= 0 && r < 5 && c >= 0 && c < 5) {
                    result += square[r][c];
                } else {
                    result += '?';
                }
            }
            CryptoApp.setOutput(result);
            CryptoApp.showToast('棋盘密码解密完成');
            CryptoApp.addHistory('棋盘解密', text, result);
        } else {
            CryptoApp.setOutput('输入格式:\n• 加密: 纯字母文本\n• 解密: 纯数字对 (如 11 23 44)');
            CryptoApp.showToast('请输入有效格式', 'warning');
        }
    },
    
    // 新增功能函数
    caeAll() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要分析的内容', 'warning');
            return;
        }
        
        let result = "🔍 凯撒密码所有位移结果\n";
        result += "══════════════════════\n\n";
        
        for (let shift = 1; shift <= 25; shift++) {
            let decrypted = '';
            for (let c of text) {
                decrypted += String.fromCharCode((c.charCodeAt(0) - 65 - shift + 26) % 26 + 65);
            }
            result += `位移 ${shift}: ${decrypted.substring(0, 40)}${decrypted.length > 40 ? '...' : ''}\n`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('生成了所有位移结果');
        CryptoApp.addHistory('凯撒所有位移', text, '查看完整结果');
    },
    
    vigEn() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        const key = (document.getElementById('vigenereKey')?.value || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        if (!key) {
            CryptoApp.showToast('请输入有效的密钥', 'warning');
            return;
        }
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const textChar = text.charCodeAt(i) - 65;
            const keyChar = key.charCodeAt(i % key.length) - 65;
            const encryptedChar = (textChar + keyChar) % 26;
            result += String.fromCharCode(encryptedChar + 65);
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`维吉尼亚加密完成 (密钥:"${key}")`);
        CryptoApp.addHistory('维吉尼亚加密', text, result);
    },
    
    vigDe() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        const key = (document.getElementById('vigenereKey')?.value || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        if (!key) {
            CryptoApp.showToast('请输入有效的密钥', 'warning');
            return;
        }
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const textChar = text.charCodeAt(i) - 65;
            const keyChar = key.charCodeAt(i % key.length) - 65;
            const decryptedChar = (textChar - keyChar + 26) % 26;
            result += String.fromCharCode(decryptedChar + 65);
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`维吉尼亚解密完成 (密钥:"${key}")`);
        CryptoApp.addHistory('维吉尼亚解密', text, result);
    },
    
    railEn() {
        const text = CryptoApp.dom.inputText.value;
        const rails = parseInt(document.getElementById('railFenceRails')?.value) || 3;
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        // 栅栏密码加密
        const rail = new Array(rails).fill('').map(() => []);
        let direction = 1;
        let currentRail = 0;
        
        for (let i = 0; i < text.length; i++) {
            rail[currentRail].push(text[i]);
            currentRail += direction;
            if (currentRail === rails - 1 || currentRail === 0) {
                direction = -direction;
            }
        }
        
        const result = rail.map(r => r.join('')).join('');
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`栅栏密码加密完成 (${rails}个栅栏)`);
        CryptoApp.addHistory('栅栏加密', text, result);
    },
    
    railDe() {
        const text = CryptoApp.dom.inputText.value;
        const rails = parseInt(document.getElementById('railFenceRails')?.value) || 3;
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        // 栅栏密码解密
        const rail = new Array(rails).fill('').map(() => new Array(text.length).fill(null));
        let direction = 1;
        let currentRail = 0;
        
        // 标记位置
        for (let i = 0; i < text.length; i++) {
            rail[currentRail][i] = '*';
            currentRail += direction;
            if (currentRail === rails - 1 || currentRail === 0) {
                direction = -direction;
            }
        }
        
        // 填充字符
        let index = 0;
        for (let r = 0; r < rails; r++) {
            for (let c = 0; c < text.length; c++) {
                if (rail[r][c] === '*') {
                    rail[r][c] = text[index++];
                }
            }
        }
        
        // 读取结果
        let result = '';
        direction = 1;
        currentRail = 0;
        for (let i = 0; i < text.length; i++) {
            result += rail[currentRail][i];
            currentRail += direction;
            if (currentRail === rails - 1 || currentRail === 0) {
                direction = -direction;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`栅栏密码解密完成 (${rails}个栅栏)`);
        CryptoApp.addHistory('栅栏解密', text, result);
    },
    
    railAll() {
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要分析的内容', 'warning');
            return;
        }
        
        let result = "🔍 栅栏密码所有可能结果\n";
        result += "══════════════════════\n\n";
        
        for (let rails = 2; rails <= Math.min(10, Math.floor(text.length / 2)); rails++) {
            // 简单解密尝试
            const resultText = `栅栏数 ${rails}: 尝试解密 (长度:${text.length})\n`;
            result += resultText;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('生成了所有栅栏数分析');
    },
    
    rotN() {
        const text = CryptoApp.dom.inputText.value;
        const n = parseInt(prompt('请输入ROT-N的N值 (1-25):', '13')) || 13;
        
        if (!text) {
            CryptoApp.showToast('请输入需要转换的内容', 'warning');
            return;
        }
        if (n < 1 || n > 25) {
            CryptoApp.showToast('N值必须在1-25之间', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            if (/[a-z]/.test(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 97 + n) % 26 + 97);
            } else if (/[A-Z]/.test(c)) {
                result += String.fromCharCode((c.charCodeAt(0) - 65 + n) % 26 + 65);
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`ROT-${n}转换完成`);
        CryptoApp.addHistory(`ROT-${n}`, text, result);
    },
    
    subEn() {
        const text = CryptoApp.dom.inputText.value.toUpperCase();
        const key = (document.getElementById('substitutionKey')?.value || 'ZYXWVUTSRQPONMLKJIHGFEDCBA').toUpperCase();
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        let result = '';
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        for (let c of text) {
            if (/[A-Z]/.test(c)) {
                const index = alphabet.indexOf(c);
                if (index !== -1 && index < key.length) {
                    result += key[index];
                } else {
                    result += c;
                }
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('替换密码加密完成');
        CryptoApp.addHistory('替换加密', text, result);
    },
    
    subDe() {
        const text = CryptoApp.dom.inputText.value.toUpperCase();
        const key = (document.getElementById('substitutionKey')?.value || 'ZYXWVUTSRQPONMLKJIHGFEDCBA').toUpperCase();
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        let result = '';
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        for (let c of text) {
            if (/[A-Z]/.test(c)) {
                const index = key.indexOf(c);
                if (index !== -1) {
                    result += alphabet[index];
                } else {
                    result += c;
                }
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('替换密码解密完成');
        CryptoApp.addHistory('替换解密', text, result);
    },
    
    subCrack() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要分析的内容', 'warning');
            return;
        }
        
        // 简单的频率分析
        const freq = {};
        for (let c of text) {
            freq[c] = (freq[c] || 0) + 1;
        }
        
        let result = "🔍 字母频率分析结果\n";
        result += "══════════════════\n\n";
        result += `总字母数: ${text.length}\n\n`;
        result += "频率排序 (从高到低):\n";
        
        const sortedFreq = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        const englishFreq = 'ETAOINSHRDLCUMWFGYPBVKJXQZ'; // 英语字母频率顺序
        
        sortedFreq.slice(0, 10).forEach(([letter, count], index) => {
            const percentage = ((count / text.length) * 100).toFixed(2);
            const suggestedLetter = englishFreq[index] || '?';
            result += `${letter}: ${count}次 (${percentage}%) → 可能对应 "${suggestedLetter}"\n`;
        });
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('频率分析完成');
        CryptoApp.addHistory('频率分析', text, '查看分析结果');
    },
    
    railTest() {
        const mode = document.getElementById('railMode')?.value || 'zigzag';
        CryptoApp.showToast(`栅栏模式: ${mode} (演示功能)`, 'info');
        CryptoApp.setOutput(`栅栏密码模式测试\n模式: ${mode}\n这是一个演示功能，用于展示不同的栅栏加密模式。`);
    }
};

// 导出到全局
window.classic = ClassicModule;