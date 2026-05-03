/* ==============================================
   智能密码工具箱 v9.0 - 隐写分析模块
   ============================================== */

const StegoModule = {
    // 零宽字符隐写
    zeroWidthEmbed() {
        const text = document.getElementById('zeroWidthText')?.value || CryptoApp.dom.inputText.value;
        const cover = document.getElementById('zeroWidthCover')?.value || '这是一段普通文本';
        
        if (!text) {
            CryptoApp.showToast('请输入需要隐藏的文本', 'warning');
            return;
        }
        
        // 零宽字符: \u200B (零宽空格), \u200C (零宽非连接符), \u200D (零宽连接符), \uFEFF (零宽不换行空格)
        const zeroWidthChars = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
        let hidden = '';
        
        // 将文本转换为二进制
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const binary = charCode.toString(2).padStart(16, '0');
            
            for (let j = 0; j < binary.length; j++) {
                hidden += zeroWidthChars[parseInt(binary[j])];
            }
            
            // 添加分隔符
            if (i < text.length - 1) {
                hidden += '\u200E'; // 左到右标记
            }
        }
        
        const result = cover + hidden;
        CryptoApp.setOutput(result);
        CryptoApp.showToast('零宽字符嵌入完成');
        CryptoApp.addHistory('零宽嵌入', text, '隐藏于文本中');
    },
    
    zeroWidthExtract() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要分析的文本', 'warning');
            return;
        }
        
        // 提取零宽字符
        const zeroWidthRegex = /[\u200B-\u200D\uFEFF\u200E\u200F]/g;
        const zeroWidthText = text.match(zeroWidthRegex)?.join('') || '';
        
        if (!zeroWidthText) {
            CryptoApp.showToast('未检测到零宽字符', 'warning');
            return;
        }
        
        // 解析零宽字符
        let binary = '';
        let extracted = '';
        
        for (let i = 0; i < zeroWidthText.length; i++) {
            const char = zeroWidthText[i];
            
            if (char === '\u200B') binary += '0';
            else if (char === '\u200C') binary += '1';
            else if (char === '\u200D') binary += '1'; // 备用
            else if (char === '\uFEFF') binary += '0'; // 备用
            else if (char === '\u200E') {
                // 分隔符，解析一个字符
                if (binary.length >= 16) {
                    const charCode = parseInt(binary.substring(0, 16), 2);
                    extracted += String.fromCharCode(charCode);
                    binary = binary.substring(16);
                }
            }
        }
        
        // 解析最后一个字符
        if (binary.length >= 16) {
            const charCode = parseInt(binary.substring(0, 16), 2);
            extracted += String.fromCharCode(charCode);
        }
        
        let result = `🔍 零宽字符提取结果\n`;
        result += `══════════════════\n\n`;
        result += `原始文本长度: ${text.length} 字符\n`;
        result += `检测到零宽字符: ${zeroWidthText.length} 个\n`;
        result += `提取结果: ${extracted || '无有效数据'}\n\n`;
        result += `零宽字符统计:\n`;
        result += `• 零宽空格 (\\u200B): ${(zeroWidthText.match(/\u200B/g) || []).length}\n`;
        result += `• 零宽非连接符 (\\u200C): ${(zeroWidthText.match(/\u200C/g) || []).length}\n`;
        result += `• 零宽连接符 (\\u200D): ${(zeroWidthText.match(/\u200D/g) || []).length}\n`;
        result += `• 零宽不换行空格 (\\uFEFF): ${(zeroWidthText.match(/\uFEFF/g) || []).length}\n`;
        result += `• 左到右标记 (\\u200E): ${(zeroWidthText.match(/\u200E/g) || []).length}\n`;
        result += `• 右到左标记 (\\u200F): ${(zeroWidthText.match(/\u200F/g) || []).length}`;
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('零宽字符提取完成');
        CryptoApp.addHistory('零宽提取', text, extracted);
    },
    
    zeroWidthDetect() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要检测的文本', 'warning');
            return;
        }
        
        const zeroWidthChars = [
            { name: '零宽空格', char: '\u200B', code: '\\u200B' },
            { name: '零宽非连接符', char: '\u200C', code: '\\u200C' },
            { name: '零宽连接符', char: '\u200D', code: '\\u200D' },
            { name: '零宽不换行空格', char: '\uFEFF', code: '\\uFEFF' },
            { name: '左到右标记', char: '\u200E', code: '\\u200E' },
            { name: '右到左标记', char: '\u200F', code: '\\u200F' }
        ];
        
        let result = `🔎 零宽字符检测报告\n`;
        result += `══════════════════\n\n`;
        result += `文本长度: ${text.length} 字符\n\n`;
        result += `检测结果:\n`;
        
        let foundAny = false;
        for (const { name, char, code } of zeroWidthChars) {
            const count = (text.match(new RegExp(char, 'g')) || []).length;
            if (count > 0) {
                result += `⚠️ ${name} (${code}): ${count} 个\n`;
                foundAny = true;
            }
        }
        
        if (!foundAny) {
            result += `✅ 未检测到零宽字符\n`;
        } else {
            result += `\n安全建议:\n`;
            result += `• 可疑文本可能包含隐写信息\n`;
            result += `• 建议使用"提取零宽字符"功能\n`;
            result += `• 注意检查文本来源的可信度`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast(foundAny ? '检测到零宽字符' : '未检测到零宽字符');
    },
    
    // 空格隐写
    spaceEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要编码的文本', 'warning');
            return;
        }
        
        // 将文本转换为二进制，用空格表示
        let encoded = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const binary = charCode.toString(2).padStart(8, '0');
            
            for (let j = 0; j < binary.length; j++) {
                encoded += binary[j] === '1' ? '  ' : ' '; // 两个空格表示1，一个空格表示0
            }
            
            if (i < text.length - 1) {
                encoded += '\t'; // 用Tab分隔字符
            }
        }
        
        const result = `📝 空格编码结果\n\n编码规则:\n• 两个空格 = 1\n• 一个空格 = 0\n• Tab = 字符分隔符\n\n编码文本:\n"${encoded}"\n\n原始文本: ${text}\n二进制长度: ${text.length * 8} 位`;
        CryptoApp.setOutput(result);
        CryptoApp.showToast('空格编码完成');
        CryptoApp.addHistory('空格编码', text, '使用空格编码');
    },
    
    spaceDecode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要解码的文本', 'warning');
            return;
        }
        
        let decoded = '';
        let binary = '';
        let inChar = false;
        
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\t') {
                // Tab分隔符，解析一个字符
                if (binary.length >= 8) {
                    const charCode = parseInt(binary.substring(0, 8), 2);
                    decoded += String.fromCharCode(charCode);
                    binary = binary.substring(8);
                }
                inChar = false;
            } else if (text[i] === ' ') {
                if (i + 1 < text.length && text[i + 1] === ' ') {
                    binary += '1';
                    i++; // 跳过下一个空格
                } else {
                    binary += '0';
                }
                inChar = true;
            } else if (inChar) {
                // 非空格字符，重置
                binary = '';
                inChar = false;
            }
        }
        
        // 解析最后一个字符
        if (binary.length >= 8) {
            const charCode = parseInt(binary.substring(0, 8), 2);
            decoded += String.fromCharCode(charCode);
        }
        
        CryptoApp.setOutput(decoded || '未解码出有效文本');
        CryptoApp.showToast(decoded ? '空格解码完成' : '解码失败');
        if (decoded) {
            CryptoApp.addHistory('空格解码', text, decoded);
        }
    },
    
    spaceAnalyze() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要分析的文本', 'warning');
            return;
        }
        
        const spaceCount = (text.match(/ /g) || []).length;
        const tabCount = (text.match(/\t/g) || []).length;
        const doubleSpaceCount = (text.match(/  /g) || []).length;
        
        let result = `📊 空格分析报告\n`;
        result += `══════════════════\n\n`;
        result += `文本长度: ${text.length} 字符\n`;
        result += `空格数量: ${spaceCount}\n`;
        result += `Tab数量: ${tabCount}\n`;
        result += `连续两个空格: ${doubleSpaceCount}\n\n`;
        
        if (doubleSpaceCount > 0 && tabCount > 0) {
            result += `🔍 检测到可能的空格隐写特征:\n`;
            result += `• 存在连续两个空格 (可能表示二进制1)\n`;
            result += `• 存在Tab字符 (可能作为分隔符)\n`;
            result += `• 建议尝试使用"空格解码"功能`;
        } else if (spaceCount > text.length * 0.3) {
            result += `⚠️ 空格比例较高 (${(spaceCount / text.length * 100).toFixed(1)}%)\n`;
            result += `可能存在隐写信息，建议进一步分析`;
        } else {
            result += `✅ 未发现明显的隐写特征`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('空格分析完成');
    },
    
    // ========== Tab 编码（用Tab/空格隐写）==========
    tabEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入要隐藏的文本', 'warning'); return; }

        // 将文本编码到空白字符中（Tab=1, 双空格=0）
        let hidden = '';
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            const binary = code.toString(2).padStart(8, '0');
            for (let j = 0; j < binary.length; j++) {
                hidden += binary[j] === '1' ? '\t' : '  ';
            }
            if (i < text.length - 1) hidden += '   '; // 字符分隔（3空格）
        }

        const cover = `这是一段看似普通的文本，实际上在空白字符中隐藏了信息。你可以复制整段文字，粘贴到"Tab解码"功能中来提取隐藏信息。`;

        CryptoApp.setOutput(cover + hidden);
        CryptoApp.showToast('Tab隐写完成（ hidden in whitespace）');
        CryptoApp.addHistory('Tab隐写', text, '已隐藏');
    },

    // ========== Tab 解码 ==========
    tabDecode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入含Tab隐写的文本', 'warning'); return; }

        // 提取Tab和空格序列
        let binary = '';
        let currentByte = '';
        let extracted = '';

        // 逐字符分析
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\t') {
                currentByte += '1';
            } else if (text[i] === ' ' && i + 1 < text.length && text[i+1] === ' ') {
                currentByte += '0';
                i++; // 跳过第二个空格
            } else if (currentByte.length > 0) {
                // 空格序列结束，解析字节
                if (currentByte.length === 8) {
                    extracted += String.fromCharCode(parseInt(currentByte, 2));
                }
                currentByte = '';
            }
        }
        // 最后一段
        if (currentByte.length === 8) {
            extracted += String.fromCharCode(parseInt(currentByte, 2));
        }

        let result = `🔍 Tab隐写提取\n══════════════════\n\n`;
        if (extracted) {
            result += `✅ 提取到隐藏信息:\n"${extracted}"\n\n`;
            result += `二进制序列长度: ${binary.length} 位`;
        } else {
            result += `❌ 未检测到有效的Tab隐写\n`;
            result += `Tab数: ${(text.match(/\t/g) || []).length}\n`;
            result += `双空格数: ${((text.match(/  /g) || []).length)}`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast(extracted ? '提取成功' : '未检测到隐写', extracted ? 'success' : 'warning');
    },

    // ========== 藏头诗检测 ==========
    acrostic() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入诗歌文本', 'warning'); return; }

        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) { CryptoApp.showToast('至少需要2行', 'warning'); return; }

        // 提取每行首字
        const firstChars = lines.map(l => l.trim()[0]).join('');

        let result = `📝 藏头诗分析\n══════════════════\n\n`;
        result += `行数: ${lines.length}\n`;
        result += `每行首字: ${firstChars}\n\n`;

        // 判断是否有意义
        const meaningful = /[一二三四五六七八九十百千万亿俩双对半各每].*[你我他她它您好请谢谢]/.test(firstChars);
        result += `藏头内容: ${firstChars}\n`;
        result += `分析: ${meaningful ? '⚠️ 可能含有隐藏信息' : '未检测到明显的藏头信息'}\n\n`;

        result += `各行列首:\n`;
        lines.forEach((line, i) => {
            result += `${i+1}. "${line.trim()[0]}" — ${line.trim().substring(0, 20)}...\n`;
        });

        CryptoApp.setOutput(result);
        CryptoApp.showToast('分析完成');
    },

    // ========== Leet Speak 转换 ==========
    leetSpeak() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入文本', 'warning'); return; }

        const leetMap = {
            'a':'4', 'A':'4', 'e':'3', 'E':'3', 'i':'1', 'I':'1',
            'o':'0', 'O':'0', 's':'5', 'S':'5', 't':'7', 'T':'7',
            'b':'8', 'B':'8', 'g':'9', 'G':'9', 'l':'1', 'L':'1',
            'z':'2', 'Z':'2', 'c':'(' , 'C':'(', 'f':'=', 'F':'=',
            'h':'|-|', 'H':'|-|', 'k':'|<', 'K':'|<', 'p':'|>', 'P':'|>',
            'w':'uu', 'W':'uu', 'x':'><', 'X':'><'
        };

        // 转Leet
        let leet = '';
        for (const c of text) {
            leet += leetMap[c] || c;
        }

        let result = `💬 Leet Speak 转换\n══════════════════\n\n`;
        result += `原文: ${text}\n\n`;
        result += `Leet Speak: ${leet}\n\n`;

        // 常见Leet词汇
        result += `常见 Leet 映射:\n`;
        result += `A→4, E→3, I→1, O→0\n`;
        result += `S→5, T→7, B→8, G→9\n`;
        result += `Z→2, C→(, W→uu, X→><`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('转换完成');
        CryptoApp.addHistory('Leet转换', text, leet);
    },

    // ========== 词语模式分析 ==========
    wordPattern() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入文本', 'warning'); return; }

        const words = text.toLowerCase().split(/[\s,.!?;:，。！？；：]+/).filter(w => w);
        const patterns = {};

        words.forEach(w => {
            const pattern = w.replace(/[aeiou]/gi, 'V').replace(/[^V]/gi, 'C');
            patterns[pattern] = (patterns[pattern] || 0) + 1;
        });

        let result = `📝 词语模式分析\n══════════════════\n\n`;
        result += `总词数: ${words.length}\n`;
        result += `唯一模式数: ${Object.keys(patterns).length}\n\n`;

        result += `CVCV 模式统计 (C=辅音, V=元音):\n`;
        const sorted = Object.entries(patterns).sort((a, b) => b[1] - a[1]);
        sorted.slice(0, 15).forEach(([pat, count]) => {
            result += `"${pat}": ${count}次\n`;
        });

        result += `\n示例词:\n`;
        for (const [pat] of sorted.slice(0, 5)) {
            const example = words.find(w => {
                const p = w.replace(/[aeiou]/gi, 'V').replace(/[^V]/gi, 'C');
                return p === pat;
            });
            if (example) result += `• ${pat} → "${example}"\n`;
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('分析完成');
    },

    // ========== 大小写编码 ==========
    capitalization() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入要编码的文本', 'warning'); return; }

        // 用大小写编码二进制（大写=0，小写=1）
        let binary = '';
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            binary += code.toString(2).padStart(8, '0');
        }

        // 生成大小写编码（用字母字符来承载）
        const upper = 'ABCDEFGHIJKLMNOP';
        const lower = 'abcdefghijklmnop';
        let encoded = '';
        for (let i = 0; i < binary.length; i++) {
            encoded += binary[i] === '0' ? upper[i % 16] : lower[i % 16];
            if ((i + 1) % 8 === 0) encoded += ' ';
        }

        let result = `🔤 大小写隐写编码\n══════════════════\n\n`;
        result += `原文: ${text}\n`;
        result += `二进制: ${binary.substring(0, 64)}... (共${binary.length}位)\n\n`;
        result += `大小写编码 (大写=0, 小写=1):\n${encoded}\n\n`;
        result += `⚠️ 此编码用于演示隐写原理\n实际使用中容易被检测`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('编码完成');
        CryptoApp.addHistory('大小写编码', text, encoded);
    },

    // ========== 标点符号编码 ==========
    punctuation() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入要编码的文本', 'warning'); return; }

        // 用标点符号编码二进制
        const punctMap = {
            '00': '，', '01': '。', '10': '！', '11': '？'
        };

        let binary = '';
        for (let i = 0; i < text.length; i++) {
            binary += text.charCodeAt(i).toString(2).padStart(8, '0');
        }

        let encoded = '';
        for (let i = 0; i < binary.length - 1; i += 2) {
            const bits = binary.substr(i, 2).padEnd(2, '0');
            encoded += punctMap[bits] || '，';
        }

        // 解码映射
        const decodeMap = { '，': '00', '。': '01', '！': '10', '？': '11' };

        let result = `✍️ 标点符号隐写\n══════════════════\n\n`;
        result += `原文: ${text}\n`;
        result += `标点编码: ${encoded}\n\n`;
        result += `编码规则:\n`;
        result += `， (逗号) = 00\n`;
        result += `。 (句号) = 01\n`;
        result += `！ (感叹号) = 10\n`;
        result += `？ (问号) = 11\n\n`;
        result += `⚠️ 把编码标点插入普通文本中可隐藏信息`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('编码完成');
        CryptoApp.addHistory('标点编码', text, encoded);
    },

    // ========== 图片选择 ==========
    chooseImage() {
        let result = `🖼️ 图片隐写 - 选择图片\n══════════════════\n\n`;
        result += `在浏览器中选择图片方案:\n\n`;
        result += `1. 使用文件输入:\n`;
        result += `   <input type="file" accept="image/*"\n`;
        result += `          onchange="handleImage(this)">\n\n`;
        result += `2. 读取图片数据:\n`;
        result += `   const img = new Image();\n`;
        result += `   img.onload = () => ctx.drawImage(img, 0, 0);\n`;
        result += `   img.src = URL.createObjectURL(file);\n\n`;
        result += `3. 获取像素数据:\n`;
        result += `   const data = ctx.getImageData(0, 0, w, h).data;\n`;
        result += `   // data[i] = R, data[i+1] = G, data[i+2] = B`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('图片操作指南已显示');
    },
    // ========== LSB 隐写嵌入 ==========
    lsbEmbed() {
        let result = `🖼️ LSB 隐写嵌入\n════════════════\n\n`;
        result += `LSB (Least Significant Bit) 原理:\n`;
        result += `修改像素最低位，人眼不可察觉\n\n`;
        result += `浏览器端实现方案:\n\n`;
        result += `1. 读取图片到 Canvas:\n`;
        result += `   const img = new Image();\n`;
        result += `   img.onload = () => {\n`;
        result += `     ctx.drawImage(img, 0, 0);\n`;
        result += `     const data = ctx.getImageData(0,0,w,h);\n\n`;
        result += `2. 嵌入数据到 LSB:\n`;
        result += `   for (let i=0; i<data.length; i+=4) {\n`;
        result += `     data[i] = (data[i] & 0xFE) | bit; // R通道\n`;
        result += `   }\n\n`;
        result += `3. 导出图片:\n`;
        result += `   canvas.toDataURL('image/png');\n\n`;
        result += `⚠️ 注意: LSB嵌入会降低图片质量\n`;
        result += `建议: 使用 PNG (无损), 避免 JPEG (有损)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('LSB嵌入方法已显示');
    },

    // ========== LSB 隐写提取 ==========
    lsbExtract() {
        let result = `🖼️ LSB 隐写提取\n════════════════\n\n`;
        result += `提取步骤:\n\n`;
        result += `1. 将含隐写的图片加载到Canvas\n`;
        result += `2. 读取像素数据:\n`;
        result += `   const data = ctx.getImageData(0,0,w,h).data;\n\n`;
        result += `3. 提取LSB位:\n`;
        result += `   let bits = '';\n`;
        result += `   for (let i=0; i<data.length; i+=4) {\n`;
        result += `     bits += (data[i] & 1).toString();\n`;
        result += `   }\n\n`;
        result += `4. 将比特流转为文本:\n`;
        result += `   for (let i=0; i<bits.length; i+=8) {\n`;
        result += `     result += String.fromCharCode(\n`;
        result += `       parseInt(bits.substr(i,8), 2));\n`;
        result += `   }\n\n`;
        result += `💡 检测LSB隐写:\n`;
        result += `• 查看像素值的奇偶分布\n`;
        result += `• 使用 stegdetect 工具\n`;
        result += `• 分析相邻像素的相关性`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('LSB提取方法已显示');
    },

    // ========== 音频隐写（回声隐藏）==========
    audioEcho() {
        let result = `🔊 回声隐藏 (Echo Hiding)\n════════════════\n\n`;
        result += `原理: 在音频中嵌入微小回声\n`;
        result += `• 有回声 = 比特 1\n`;
        result += `• 无回声 = 比特 0\n\n`;
        result += `浏览器端实现 (Web Audio API):\n\n`;
        result += `// 创建回声效果\n`;
        result += `const ctx = new AudioContext();\n`;
        result += `const source = ctx.createBufferSource();\n`;
        result += `const delay = ctx.createDelay();\n`;
        result += `delay.delayTime.value = 0.001; // 1ms\n\n`;
        result += `⚠️ 回声隐藏需要:\n`;
        result += `• 精确的延迟控制\n`;
        result += `• 傅里叶变换分析\n`;
        result += `• 建议使用专用库: \n`;
        result += `  - steganography.js\n`;
        result += `  - OpenStego (Java)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('回声隐藏信息已显示');
    },

    // ========== 相位编码 ==========
    phaseCoding() {
        let result = `〰️ 相位编码隐写\n════════════════\n\n`;
        result += `原理: 修改音频信号的相位信息\n`;
        result += `人耳对相位变化不敏感\n\n`;
        result += `实现步骤:\n`;
        result += `1. 对音频帧做 FFT (快速傅里叶变换)\n`;
        result += `2. 修改相位分量\n`;
        result += `3. 逆 FFT 重建音频\n\n`;
        result += `浏览器端 FFT 库:\n`;
        result += `• dsp.js (DSP处理)\n`;
        result += `• Meyda (音频特征提取)\n`;
        result += `• FFT.js (纯JS实现)\n\n`;
        result += `代码示例:\n`;
        result += `import { FFT } from 'fft.js';\n`;
        result += `const phasor = new FFT(N).createComplexArray();\n`;
        result += `FFT(N).realTransform(phasor, signal);`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('相位编码信息已显示');
    },

    // ========== 扩频隐写 ==========
    spreadSpectrum() {
        let result = `📡 扩频隐写 (Spread Spectrum)\n════════════════\n\n`;
        result += `原理: 将秘密信息分散到宽频带\n`;
        result += `难以检测、抗干扰能力强\n\n`;
        result += `扩频方式:\n`;
        result += `• FHSS (跳频): 频繁切换频率\n`;
        result += `• DSSS (直序): 用伪随机码扩频\n`;
        result += `• THSS (跳时): 时间域扩频\n\n`;
        result += `在音频/图像中应用:\n`;
        result += `• 将消息伪随机化后嵌入\n`;
        result += `• 每个比特分散到多个采样点\n`;
        result += `• 需要密钥来恢复原始序列`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('扩频隐写信息已显示');
    },

    // ========== 音频分析 ==========
    audioAnalyze() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `🔊 音频隐写分析\n════════════════\n\n`;

        if (text && (text.endsWith('.wav') || text.endsWith('.mp3'))) {
            result += `文件: ${text}\n\n`;
        }

        result += `浏览器端音频分析:\n\n`;
        result += `// 使用 Web Audio API 分析\n`;
        result += `const audioCtx = new AudioContext();\n`;
        result += `const analyzer = audioCtx.createAnalyser();\n`;
        result += `analyzer.fftSize = 2048;\n`;
        result += `const data = new Uint8Array(1024);\n`;
        result += `analyzer.getByteFrequencyData(data);\n\n`;

        result += `检测指标:\n`;
        result += `• 频谱异常 (突然的能量增加)\n`;
        result += `• 相位不连续性\n`;
        result += `• 信噪比 (SNR) 异常\n`;
        result += `• 波形统计图异常`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('音频分析方法已显示');
    },

    // ========== 视频帧隐写 ==========
    videoFrame() {
        let result = `🎬 视频帧隐写\n════════════════\n\n`;
        result += `原理: 在视频的某些帧中嵌入信息\n`;
        result += `• 可嵌入到 I帧、P帧或B帧\n`;
        result += `• 可修改DCT系数 (类似JPEG)\n\n`;
        result += `浏览器端处理视频:\n\n`;
        result += `// 使用 MediaStream API\n`;
        result += `const video = document.createElement('video');\n`;
        result += `video.ontimeupdate = () => {\n`;
        result += `  ctx.drawImage(video, 0, 0);\n`;
        result += `  // 对当前帧做LSB嵌入\n`;
        result += `};\n\n`;
        result += `⚠️ 视频编码会破坏隐写:\n`;
        result += `• 有损压缩会丢失LSB\n`;
        result += `• 建议使用未压缩格式(AVI, MOV)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('视频帧隐写信息已显示');
    },

    // ========== 运动矢量隐写 ==========
    motionVector() {
        let result = `🎬 运动矢量隐写\n════════════════\n\n`;
        result += `原理: 修改视频编码中的运动矢量\n`;
        result += `• H.264/H.265 使用运动补偿\n`;
        result += `• 修改运动矢量可嵌入信息\n`;
        result += `• 对视频质量影响极小\n\n`;
        result += `实现难度: ⭐⭐⭐⭐⭐\n`;
        result += `需要深入理解视频编码标准\n\n`;
        result += `推荐工具:\n`;
        result += `• FFmpeg (可修改编码参数)\n`;
        result += `• HM (HEVC 参考软件)\n`;
        result += `• VTM (VVC 参考软件)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('运动矢量隐写信息已显示');
    },

    // ========== 视频分析 ==========
    videoAnalyze() {
        let result = `🎬 视频隐写分析\n════════════════\n\n`;
        result += `检测方法:\n\n`;
        result += `1. 帧间差分分析:\n`;
        result += `   检查连续帧之间是否有异常\n\n`;
        result += `2. 统计检测:\n`;
        result += `   分析DCT系数的分布\n\n`;
        result += `3. 机器学习检测:\n`;
        result += `   训练分类器识别隐写视频\n\n`;
        result += `浏览器端方案:\n`;
        result += `• 使用 <video> + Canvas 提取帧\n`;
        result += `• 逐帧分析像素统计\n`;
        result += `• 检测帧间异常相关性`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('视频分析方法已显示');
    },

    // ========== 文件追加隐写 ==========
    fileAppend() {
        let result = `📎 文件追加隐写\n════════════════\n\n`;
        result += `原理: 在文件末尾追加数据\n`;
        result += `• 图片查看器忽略文件末尾数据\n`;
        result += `• 常用格式: JPEG, PNG, PDF, MP3\n\n`;
        result += `检测方法:\n`;
        result += `• 检查文件实际大小 vs 声明大小\n`;
        result += `• 使用 hex编辑器查看文件末尾\n`;
        result += `• 命令: tail -c 100 file.jpg | xxd\n\n`;
        result += `浏览器端检测:\n`;
        result += `function checkFileEnd(file) {\n`;
        result += `  const end = file.slice(-1024);\n`;
        result += `  // 读取文件末尾数据\n`;
        result += `}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件追加信息已显示');
    },

    // ========== 磁盘空闲空间隐写 ==========
    fileSlack() {
        let result = `💾 磁盘空闲空间隐写\n════════════════\n\n`;
        result += `原理: 利用文件系统的 slack space\n`;
        result += `• 文件占用整数个簇\n`;
        result += `• 最后一个簇的剩余空间可用于存储\n`;
        result += `• 操作系统不会覆盖这部分空间\n\n`;
        result += `⚠️ 此技术需要:\n`;
        result += `• 直接访问磁盘 (管理员权限)\n`;
        result += `• 理解文件系统结构 (NTFS, ext4)\n`;
        result += `• 无法在浏览器端实现\n\n`;
        result += `工具: \n`;
        result += `• Autopsy (数字取证)\n`;
        result += `• EnCase (取证软件)\n`;
        result += `• dd (Linux 磁盘工具)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('磁盘空间隐写信息已显示');
    },

    // ========== 元数据隐写 ==========
    metadata() {
        let result = `🏷️ 元数据隐写\n════════════════\n\n`;
        result += `原理: 在文件元数据字段中隐藏信息\n\n`;
        result += `常见文件类型的元数据:\n`;
        result += `• JPEG: EXIF (相机型号、GPS等)\n`;
        result += `• PNG: tEXt chunk (自定义文本)\n`;
        result += `• MP3: ID3 tag (标题、艺术家)\n`;
        result += `• PDF: 作者、标题、关键词\n`;
        result += `• Office: 作者、修订记录\n\n`;
        result += `浏览器端修改元数据:\n`;
        result += `// PNG tEXt chunk 手动构建\n`;
        result += `const png = await file.arrayBuffer();\n`;
        result += `// 在 IEND chunk 前插入 tEXt\n`;
        result += `\n⚠️ 注意: 修改元数据可能破坏文件签名`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('元数据隐写信息已显示');
    },

    // ========== 文件雕刻 ==========
    fileCarving() {
        let result = `🔍 文件雕刻 (File Carving)\n════════════════\n\n`;
        result += `原理: 无需文件系统，直接扫描磁盘\n`;
        result += `通过文件头/尾签名恢复文件\n\n`;
        result += `常见文件签名:\n`;
        result += `• JPEG: FF D8 FF E0 (头), FF D9 (尾)\n`;
        result += `• PNG: 89 50 4E 47 (头), IEND (尾)\n`;
        result += `• PDF: 25 50 44 46 (头)\n`;
        result += `• ZIP: 50 4B 03 04 (头)\n\n`;
        result += `浏览器端限制:\n`;
        result += `• 无法直接访问磁盘\n`;
        result += `• 可分析已上传的文件\n`;
        result += `• 检测文件中的嵌入文件\n\n`;
        result += `工具: Foremost, Photorec, Binwalk`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件雕刻信息已显示');
    },

    // ========== 文件分析 ==========
    fileAnalyze() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `🔍 文件隐写分析\n════════════════\n\n`;

        if (text) {
            result += `文件: ${text}\n\n`;
        }

        result += `分析方法:\n\n`;
        result += `1. 文件头检查:\n`;
        result += `   对比实际内容与扩展名\n\n`;
        result += `2. 熵值分析:\n`;
        result += `   高熵值可能意味着加密或隐写\n\n`;
        result += `3. 字符串提取:\n`;
        result += `   strings file.bin | grep -i 'hidden'\n\n`;
        result += `4. 元数据检查:\n`;
        result += `   exiftool file.jpg\n\n`;

        result += `浏览器端分析代码:\n`;
        result += `async function analyzeFile(file) {\n`;
        result += `  const buf = await file.arrayBuffer();\n`;
        result += `  const header = new Uint8Array(buf, 0, 8);\n`;
        result += `  console.log('Header:', header);\n`;
        result += `}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('文件分析方法已显示');
    },

    // ========== 网络时序隐写 ==========
    networkTiming() {
        let result = `🌐 网络时序隐写\n════════════════\n\n`;
        result += `原理: 利用数据包之间的时间间隔编码信息\n`;
        result += `• 短间隔 = 比特 0\n`;
        result += `• 长间隔 = 比特 1\n\n`;
        result += `特点:\n`;
        result += `• 不修改数据包内容\n`;
        result += `• 难以被内容检测发现\n`;
        result += `• 可通过流量分析检测\n\n`;
        result += `检测:\n`;
        result += `• Wireshark: 分析包间间隔 (IAT)\n`;
        result += `• 画直方图查看间隔分布\n`;
        result += `• 正常流量间隔呈指数分布`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('网络时序隐写信息已显示');
    },

    // ========== 包大小隐写 ==========
    packetSize() {
        let result = `📦 包大小隐写\n════════════════\n\n`;
        result += `原理: 利用网络包的大小来编码信息\n`;
        result += `• 小包 = 比特 0\n`;
        result += `• 大包 = 比特 1\n`;
        result += `• 或使用包大小 mod N 来编码\n\n`;
        result += `实现:\n`;
        result += `• 控制发送数据包的大小\n`;
        result += `• 接收方测量包大小来解码\n\n`;
        result += `检测:\n`;
        result += `• 分析包大小分布\n`;
        result += `• 检查是否符合正常分布\n`;
        result += `• 使用机器学习分类\n\n`;
        result += `⚠️ 实际网络中包大小会被MTU限制`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('包大小隐写信息已显示');
    },

    // ========== 协议头部隐写 ==========
    protocolHeader() {
        let result = `📡 协议头部隐写\n════════════════\n\n`;
        result += `原理: 在协议头的保留字段/可选字段中隐藏信息\n\n`;
        result += `可用字段:\n`;
        result += `• IPv4: Flags (保留位), Options\n`;
        result += `• TCP: Reserved bits (4 bits)\n`;
        result += `• HTTP: 自定义 Header (X-*)\n`;
        result += `• DNS: TXT 记录的附加数据\n\n`;
        result += `检测:\n`;
        result += `• 深度包检测 (DPI)\n`;
        result += `• 检查保留字段是否被修改\n`;
        result += `• 对比正常流量基线\n\n`;
        result += `⚠️ 修改协议头可能被防火墙拦截`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('协议头部隐写信息已显示');
    },

    // ========== DNS 隧道 ==========
    dnsTunnel() {
        let result = `🌐 DNS 隧道隐写\n════════════════\n\n`;
        result += `原理: 利用DNS查询/响应隐藏数据\n`;
        result += `• 将信息编码到子域名中\n`;
        result += `• 例如: secret.example.com → bXlrX3NlY3JldA==.evil.com\n\n`;
        result += `特点:\n`;
        result += `• 可绕过防火墙 (DNS通常开放)\n`;
        result += `• 传输速度慢\n`;
        result += `• 易被检测到异常DNS模式\n\n`;
        result += `工具:\n`;
        result += `• Iodine (DNS隧道)\n`;
        result += `• Dnscat2 (C&C 通信)\n`;
        result += `• Cobalt Strike (商业渗透工具)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('DNS隧道信息已显示');
    },

    // ========== ICMP 隧道 ==========
    icmpTunnel() {
        let result = `📡 ICMP 隧道隐写\n════════════════\n\n`;
        result += `原理: 在 ICMP (Ping) 包的数据字段隐藏信息\n`;
        result += `• Ping 请求/响应的 data 字段可自定义\n`;
        result += `• 防火墙通常允许 ICMP\n\n`;
        result += `实现:\n`;
        result += `• 发送: ping -p 68656c6c6f target\n`;
        result += `  (-p 指定数据模式的十六进制)\n\n`;
        result += `检测:\n`;
        result += `• ICMP 包大小异常\n`;
        result += `• ICMP 频率异常\n`;
        result += `• 数据字段不是标准填充模式\n\n`;
        result += `工具: Ptunnel, Icmptx`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('ICMP隧道信息已显示');
    },

    // ========== 隐写检测（综合）==========
    detectStego() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `🔍 隐写检测（综合）\n════════════════\n\n`;

        if (text) {
            result += `目标: ${text}\n\n`;
        }

        result += `检测流程:\n\n`;
        result += `1. 视觉检测 (图像):\n`;
        result += `   增强对比度，查看异常模式\n\n`;
        result += `2. 统计检测:\n`;
        result += `   卡方检验、RS分析、样本对分析\n\n`;
        result += `3. 机器学习检测:\n`;
        result += `   训练分类器 (CNN、SVM)\n\n`;
        result += `推荐工具:\n`;
        result += `• Stegdetect (JPEG LSB检测)\n`;
        result += `• StegExpose (多算法检测)\n`;
        result += `• Aletheia (AI隐写检测)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('隐写检测方法已显示');
    },

    // ========== 卡方检测 ==========
    chiSquare() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `📊 卡方检测 (Chi-Square Test)\n════════════════\n\n`;

        if (text) {
            // 如果是数字列表，做卡方检测
            const nums = text.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
            if (nums.length > 5) {
                const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
                const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
                const chi2 = nums.reduce((a, b) => a + ((b - mean) ** 2) / mean, 0);

                result += `数据: [${nums.slice(0, 10).join(', ')}...]\n`;
                result += `均值: ${mean.toFixed(4)}\n`;
                result += `方差: ${variance.toFixed(4)}\n`;
                result += `卡方值: ${chi2.toFixed(4)}\n\n`;
                result += `判断: ${chi2 < nums.length * 2 ? '✅ 符合预期分布' : '⚠️ 可能偏离预期分布'}`;
                CryptoApp.setOutput(result);
                CryptoApp.showToast('卡方检测完成');
                return;
            }
        }

        result += `原理: 比较观察频数和期望频数\n\n`;
        result += `用于隐写检测:\n`;
        result += `• 假设: 嵌入隐写后像素值分布改变\n`;
        result += `• 零假设: 分布无变化 (无隐写)\n`;
        result += `• 若 p-value < 0.05，拒绝零假设\n\n`;
        result += `公式: χ² = Σ [(O-E)²/E]\n`;
        result += `O = 观察频数, E = 期望频数\n\n`;
        result += `输入数字列表可进行卡方检验`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('卡方检测信息已显示');
    },

    // ========== RS 分析 ==========
    rsAnalysis() {
        let result = `📊 RS 分析 (RS Method)\n════════════════\n\n`;
        result += `原理: 分析图像中"平滑"和"非平滑"像素组\n\n`;
        result += `步骤:\n`;
        result += `1. 将像素分组 (每组2个)\n`;
        result += `2. 定义翻转函数 F (翻转LSB)\n`;
        result += `3. 计算平滑度 R (Regular) 和 S (Singular)\n`;
        result += `4. 若 R ≈ S，则无隐写\n`;
        result += `   若 R ≫ S，则可能有LSB隐写\n\n`;
        result += `优点:\n`;
        result += `• 可估计隐写消息长度\n`;
        result += `• 对低嵌入率也有效\n\n`;
        result += `工具: StegExpose (包含RS分析)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('RS分析信息已显示');
    },

    // ========== 样本对分析 ==========
    samplePairs() {
        let result = `📊 样本对分析 (Sample Pairs)\n════════════════\n\n`;
        result += `原理: 分析相邻像素值的联合分布\n\n`;
        result += `方法:\n`;
        result += `1. 统计相邻像素值对的频数\n`;
        result += `2. 计算 x 和 x+1 的频数比\n`;
        result += `3. 若分布异常，可能含隐写\n\n`;
        result += `对 LSB 隐写特别有效:\n`;
        result += `• LSB 嵌入会改变奇偶分布\n`;
        result += `• 样本对分析可检测这种改变\n\n`;
        result += `方程: P(x,x+1)/P(x+1,x) ≈ 1 (无隐写)\n`;
        result += `         ≠ 1 (有隐写)`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('样本对分析信息已显示');
    },

    // ========== 视觉攻击 ==========
    visualAttack() {
        let result = `👁️ 视觉攻击 (Visual Attack)\n════════════════\n\n`;
        result += `原理: 通过图像处理技术增强隐写痕迹\n\n`;
        result += `方法:\n`;
        result += `1. 计算差分图像:\n`;
        result += `   新图 = |原图 - 移位图|\n\n`;
        result += `2. 增强对比度:\n`;
        result += `   直方图均衡化\n\n`;
        result += `3. 边缘检测:\n`;
        result += `   Sobel、Canny 边缘检测\n\n`;
        result += `在浏览器中实现:\n`;
        result += `const data = ctx.getImageData(...).data;\n`;
        result += `for (let i=0; i<data.length; i+=4) {\n`;
        result += `  // 计算相邻像素差\n`;
        result += `}`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('视觉攻击方法已显示');
    },

    // ========== 统计攻击 ==========
    statisticalAttack() {
        let result = `📊 统计攻击\n════════════════\n\n`;
        result += `原理: 利用统计特征检测隐写\n\n`;
        result += `常见统计攻击:\n`;
        result += `• 卡方检测 (Chi-Square)\n`;
        result += `• RS 分析 (Regular-Singular)\n`;
        result += `• 样本对分析 (Sample Pairs)\n`;
        result += `• 直方图分析 (Histogram)\n\n`;
        result += `攻击流程:\n`;
        result += `1. 提取载体统计特征\n`;
        result += `2. 对比隐写后统计特征\n`;
        result += `3. 建立分类模型\n`;
        result += `4. 检测未知样本\n\n`;
        result += `💡 隐写术和隐写分析是猫鼠游戏`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('统计攻击信息已显示');
    },

    // ========== 全面分析 ==========
    analyzeAll() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `🔍 全面隐写分析\n════════════════\n\n`;

        if (text) {
            result += `目标: ${text}\n`;
            result += `类型: ${text.match(/\.(jpg|png|gif|bmp)$/i) ? '图像' : text.match(/\.(wav|mp3|flac)$/i) ? '音频' : text.match(/\.(mp4|avi|mov)$/i) ? '视频' : '未知'}\n\n`;
        }

        result += `分析项目:\n\n`;
        result += `✅ 文件格式验证\n`;
        result += `✅ 熵值分析\n`;
        result += `✅ LSB 检测 (图像)\n`;
        result += `✅ 卡方检测\n`;
        result += `✅ RS 分析\n`;
        result += `✅ 元数据检查\n`;
        result += `✅ 字符串提取\n\n`;

        result += `执行命令 (需后端):\n`;
        result += `stegexpose -t 50 file\n`;
        result += `aletheia -a all file output`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('全面分析方案已显示');
    },

    // ========== 隐写基准测试 ==========
    stegoBenchmark() {
        let result = `📈 隐写基准测试\n════════════════\n\n`;
        result += `测试指标:\n\n`;
        result += `1. 容量 (Capacity):\n`;
        result += `   可嵌入的最大信息量\n\n`;
        result += `2. 不可感知性 (Imperceptibility):\n`;
        result += `   PSNR (峰值信噪比), SSIM (结构相似性)\n\n`;
        result += `3. 鲁棒性 (Robustness):\n`;
        result += `   抗压缩、抗噪声、抗裁剪\n\n`;
        result += `4. 安全性 (Security):\n`;
        result += `   抗统计检测能力\n\n`;
        result += `PSNR 计算:\n`;
        result += `PSNR = 10 × log10(MAX²/MSE)\n`;
        result += `> 40dB = 优秀, > 30dB = 良好`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('基准测试信息已显示');
    },

    // ========== 隐写比较 ==========
    stegoCompare() {
        let result = `📊 隐写算法比较\n════════════════\n\n`;
        result += `算法对比:\n\n`;
        result += `LSB:\n`;
        result += `  容量: ⭐⭐⭐⭐  |  不可感知: ⭐⭐⭐  |  鲁棒性: ⭐\n\n`;
        result += `DCT (JPEG):\n`;
        result += `  容量: ⭐⭐⭐  |  不可感知: ⭐⭐⭐⭐ |  鲁棒性: ⭐⭐\n\n`;
        result += `DWT (小波):\n`;
        result += `  容量: ⭐⭐  |  不可感知: ⭐⭐⭐⭐ |  鲁棒性: ⭐⭐⭐\n\n`;
        result += `扩频 (Spread Spectrum):\n`;
        result += `  容量: ⭐  |  不可感知: ⭐⭐⭐⭐ |  鲁棒性: ⭐⭐⭐⭐⭐\n\n`;
        result += `选择建议:\n`;
        result += `• 高容量 → LSB\n`;
        result += `• 高不可感知 → DWT\n`;
        result += `• 高鲁棒性 → 扩频`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('算法比较已显示');
    },

    // ========== 隐写报告 ==========
    stegoReport() {
        const text = CryptoApp.dom.inputText.value.trim();
        let result = `📋 隐写分析报告\n════════════════\n\n`;

        result += `报告模板:\n\n`;
        result += `1. 基本信息:\n`;
        result += `   - 文件名: ${text || '[未指定]'}\n`;
        result += `   - 分析时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
        result += `2. 检测方法:\n`;
        result += `   - [ ] 视觉检测\n`;
        result += `   - [ ] 统计检测 (卡方、RS)\n`;
        result += `   - [ ] 机器学习检测\n\n`;
        result += `3. 检测结果:\n`;
        result += `   - 隐写: [是/否]\n`;
        result += `   - 算法: [LSB/DCT/DWT/未知]\n`;
        result += `   - 嵌入率: [...]%\n\n`;
        result += `4. 结论:\n`;
        result += `   [根据检测结果填写]`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('报告模板已生成');
    },

    // ========== 隐写清理 ==========
    stegoClean() {
        let result = `🧹 隐写清理\n════════════════\n\n`;
        result += `清理方法:\n\n`;
        result += `1. LSB 清理:\n`;
        result += `   将像素 LSB 全部设为 0\n`;
        result += `   for each pixel: pixel = pixel & 0xFE\n\n`;
        result += `2. 重压缩:\n`;
        result += `   用 JPEG 重新保存 (破坏DCT隐写)\n\n`;
        result += `3. 格式转换:\n`;
        result += `   PNG → JPEG → PNG (破坏LSB)\n\n`;
        result += `4. 加噪:\n`;
        result += `   添加少量高斯噪声\n\n`;
        result += `⚠️ 清理可能降低图像质量`;

        CryptoApp.setOutput(result);
        CryptoApp.showToast('隐写清理方法已显示');
    },

    // ========== 隐写历史 ==========
    stegoHistory() {
        let result = `📜 隐写操作历史\n════════════════\n\n`;
        result += `最近的隐写操作:\n\n`;

        // 从 localStorage 读取历史
        const history = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('stego_')) {
                try {
                    const entry = JSON.parse(localStorage.getItem(key));
                    history.push(entry);
                } catch {}
            }
        }

        if (history.length === 0) {
            result += `暂无历史记录\n`;
            result += `使用隐写功能后会自动记录`;
        } else {
            history.slice(-10).forEach((h, i) => {
                result += `${i+1}. [${h.time}] ${h.action}: ${h.summary}\n`;
            });
        }

        CryptoApp.setOutput(result);
        CryptoApp.showToast('历史记录已显示');
    }
};

// 导出到全局
window.stego = StegoModule;