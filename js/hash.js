/* ==============================================
   智能密码工具箱 v9.0 - 哈希算法模块
   ============================================== */

/**
 * 纯JS MD5实现（浏览器不原生支持MD5）
 * 返回十六进制字符串（小写）
 */
function md5Pure(input) {
    function safeAdd(x, y) {
        const lsw = (x & 0xffff) + (y & 0xffff);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff);
    }
    function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }
    function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
    function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
    function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

    function processBlock(state, block) {
        let a = state[0], b = state[1], c = state[2], d = state[3];
        a = md5ff(a, b, c, d, block[0], 7, -680876936);
        d = md5ff(d, a, b, c, block[1], 12, -389564586);
        c = md5ff(c, d, a, b, block[2], 17, 606105819);
        b = md5ff(b, c, d, a, block[3], 22, -1044525330);
        a = md5ff(a, b, c, d, block[4], 7, -176418897);
        d = md5ff(d, a, b, c, block[5], 12, 1200080426);
        c = md5ff(c, d, a, b, block[6], 17, -1473231341);
        b = md5ff(b, c, d, a, block[7], 22, -45705983);
        a = md5ff(a, b, c, d, block[8], 7, 1770035416);
        d = md5ff(d, a, b, c, block[9], 12, -1958414417);
        c = md5ff(c, d, a, b, block[10], 17, -42063);
        b = md5ff(b, c, d, a, block[11], 22, -1990404162);
        a = md5ff(a, b, c, d, block[12], 7, 1804603682);
        d = md5ff(d, a, b, c, block[13], 12, -40341101);
        c = md5ff(c, d, a, b, block[14], 17, -1502002290);
        b = md5ff(b, c, d, a, block[15], 22, 1236535329);

        a = md5gg(a, b, c, d, block[1], 5, -165796510);
        d = md5gg(d, a, b, c, block[6], 9, -1069501632);
        c = md5gg(c, d, a, b, block[11], 14, 643717713);
        b = md5gg(b, c, d, a, block[0], 20, -373897302);
        a = md5gg(a, b, c, d, block[5], 5, -701558691);
        d = md5gg(d, a, b, c, block[10], 9, 38016083);
        c = md5gg(c, d, a, b, block[15], 14, -660478335);
        b = md5gg(b, c, d, a, block[4], 20, -405537848);
        a = md5gg(a, b, c, d, block[9], 5, 568446438);
        d = md5gg(d, a, b, c, block[14], 9, -1019803690);
        c = md5gg(c, d, a, b, block[3], 14, -187363961);
        b = md5gg(b, c, d, a, block[8], 20, 1163531501);
        a = md5gg(a, b, c, d, block[13], 5, -1444681467);
        d = md5gg(d, a, b, c, block[2], 9, -51403784);
        c = md5gg(c, d, a, b, block[7], 14, 1735328473);
        b = md5gg(b, c, d, a, block[12], 20, -1926607734);

        a = md5hh(a, b, c, d, block[5], 4, -378558);
        d = md5hh(d, a, b, c, block[8], 11, -2022574463);
        c = md5hh(c, d, a, b, block[11], 16, 1839030562);
        b = md5hh(b, c, d, a, block[14], 23, -35309556);
        a = md5hh(a, b, c, d, block[1], 4, -1530992060);
        d = md5hh(d, a, b, c, block[4], 11, 1272893353);
        c = md5hh(c, d, a, b, block[7], 16, -155497632);
        b = md5hh(b, c, d, a, block[10], 23, -1094730640);
        a = md5hh(a, b, c, d, block[13], 4, 681279174);
        d = md5hh(d, a, b, c, block[0], 11, -358537222);
        c = md5hh(c, d, a, b, block[3], 16, -722521979);
        b = md5hh(b, c, d, a, block[6], 23, 76029189);
        a = md5hh(a, b, c, d, block[9], 4, -640364487);
        d = md5hh(d, a, b, c, block[12], 11, -421815835);
        c = md5hh(c, d, a, b, block[15], 16, 530742520);
        b = md5hh(b, c, d, a, block[2], 23, -995338651);

        a = md5ii(a, b, c, d, block[0], 6, -198630844);
        d = md5ii(d, a, b, c, block[7], 10, 1126891415);
        c = md5ii(c, d, a, b, block[14], 15, -1416354905);
        b = md5ii(b, c, d, a, block[5], 21, -57434055);
        a = md5ii(a, b, c, d, block[12], 6, 1700485571);
        d = md5ii(d, a, b, c, block[3], 10, -1894986606);
        c = md5ii(c, d, a, b, block[10], 15, -1051523);
        b = md5ii(b, c, d, a, block[1], 21, -2054922799);
        a = md5ii(a, b, c, d, block[8], 6, 1873313359);
        d = md5ii(d, a, b, c, block[15], 10, -30611744);
        c = md5ii(c, d, a, b, block[6], 15, -1560198380);
        b = md5ii(b, c, d, a, block[13], 21, 1309151649);
        a = md5ii(a, b, c, d, block[4], 6, -145523070);
        d = md5ii(d, a, b, c, block[11], 10, -1120210379);
        c = md5ii(c, d, a, b, block[2], 15, 718787259);
        b = md5ii(b, c, d, a, block[9], 21, -343485551);

        state[0] = safeAdd(a, state[0]);
        state[1] = safeAdd(b, state[1]);
        state[2] = safeAdd(c, state[2]);
        state[3] = safeAdd(d, state[3]);
    }

    function bytesToWords(bytes) {
        const words = new Int32Array(16);
        for (let i = 0; i < bytes.length; i++) {
            words[i >> 2] |= bytes[i] << ((i % 4) << 3);
        }
        return words;
    }

    function wordsToBytes(words) {
        const bytes = new Uint8Array(words.length << 2);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = (words[i >> 2] >>> ((i % 4) << 3)) & 0xff;
        }
        return bytes;
    }

    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    const bitLen = bytes.length * 8;

    // 预处理：填充
    const paddedLen = ((bytes.length + 8) & ~63) + 64;
    const padded = new Uint8Array(paddedLen);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    // 附加长度（小端序，64位）
    padded[paddedLen - 8] = bitLen & 0xff;
    padded[paddedLen - 7] = (bitLen >>> 8) & 0xff;
    padded[paddedLen - 6] = (bitLen >>> 16) & 0xff;
    padded[paddedLen - 5] = (bitLen >>> 24) & 0xff;
    // 注意：>32位长度在JS中精度受限，但一般文本不会超过

    const state = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);

    for (let i = 0; i < padded.length; i += 64) {
        const block = bytesToWords(padded.subarray(i, i + 64));
        processBlock(state, block);
    }

    const outputBytes = wordsToBytes(state);
    return Array.from(outputBytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

const HashModule = {
    md5() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要计算哈希的内容', 'warning');
            return;
        }
        try {
            const result = md5Pure(text);
            CryptoApp.setOutput(result);
            CryptoApp.showToast('MD5计算完成');
            CryptoApp.addHistory('MD5哈希', text, result);
        } catch (e) {
            CryptoApp.setOutput(`MD5计算失败: ${e.message}`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    async sha256() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要计算哈希的内容', 'warning');
            return;
        }
        
        try {
            const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(result);
            CryptoApp.showToast('SHA256计算完成');
            CryptoApp.addHistory('SHA256哈希', text, result);
        } catch (e) {
            CryptoApp.setOutput(`SHA256计算失败: ${e.message}`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    async sha512() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) {
            CryptoApp.showToast('请输入需要计算哈希的内容', 'warning');
            return;
        }
        
        try {
            const hash = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(result);
            CryptoApp.showToast('SHA512计算完成');
            CryptoApp.addHistory('SHA512哈希', text, result);
        } catch (e) {
            CryptoApp.setOutput(`SHA512计算失败: ${e.message}`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    // 其他哈希函数
    async sha1() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算哈希的内容', 'warning'); return; }
        try {
            const hash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(result);
            CryptoApp.showToast('SHA1计算完成');
            CryptoApp.addHistory('SHA1哈希', text, result);
        } catch (e) {
            CryptoApp.setOutput(`SHA1计算失败: ${e.message}`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    async sha3() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算哈希的内容', 'warning'); return; }
        try {
            const hash = await crypto.subtle.digest('SHA3-256', new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(result);
            CryptoApp.showToast('SHA3-256计算完成');
            CryptoApp.addHistory('SHA3-256', text, result);
        } catch (e) {
            CryptoApp.setOutput(`SHA3-256计算失败: ${e.message}\n\n提示: 浏览器可能不支持SHA3，请使用Chrome 107+`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    async sha3_512() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算哈希的内容', 'warning'); return; }
        try {
            const hash = await crypto.subtle.digest('SHA3-512', new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(result);
            CryptoApp.showToast('SHA3-512计算完成');
            CryptoApp.addHistory('SHA3-512', text, result);
        } catch (e) {
            CryptoApp.setOutput(`SHA3-512计算失败: ${e.message}\n\n提示: 浏览器可能不支持SHA3`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    async hmacMd5() {
        const text = CryptoApp.dom.inputText.value;
        const key = document.getElementById('hmacKey')?.value || prompt('请输入HMAC密钥:', 'secret');
        if (!text) { CryptoApp.showToast('请输入需要计算的内容', 'warning'); return; }
        if (!key) return;
        try {
            const keyData = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
            const sig = await crypto.subtle.sign('HMAC', keyData, new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(`HMAC-MD5 (使用SHA1实现):\n${result}\n\n⚠️ 浏览器不支持原生MD5，此处用SHA1替代\n如需真正MD5-HMAC请使用后端`);
            CryptoApp.showToast('HMAC计算完成');
        } catch (e) {
            CryptoApp.setOutput(`HMAC计算失败: ${e.message}`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    async hmacSha256() {
        const text = CryptoApp.dom.inputText.value;
        const key = document.getElementById('hmacKey')?.value || prompt('请输入HMAC密钥:', 'secret');
        if (!text) { CryptoApp.showToast('请输入需要计算的内容', 'warning'); return; }
        if (!key) return;
        try {
            const keyData = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const sig = await crypto.subtle.sign('HMAC', keyData, new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(result);
            CryptoApp.showToast('HMAC-SHA256计算完成');
            CryptoApp.addHistory('HMAC-SHA256', text, result);
        } catch (e) {
            CryptoApp.setOutput(`HMAC计算失败: ${e.message}`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    async hmacSha512() {
        const text = CryptoApp.dom.inputText.value;
        const key = document.getElementById('hmacKey')?.value || prompt('请输入HMAC密钥:', 'secret');
        if (!text) { CryptoApp.showToast('请输入需要计算的内容', 'warning'); return; }
        if (!key) return;
        try {
            const keyData = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
            const sig = await crypto.subtle.sign('HMAC', keyData, new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(result);
            CryptoApp.showToast('HMAC-SHA512计算完成');
            CryptoApp.addHistory('HMAC-SHA512', text, result);
        } catch (e) {
            CryptoApp.setOutput(`HMAC计算失败: ${e.message}`);
            CryptoApp.showToast('计算失败', 'error');
        }
    },
    
    hmacSm3() {
        const text = CryptoApp.dom.inputText.value;
        const key = document.getElementById('hmacKey')?.value || prompt('请输入HMAC密钥:', 'secret');
        if (!text) { CryptoApp.showToast('请输入需要计算的内容', 'warning'); return; }
        CryptoApp.setOutput(`HMAC-SM3 计算结果\n══════════════════\n\n输入: ${text.substring(0, 50)}...\n密钥: ${key}\n\n⚠️ SM3为国密算法，浏览器原生不支持\n需要使用 sm-crypto 等国密库实现\n\n建议: 在服务端使用国密SDK计算`);
        CryptoApp.showToast('SM3需要国密库支持', 'info');
    },
    
    sm3() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算哈希的内容', 'warning'); return; }
        CryptoApp.setOutput(`SM3 国密哈希\n══════════════════\n\n输入: ${text.substring(0, 50)}...\n\n⚠️ SM3为国密算法，浏览器原生不支持\n需要使用 sm-crypto 等国密库实现\n\nSM3特点:\n• 消息摘要长度: 256位\n• 类似SHA-256但独立设计\n• 中国国家标准 GB/T 32905-2016\n\n建议: 在服务端使用国密SDK计算`);
        CryptoApp.showToast('SM3需要国密库支持', 'info');
    },
    
    sm3Hmac() {
        const text = CryptoApp.dom.inputText.value;
        const key = document.getElementById('hmacKey')?.value || prompt('请输入HMAC密钥:', 'secret');
        if (!text) { CryptoApp.showToast('请输入需要计算的内容', 'warning'); return; }
        CryptoApp.setOutput(`SM3-HMAC 计算结果\n══════════════════\n\n输入: ${text.substring(0, 50)}...\n密钥: ${key}\n\n⚠️ SM3-HMAC需要国密库支持\n建议: 使用 sm-crypto 或后端国密SDK`);
        CryptoApp.showToast('SM3-HMAC需要国密库', 'info');
    },
    
    crc32() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算CRC32的内容', 'warning'); return; }
        const bytes = new TextEncoder().encode(text);
        let crc = 0xFFFFFFFF;
        const table = [];
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
            table[i] = c;
        }
        for (const b of bytes) crc = table[(crc ^ b) & 0xFF] ^ (crc >>> 8);
        crc = (crc ^ 0xFFFFFFFF) >>> 0;
        const result = crc.toString(16).toUpperCase().padStart(8, '0');
        CryptoApp.setOutput(`CRC32: ${result}\n十进制: ${crc}\n\n输入长度: ${text.length} 字符 / ${bytes.length} 字节`);
        CryptoApp.showToast('CRC32计算完成');
        CryptoApp.addHistory('CRC32', text, result);
    },
    
    crc64() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算CRC64的内容', 'warning'); return; }
        // CRC64-ECMA
        const bytes = new TextEncoder().encode(text);
        const POLY = 0x42F0E1EBA9EA3693n;
        let crc = 0n;
        for (const b of bytes) {
            crc ^= BigInt(b) << 56n;
            for (let j = 0; j < 8; j++) {
                crc = crc & 0x8000000000000000n ? (crc << 1n) ^ POLY : crc << 1n;
            }
        }
        const result = (crc & 0xFFFFFFFFFFFFFFFFn).toString(16).toUpperCase().padStart(16, '0');
        CryptoApp.setOutput(`CRC64: ${result}\n\n输入长度: ${text.length} 字符 / ${bytes.length} 字节`);
        CryptoApp.showToast('CRC64计算完成');
        CryptoApp.addHistory('CRC64', text, result);
    },
    
    adler32() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算Adler32的内容', 'warning'); return; }
        const bytes = new TextEncoder().encode(text);
        let a = 1, b = 0;
        const MOD = 65521;
        for (const byte of bytes) {
            a = (a + byte) % MOD;
            b = (b + a) % MOD;
        }
        const result = ((b << 16) | a).toString(16).toUpperCase().padStart(8, '0');
        CryptoApp.setOutput(`Adler32: ${result}\n十进制: ${(b << 16) | a}\n\n输入长度: ${text.length} 字符 / ${bytes.length} 字节`);
        CryptoApp.showToast('Adler32计算完成');
        CryptoApp.addHistory('Adler32', text, result);
    },
    
    ripemd160() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算哈希的内容', 'warning'); return; }
        CryptoApp.setOutput(`RIPEMD-160\n══════════════════\n\n输入: ${text.substring(0, 50)}...\n\n⚠️ 浏览器不支持原生RIPEMD-160\n建议:\n1. 使用第三方库如 js-ripemd160\n2. 在服务端使用 OpenSSL 计算\n\nRIPEMD-160特点:\n• 输出160位摘要\n• 常用于比特币地址生成\n• 比SHA1更安全`);
        CryptoApp.showToast('RIPEMD-160需要第三方库', 'info');
    },
    
    whirlpool() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入需要计算哈希的内容', 'warning'); return; }
        CryptoApp.setOutput(`WHIRLPOOL 哈希\n══════════════════\n\n输入: ${text.substring(0, 50)}...\n\n⚠️ 浏览器不支持原生WHIRLPOOL\n建议: 使用第三方库或服务端计算\n\nWHIRLPOOL特点:\n• 输出512位摘要\n• 基于AES设计\n• ISO/IEC 10118-3标准`);
        CryptoApp.showToast('WHIRLPOOL需要第三方库', 'info');
    },
    
    identify() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) {
            CryptoApp.showToast('请输入需要识别的哈希', 'warning');
            return;
        }
        
        const hashPatterns = [
            { pattern: /^[a-f0-9]{32}$/i, name: 'MD5' },
            { pattern: /^[a-f0-9]{40}$/i, name: 'SHA1' },
            { pattern: /^[a-f0-9]{64}$/i, name: 'SHA256' },
            { pattern: /^[a-f0-9]{96}$/i, name: 'SHA384' },
            { pattern: /^[a-f0-9]{128}$/i, name: 'SHA512' },
            { pattern: /^[a-f0-9]{56}$/i, name: 'SHA224' },
            { pattern: /^[a-f0-9]{8}$/i, name: 'CRC32' },
            { pattern: /^[a-f0-9]{16}$/i, name: 'CRC64' },
            { pattern: /^[a-f0-9]{48}$/i, name: 'SHA3-384' }
        ];
        
        let result = '🔍 哈希类型识别\n';
        result += '══════════════\n\n';
        
        for (const pattern of hashPatterns) {
            if (pattern.pattern.test(text)) {
                result += `✅ 识别为: ${pattern.name}\n`;
                result += `长度: ${text.length} 字符\n`;
                result += `格式: 十六进制\n`;
                
                CryptoApp.setOutput(result);
                CryptoApp.showToast(`识别为${pattern.name}`);
                CryptoApp.addHistory('哈希识别', text, pattern.name);
                return;
            }
        }
        
        result += '❌ 无法识别哈希类型\n';
        result += `长度: ${text.length} 字符\n`;
        result += '💡 可能不是标准哈希值\n';
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('无法识别哈希类型', 'warning');
    },
    
    crackOnline() {
        CryptoApp.setOutput('在线破解功能需要网络连接\n访问: https://crackstation.net/');
        CryptoApp.showToast('请访问在线破解网站', 'info');
    },
    
    rainbowTable() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入哈希值', 'warning'); return; }
        
        let result = `🌈 彩虹表查询\n══════════════════\n\n`;
        result += `输入哈希: ${text}\n`;
        result += `哈希长度: ${text.length} 字符\n\n`;
        
        // 识别哈希类型
        const patterns = [
            { len: 32, name: 'MD5' }, { len: 40, name: 'SHA1' },
            { len: 64, name: 'SHA256' }, { len: 128, name: 'SHA512' }
        ];
        const matched = patterns.find(p => p.len === text.length && /^[a-f0-9]+$/i.test(text));
        
        if (matched) {
            result += `哈希类型: ${matched.name}\n\n`;
            result += `在线查询:\n`;
            result += `• https://crackstation.net/\n`;
            result += `• https://www.md5online.org/\n`;
            result += `• https://hashes.com/en/decrypt/hash\n`;
            result += `• https://md5decrypt.net/\n\n`;
            result += `💡 提示: 短密码(≤8位)在彩虹表中通常可查到\n长密码或加盐哈希难以破解`;
        } else {
            result += `⚠️ 无法识别哈希类型\n`;
            result += `请确认输入为有效的十六进制哈希值\n\n`;
            result += `常见哈希长度:\n`;
            result += `• MD5: 32位\n• SHA1: 40位\n• SHA256: 64位\n• SHA512: 128位`;
        }
        
        CryptoApp.setOutput(result);
        CryptoApp.showToast('彩虹表查询信息');
    },

    // ===== 补充缺失函数 =====

    async sha224() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        try {
            const hash = await crypto.subtle.digest('SHA-224', new TextEncoder().encode(text));
            CryptoApp.setOutput(Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));
            CryptoApp.showToast('SHA224计算完成');
        } catch (e) { CryptoApp.setOutput('SHA224失败: ' + e.message + '\n需Chrome 107+'); CryptoApp.showToast('失败', 'error'); }
    },

    async sha384() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        try {
            const hash = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(text));
            CryptoApp.setOutput(Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));
            CryptoApp.showToast('SHA384计算完成');
        } catch (e) { CryptoApp.setOutput('SHA384失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    async sha512_224() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('SHA-512/224\n════════════════\n\n⚠️ 浏览器不支持SHA-512/224\n建议使用后端OpenSSL计算');
        CryptoApp.showToast('需要后端支持', 'info');
    },

    async sha512_256() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('SHA-512/256\n════════════════\n\n⚠️ 浏览器不支持SHA-512/256\n建议使用后端OpenSSL计算');
        CryptoApp.showToast('需要后端支持', 'info');
    },

    async sha3_224() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        try {
            const hash = await crypto.subtle.digest('SHA3-224', new TextEncoder().encode(text));
            CryptoApp.setOutput(Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));
            CryptoApp.showToast('SHA3-224计算完成');
        } catch (e) { CryptoApp.setOutput('SHA3-224失败: ' + e.message + '\n需Chrome 107+'); CryptoApp.showToast('失败', 'error'); }
    },

    async sha3_256() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        try {
            const hash = await crypto.subtle.digest('SHA3-256', new TextEncoder().encode(text));
            CryptoApp.setOutput(Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));
            CryptoApp.showToast('SHA3-256计算完成');
        } catch (e) { CryptoApp.setOutput('SHA3-256失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    async sha3_384() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        try {
            const hash = await crypto.subtle.digest('SHA3-384', new TextEncoder().encode(text));
            CryptoApp.setOutput(Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));
            CryptoApp.showToast('SHA3-384计算完成');
        } catch (e) { CryptoApp.setOutput('SHA3-384失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    keccak() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('Keccak 哈希\n════════════════\n\n⚠️ 浏览器不支持原生Keccak\nKeccak是SHA3的前身，与SHA3填充不同\n建议:\n• 使用 ethers.js 的 keccak256\n• 使用 js-sha3 库\n\n常用于: 以太坊地址哈希');
        CryptoApp.showToast('需要第三方库', 'info');
    },

    shake() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const len = prompt('输出长度(字节):', '32');
        if (!len) return;
        CryptoApp.setOutput(`SHAKE128/256 可变长度哈希\n══════════════════════════\n\n⚠️ 浏览器不支持原生SHAKE\n建议使用 js-sha3 库\n\nSHAKE特点:\n• 可变输出长度: ${len}字节\n• SHA3标准的可扩展输出函数\n• 常用于: 密码学协议、XOF`);
        CryptoApp.showToast('需要第三方库', 'info');
    },

    blake2s() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('BLAKE2s 哈希\n════════════════\n\n⚠️ 浏览器不支持原生BLAKE2s\n建议使用 blakejs 库\n\nBLAKE2s特点:\n• 输出256位\n• 比SHA256更快\n• 适用于32位平台');
        CryptoApp.showToast('需要第三方库', 'info');
    },

    blake2b() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('BLAKE2b 哈希\n════════════════\n\n⚠️ 浏览器不支持原生BLAKE2b\n建议使用 blakejs 库\n\nBLAKE2b特点:\n• 输出512位\n• 比SHA512更快\n• 适用于64位平台');
        CryptoApp.showToast('需要第三方库', 'info');
    },

    blake3() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('BLAKE3 哈希\n════════════════\n\n⚠️ 浏览器不支持原生BLAKE3\n建议使用 blake3 wasm库\n\nBLAKE3特点:\n• 比BLAKE2更快\n• 支持可变长度输出\n• 支持XOF/PRF模式\n• 并行化设计');
        CryptoApp.showToast('需要第三方库', 'info');
    },

    blake256() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('BLAKE-256 哈希\n═════════════════\n\n⚠️ 浏览器不支持原生BLAKE-256\nBLAKE-256是BLAKE的256位版本\n建议使用第三方库或后端计算');
        CryptoApp.showToast('需要第三方库', 'info');
    },

    blake512() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('BLAKE-512 哈希\n═════════════════\n\n⚠️ 浏览器不支持原生BLAKE-512\nBLAKE-512是BLAKE的512位版本\n建议使用第三方库或后端计算');
        CryptoApp.showToast('需要第三方库', 'info');
    },

    sm3_hmac() { this.sm3Hmac(); },

    ripemd() { this.ripemd160(); },

    tiger() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('Tiger 哈希\n════════════════\n\n⚠️ 浏览器不支持原生Tiger\n建议使用第三方库\n\nTiger特点:\n• 输出192位\n• 专为64位平台优化\n• 常用于TTH文件哈希');
        CryptoApp.showToast('需要第三方库', 'info');
    },

    fnv() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const bytes = new TextEncoder().encode(text);
        // FNV-1a 32-bit
        let hash = 0x811c9dc5;
        for (const b of bytes) { hash ^= b; hash = Math.imul(hash, 0x01000193); }
        hash = hash >>> 0;
        // FNV-1a 64-bit (JS精度受限，用BigInt模拟)
        let hash64 = 0xcbf29ce484222325n;
        const PRIME64 = 0x100000001b3n;
        const MASK64 = (1n << 64n) - 1n;
        for (const b of bytes) { hash64 = ((hash64 ^ BigInt(b)) * PRIME64) & MASK64; }
        CryptoApp.setOutput(`FNV哈希\n════════════════\n\nFNV-1a 32: ${hash.toString(16).padStart(8,'0')}\nFNV-1a 64: ${hash64.toString(16).padStart(16,'0')}\n\n输入: ${text.substring(0,50)}`);
        CryptoApp.showToast('FNV哈希计算完成');
    },

    async hashWithOptions() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        const algo = document.getElementById('hashAlgorithm')?.value || prompt('选择算法:\nSHA-1 / SHA-256 / SHA-384 / SHA-512', 'SHA-256');
        if (!algo) return;
        try {
            const hash = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
            const result = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
            CryptoApp.setOutput(`[${algo}] ${result}`);
            CryptoApp.showToast(algo + '计算完成');
        } catch (e) { CryptoApp.setOutput('失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    async hmac() {
        const text = CryptoApp.dom.inputText.value;
        const key = document.getElementById('hmacKey')?.value || prompt('请输入HMAC密钥:', 'secret');
        if (!text || !key) { CryptoApp.showToast('请输入内容和密钥', 'warning'); return; }
        try {
            const keyData = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const sig = await crypto.subtle.sign('HMAC', keyData, new TextEncoder().encode(text));
            CryptoApp.setOutput('HMAC-SHA256: ' + Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join(''));
            CryptoApp.showToast('HMAC计算完成');
        } catch (e) { CryptoApp.setOutput('HMAC失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    async verifyHmac() {
        const text = CryptoApp.dom.inputText.value;
        const key = document.getElementById('hmacKey')?.value || prompt('HMAC密钥:', 'secret');
        const expected = prompt('预期的HMAC值(十六进制):');
        if (!text || !key || !expected) { CryptoApp.showToast('缺少参数', 'warning'); return; }
        try {
            const keyData = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const sig = await crypto.subtle.sign('HMAC', keyData, new TextEncoder().encode(text));
            const actual = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
            const match = actual === expected.toLowerCase();
            CryptoApp.setOutput(`HMAC验证\n════════════\n\n计算值: ${actual}\n预期值: ${expected.toLowerCase()}\n\n结果: ${match ? '✅ 匹配' : '❌ 不匹配'}`);
            CryptoApp.showToast(match ? '验证通过' : '验证失败', match ? 'success' : 'error');
        } catch (e) { CryptoApp.setOutput('验证失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
    },

    chooseFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const buf = await file.arrayBuffer();
            try {
                const hash = await crypto.subtle.digest('SHA-256', buf);
                const result = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
                CryptoApp.setOutput(`文件: ${file.name}\n大小: ${file.size} 字节\nSHA-256: ${result}`);
                CryptoApp.showToast('文件哈希计算完成');
            } catch (e) { CryptoApp.setOutput('失败: ' + e.message); CryptoApp.showToast('失败', 'error'); }
        };
        input.click();
    },

    async hashFile() { this.chooseFile(); },

    findCollision() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入内容', 'warning'); return; }
        CryptoApp.setOutput('🔍 哈希碰撞检测\n══════════════════\n\n⚠️ 哈希碰撞搜索需要大量计算\n浏览器端不现实，建议:\n\n1. MD5碰撞: 使用 fastcoll 工具\n2. SHA1碰撞: SHAttered攻击\n3. SHA256+: 目前无已知碰撞\n\n学术参考:\n• MD5: 可在秒级产生碰撞\n• SHA1: 2017年首次实际碰撞\n• SHA256+: 暂无实际碰撞');
        CryptoApp.showToast('需要专业工具', 'info');
    },

    hashLength() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入哈希值', 'warning'); return; }
        const len = text.length;
        const table = [
            [8, 'CRC32/Adler32'], [16, 'CRC64/MD4'], [32, 'MD5/MD5'], [40, 'SHA1/RIPEMD160'],
            [56, 'SHA224/SHA3-224'], [64, 'SHA256/SHA3-256/SM3'], [96, 'SHA384/SHA3-384'],
            [128, 'SHA512/SHA3-512/Whirlpool']
        ];
        const matches = table.filter(([l]) => l === len);
        let info = `📏 哈希长度分析\n══════════════════\n\n输入长度: ${len} 字符\n\n`;
        if (matches.length) info += `可能的类型:\n${matches.map(([,n]) => '• ' + n).join('\n')}`;
        else info += '❌ 未匹配到标准哈希长度';
        CryptoApp.setOutput(info);
        CryptoApp.showToast('长度分析完成');
    },

    compareHashes() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入两个哈希值(每行一个)', 'warning'); return; }
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) { CryptoApp.showToast('请输入至少两行哈希值', 'warning'); return; }
        let info = '⚖️ 哈希比较\n════════════════\n\n';
        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                const match = lines[i].toLowerCase() === lines[j].toLowerCase();
                info += `哈希${i+1} vs 哈希${j+1}: ${match ? '✅ 相同' : '❌ 不同'}\n`;
            }
        }
        CryptoApp.setOutput(info);
        CryptoApp.showToast('比较完成');
    },

    async hashPerformance() {
        const sizes = [100, 1000, 10000];
        const algos = ['SHA-1', 'SHA-256', 'SHA-512'];
        let result = '⚡ 哈希性能测试\n══════════════════\n\n';
        for (const algo of algos) {
            result += `[${algo}]\n`;
            for (const size of sizes) {
                const data = new TextEncoder().encode('A'.repeat(size));
                const t0 = performance.now();
                try { await crypto.subtle.digest(algo, data); } catch { result += `  ${size}B: 不支持\n`; continue; }
                const ms = (performance.now() - t0).toFixed(2);
                result += `  ${size}B: ${ms}ms\n`;
            }
            result += '\n';
        }
        CryptoApp.setOutput(result);
        CryptoApp.showToast('性能测试完成');
    },

    hashBenchmark() { this.hashPerformance(); },

    lookupHash() { this.rainbowTable(); },

    hashCrack() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入哈希值', 'warning'); return; }
        const isMD5 = /^[a-f0-9]{32}$/i.test(text);
        const isSHA1 = /^[a-f0-9]{40}$/i.test(text);
        const isSHA256 = /^[a-f0-9]{64}$/i.test(text);
        let info = '🔓 哈希破解\n════════════════\n\n';
        info += `输入: ${text}\n类型: ${isMD5 ? 'MD5' : isSHA1 ? 'SHA1' : isSHA256 ? 'SHA256' : '未知'}\n\n`;
        info += '在线破解:\n• https://crackstation.net/\n• https://hashes.com/en/decrypt/hash\n• https://www.md5online.org/\n\n';
        info += '⚠️ 本工具不提供离线暴力破解\n仅提供查询链接';
        CryptoApp.setOutput(info);
        CryptoApp.showToast('请使用在线工具', 'info');
    },

    saltAnalysis() {
        const text = CryptoApp.dom.inputText.value.trim();
        if (!text) { CryptoApp.showToast('请输入哈希值', 'warning'); return; }
        let info = '🧂 盐值分析\n════════════════\n\n';
        info += `输入: ${text}\n长度: ${text.length}\n\n`;
        info += '常见加盐格式:\n• $salt$hash\n• hash:salt\n• $1$salt$hash (MD5-crypt)\n• $5$salt$hash (SHA256-crypt)\n• $6$salt$hash (SHA512-crypt)\n\n';
        const parts = text.split('$').filter(Boolean);
        if (parts.length >= 2) info += `检测到分隔符 "$": 可能含盐值\n段数: ${parts.length}`;
        else info += '未检测到明显的加盐格式';
        CryptoApp.setOutput(info);
        CryptoApp.showToast('盐值分析完成');
    },

    pbkdf2() {
        const text = CryptoApp.dom.inputText.value;
        const pass = text || prompt('请输入密码:');
        if (!pass) return;
        const salt = prompt('盐值:', 'salt');
        const iter = parseInt(prompt('迭代次数:', '100000')) || 100000;
        crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits'])
            .then(key => crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: iter, hash: 'SHA-256' }, key, 256))
            .then(bits => {
                const result = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
                CryptoApp.setOutput(`PBKDF2-HMAC-SHA256\n═══════════════════\n\n密码: ${pass.substring(0,10)}...\n盐值: ${salt}\n迭代: ${iter}\n\n结果: ${result}`);
                CryptoApp.showToast('PBKDF2计算完成');
            })
            .catch(e => { CryptoApp.setOutput('PBKDF2失败: ' + e.message); CryptoApp.showToast('失败', 'error'); });
    },

    bcrypt() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入密码', 'warning'); return; }
        CryptoApp.setOutput('🔒 Bcrypt 哈希\n═════════════════\n\n⚠️ 浏览器不支持原生Bcrypt\n建议使用 bcryptjs 库\n\nBcrypt特点:\n• 自适应工作因子(成本)\n• 内置盐值\n• 格式: $2b$10$22字符盐+31字符哈希\n• 抗GPU/ASIC破解\n\n推荐:\n• npm install bcryptjs\n• 工作因子建议: 10-12');
        CryptoApp.showToast('需要bcryptjs库', 'info');
    },

    scrypt() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入密码', 'warning'); return; }
        CryptoApp.setOutput('🔐 Scrypt 哈希\n═════════════════\n\n⚠️ 浏览器不支持原生Scrypt\n建议使用 scrypt-js 库\n\nScrypt特点:\n• 内存密集型KDF\n• 抗ASIC攻击\n• Litecoin使用\n• 参数: N(成本), r(块大小), p(并行度)\n\n推荐:\n• npm install scrypt-js\n• 典型: N=16384, r=8, p=1');
        CryptoApp.showToast('需要scrypt-js库', 'info');
    },

    argon2() {
        const text = CryptoApp.dom.inputText.value;
        if (!text) { CryptoApp.showToast('请输入密码', 'warning'); return; }
        CryptoApp.setOutput('🛡️ Argon2 哈希\n══════════════════\n\n⚠️ 浏览器不支持原生Argon2\n建议使用 argon2-browser 或 WASM\n\nArgon2特点:\n• 2015年密码哈希竞赛冠军\n• 三种变体: Argon2d/Argon2i/Argon2id\n• 内存+CPU密集\n• 推荐密码哈希标准\n\n推荐:\n• npm install argon2-browser\n• 推荐 Argon2id 变体');
        CryptoApp.showToast('需要argon2库', 'info');
    }
};

// 导出到全局
window.hash = HashModule;