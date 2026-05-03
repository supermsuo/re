/* ==============================================
   智能密码工具箱 v9.0 - CTF解题模块
   ============================================== */

const CTFModule = {
    // 仿射密码
    affineEncrypt() {
        const a = parseInt(document.getElementById('affineA').value) || 5;
        const b = parseInt(document.getElementById('affineB').value) || 8;
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        // 检查a是否与26互质
        const inv = [0,1,0,9,0,21,0,15,0,3,0,19,0,7,0,23,0,11,0,5,0,17,0,25];
        if (!inv[a]) {
            CryptoApp.setOutput('错误: a必须是1,3,5,7,9,11,15,17,19,21,23,25之一');
            CryptoApp.showToast('参数a无效', 'error');
            return;
        }
        
        let result = '';
        for (let c of text) {
            if (/[A-Z]/.test(c)) {
                result += String.fromCharCode((a * (c.charCodeAt(0) - 65) + b) % 26 + 65);
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('仿射加密完成');
        CryptoApp.addHistory('仿射加密', text, result);
    },
    
    affineDecrypt() {
        const a = parseInt(document.getElementById('affineA').value) || 5;
        const b = parseInt(document.getElementById('affineB').value) || 8;
        const inv = [0,1,0,9,0,21,0,15,0,3,0,19,0,7,0,23,0,11,0,5,0,17,0,25];
        
        if (!inv[a]) {
            CryptoApp.setOutput('错误: a必须是1,3,5,7,9,11,15,17,19,21,23,25之一');
            CryptoApp.showToast('参数a无效', 'error');
            return;
        }
        
        const aInv = inv[a];
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            if (/[A-Z]/.test(c)) {
                result += String.fromCharCode((aInv * ((c.charCodeAt(0) - 65) - b + 26)) % 26 + 65);
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('仿射解密完成');
        CryptoApp.addHistory('仿射解密', text, result);
    },
    
    affineCrack() {
        const aList = [1,3,5,7,9,11,15,17,19,21,23,25];
        const inv = [0,1,0,9,0,21,0,15,0,3,0,19,0,7,0,23,0,11,0,5,0,17,0,25];
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要破解的内容', 'warning');
            return;
        }
        
        CryptoApp.state.isProcessing = true;
        CryptoApp.updateProcessStatus();
        
        let result = '🔓 仿射密码暴力破解结果\n';
        result += '═══════════════════\n\n';
        
        const commonWords = ["THE", "AND", "FOR", "YOU", "THAT", "THIS", "WITH", "HAVE", "FROM"];
        let foundResults = [];
        
        for (let a of aList) {
            const aInv = inv[a];
            for (let b = 0; b < 26; b++) {
                let decrypted = '';
                for (let c of text) {
                    if (/[A-Z]/.test(c)) {
                        decrypted += String.fromCharCode((aInv * ((c.charCodeAt(0) - 65) - b + 26)) % 26 + 65);
                    } else {
                        decrypted += c;
                    }
                }
                
                // 计算常见单词匹配度
                let score = 0;
                for (let word of commonWords) {
                    if (decrypted.includes(word)) score++;
                }
                
                if (score > 0) {
                    foundResults.push({
                        a, b, score,
                        text: decrypted,
                        preview: decrypted.substring(0, 50) + (decrypted.length > 50 ? '...' : '')
                    });
                }
            }
        }
        
        CryptoApp.state.isProcessing = false;
        CryptoApp.updateProcessStatus();
        
        if (foundResults.length > 0) {
            // 按分数排序
            foundResults.sort((a, b) => b.score - a.score);
            
            // 显示前10个结果
            foundResults.slice(0, 10).forEach((r, i) => {
                result += `${i+1}. a=${r.a}, b=${r.b} (得分:${r.score}): ${r.preview}\n`;
            });
            
            // 自动选择最佳结果
            const best = foundResults[0];
            CryptoApp.dom.outputText.value = best.text;
            CryptoApp.updateOutputInfo();
            
            result += `\n✅ 最佳结果: a=${best.a}, b=${best.b}\n`;
            result += `解密结果: ${best.text}`;
            
            CryptoApp.showToast(`找到 ${foundResults.length} 个可能结果`, 'success');
            CryptoApp.addHistory('仿射破解', text, best.text);
        } else {
            result += '未找到可能的解密结果\n';
            result += '尝试所有组合:\n';
            
            for (let a of aList.slice(0, 3)) {
                const aInv = inv[a];
                for (let b = 0; b < 3; b++) {
                    let decrypted = '';
                    for (let c of text) {
                        if (/[A-Z]/.test(c)) {
                            decrypted += String.fromCharCode((aInv * ((c.charCodeAt(0) - 65) - b + 26)) % 26 + 65);
                        } else {
                            decrypted += c;
                        }
                    }
                    result += `a=${a}, b=${b}: ${decrypted.substring(0, 30)}...\n`;
                }
            }
            
            CryptoApp.showToast('未找到有效结果', 'warning');
        }
        
        CryptoApp.setOutput(result);
    },
    
    // 九键密码
    t9Encode() {
        const map = {
            'A':'2', 'B':'22', 'C':'222', 'D':'3', 'E':'33', 'F':'333',
            'G':'4', 'H':'44', 'I':'444', 'J':'5', 'K':'55', 'L':'555',
            'M':'6', 'N':'66', 'O':'666', 'P':'7', 'Q':'77', 'R':'777', 'S':'7777',
            'T':'8', 'U':'88', 'V':'888', 'W':'9', 'X':'99', 'Y':'999', 'Z':'9999'
        };
        
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            result += (map[c] || c) + ' ';
        }
        
        CryptoApp.setOutput(result.trim());
        CryptoApp.showToast('九键加密完成');
        CryptoApp.addHistory('九键加密', text, result);
    },
    
    t9Decode() {
        const map = {
            '2':'A', '22':'B', '222':'C', '3':'D', '33':'E', '333':'F',
            '4':'G', '44':'H', '444':'I', '5':'J', '55':'K', '555':'L',
            '6':'M', '66':'N', '666':'O', '7':'P', '77':'Q', '777':'R', '7777':'S',
            '8':'T', '88':'U', '888':'V', '9':'W', '99':'X', '999':'Y', '9999':'Z'
        };
        
        const text = CryptoApp.dom.inputText.value.replace(/[^2-9]/g, ' ');
        const groups = text.trim().split(/\s+/);
        
        if (groups.length === 0 || (groups.length === 1 && groups[0] === '')) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let group of groups) {
            result += map[group] || '?';
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('九键解密完成');
        CryptoApp.addHistory('九键解密', text, result);
    },
    
    // 当铺密码
    dangpuEncode() {
        const map = { 
            '0':'当', '1':'铺', '2':'三', '3':'四', '4':'五', 
            '5':'六', '6':'七', '7':'八', '8':'九', '9':'十' 
        };
        
        const text = CryptoApp.dom.inputText.value.replace(/[^0-9]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的数字', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            result += map[c] || c;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('当铺加密完成');
        CryptoApp.addHistory('当铺加密', text, result);
    },
    
    dangpuDecode() {
        const map = { 
            '当':'0', '铺':'1', '三':'2', '四':'3', '五':'4', 
            '六':'5', '七':'6', '八':'7', '九':'8', '十':'9' 
        };
        
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            result += map[c] !== undefined ? map[c] : c;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('当铺解密完成');
        CryptoApp.addHistory('当铺解密', text, result);
    },
    
    // 佛曰密码
    buddhaEncode() {
        const map = {
            'A':'㘵', 'B':'䂙', 'C':'𥰆', 'D':'埊', 'E':'徳', 'F':'𡿺', 'G':'𪚥',
            'H':'囍', 'I':'𠔥', 'J':'𡃁', 'K':'𡛂', 'L':'𠙚', 'M':'𡚻', 'N':'𠄠',
            'O':'𠀾', 'P':'𪚘', 'Q':'𪚙', 'R':'𪚚', 'S':'𪚛', 'T':'𪚜', 'U':'𪚝',
            'V':'𪚞', 'W':'𪚟', 'X':'𪚠', 'Y':'𪚡', 'Z':'𪚢'
        };
        
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            result += map[c] || c;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('佛曰加密完成');
        CryptoApp.addHistory('佛曰加密', text, result);
    },
    
    buddhaDecode() {
        const map = {
            '㘵':'A', '䂙':'B', '𥰆':'C', '埊':'D', '徳':'E', '𡿺':'F', '𪚥':'G',
            '囍':'H', '𠔥':'I', '𡃁':'J', '𡛂':'K', '𠙚':'L', '𡚻':'M', '𠄠':'N',
            '𠀾':'O', '𪚘':'P', '𪚙':'Q', '𪚚':'R', '𪚛':'S', '𪚜':'T', '𪚝':'U',
            '𪚞':'V', '𪚟':'W', '𪚠':'X', '𪚡':'Y', '𪚢':'Z'
        };
        
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            result += map[c] || c;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('佛曰解密完成');
        CryptoApp.addHistory('佛曰解密', text, result);
    },
    
    // 盲文密码
    brailleEncode() {
        const map = {
            'A':'⠁', 'B':'⠃', 'C':'⠉', 'D':'⠙', 'E':'⠑', 'F':'⠋', 'G':'⠛',
            'H':'⠓', 'I':'⠊', 'J':'⠚', 'K':'⠅', 'L':'⠇', 'M':'⠍', 'N':'⠝',
            'O':'⠕', 'P':'⠏', 'Q':'⠟', 'R':'⠗', 'S':'⠎', 'T':'⠞', 'U':'⠥',
            'V':'⠧', 'W':'⠺', 'X':'⠭', 'Y':'⠽', 'Z':'⠵'
        };
        
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            result += map[c] || c;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('盲文加密完成');
        CryptoApp.addHistory('盲文加密', text, result);
    },
    
    brailleDecode() {
        const map = {
            '⠁':'A', '⠃':'B', '⠉':'C', '⠙':'D', '⠑':'E', '⠋':'F', '⠛':'G',
            '⠓':'H', '⠊':'I', '⠚':'J', '⠅':'K', '⠇':'L', '⠍':'M', '⠝':'N',
            '⠕':'O', '⠏':'P', '⠟':'Q', '⠗':'R', '⠎':'S', '⠞':'T', '⠥':'U',
            '⠧':'V', '⠺':'W', '⠭':'X', '⠽':'Y', '⠵':'Z'
        };
        
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        let result = '';
        for (let c of text) {
            result += map[c] || c;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('盲文解密完成');
        CryptoApp.addHistory('盲文解密', text, result);
    },
    
    // 零宽字符
    zeroWidthExtract() {
        const zeroChars = ['\u200b', '\u200c', '\u200d', '\u2060'];
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要分析的内容', 'warning');
            return;
        }
        
        let binary = '';
        for (let c of text) {
            const index = zeroChars.indexOf(c);
            if (index !== -1) {
                binary += index.toString(2).padStart(2, '0');
            }
        }
        
        if (!binary) {
            CryptoApp.setOutput('未检测到零宽字符');
            CryptoApp.showToast('未找到零宽字符', 'warning');
            return;
        }
        
        let result = '';
        for (let i = 0; i < binary.length; i += 8) {
            const byte = binary.substr(i, 8);
            if (byte.length === 8) {
                result += String.fromCharCode(parseInt(byte, 2));
            }
        }
        
        if (!result) {
            CryptoApp.setOutput('提取到零宽字符但解码失败');
            CryptoApp.showToast('解码失败', 'error');
            return;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('零宽字符提取完成');
        CryptoApp.addHistory('零宽提取', text, result);
    },
    
    zeroWidthEmbed() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要隐藏文本的内容', 'warning');
            return;
        }
        
        const hiddenText = prompt("请输入要隐藏的文本（最多100字符）:", "秘密信息");
        if (!hiddenText) return;
        
        const zeroChars = ['\u200b', '\u200c', '\u200d', '\u2060'];
        let binary = '';
        
        // 将隐藏文本转换为二进制
        for (let c of hiddenText.substring(0, 100)) {
            binary += c.charCodeAt(0).toString(2).padStart(8, '0');
        }
        
        // 将二进制转换为零宽字符
        let zeroStr = '';
        for (let i = 0; i < binary.length; i += 2) {
            const bits = binary.substr(i, 2);
            const index = parseInt(bits, 2);
            zeroStr += zeroChars[index] || zeroChars[0];
        }
        
        // 将零宽字符附加到原始文本
        const result = text + zeroStr;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('零宽字符已嵌入');
        CryptoApp.addHistory('零宽嵌入', text, '包含隐藏信息');
    },
    
    // 其他CTF工具
    phoneWave() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要处理的内容', 'warning');
            return;
        }
        
        // 手机波形密码：将字母转换为波形表示
        const waveMap = {
            'A':'↗↘', 'B':'↗↗↘', 'C':'↗↗↗↘', 'D':'↘↗', 'E':'↘↘↗',
            'F':'↘↘↘↗', 'G':'↗↘↗', 'H':'↗↗↘↗', 'I':'↗↗↗↘↗',
            'J':'↘↗↘', 'K':'↘↘↗↘', 'L':'↘↘↘↗↘', 'M':'↗↘↘',
            'N':'↗↗↘↘', 'O':'↗↗↗↘↘', 'P':'↘↗↗', 'Q':'↘↘↗↗',
            'R':'↘↘↘↗↗', 'S':'↗↘↗↘', 'T':'↗↗↘↗↘', 'U':'↘↗↘↗',
            'V':'↘↘↗↘↗', 'W':'↗↘↘↗', 'X':'↗↗↘↘↗', 'Y':'↘↗↗↘',
            'Z':'↘↘↗↗↘'
        };
        
        let result = '';
        for (let c of text.toUpperCase()) {
            if (/[A-Z]/.test(c)) {
                result += (waveMap[c] || c) + ' ';
            } else if (c === ' ') {
                result += '| ';
            }
        }
        
        CryptoApp.setOutput(result.trim());
        CryptoApp.showToast('手机波形加密完成');
        CryptoApp.addHistory('波形加密', text, result);
    },
    
    keyboard() {
        const text = CryptoApp.dom.inputText.value.toUpperCase();
        if (!text) {
            CryptoApp.showToast('请输入需要处理的内容', 'warning');
            return;
        }
        
        // 键盘位移密码：Qwerty键盘上的位移
        const keyboardRows = [
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
        ];
        
        let result = '';
        for (let c of text) {
            if (/[A-Z]/.test(c)) {
                let found = false;
                for (let row of keyboardRows) {
                    const index = row.indexOf(c);
                    if (index !== -1) {
                        // 向右位移一位
                        const newIndex = (index + 1) % row.length;
                        result += row[newIndex];
                        found = true;
                        break;
                    }
                }
                if (!found) result += c;
            } else {
                result += c;
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('键盘位移加密完成');
        CryptoApp.addHistory('键盘位移', text, result);
    },
    
    musicEncode() {
        const text = CryptoApp.dom.inputText.value.toUpperCase();
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        // 音符加密：字母映射到音符
        const noteMap = {
            'A':'♪C', 'B':'♪D', 'C':'♪E', 'D':'♪F', 'E':'♪G',
            'F':'♪A', 'G':'♪B', 'H':'♩C', 'I':'♩D', 'J':'♩E',
            'K':'♩F', 'L':'♩G', 'M':'♩A', 'N':'♩B', 'O':'♪c',
            'P':'♪d', 'Q':'♪e', 'R':'♪f', 'S':'♪g', 'T':'♪a',
            'U':'♪b', 'V':'♩c', 'W':'♩d', 'X':'♩e', 'Y':'♩f',
            'Z':'♩g'
        };
        
        let result = '';
        for (let c of text) {
            if (/[A-Z]/.test(c)) {
                result += (noteMap[c] || '♪') + ' ';
            } else if (c === ' ') {
                result += '𝄞 ';
            }
        }
        
        CryptoApp.setOutput(result.trim());
        CryptoApp.showToast('音符加密完成');
        CryptoApp.addHistory('音符加密', text, result);
    },
    
    musicDecode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        // 音符解密：反向映射
        const noteMap = {
            '♪C':'A', '♪D':'B', '♪E':'C', '♪F':'D', '♪G':'E',
            '♪A':'F', '♪B':'G', '♩C':'H', '♩D':'I', '♩E':'J',
            '♩F':'K', '♩G':'L', '♩A':'M', '♩B':'N', '♪c':'O',
            '♪d':'P', '♪e':'Q', '♪f':'R', '♪g':'S', '♪a':'T',
            '♪b':'U', '♩c':'V', '♩d':'W', '♩e':'X', '♩f':'Y',
            '♩g':'Z'
        };
        
        // 提取音符
        const notes = text.match(/[♪♩][A-Za-z]/g) || [];
        let result = '';
        
        for (let note of notes) {
            result += noteMap[note] || '?';
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('音符解密完成');
        CryptoApp.addHistory('音符解密', text, result);
    },
    
    pigpenEncode() {
        const text = CryptoApp.dom.inputText.value.toUpperCase();
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        // 猪圈密码：字母映射到网格
        const pigpenMap = {
            'A':'┌─┐\n│A│\n└─┘', 'B':'┌─┐\n│B│\n└─┘', 'C':'┌─┐\n│C│\n└─┘',
            'D':'╔═╗\n║D║\n╚═╝', 'E':'╔═╗\n║E║\n╚═╝', 'F':'╔═╗\n║F║\n╚═╝',
            'G':'┌─╗\n│G║\n└─╝', 'H':'┌─╗\n│H║\n└─╝', 'I':'┌─╗\n│I║\n└─╝',
            'J':'╔─┐\n║J│\n╚─┘', 'K':'╔─┐\n║K│\n╚─┘', 'L':'╔─┐\n║L│\n╚─┘',
            'M':'┌─┐\n│M│\n└─┘·', 'N':'┌─┐\n│N│\n└─┘··', 'O':'┌─┐\n│O│\n└─┘···',
            'P':'╔═╗\n║P║\n╚═╝·', 'Q':'╔═╗\n║Q║\n╚═╝··', 'R':'╔═╗\n║R║\n╚═╝···',
            'S':'┌─╗\n│S║\n└─╝·', 'T':'┌─╗\n│T║\n└─╝··', 'U':'┌─╗\n│U║\n└─╝···',
            'V':'╔─┐\n║V│\n╚─┘·', 'W':'╔─┐\n║W│\n╚─┘··', 'X':'╔─┐\n║X│\n╚─┘···',
            'Y':'┌─┐\n│Y│\n└─┘····', 'Z':'╔═╗\n║Z║\n╚═╝····'
        };
        
        let result = '';
        for (let c of text) {
            if (/[A-Z]/.test(c)) {
                result += pigpenMap[c] || c + '\n\n';
            } else if (c === ' ') {
                result += '   \n\n';
            }
        }
        
        CryptoApp.setOutput(result.trim());
        CryptoApp.showToast('猪圈加密完成');
        CryptoApp.addHistory('猪圈加密', text, '图形密码');
    },
    
    pigpenDecode() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入猪圈密码符号描述', 'warning'); return; }
        
        // 猪圈密码符号→字母映射（用文字描述符号特征）
        const pigpenDecodeMap = {
            '┌─┐': 'A', '│A│': 'A', '└─┘': 'A',
            '┌─┐·': 'M', '┌─┐··': 'N', '┌─┐···': 'O',
            '╔═╗': 'D', '╔═╗·': 'P', '╔═╗··': 'Q', '╔═╗···': 'R',
            '┌─╗': 'G', '┌─╗·': 'S', '┌─╗··': 'T', '┌─╗···': 'U',
            '╔─┐': 'J', '╔─┐·': 'V', '╔─┐··': 'W', '╔─┐···': 'X'
        };
        
        // 使用简化版：用字母标识替代
        const simpleMap = {
            'A':'A','B':'B','C':'C','D':'D','E':'E','F':'F',
            'G':'G','H':'H','I':'I','J':'J','K':'K','L':'L',
            'M':'M','N':'N','O':'O','P':'P','Q':'Q','R':'R',
            'S':'S','T':'T','U':'U','V':'V','W':'W','X':'X',
            'Y':'Y','Z':'Z'
        };
        
        let result = '🔓 猪圈密码解密\n══════════════════\n\n';
        result += '猪圈密码是图形密码，需要识别图形模式。\n\n';
        result += '输入方式:\n';
        result += '• 直接输入字母（自动识别对应图形）\n';
        result += '• 使用符号描述（如 ┌─┐ 表示A组）\n\n';
        result += '猪圈密码对照表:\n';
        result += '第一行(无点): A B C | D E F | G H I | J K L\n';
        result += '第二行(1点):  M N O | P Q R | S T U | V W X\n';
        result += '第三行(2点):  Y Z\n\n';
        result += '图形类型:\n';
        result += '• ┌─┐ (左上角方框): A,B,C → M,N,O → Y,Z\n';
        result += '• ╔═╗ (完整方框):   D,E,F → P,Q,R\n';
        result += '• ┌─╗ (右开放框):  G,H,I → S,T,U\n';
        result += '• ╔─┐ (左开放框):  J,K,L → V,W,X\n';
        result += '• 点数: 无点=前3字母, 1点=中间3字母, 2-3点=后字母\n';
        
        const upper = text.toUpperCase();
        if (/^[A-Z]+$/.test(upper)) {
            result += `\n输入识别: ${upper}\n`;
            result += `对应明文: ${upper.split('').map(c => simpleMap[c] || c).join('')}`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('猪圈密码参考信息');
    },
    
    curveEncode() {
        const key = parseInt(document.getElementById('curveKey').value) || 4;
        const text = CryptoApp.dom.inputText.value.replace(/\s/g, '');
        
        if (!text) {
            CryptoApp.showToast('请输入需要加密的内容', 'warning');
            return;
        }
        
        // 曲路密码：按栏数重新排列
        const rows = Math.ceil(text.length / key);
        const grid = [];
        
        // 创建网格
        for (let i = 0; i < rows; i++) {
            grid[i] = [];
            for (let j = 0; j < key; j++) {
                const index = i * key + j;
                grid[i][j] = index < text.length ? text[index] : '';
            }
        }
        
        // 按列读取
        let result = '';
        for (let j = 0; j < key; j++) {
            for (let i = 0; i < rows; i++) {
                if (grid[i][j]) {
                    result += grid[i][j];
                }
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`曲路加密完成 (栏数: ${key})`);
        CryptoApp.addHistory('曲路加密', text, result);
    },
    
    curveDecode() {
        const key = parseInt(document.getElementById('curveKey').value) || 4;
        const text = CryptoApp.dom.inputText.value;
        
        if (!text) {
            CryptoApp.showToast('请输入需要解密的内容', 'warning');
            return;
        }
        
        // 曲路解密：反向过程
        const rows = Math.ceil(text.length / key);
        const cols = key;
        const grid = Array(rows).fill().map(() => Array(cols).fill(''));
        
        let index = 0;
        
        // 按列填充
        for (let j = 0; j < cols; j++) {
            for (let i = 0; i < rows; i++) {
                if (index < text.length) {
                    grid[i][j] = text[index++];
                }
            }
        }
        
        // 按行读取
        let result = '';
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j]) {
                    result += grid[i][j];
                }
            }
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`曲路解密完成 (栏数: ${key})`);
        CryptoApp.addHistory('曲路解密', text, result);
    },
    
    stegoAnalyze() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要分析的内容', 'warning');
            return;
        }
        
        let result = '🕵️ 隐写分析报告\n';
        result += '═══════════════\n\n';
        
        // 检查零宽字符
        const zeroChars = text.match(/[\u200b\u200c\u200d\u2060]/g);
        if (zeroChars) {
            result += `✅ 发现零宽字符: ${zeroChars.length} 个\n`;
        }
        
        // 检查控制字符
        const controlChars = text.match(/[\u0000-\u001F\u007F-\u009F]/g);
        if (controlChars) {
            result += `✅ 发现控制字符: ${controlChars.length} 个\n`;
        }
        
        // 检查空格模式
        const spaces = text.match(/ /g);
        if (spaces) {
            result += `✅ 空格数量: ${spaces.length} 个\n`;
            
            // 检查连续空格
            const doubleSpaces = text.match(/  {2,}/g);
            if (doubleSpaces) {
                result += `⚠️  发现连续空格: ${doubleSpaces.length} 处\n`;
            }
        }
        
        // 检查Tab字符
        const tabs = text.match(/\t/g);
        if (tabs) {
            result += `✅ Tab字符: ${tabs.length} 个\n`;
        }
        
        // 检查不可打印字符
        const nonPrintable = text.match(/[^\x20-\x7E\n\r\t]/g);
        if (nonPrintable) {
            result += `⚠️  不可打印字符: ${nonPrintable.length} 个\n`;
        }
        
        // 检查Base64隐写
        if (/[a-z0-9+/]+={0,2}$/i.test(text)) {
            try {
                const decoded = atob(text);
                if (decoded.includes('\0') || decoded.includes('\u0001')) {
                    result += '⚠️  Base64中可能包含隐写数据\n';
                }
            } catch {}
        }
        
        if (!zeroChars && !controlChars && !doubleSpaces && !tabs && !nonPrintable) {
            result += '✅ 未发现明显的隐写痕迹\n';
        }
        
        result += '\n💡 建议:\n';
        if (zeroChars) result += '- 使用零宽字符提取工具\n';
        if (controlChars) result += '- 检查控制字符的含义\n';
        if (doubleSpaces) result += '- 分析空格隐写模式\n';
        if (nonPrintable) result += '- 查看不可打印字符\n';
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('隐写分析完成');
        CryptoApp.addHistory('隐写分析', text, '分析报告');
    },
    
    whiteSpace() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要处理的内容', 'warning');
            return;
        }
        
        // 空格隐写：将文本转换为空格模式
        let binary = '';
        for (let c of text) {
            binary += c.charCodeAt(0).toString(2).padStart(8, '0');
        }
        
        let result = '';
        for (let bit of binary) {
            result += bit === '1' ? '  ' : ' '; // 两个空格表示1，一个空格表示0
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('空格隐写生成完成');
        CryptoApp.addHistory('空格隐写', text, '空格编码');
    },
    
    // 辅助函数 - 仿射密码分析
    analyzeAffine() {
        const text = CryptoApp.dom.inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (!text) { CryptoApp.showToast('请输入需要分析的密文', 'warning'); return; }
        
        // 频率分析
        const freq = {};
        for (const c of text) freq[c] = (freq[c] || 0) + 1;
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        const total = text.length;
        
        let result = '🔍 仿射密码分析\n══════════════════\n\n';
        result += `密文长度: ${total}\n\n`;
        result += '频率分布:\n';
        sorted.slice(0, 10).forEach(([c, n]) => {
            result += `${c}: ${n}次 (${(n / total * 100).toFixed(1)}%) ${'█'.repeat(Math.floor(n / total * 100))}\n`;
        });
        
        // 仿射密码参数推断
        const aList = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
        const inv = [0, 1, 0, 9, 0, 21, 0, 15, 0, 3, 0, 19, 0, 7, 0, 23, 0, 11, 0, 5, 0, 17, 0, 25];
        const englishFreq = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';
        
        result += '\n基于最高频字母的推断:\n';
        const mostCommon = sorted[0][0];
        result += `最高频密文字母: ${mostCommon}\n\n`;
        
        // 假设最高频字母对应E(最常见英文字母)
        const mostCommonCode = mostCommon.charCodeAt(0) - 65;
        const eCode = 4; // E
        const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL'];
        
        let bestResults = [];
        for (const a of aList) {
            for (let b = 0; b < 26; b++) {
                let dec = '';
                for (const c of text) {
                    dec += String.fromCharCode((inv[a] * ((c.charCodeAt(0) - 65) - b + 260)) % 26 + 65);
                }
                let score = 0;
                for (const w of commonWords) { if (dec.includes(w)) score++; }
                if (score > 0) bestResults.push({ a, b, dec, score });
            }
        }
        
        bestResults.sort((a, b) => b.score - a.score);
        if (bestResults.length > 0) {
            result += '可能的参数:\n';
            bestResults.slice(0, 5).forEach((r, i) => {
                result += `${i + 1}. a=${r.a}, b=${r.b} (匹配:${r.score}) → ${r.dec.substring(0, 40)}...\n`;
            });
            const best = bestResults[0];
            CryptoApp.setOutput(result + `\n✅ 最可能: a=${best.a}, b=${best.b}`);
            CryptoApp.showToast(`推断 a=${best.a}, b=${best.b}`);
        } else {
            result += '未找到明确匹配，尝试所有a值:\n';
            for (const a of aList.slice(0, 3)) {
                const b = (mostCommonCode - a * eCode + 2600) % 26;
                let dec = '';
                for (const c of text) {
                    dec += String.fromCharCode((inv[a] * ((c.charCodeAt(0) - 65) - b + 260)) % 26 + 65);
                }
                result += `a=${a}, b=${b}: ${dec.substring(0, 30)}...\n`;
            }
            CryptoApp.setOutput(result);
            CryptoApp.showToast('分析结果不确定', 'warning');
        }
    }
};

// 导出到全局
window.ctf = CTFModule;