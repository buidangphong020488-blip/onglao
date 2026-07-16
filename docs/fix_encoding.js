/**
 * Fix double-encoding: file was read as CP1252 by PowerShell then re-saved as UTF-8
 * Reversal: read current UTF-8 → map each char back to its CP1252 byte → original UTF-8 bytes
 */
const fs = require('fs');
const path = require('path');

// CP1252 special chars (0x80-0x9F range) → Unicode code point
// Used to REVERSE: if we see this Unicode char, the original byte was the key
const cp1252Reverse = {
    0x20AC: 0x80, // €
    0x201A: 0x82, // ‚
    0x0192: 0x83, // ƒ
    0x201E: 0x84, // „
    0x2026: 0x85, // …
    0x2020: 0x86, // †
    0x2021: 0x87, // ‡
    0x02C6: 0x88, // ˆ
    0x2030: 0x89, // ‰
    0x0160: 0x8A, // Š
    0x2039: 0x8B, // ‹
    0x0152: 0x8C, // Œ
    0x017D: 0x8E, // Ž
    0x2018: 0x91, // '
    0x2019: 0x92, // '
    0x201C: 0x93, // "
    0x201D: 0x94, // "
    0x2022: 0x95, // •
    0x2013: 0x96, // –
    0x2014: 0x97, // —
    0x02DC: 0x98, // ˜
    0x2122: 0x99, // ™
    0x0161: 0x9A, // š
    0x203A: 0x9B, // ›
    0x0153: 0x9C, // œ
    0x017E: 0x9E, // ž
    0x0178: 0x9F, // Ÿ
};

function reverseCp1252Byte(code) {
    if (code <= 0x7F) return code;                          // ASCII unchanged
    if (code >= 0xA0 && code <= 0xFF) return code;          // Latin-1 range
    if (cp1252Reverse[code] !== undefined) return cp1252Reverse[code]; // CP1252 special
    if (code >= 0x80 && code <= 0x9F) return code;          // undefined CP1252 → .NET maps to itself
    return null; // can't map → emit original UTF-8 bytes
}

function fixEncoding(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const bytes = [];
    let i = 0;
    const chars = [...content]; // iterate by Unicode codepoint
    for (const char of chars) {
        const code = char.codePointAt(0);
        const byte = reverseCp1252Byte(code);
        if (byte !== null) {
            bytes.push(byte);
        } else {
            // Character that can't be mapped back — keep as-is (emit UTF-8 bytes)
            const raw = Buffer.from(char, 'utf8');
            for (const b of raw) bytes.push(b);
        }
    }
    const result = Buffer.from(bytes);
    fs.writeFileSync(filePath, result);
    console.log(`✅ Fixed: ${filePath} (${chars.length} chars → ${result.length} bytes)`);
}

const ROOT = path.join(__dirname, '..');
const files = [
    'src/app/admin/AdminPage.tsx',
    'src/components/onglao-platform.tsx',
    'src/components/onglao/hooks/useVideoExport.tsx',
];

files.forEach(f => {
    try {
        fixEncoding(path.join(ROOT, f));
    } catch (e) {
        console.error(`❌ Error fixing ${f}: ${e.message}`);
    }
});

console.log('\nDone. Verify a sample:');
const sample = fs.readFileSync(path.join(ROOT, 'src/components/onglao-platform.tsx'), 'utf8');
const line85 = sample.split('\n')[84];
console.log('Line 85:', line85.trim());
