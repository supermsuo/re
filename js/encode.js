/* ==============================================
   智能密码工具箱 v9.0 - 编码转换模块
   ============================================== */

const EncodeModule = {
    urlEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要编码的内容', 'warning');
            return;
        }
        
        CryptoApp.setOutput(encodeURIComponent(text));
        CryptoApp.showToast('URL编码完成');
        CryptoApp.addHistory('URL编码', text, encodeURIComponent(text));
    },
    
    urlDecode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要解码的内容', 'warning');
            return;
        }
        
        try {
            const decoded = decodeURIComponent(text);
            CryptoApp.setOutput(decoded);
            CryptoApp.showToast('URL解码完成');
            CryptoApp.addHistory('URL解码', text, decoded);
        } catch (e) {
            CryptoApp.setOutput(`URL解码失败: ${e.message}`);
            CryptoApp.showToast('解码失败', 'error');
        }
    },
    
    hexEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要编码的内容', 'warning');
            return;
        }
        
        const bytes = new TextEncoder().encode(text);
        const result = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('Hex编码完成');
        CryptoApp.addHistory('Hex编码', text, result);
    },
    
    hexDecode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要解码的内容', 'warning');
            return;
        }
        
        try {
            const hex = text.replace(/\s/g, '');
            if (hex.length % 2 !== 0) {
                CryptoApp.setOutput('Hex长度必须为偶数');
                CryptoApp.showToast('长度错误', 'error');
                return;
            }
            
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) {
                bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
            }
            const result = new TextDecoder().decode(bytes);
            
            CryptoApp.setOutput(result);
            CryptoApp.showToast('Hex解码完成');
            CryptoApp.addHistory('Hex解码', text, result);
        } catch (e) {
            CryptoApp.setOutput(`Hex解码失败: ${e.message}`);
            CryptoApp.showToast('解码失败', 'error');
        }
    },
    
    base64Encode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要编码的内容', 'warning');
            return;
        }
        
        // 支持 Unicode：先 encodeURIComponent 再 btoa
        const result = btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)));
        CryptoApp.setOutput(result);
        CryptoApp.showToast('Base64编码完成');
        CryptoApp.addHistory('Base64编码', text, result);
    },
    
    base64Decode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要解码的内容', 'warning');
            return;
        }
        
        try {
            // 支持 Unicode：先 atob 再 decodeURIComponent
            const decoded = decodeURIComponent(Array.from(atob(text), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            CryptoApp.setOutput(decoded);
            CryptoApp.showToast('Base64解码完成');
            CryptoApp.addHistory('Base64解码', text, decoded);
        } catch (e) {
            CryptoApp.setOutput(`Base64解码失败: ${e.message}`);
            CryptoApp.showToast('解码失败', 'error');
        }
    },
    
    // 其他编码函数
    htmlEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要编码的内容', 'warning'); return; }
        const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;', ' ':'&nbsp;', '©':'&copy;', '®':'&reg;', '™':'&trade;', '¥':'&yen;', '€':'&euro;', '£':'&pound;', '§':'&sect;', '°':'&deg;', '±':'&plusmn;', '×':'&times;', '÷':'&divide;' };
        const result = text.split('').map(c => map[c] !== undefined ? map[c] : c).join('');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('HTML实体编码完成');
        CryptoApp.addHistory('HTML编码', text, result);
    },
    
    htmlDecode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要解码的内容', 'warning'); return; }
        const el = document.createElement('textarea');
        el.innerHTML = text;
        const result = el.value;
        CryptoApp.setOutput(result);
        CryptoApp.showToast('HTML实体解码完成');
        CryptoApp.addHistory('HTML解码', text, result);
    },
    
    unicodeEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要编码的内容', 'warning'); return; }
        const result = text.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('Unicode编码完成');
        CryptoApp.addHistory('Unicode编码', text, result);
    },
    
    unicodeDecode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要解码的内容', 'warning'); return; }
        try {
            const result = text.replace(/\\u([0-9a-fA-F]{4})/g, (m, code) => String.fromCharCode(parseInt(code, 16)));
            CryptoApp.setOutput(result);
            CryptoApp.showToast('Unicode解码完成');
            CryptoApp.addHistory('Unicode解码', text, result);
        } catch (e) {
            CryptoApp.setOutput(`Unicode解码失败: ${e.message}`);
            CryptoApp.showToast('解码失败', 'error');
        }
    },
    
    binaryEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要编码的内容', 'warning'); return; }
        const result = Array.from(new TextEncoder().encode(text)).map(b => b.toString(2).padStart(8, '0')).join(' ');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('二进制编码完成');
        CryptoApp.addHistory('二进制编码', text, result);
    },
    
    binaryDecode() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入二进制数据', 'warning'); return; }
        try {
            const bytes = text.split(/\s+/).map(b => parseInt(b, 2));
            if (bytes.some(isNaN)) throw new Error('包含无效的二进制数据');
            const result = new TextDecoder().decode(new Uint8Array(bytes));
            CryptoApp.setOutput(result);
            CryptoApp.showToast('二进制解码完成');
            CryptoApp.addHistory('二进制解码', text, result);
        } catch (e) {
            CryptoApp.setOutput(`二进制解码失败: ${e.message}`);
            CryptoApp.showToast('解码失败', 'error');
        }
    },
    
    octalEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要编码的内容', 'warning'); return; }
        const result = Array.from(new TextEncoder().encode(text)).map(b => b.toString(8).padStart(3, '0')).join(' ');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('八进制编码完成');
        CryptoApp.addHistory('八进制编码', text, result);
    },
    
    octalDecode() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入八进制数据', 'warning'); return; }
        try {
            const bytes = text.split(/\s+/).map(b => parseInt(b, 8));
            if (bytes.some(isNaN)) throw new Error('包含无效的八进制数据');
            const result = new TextDecoder().decode(new Uint8Array(bytes));
            CryptoApp.setOutput(result);
            CryptoApp.showToast('八进制解码完成');
            CryptoApp.addHistory('八进制解码', text, result);
        } catch (e) {
            CryptoApp.setOutput(`八进制解码失败: ${e.message}`);
            CryptoApp.showToast('解码失败', 'error');
        }
    },
    
    base32Encode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要编码的内容', 'warning'); return; }
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const bytes = new TextEncoder().encode(text);
        let bits = '';
        for (const b of bytes) bits += b.toString(2).padStart(8, '0');
        while (bits.length % 5 !== 0) bits += '0';
        let result = '';
        for (let i = 0; i < bits.length; i += 5) {
            result += alphabet[parseInt(bits.substring(i, i + 5), 2)];
        }
        while (result.length % 8 !== 0) result += '=';
        CryptoApp.setOutput(result);
        CryptoApp.showToast('Base32编码完成');
        CryptoApp.addHistory('Base32编码', text, result);
    },
    
    base32Decode() {
        const text = CryptoApp.dom.inputText.value.trim().replace(/=+$/, '');
        if (!text) { CryptoApp.showToast('请输入Base32数据', 'warning'); return; }
        try {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let bits = '';
            for (const c of text.toUpperCase()) {
                const idx = alphabet.indexOf(c);
                if (idx === -1) throw new Error(`无效字符: ${c}`);
                bits += idx.toString(2).padStart(5, '0');
            }
            const byteLen = Math.floor(bits.length / 8);
            const bytes = [];
            for (let i = 0; i < byteLen; i++) {
                bytes.push(parseInt(bits.substring(i * 8, i * 8 + 8), 2));
            }
            const result = new TextDecoder().decode(new Uint8Array(bytes));
            CryptoApp.setOutput(result);
            CryptoApp.showToast('Base32解码完成');
            CryptoApp.addHistory('Base32解码', text, result);
        } catch (e) {
            CryptoApp.setOutput(`Base32解码失败: ${e.message}`);
            CryptoApp.showToast('解码失败', 'error');
        }
    },
    
    base16Encode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要编码的内容', 'warning'); return; }
        const result = Array.from(new TextEncoder().encode(text)).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join('');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('Base16编码完成');
        CryptoApp.addHistory('Base16编码', text, result);
    },
    
    base58Encode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要编码的内容', 'warning'); return; }
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const bytes = new TextEncoder().encode(text);
        let num = 0n;
        for (const b of bytes) num = num * 256n + BigInt(b);
        let result = '';
        while (num > 0n) { result = alphabet[Number(num % 58n)] + result; num /= 58n; }
        for (const b of bytes) { if (b === 0) result = '1' + result; else break; }
        CryptoApp.setOutput(result || '1');
        CryptoApp.showToast('Base58编码完成');
        CryptoApp.addHistory('Base58编码', text, result);
    },
    
    baseConvert() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入需要转换的数字', 'warning'); return; }
        const fromBase = parseInt(prompt('源进制 (2-36):', '10'));
        const toBase = parseInt(prompt('目标进制 (2-36):', '16'));
        if (isNaN(fromBase) || isNaN(toBase) || fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
            CryptoApp.showToast('进制范围: 2-36', 'warning'); return;
        }
        const num = parseInt(text, fromBase);
        if (isNaN(num)) { CryptoApp.showToast('输入不是有效的源进制数', 'error'); return; }
        const result = num.toString(toBase).toUpperCase();
        CryptoApp.setOutput(`${fromBase}进制 → ${toBase}进制\n\n输入: ${text}\n输出: ${result}\n十进制: ${num}`);
        CryptoApp.showToast(`${fromBase}→${toBase}进制转换完成`);
        CryptoApp.addHistory('进制转换', text, result);
    },
    
    baseBatch() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入十进制数字', 'warning'); return; }
        const num = parseInt(text);
        if (isNaN(num)) { CryptoApp.showToast('请输入有效的十进制数字', 'error'); return; }
        let result = `🔢 批量进制转换 (${num})\n═══════════════════\n\n`;
        result += `二进制 (BIN):  ${num.toString(2)}\n`;
        result += `八进制 (OCT):  ${num.toString(8)}\n`;
        result += `十进制 (DEC):  ${num}\n`;
        result += `十六进制 (HEX): ${num.toString(16).toUpperCase()}\n`;
        result += `Base36:       ${num.toString(36).toUpperCase()}\n\n`;
        result += `字节数据:\n`;
        const hex = num.toString(16).padStart(2, '0');
        const hexBytes = hex.length % 2 ? '0' + hex : hex;
        result += `HEX: ${hexBytes.match(/.{2}/g).join(' ')}\n`;
        result += `OCT: ${Array.from(new TextEncoder().encode(text)).map(b => b.toString(8).padStart(3, '0')).join(' ')}\n`;
        result += `BIN: ${Array.from(new TextEncoder().encode(text)).map(b => b.toString(2).padStart(8, '0')).join(' ')}`;
        CryptoApp.setOutput(result);
        CryptoApp.showToast('批量进制转换完成');
    },
    
    // 自动解码
    autoDecode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要解码的内容', 'warning');
            return;
        }
        
        let result = '🔍 自动编码检测与解码\n';
        result += '═══════════════════\n\n';
        
        // 尝试Base64
        try {
            if (/^[a-z0-9+/]+={0,2}$/i.test(text)) {
                const decoded = atob(text);
                if (!/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(decoded)) {
                    result += '✅ Base64 解码成功:\n';
                    result += decoded + '\n\n';
                    CryptoApp.setOutput(decoded);
                    CryptoApp.showToast('Base64解码成功');
                    return;
                }
            }
        } catch {}
        
        // 尝试Hex
        try {
            if (/^[a-f0-9]+$/i.test(text) && text.length % 2 === 0) {
                const hex = text.replace(/\s/g, '');
                let decoded = '';
                for (let i = 0; i < hex.length; i += 2) {
                    decoded += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                }
                if (!/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(decoded)) {
                    result += '✅ Hex 解码成功:\n';
                    result += decoded + '\n\n';
                    CryptoApp.setOutput(decoded);
                    CryptoApp.showToast('Hex解码成功');
                    return;
                }
            }
        } catch {}
        
        // 尝试URL
        try {
            if (/%/.test(text)) {
                const decoded = decodeURIComponent(text);
                if (decoded !== text) {
                    result += '✅ URL 解码成功:\n';
                    result += decoded + '\n\n';
                    CryptoApp.setOutput(decoded);
                    CryptoApp.showToast('URL解码成功');
                    return;
                }
            }
        } catch {}
        
        result += '❌ 自动解码失败，未识别出编码格式\n';
        result += '💡 建议: 手动选择编码类型进行解码\n';
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('自动解码失败', 'warning');
    },

    // ===== 补充缺失函数 =====

    convert() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const from = document.getElementById('encodeFrom')?.value || 'text';
        const to = document.getElementById('encodeTo')?.value || 'text';

        if (from === to) {
            CryptoApp.setOutput(text);
            CryptoApp.showToast('源和目标相同，无需转换');
            return;
        }

        // 第一步：将输入从源格式解码为明文
        let plain;
        try {
            switch (from) {
                case 'text': plain = text; break;
                case 'hex': {
                    const h = text.replace(/\s/g, '');
                    if (h.length % 2 !== 0) throw new Error('Hex长度必须为偶数');
                    plain = '';
                    for (let i = 0; i < h.length; i += 2) plain += String.fromCharCode(parseInt(h.substr(i, 2), 16));
                    break;
                }
                case 'base64': plain = atob(text); break;
                case 'url': plain = decodeURIComponent(text); break;
                case 'binary': {
                    const parts = text.trim().split(/\s+/);
                    plain = parts.map(b => String.fromCharCode(parseInt(b, 2))).join('');
                    break;
                }
                default: throw new Error('不支持的源格式: ' + from);
            }
        } catch (e) {
            CryptoApp.setOutput('解码源格式失败: ' + e.message);
            CryptoApp.showToast('解码失败', 'error');
            return;
        }

        // 第二步：将明文编码为目标格式
        try {
            let result;
            switch (to) {
                case 'text': result = plain; break;
                case 'hex': result = Array.from(new TextEncoder().encode(plain)).map(b => b.toString(16).padStart(2, '0')).join(' '); break;
                case 'base64': result = btoa(plain); break;
                case 'url': result = encodeURIComponent(plain); break;
                case 'binary': result = Array.from(new TextEncoder().encode(plain)).map(b => b.toString(2).padStart(8, '0')).join(' '); break;
                default: throw new Error('不支持的目标格式: ' + to);
            }
            CryptoApp.setOutput(result);
            CryptoApp.showToast(`${from} → ${to} 转换完成`);
            CryptoApp.addHistory(`编码转换(${from}→${to})`, text, result);
        } catch (e) {
            CryptoApp.setOutput('编码目标格式失败: ' + e.message);
            CryptoApp.showToast('编码失败', 'error');
        }
    },

    autoDetect() { this.autoDecode(); },

    base64UrlEncode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const result = btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('Base64URL编码完成');
        CryptoApp.addHistory('Base64URL编码', text, result);
    },

    base64UrlDecode() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        try {
            let s = text.replace(/-/g, '+').replace(/_/g, '/');
            while (s.length % 4) s += '=';
            const result = atob(s);
            CryptoApp.setOutput(result);
            CryptoApp.showToast('Base64URL解码完成');
            CryptoApp.addHistory('Base64URL解码', text, result);
        } catch (e) { CryptoApp.setOutput('Base64URL解码失败: ' + e.message); CryptoApp.showToast('解码失败', 'error'); }
    },

    base64File() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const b64 = ev.target.result.split(',')[1] || '';
                CryptoApp.setOutput(b64);
                CryptoApp.showToast('文件Base64编码完成');
            };
            reader.readAsDataURL(file);
        };
        input.click();
    },

    hexDump() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const bytes = new TextEncoder().encode(text);
        let result = '';
        for (let i = 0; i < bytes.length; i += 16) {
            const slice = bytes.slice(i, i + 16);
            const hex = Array.from(slice).map(b => b.toString(16).padStart(2, '0')).join(' ');
            const ascii = Array.from(slice).map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : '.').join('');
            result += i.toString(16).padStart(8, '0') + '  ' + hex.padEnd(48) + '  |' + ascii + '|\n';
        }
        CryptoApp.setOutput(result);
        CryptoApp.showToast('Hex Dump完成');
    },

    hexToBytes() {
        const text = CryptoApp.dom.inputText.value.replace(/\s/g, '');
        if (!text) { CryptoApp.showToast('请输入十六进制数据', 'warning'); return; }
        try {
            const bytes = [];
            for (let i = 0; i < text.length; i += 2) bytes.push(parseInt(text.substr(i, 2), 16));
            CryptoApp.setOutput('字节数组: [' + bytes.join(', ') + ']');
            CryptoApp.showToast('Hex转字节完成');
        } catch (e) { CryptoApp.setOutput('转换失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    bytesToHex() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入字节数组如 [72,101]', 'warning'); return; }
        try {
            const bytes = JSON.parse(text.startsWith('[') ? text : '[' + text + ']');
            const result = bytes.map(b => b.toString(16).padStart(2, '0')).join(' ');
            CryptoApp.setOutput(result);
            CryptoApp.showToast('字节转Hex完成');
        } catch (e) { CryptoApp.setOutput('转换失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    urlEncodeComponent() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput(encodeURIComponent(text));
        CryptoApp.showToast('URL组件编码完成');
    },

    urlDecodeComponent() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        try { CryptoApp.setOutput(decodeURIComponent(text)); CryptoApp.showToast('URL组件解码完成'); }
        catch (e) { CryptoApp.setOutput('解码失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    parseQueryString() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入URL或查询字符串', 'warning'); return; }
        try {
            const search = text.includes('?') ? text.split('?').slice(1).join('?') : text;
            const params = new URLSearchParams(search);
            const obj = {};
            params.forEach((v, k) => { obj[k] = v; });
            CryptoApp.setOutput(JSON.stringify(obj, null, 2));
            CryptoApp.showToast('查询参数解析完成');
        } catch (e) { CryptoApp.setOutput('解析失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    utf8Encode() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const bytes = new TextEncoder().encode(text);
        const result = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
        CryptoApp.setOutput('UTF-8 字节: ' + result + '\n字节数: ' + bytes.length);
        CryptoApp.showToast('UTF-8编码完成');
    },

    utf8Decode() {
        const text = CryptoApp.dom.inputText.value.replace(/\s/g, '');
        if (!text) { CryptoApp.showToast('请输入UTF-8十六进制', 'warning'); return; }
        try {
            const bytes = [];
            for (let i = 0; i < text.length; i += 2) bytes.push(parseInt(text.substr(i, 2), 16));
            CryptoApp.setOutput(new TextDecoder().decode(new Uint8Array(bytes)));
            CryptoApp.showToast('UTF-8解码完成');
        } catch (e) { CryptoApp.setOutput('解码失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    escape() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput(escape(text));
        CryptoApp.showToast('escape编码完成');
    },

    unescape() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        try { CryptoApp.setOutput(unescape(text)); CryptoApp.showToast('unescape解码完成'); }
        catch (e) { CryptoApp.setOutput('解码失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    asciiTable() {
        let result = 'ASCII 字符表\n══════════════════════════════════\n\n';
        result += 'DEC  HEX   CHR  │ DEC  HEX   CHR\n';
        result += '─────────────────┼─────────────────\n';
        for (let i = 32; i < 64; i++) {
            const lo = i, hi = i + 64;
            const loC = lo < 33 ? 'NUL' : (lo === 32 ? 'SP' : String.fromCharCode(lo));
            const hiC = hi === 127 ? 'DEL' : String.fromCharCode(hi);
            result += `${lo.toString().padStart(3)}  0x${lo.toString(16).toUpperCase().padStart(2,'0')}  ${loC.padEnd(4)} │ ${hi.toString().padStart(3)}  0x${hi.toString(16).toUpperCase().padStart(2,'0')}  ${hiC.padEnd(4)}\n`;
        }
        CryptoApp.setOutput(result);
        CryptoApp.showToast('ASCII表已生成');
    },

    morseEncode() {
        const text = CryptoApp.dom.inputText.value.toUpperCase();
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const morse = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.', ' ':' / '};
        const result = text.split('').map(c => morse[c] || c).join(' ');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('摩斯编码完成');
    },

    morseDecode() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入摩斯码', 'warning'); return; }
        const morse = {'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z','-----':'0','.----':'1','..---':'2','...--':'3','....-':'4','.....':'5','-....':'6','--...':'7','---..':'8','----.':'9'};
        const result = text.split(' / ').map(word => word.split(' ').map(c => morse[c] || c).join('')).join(' ');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('摩斯解码完成');
    },

    jsonMinify() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入JSON', 'warning'); return; }
        try { CryptoApp.setOutput(JSON.stringify(JSON.parse(text))); CryptoApp.showToast('JSON压缩完成'); }
        catch (e) { CryptoApp.setOutput('JSON解析失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    xmlFormat() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入XML', 'warning'); return; }
        let result = text.replace(/(>)(<)(\/*)/g, '$1\n$2$3');
        let indent = 0;
        const lines = result.split('\n');
        const formatted = lines.map(line => {
            if (line.match(/^<\//)) indent--;
            const pad = '  '.repeat(Math.max(0, indent));
            if (line.match(/^<[^/]/) && !line.match(/\/>$/)) indent++;
            return pad + line;
        }).join('\n');
        CryptoApp.setOutput(formatted);
        CryptoApp.showToast('XML格式化完成');
    },

    detectCharset() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        let info = '🔍 字符编码检测\n═════════════════\n\n';
        const hasChinese = /[\u4e00-\u9fff]/.test(text);
        const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
        const hasKorean = /[\uac00-\ud7af]/.test(text);
        const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(text);
        info += `包含中文: ${hasChinese ? '是' : '否'}\n`;
        info += `包含日文: ${hasJapanese ? '是' : '否'}\n`;
        info += `包含韩文: ${hasKorean ? '是' : '否'}\n`;
        info += `包含Emoji: ${hasEmoji ? '是' : '否'}\n`;
        info += `字符数: ${text.length}\n`;
        info += `UTF-8字节数: ${new TextEncoder().encode(text).length}\n`;
        info += `\n建议编码: UTF-8`;
        CryptoApp.setOutput(info);
        CryptoApp.showToast('编码检测完成');
    },

    detectBom() {
        const text = CryptoApp.dom.inputText.value;
        let info = '🔍 BOM检测\n═══════════\n\n';
        info += '⚠️ BOM是文件头标记，无法从文本内容检测\n需上传二进制文件才能检测BOM\n\n';
        info += '常见BOM:\n• UTF-8: EF BB BF\n• UTF-16 LE: FF FE\n• UTF-16 BE: FE FF\n• UTF-32 LE: FF FE 00 00\n• UTF-32 BE: 00 00 FE FF';
        CryptoApp.setOutput(info);
        CryptoApp.showToast('BOM检测信息');
    },

    normalizeText() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const form = prompt('选择Unicode正规化形式:\nNFC / NFD / NFKC / NFKD', 'NFC');
        if (!form || !['NFC','NFD','NFKC','NFKD'].includes(form.toUpperCase())) { CryptoApp.showToast('已取消或无效', 'warning'); return; }
        const result = text.normalize(form.toUpperCase());
        CryptoApp.setOutput(result);
        CryptoApp.showToast(`${form.toUpperCase()}正规化完成`);
    },

    removeBom() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const result = text.replace(/^\uFEFF/, '');
        CryptoApp.setOutput(result);
        CryptoApp.showToast('BOM已移除');
    },

    fixEncoding() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        let result = text;
        // 修复常见乱码：Latin1误读为UTF-8的中文
        try {
            const bytes = new Uint8Array(text.length);
            for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
            const fixed = new TextDecoder('utf-8').decode(bytes);
            if (fixed !== text && /[\u4e00-\u9fff]/.test(fixed)) result = 'UTF-8修复:\n' + fixed;
            else result = '未检测到可修复的编码问题\n\n原始文本:\n' + text;
        } catch { result = '编码修复失败，原始文本:\n' + text; }
        CryptoApp.setOutput(result);
        CryptoApp.showToast('编码修复完成');
    },

    // ===== 之前缺失的函数 =====

    jsonFormat() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入JSON', 'warning'); return; }
        try {
            const obj = JSON.parse(text);
            CryptoApp.setOutput(JSON.stringify(obj, null, 2));
            CryptoApp.showToast('JSON格式化完成');
        } catch (e) {
            CryptoApp.setOutput('JSON解析失败: ' + e.message);
            CryptoApp.showToast('格式化失败', 'error');
        }
    },

    rot13() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const result = text.replace(/[a-zA-Z]/g, c => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
        });
        CryptoApp.setOutput(result);
        CryptoApp.showToast('ROT13转换完成');
        CryptoApp.addHistory('ROT13', text, result);
    },

    atbash() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const result = text.replace(/[a-zA-Z]/g, c => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base));
        });
        CryptoApp.setOutput(result);
        CryptoApp.showToast('Atbash转换完成');
        CryptoApp.addHistory('Atbash', text, result);
    },

    csvToJson() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入CSV数据', 'warning'); return; }
        try {
            const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length < 2) { CryptoApp.showToast('CSV至少需要标题行+1数据行', 'warning'); return; }
            const headers = lines[0].split(',').map(h => h.trim());
            const data = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const obj = {};
                headers.forEach((h, idx) => { obj[h] = values[idx] || ''; });
                data.push(obj);
            }
            CryptoApp.setOutput(JSON.stringify(data, null, 2));
            CryptoApp.showToast('CSV转JSON完成');
        } catch (e) {
            CryptoApp.setOutput('转换失败: ' + e.message);
            CryptoApp.showToast('失败', 'error');
        }
    },

    jsonToCsv() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入JSON数组', 'warning'); return; }
        try {
            const data = JSON.parse(text);
            if (!Array.isArray(data) || data.length === 0) { CryptoApp.showToast('需要非空JSON数组', 'warning'); return; }
            const headers = Object.keys(data[0]);
            let csv = headers.join(',') + '\n';
            for (const row of data) {
                csv += headers.map(h => row[h] ?? '').join(',') + '\n';
            }
            CryptoApp.setOutput(csv.trim());
            CryptoApp.showToast('JSON转CSV完成');
        } catch (e) {
            CryptoApp.setOutput('转换失败: ' + e.message);
            CryptoApp.showToast('失败', 'error');
        }
    },

    applySettings() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        // 读取编码设置面板的选项
        const encoding = document.getElementById('encodingType')?.value || 'utf-8';
        const lineEnding = document.getElementById('lineEnding')?.value || 'lf';
        const bom = document.getElementById('bomOption')?.checked;

        let result = text;
        // 应用换行符转换
        if (lineEnding === 'lf') result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        else if (lineEnding === 'crlf') result = result.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
        else if (lineEnding === 'cr') result = result.replace(/\r\n/g, '\r').replace(/\n/g, '\r');

        let info = `⚙️ 编码设置已应用\n══════════════════\n\n`;
        info += `编码: ${encoding}\n`;
        info += `换行符: ${lineEnding === 'lf' ? 'LF (Unix)' : lineEnding === 'crlf' ? 'CRLF (Windows)' : 'CR (Mac)'}\n`;
        info += `BOM: ${bom ? '是' : '否'}\n\n`;
        info += `处理结果:\n${result}`;

        CryptoApp.setOutput(info);
        CryptoApp.showToast('设置已应用');
    }
};

// 导出到全局
window.encode = EncodeModule;