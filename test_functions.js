/**
 * 密码解析9.0 功能测试脚本
 * 使用 Playwright 自动化测试各模块按钮功能
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML_PATH = path.resolve('d:/html/open-re/index.html');
const RESULTS = [];

function log(module, func, status, detail = '') {
    const entry = { module, func, status, detail };
    RESULTS.push(entry);
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} [${module}] ${func}${detail ? ' - ' + detail : ''}`);
}

async function runTests() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 收集控制台错误
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    // 收集页面错误
    const pageErrors = [];
    page.on('pageerror', err => {
        pageErrors.push(err.message);
    });

    console.log('\n🚀 开始功能测试...\n');
    console.log('='.repeat(60));

    // 加载页面
    console.log('\n📄 加载页面...');
    await page.goto(`file:///${HTML_PATH.replace(/\\/g, '/')}`);
    await page.waitForTimeout(2000);

    // 检查页面加载错误
    if (pageErrors.length > 0) {
        console.log(`❌ 页面加载错误: ${pageErrors.length} 个`);
        pageErrors.forEach(e => console.log(`   - ${e}`));
    } else {
        console.log('✅ 页面加载无错误');
    }

    // 获取输入/输出区域
    const inputArea = '#inputText';
    const outputArea = '#outputText';

    // 辅助函数：设置输入文本
    async function setInput(text) {
        await page.fill(inputArea, text);
    }

    // 辅助函数：获取输出文本
    async function getOutput() {
        return await page.inputValue(outputArea);
    }

    // 辅助函数：点击标签页
    async function clickTab(tabName) {
        await page.click(`.tab[data-tab="${tabName}"]`);
        await page.waitForTimeout(300);
    }

    // 辅助函数：点击按钮并等待输出
    async function clickAndWait(selector, waitMs = 800) {
        try {
            await page.click(selector, { timeout: 5000 });
            await page.waitForTimeout(waitMs);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 辅助函数：评估onclick处理
    async function evalOnClick(code, waitMs = 800) {
        try {
            await page.evaluate(code);
            await page.waitForTimeout(waitMs);
            return true;
        } catch (e) {
            return false;
        }
    }

    // =====================================================
    // 测试1：古典密码模块
    // =====================================================
    console.log('\n📜 测试古典密码模块...');
    await clickTab('classic');
    await setInput('HELLO WORLD');

    // 凯撒加密
    try {
        await page.fill('#caesarShift', '3');
        await evalOnClick('classic.caeEn()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '凯撒加密', 'PASS', `位移3: HELLO WORLD → ${output.substring(0, 30)}`);
        } else {
            log('古典密码', '凯撒加密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '凯撒加密', 'FAIL', e.message);
    }

    // 凯撒解密
    try {
        await evalOnClick('classic.caeDe()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '凯撒解密', 'PASS', output.substring(0, 30));
        } else {
            log('古典密码', '凯撒解密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '凯撒解密', 'FAIL', e.message);
    }

    // 凯撒暴力破解
    try {
        await evalOnClick('classic.caeCrack()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '凯撒暴力破解', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('古典密码', '凯撒暴力破解', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '凯撒暴力破解', 'FAIL', e.message);
    }

    // 所有位移
    try {
        await evalOnClick('classic.caeAll()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '所有位移', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('古典密码', '所有位移', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '所有位移', 'FAIL', e.message);
    }

    // 维吉尼亚加密
    try {
        await page.fill('#vigenereKey', 'KEY');
        await evalOnClick('classic.vigEn()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '维吉尼亚加密', 'PASS', output.substring(0, 30));
        } else {
            log('古典密码', '维吉尼亚加密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '维吉尼亚加密', 'FAIL', e.message);
    }

    // 维吉尼亚解密
    try {
        await evalOnClick('classic.vigDe()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '维吉尼亚解密', 'PASS', output.substring(0, 30));
        } else {
            log('古典密码', '维吉尼亚解密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '维吉尼亚解密', 'FAIL', e.message);
    }

    // 栅栏密码加密
    try {
        await page.fill('#railFenceRails', '3');
        await evalOnClick('classic.railEn()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '栅栏加密', 'PASS', output.substring(0, 30));
        } else {
            log('古典密码', '栅栏加密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '栅栏加密', 'FAIL', e.message);
    }

    // Atbash
    try {
        await evalOnClick('classic.atbash()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', 'Atbash', 'PASS', output.substring(0, 30));
        } else {
            log('古典密码', 'Atbash', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', 'Atbash', 'FAIL', e.message);
    }

    // ROT13
    try {
        await evalOnClick('classic.rot13()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', 'ROT13', 'PASS', output.substring(0, 30));
        } else {
            log('古典密码', 'ROT13', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', 'ROT13', 'FAIL', e.message);
    }

    // ROT-N
    try {
        await evalOnClick('classic.rotN()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', 'ROT-N', 'PASS', output.substring(0, 30));
        } else {
            log('古典密码', 'ROT-N', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', 'ROT-N', 'FAIL', e.message);
    }

    // 摩斯电码编码
    try {
        await evalOnClick('classic.morseEn()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '摩斯编码', 'PASS', output.substring(0, 40));
        } else {
            log('古典密码', '摩斯编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '摩斯编码', 'FAIL', e.message);
    }

    // 替换密码加密
    try {
        await evalOnClick('classic.subEn()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('古典密码', '替换加密', 'PASS', output.substring(0, 30));
        } else {
            log('古典密码', '替换加密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('古典密码', '替换加密', 'FAIL', e.message);
    }

    // =====================================================
    // 测试2：编码转换模块
    // =====================================================
    console.log('\n🔀 测试编码转换模块...');
    await clickTab('encode');
    await setInput('Hello World 你好世界');

    // Base64编码
    try {
        await evalOnClick('encode.base64Encode()');
        const output = await getOutput();
        if (output && output.includes('SGVsbG8')) {
            log('编码转换', 'Base64编码', 'PASS', output.substring(0, 40));
        } else if (output && output.length > 0) {
            log('编码转换', 'Base64编码', 'WARN', `非预期输出: ${output.substring(0, 40)}`);
        } else {
            log('编码转换', 'Base64编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'Base64编码', 'FAIL', e.message);
    }

    // Base64解码
    try {
        await setInput('SGVsbG8gV29ybGQ=');
        await evalOnClick('encode.base64Decode()');
        const output = await getOutput();
        if (output && output.includes('Hello World')) {
            log('编码转换', 'Base64解码', 'PASS', output.substring(0, 30));
        } else if (output && output.length > 0) {
            log('编码转换', 'Base64解码', 'WARN', `非预期输出: ${output.substring(0, 30)}`);
        } else {
            log('编码转换', 'Base64解码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'Base64解码', 'FAIL', e.message);
    }

    // Hex编码
    try {
        await setInput('Hello');
        await evalOnClick('encode.hexEncode()');
        const output = await getOutput();
        if (output && (output.includes('48 65 6c 6c 6f') || output.includes('48656c6c6f') || output.includes('48656C6C6F'))) {
            log('编码转换', 'Hex编码', 'PASS', output.substring(0, 30));
        } else if (output && output.length > 0) {
            log('编码转换', 'Hex编码', 'WARN', `输出: ${output.substring(0, 30)}`);
        } else {
            log('编码转换', 'Hex编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'Hex编码', 'FAIL', e.message);
    }

    // Hex解码
    try {
        await setInput('48656c6c6f');
        await evalOnClick('encode.hexDecode()');
        const output = await getOutput();
        if (output && output.includes('Hello')) {
            log('编码转换', 'Hex解码', 'PASS', output.substring(0, 30));
        } else if (output && output.length > 0) {
            log('编码转换', 'Hex解码', 'WARN', `输出: ${output.substring(0, 30)}`);
        } else {
            log('编码转换', 'Hex解码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'Hex解码', 'FAIL', e.message);
    }

    // URL编码
    try {
        await setInput('Hello World');
        await evalOnClick('encode.urlEncode()');
        const output = await getOutput();
        if (output && (output.includes('Hello%20World') || output.includes('Hello+World'))) {
            log('编码转换', 'URL编码', 'PASS', output.substring(0, 30));
        } else if (output && output.length > 0) {
            log('编码转换', 'URL编码', 'WARN', `输出: ${output.substring(0, 30)}`);
        } else {
            log('编码转换', 'URL编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'URL编码', 'FAIL', e.message);
    }

    // Unicode编码
    try {
        await setInput('AB');
        await evalOnClick('encode.unicodeEncode()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('编码转换', 'Unicode编码', 'PASS', output.substring(0, 40));
        } else {
            log('编码转换', 'Unicode编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'Unicode编码', 'FAIL', e.message);
    }

    // 二进制编码
    try {
        await setInput('AB');
        await evalOnClick('encode.binaryEncode()');
        const output = await getOutput();
        if (output && output.length > 0 && output.includes('0100')) {
            log('编码转换', '二进制编码', 'PASS', output.substring(0, 40));
        } else if (output && output.length > 0) {
            log('编码转换', '二进制编码', 'WARN', `输出: ${output.substring(0, 40)}`);
        } else {
            log('编码转换', '二进制编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', '二进制编码', 'FAIL', e.message);
    }

    // HTML实体编码
    try {
        await setInput('<script>alert(1)</script>');
        await evalOnClick('encode.htmlEncode()');
        const output = await getOutput();
        if (output && (output.includes('&lt;') || output.includes('&#'))) {
            log('编码转换', 'HTML实体编码', 'PASS', output.substring(0, 40));
        } else if (output && output.length > 0) {
            log('编码转换', 'HTML实体编码', 'WARN', `输出: ${output.substring(0, 40)}`);
        } else {
            log('编码转换', 'HTML实体编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'HTML实体编码', 'FAIL', e.message);
    }

    // 摩斯编码（encode模块）
    try {
        await setInput('SOS');
        await evalOnClick('encode.morseEncode()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('编码转换', '摩斯编码', 'PASS', output.substring(0, 40));
        } else {
            log('编码转换', '摩斯编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', '摩斯编码', 'FAIL', e.message);
    }

    // JSON格式化
    try {
        await setInput('{"name":"test","value":123}');
        await evalOnClick('encode.jsonFormat()');
        const output = await getOutput();
        if (output && output.includes('name')) {
            log('编码转换', 'JSON格式化', 'PASS', `格式化成功`);
        } else {
            log('编码转换', 'JSON格式化', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'JSON格式化', 'FAIL', e.message);
    }

    // ROT13（encode模块）
    try {
        await setInput('Hello');
        await evalOnClick('encode.rot13()');
        const output = await getOutput();
        if (output && output.includes('Uryyb')) {
            log('编码转换', 'ROT13', 'PASS', output.substring(0, 30));
        } else if (output && output.length > 0) {
            log('编码转换', 'ROT13', 'WARN', `输出: ${output.substring(0, 30)}`);
        } else {
            log('编码转换', 'ROT13', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'ROT13', 'FAIL', e.message);
    }

    // Base64URL编码
    try {
        await setInput('Hello World');
        await evalOnClick('encode.base64UrlEncode()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('编码转换', 'Base64URL编码', 'PASS', output.substring(0, 40));
        } else {
            log('编码转换', 'Base64URL编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'Base64URL编码', 'FAIL', e.message);
    }

    // Hex转储
    try {
        await setInput('Hello World');
        await evalOnClick('encode.hexDump()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('编码转换', 'Hex转储', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('编码转换', 'Hex转储', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', 'Hex转储', 'FAIL', e.message);
    }

    // 自动检测
    try {
        await setInput('SGVsbG8gV29ybGQ=');
        await evalOnClick('encode.autoDetect()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('编码转换', '自动检测', 'PASS', output.substring(0, 50));
        } else {
            log('编码转换', '自动检测', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', '自动检测', 'FAIL', e.message);
    }

    // 编码转换（通用）
    try {
        await setInput('Hello');
        await page.selectOption('#encodeFrom', 'text');
        await page.selectOption('#encodeTo', 'hex');
        await evalOnClick('encode.convert()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('编码转换', '通用转换(text→hex)', 'PASS', output.substring(0, 30));
        } else {
            log('编码转换', '通用转换', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('编码转换', '通用转换', 'FAIL', e.message);
    }

    // =====================================================
    // 测试3：哈希算法模块
    // =====================================================
    console.log('\n🔑 测试哈希算法模块...');
    await clickTab('hash');
    await setInput('Hello World');

    // MD5
    try {
        await evalOnClick('hash.md5()');
        const output = await getOutput();
        if (output && output.includes('b10a8db164e0754105b7a99be72e3fe5')) {
            log('哈希算法', 'MD5', 'PASS', output.substring(0, 40));
        } else if (output && output.length > 0) {
            log('哈希算法', 'MD5', 'WARN', `输出: ${output.substring(0, 40)}`);
        } else {
            log('哈希算法', 'MD5', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'MD5', 'FAIL', e.message);
    }

    // SHA-1
    try {
        await evalOnClick('hash.sha1()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', 'SHA-1', 'PASS', output.substring(0, 40));
        } else {
            log('哈希算法', 'SHA-1', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'SHA-1', 'FAIL', e.message);
    }

    // SHA-256
    try {
        await evalOnClick('hash.sha256()');
        const output = await getOutput();
        if (output && output.includes('a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e')) {
            log('哈希算法', 'SHA-256', 'PASS', output.substring(0, 40));
        } else if (output && output.length > 0) {
            log('哈希算法', 'SHA-256', 'WARN', `输出: ${output.substring(0, 40)}`);
        } else {
            log('哈希算法', 'SHA-256', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'SHA-256', 'FAIL', e.message);
    }

    // SHA-512
    try {
        await evalOnClick('hash.sha512()');
        const output = await getOutput();
        if (output && output.length >= 128) {
            log('哈希算法', 'SHA-512', 'PASS', `长度: ${output.trim().length}`);
        } else if (output && output.length > 0) {
            log('哈希算法', 'SHA-512', 'WARN', `输出长度: ${output.trim().length}`);
        } else {
            log('哈希算法', 'SHA-512', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'SHA-512', 'FAIL', e.message);
    }

    // SHA-224
    try {
        await evalOnClick('hash.sha224()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', 'SHA-224', 'PASS', output.substring(0, 40));
        } else {
            log('哈希算法', 'SHA-224', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'SHA-224', 'FAIL', e.message);
    }

    // SHA-384
    try {
        await evalOnClick('hash.sha384()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', 'SHA-384', 'PASS', output.substring(0, 40));
        } else {
            log('哈希算法', 'SHA-384', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'SHA-384', 'FAIL', e.message);
    }

    // SHA3-256
    try {
        await evalOnClick('hash.sha3_256()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', 'SHA3-256', 'PASS', output.substring(0, 40));
        } else {
            log('哈希算法', 'SHA3-256', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'SHA3-256', 'FAIL', e.message);
    }

    // CRC32
    try {
        await evalOnClick('hash.crc32()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', 'CRC32', 'PASS', output.substring(0, 30));
        } else {
            log('哈希算法', 'CRC32', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'CRC32', 'FAIL', e.message);
    }

    // HMAC
    try {
        await evalOnClick('hash.hmac()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', 'HMAC', 'PASS', output.substring(0, 40));
        } else {
            log('哈希算法', 'HMAC', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'HMAC', 'FAIL', e.message);
    }

    // FNV
    try {
        await evalOnClick('hash.fnv()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', 'FNV', 'PASS', output.substring(0, 40));
        } else {
            log('哈希算法', 'FNV', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'FNV', 'FAIL', e.message);
    }

    // 哈希长度分析
    try {
        await evalOnClick('hash.hashLength()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', '哈希长度', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('哈希算法', '哈希长度', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', '哈希长度', 'FAIL', e.message);
    }

    // 哈希比较
    try {
        await evalOnClick('hash.compareHashes()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', '哈希比较', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('哈希算法', '哈希比较', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', '哈希比较', 'FAIL', e.message);
    }

    // PBKDF2
    try {
        await evalOnClick('hash.pbkdf2()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('哈希算法', 'PBKDF2', 'PASS', output.substring(0, 40));
        } else {
            log('哈希算法', 'PBKDF2', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('哈希算法', 'PBKDF2', 'FAIL', e.message);
    }

    // =====================================================
    // 测试4：现代密码模块
    // =====================================================
    console.log('\n🔐 测试现代密码模块...');
    await clickTab('modern');
    await setInput('Hello World');

    // AES加密
    try {
        await evalOnClick('modern.symEncrypt()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('现代密码', 'AES加密', 'PASS', output.substring(0, 40));
        } else {
            log('现代密码', 'AES加密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('现代密码', 'AES加密', 'FAIL', e.message);
    }

    // RSA生成密钥
    try {
        await evalOnClick('modern.rsaGenerateKey()', 3000);
        const output = await getOutput();
        if (output && output.length > 0) {
            log('现代密码', 'RSA密钥生成', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('现代密码', 'RSA密钥生成', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('现代密码', 'RSA密钥生成', 'FAIL', e.message);
    }

    // XOR
    try {
        await evalOnClick('modern.xor()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('现代密码', 'XOR', 'PASS', output.substring(0, 30));
        } else {
            log('现代密码', 'XOR', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('现代密码', 'XOR', 'FAIL', e.message);
    }

    // 熵分析
    try {
        await evalOnClick('modern.entropyAnalyze()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('现代密码', '熵分析', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('现代密码', '熵分析', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('现代密码', '熵分析', 'FAIL', e.message);
    }

    // 密钥生成
    try {
        await evalOnClick('modern.symGenerate()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('现代密码', '密钥生成', 'PASS', output.substring(0, 40));
        } else {
            log('现代密码', '密钥生成', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('现代密码', '密钥生成', 'FAIL', e.message);
    }

    // =====================================================
    // 测试5：密码工具模块
    // =====================================================
    console.log('\n🛠️ 测试密码工具模块...');
    await clickTab('crypto');
    await setInput('Hello World 123');

    // 密钥生成
    try {
        await evalOnClick('cryptoTools.generateKey()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('密码工具', '密钥生成', 'PASS', output.substring(0, 40));
        } else {
            log('密码工具', '密钥生成', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('密码工具', '密钥生成', 'FAIL', e.message);
    }

    // 随机数生成
    try {
        await evalOnClick('cryptoTools.generateRandom()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('密码工具', '随机数生成', 'PASS', output.substring(0, 40));
        } else {
            log('密码工具', '随机数生成', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('密码工具', '随机数生成', 'FAIL', e.message);
    }

    // 转大写
    try {
        await evalOnClick('cryptoTools.textToUpper()');
        const output = await getOutput();
        if (output && output.includes('HELLO')) {
            log('密码工具', '转大写', 'PASS', output.substring(0, 30));
        } else if (output && output.length > 0) {
            log('密码工具', '转大写', 'WARN', `输出: ${output.substring(0, 30)}`);
        } else {
            log('密码工具', '转大写', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('密码工具', '转大写', 'FAIL', e.message);
    }

    // 转小写
    try {
        await evalOnClick('cryptoTools.textToLower()');
        const output = await getOutput();
        if (output && output.includes('hello')) {
            log('密码工具', '转小写', 'PASS', output.substring(0, 30));
        } else if (output && output.length > 0) {
            log('密码工具', '转小写', 'WARN', `输出: ${output.substring(0, 30)}`);
        } else {
            log('密码工具', '转小写', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('密码工具', '转小写', 'FAIL', e.message);
    }

    // 反转文本
    try {
        await evalOnClick('cryptoTools.textReverse()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('密码工具', '反转文本', 'PASS', output.substring(0, 30));
        } else {
            log('密码工具', '反转文本', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('密码工具', '反转文本', 'FAIL', e.message);
    }

    // 十进制转十六进制
    try {
        await setInput('255');
        await evalOnClick('cryptoTools.decToHex()');
        const output = await getOutput();
        if (output && (output.includes('ff') || output.includes('FF'))) {
            log('密码工具', '十进制→十六进制', 'PASS', output.substring(0, 30));
        } else if (output && output.length > 0) {
            log('密码工具', '十进制→十六进制', 'WARN', `输出: ${output.substring(0, 30)}`);
        } else {
            log('密码工具', '十进制→十六进制', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('密码工具', '十进制→十六进制', 'FAIL', e.message);
    }

    // 当前时间戳
    try {
        await evalOnClick('cryptoTools.currentTimestamp()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('密码工具', '当前时间戳', 'PASS', output.substring(0, 30));
        } else {
            log('密码工具', '当前时间戳', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('密码工具', '当前时间戳', 'FAIL', e.message);
    }

    // 质数计算
    try {
        await setInput('100');
        await evalOnClick('cryptoTools.calculatePrime()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('密码工具', '质数计算', 'PASS', output.substring(0, 40));
        } else {
            log('密码工具', '质数计算', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('密码工具', '质数计算', 'FAIL', e.message);
    }

    // =====================================================
    // 测试6：CTF解题模块
    // =====================================================
    console.log('\n🏆 测试CTF解题模块...');
    await clickTab('ctf');
    await setInput('HELLO');

    // 仿射加密
    try {
        await evalOnClick('ctf.affineEncrypt()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('CTF解题', '仿射加密', 'PASS', output.substring(0, 30));
        } else {
            log('CTF解题', '仿射加密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('CTF解题', '仿射加密', 'FAIL', e.message);
    }

    // 仿射解密
    try {
        await evalOnClick('ctf.affineDecrypt()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('CTF解题', '仿射解密', 'PASS', output.substring(0, 30));
        } else {
            log('CTF解题', '仿射解密', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('CTF解题', '仿射解密', 'FAIL', e.message);
    }

    // T9编码
    try {
        await evalOnClick('ctf.t9Encode()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('CTF解题', 'T9编码', 'PASS', output.substring(0, 30));
        } else {
            log('CTF解题', 'T9编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('CTF解题', 'T9编码', 'FAIL', e.message);
    }

    // 当铺密码
    try {
        await evalOnClick('ctf.dangpuEncode()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('CTF解题', '当铺密码', 'PASS', output.substring(0, 30));
        } else {
            log('CTF解题', '当铺密码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('CTF解题', '当铺密码', 'FAIL', e.message);
    }

    // 零宽提取
    try {
        await evalOnClick('ctf.zeroWidthExtract()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('CTF解题', '零宽提取', 'PASS', output.substring(0, 30));
        } else {
            log('CTF解题', '零宽提取', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('CTF解题', '零宽提取', 'FAIL', e.message);
    }

    // 空格隐写
    try {
        await evalOnClick('ctf.whiteSpace()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('CTF解题', '空格隐写', 'PASS', output.substring(0, 30));
        } else {
            log('CTF解题', '空格隐写', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('CTF解题', '空格隐写', 'FAIL', e.message);
    }

    // =====================================================
    // 测试7：隐写分析模块
    // =====================================================
    console.log('\n🕵️ 测试隐写分析模块...');
    await clickTab('stego');
    await setInput('This is a test message for steganography');

    // 零宽嵌入
    try {
        await page.fill('#zeroWidthText', 'secret');
        await page.fill('#zeroWidthCover', 'This is cover text');
        await evalOnClick('stego.zeroWidthEmbed()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('隐写分析', '零宽嵌入', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('隐写分析', '零宽嵌入', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('隐写分析', '零宽嵌入', 'FAIL', e.message);
    }

    // 空格编码
    try {
        await setInput('secret');
        await evalOnClick('stego.spaceEncode()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('隐写分析', '空格编码', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('隐写分析', '空格编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('隐写分析', '空格编码', 'FAIL', e.message);
    }

    // 藏头诗
    try {
        await setInput('HELLO');
        await evalOnClick('stego.acrostic()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('隐写分析', '藏头诗', 'PASS', output.substring(0, 50));
        } else {
            log('隐写分析', '藏头诗', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('隐写分析', '藏头诗', 'FAIL', e.message);
    }

    // Leet Speak
    try {
        await setInput('Hello');
        await evalOnClick('stego.leetSpeak()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('隐写分析', 'Leet Speak', 'PASS', output.substring(0, 30));
        } else {
            log('隐写分析', 'Leet Speak', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('隐写分析', 'Leet Speak', 'FAIL', e.message);
    }

    // =====================================================
    // 测试8：实用工具模块
    // =====================================================
    console.log('\n🔧 测试实用工具模块...');
    await clickTab('utils');
    await setInput('Hello World! This is a test. 你好世界！');

    // 字符统计
    try {
        await evalOnClick('utils.countChars()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('实用工具', '字符统计', 'PASS', output.substring(0, 40));
        } else {
            log('实用工具', '字符统计', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('实用工具', '字符统计', 'FAIL', e.message);
    }

    // 文本信息
    try {
        await evalOnClick('utils.textInfo()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('实用工具', '文本信息', 'PASS', `输出长度: ${output.length}`);
        } else {
            log('实用工具', '文本信息', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('实用工具', '文本信息', 'FAIL', e.message);
    }

    // JSON格式化
    try {
        await setInput('{"a":1,"b":"test"}');
        await evalOnClick('utils.formatJson()');
        const output = await getOutput();
        if (output && output.includes('a')) {
            log('实用工具', 'JSON格式化', 'PASS');
        } else {
            log('实用工具', 'JSON格式化', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('实用工具', 'JSON格式化', 'FAIL', e.message);
    }

    // 当前时间
    try {
        await evalOnClick('utils.timeNow()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('实用工具', '当前时间', 'PASS', output.substring(0, 30));
        } else {
            log('实用工具', '当前时间', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('实用工具', '当前时间', 'FAIL', e.message);
    }

    // 系统信息
    try {
        await evalOnClick('utils.systemInfo()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('实用工具', '系统信息', 'PASS', output.substring(0, 40));
        } else {
            log('实用工具', '系统信息', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('实用工具', '系统信息', 'FAIL', e.message);
    }

    // 浏览器信息
    try {
        await evalOnClick('utils.browserInfo()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('实用工具', '浏览器信息', 'PASS', output.substring(0, 40));
        } else {
            log('实用工具', '浏览器信息', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('实用工具', '浏览器信息', 'FAIL', e.message);
    }

    // 单位转换
    try {
        await setInput('1');
        await evalOnClick('utils.convertUnits()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('实用工具', '单位转换', 'PASS', output.substring(0, 30));
        } else {
            log('实用工具', '单位转换', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('实用工具', '单位转换', 'FAIL', e.message);
    }

    // =====================================================
    // 测试9：网络工具模块
    // =====================================================
    console.log('\n🌐 测试网络工具模块...');
    await clickTab('network');
    await setInput('https://example.com/path?q=test');

    // URL解析
    try {
        await evalOnClick('network.parseUrl()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('网络工具', 'URL解析', 'PASS', output.substring(0, 40));
        } else {
            log('网络工具', 'URL解析', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('网络工具', 'URL解析', 'FAIL', e.message);
    }

    // URL编码
    try {
        await evalOnClick('network.encodeUrl()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('网络工具', 'URL编码', 'PASS', output.substring(0, 40));
        } else {
            log('网络工具', 'URL编码', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('网络工具', 'URL编码', 'FAIL', e.message);
    }

    // IP信息
    try {
        await setInput('192.168.1.1');
        await evalOnClick('network.ipInfo()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('网络工具', 'IP信息', 'PASS', output.substring(0, 40));
        } else {
            log('网络工具', 'IP信息', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('网络工具', 'IP信息', 'FAIL', e.message);
    }

    // HTTP头
    try {
        await evalOnClick('network.httpHeaders()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('网络工具', 'HTTP头', 'PASS', output.substring(0, 40));
        } else {
            log('网络工具', 'HTTP头', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('网络工具', 'HTTP头', 'FAIL', e.message);
    }

    // =====================================================
    // 测试10：AI智能模块
    // =====================================================
    console.log('\n🤖 测试AI智能模块...');
    await clickTab('ai');
    await setInput('SGVsbG8gV29ybGQ=');

    // 智能识别
    try {
        await evalOnClick('ai.fullAnalysis()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('AI智能', '智能识别', 'PASS', output.substring(0, 50));
        } else {
            log('AI智能', '智能识别', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('AI智能', '智能识别', 'FAIL', e.message);
    }

    // 自动破解
    try {
        await evalOnClick('ai.autoDecode()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('AI智能', '自动破解', 'PASS', output.substring(0, 50));
        } else {
            log('AI智能', '自动破解', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('AI智能', '自动破解', 'FAIL', e.message);
    }

    // =====================================================
    // 测试11：核心功能测试
    // =====================================================
    console.log('\n⚡ 测试核心功能...');

    // 顶部快速操作
    await setInput('dGhpcyBpcyBhIHRlc3Q=');

    // AI识别
    try {
        await evalOnClick('aiDetect()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('核心功能', 'AI识别(顶部)', 'PASS', output.substring(0, 30));
        } else {
            log('核心功能', 'AI识别(顶部)', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('核心功能', 'AI识别(顶部)', 'FAIL', e.message);
    }

    // 快速解密
    try {
        await evalOnClick('quickDecode()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('核心功能', '快速解密(顶部)', 'PASS', output.substring(0, 30));
        } else {
            log('核心功能', '快速解密(顶部)', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('核心功能', '快速解密(顶部)', 'FAIL', e.message);
    }

    // 格式化
    try {
        await setInput('{"key":"value"}');
        await evalOnClick('formatInput()');
        const output = await getOutput();
        if (output && output.length > 0) {
            log('核心功能', '格式化(顶部)', 'PASS', output.substring(0, 30));
        } else {
            log('核心功能', '格式化(顶部)', 'FAIL', '输出为空');
        }
    } catch (e) {
        log('核心功能', '格式化(顶部)', 'FAIL', e.message);
    }

    // =====================================================
    // 最终检查：控制台错误
    // =====================================================
    console.log('\n📋 最终控制台错误检查...');

    // =====================================================
    // 汇总报告
    // =====================================================
    await browser.close();

    const pass = RESULTS.filter(r => r.status === 'PASS').length;
    const warn = RESULTS.filter(r => r.status === 'WARN').length;
    const fail = RESULTS.filter(r => r.status === 'FAIL').length;
    const total = RESULTS.length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 功能测试报告');
    console.log('='.repeat(60));
    console.log(`总计: ${total} 项测试`);
    console.log(`✅ 通过: ${pass}  (${(pass/total*100).toFixed(1)}%)`);
    console.log(`⚠️ 警告: ${warn}  (${(warn/total*100).toFixed(1)}%)`);
    console.log(`❌ 失败: ${fail}  (${(fail/total*100).toFixed(1)}%)`);
    console.log('='.repeat(60));

    // 按模块统计
    const modules = [...new Set(RESULTS.map(r => r.module))];
    console.log('\n📊 模块统计:');
    for (const mod of modules) {
        const modResults = RESULTS.filter(r => r.module === mod);
        const modPass = modResults.filter(r => r.status === 'PASS').length;
        const modWarn = modResults.filter(r => r.status === 'WARN').length;
        const modFail = modResults.filter(r => r.status === 'FAIL').length;
        console.log(`  ${mod}: ${modPass}✅ ${modWarn}⚠️ ${modFail}❌ / ${modResults.length}项`);
    }

    // 失败项目
    if (fail > 0) {
        console.log('\n❌ 失败项目详情:');
        RESULTS.filter(r => r.status === 'FAIL').forEach(r => {
            console.log(`  [${r.module}] ${r.func}: ${r.detail}`);
        });
    }

    // 警告项目
    if (warn > 0) {
        console.log('\n⚠️ 警告项目详情:');
        RESULTS.filter(r => r.status === 'WARN').forEach(r => {
            console.log(`  [${r.module}] ${r.func}: ${r.detail}`);
        });
    }

    console.log('\n控制台错误数量:', consoleErrors.length);
    if (consoleErrors.length > 0 && consoleErrors.length <= 20) {
        console.log('控制台错误:');
        consoleErrors.forEach(e => console.log(`  - ${e}`));
    }

    // 保存报告到文件
    const report = {
        timestamp: new Date().toISOString(),
        summary: { total, pass, warn, fail },
        consoleErrors: consoleErrors.length,
        pageErrors: pageErrors.length,
        results: RESULTS
    };
    fs.writeFileSync('d:/html/open-re/test-report.json', JSON.stringify(report, null, 2), 'utf8');
    console.log('\n📄 详细报告已保存到: d:/html/open-re/test-report.json');
}

runTests().catch(e => {
    console.error('测试执行失败:', e);
    process.exit(1);
});
