#!/usr/bin/env python3
"""Deterministic monochrome codemod.

Replaces every chromatic color token (hex 3/4/6/8, rgb()/rgba(), hsl()/hsla(),
and a curated set of named colors) with its luminance-preserving grayscale
equivalent. Near-neutral colors (max-min channel spread <= THRESH) are left
untouched to keep diffs clean. One way to neutralize chroma everywhere.
"""
import re, sys, os

THRESH = 8  # desaturate when (max-min) channel spread exceeds this

def lum(r, g, b):
    return round(0.2126 * r + 0.7152 * g + 0.0722 * b)

def gray(r, g, b):
    if max(r, g, b) - min(r, g, b) <= THRESH:
        return None  # already neutral
    l = max(0, min(255, lum(r, g, b)))
    return l

def hex2(n):
    return format(n, '02X')

NAMED = {
    'aqua': (0, 255, 255), 'cyan': (0, 255, 255), 'teal': (0, 128, 128),
    'blue': (0, 0, 255), 'navy': (0, 0, 128), 'royalblue': (65, 105, 225),
    'dodgerblue': (30, 144, 255), 'steelblue': (70, 130, 180),
    'skyblue': (135, 206, 235), 'lightblue': (173, 216, 230),
    'indigo': (75, 0, 130), 'turquoise': (64, 224, 208),
    'green': (0, 128, 0), 'lime': (0, 255, 0), 'red': (255, 0, 0),
    'orange': (255, 165, 0), 'purple': (128, 0, 128), 'violet': (238, 130, 238),
    'magenta': (255, 0, 255), 'pink': (255, 192, 203), 'gold': (255, 215, 0),
    'yellow': (255, 255, 0),
}

def repl_hex(m):
    s = m.group(0)
    h = s[1:]
    if len(h) in (3, 4):
        comps = [int(c * 2, 16) for c in h]
    else:
        comps = [int(h[i:i+2], 16) for i in range(0, len(h), 2)]
    if len(h) in (3, 6):
        r, g, b = comps; a = None
    else:
        r, g, b, a = comps
    l = gray(r, g, b)
    if l is None:
        return s
    out = '#' + hex2(l) * 3
    if a is not None:
        out += hex2(a)
    return out

def repl_rgb(m):
    pre = m.group(1)            # 'rgb' or 'rgba'
    nums = m.group(2)
    parts = [p.strip() for p in nums.split(',')]
    try:
        r, g, b = (int(round(float(parts[i]))) for i in range(3))
    except ValueError:
        return m.group(0)
    l = gray(r, g, b)
    if l is None:
        return m.group(0)
    rest = ',' + ','.join(parts[3:]) if len(parts) > 3 else ''
    # keep original spacing style minimally: 'L, L, L'
    return f"{pre}({l}, {l}, {l}{rest})"

def repl_hsl(m):
    pre = m.group(1)            # 'hsl' or 'hsla'
    parts = [p.strip() for p in m.group(2).split(',')]
    if len(parts) < 3:
        return m.group(0)
    parts[1] = '0%'
    return f"{pre}({', '.join(parts)})"

def repl_named(m):
    word = m.group(0)
    key = word.lower()
    if key not in NAMED:
        return word
    l = gray(*NAMED[key])
    if l is None:
        return word
    return '#' + hex2(l) * 3

HEX = re.compile(r'#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b')
RGB = re.compile(r'\b(rgba?)\(\s*([0-9.,\s]+?)\s*\)')
HSL = re.compile(r'\b(hsla?)\(\s*([0-9a-zA-Z.,%\s]+?)\s*\)')
# named colors only when they look like a CSS value (preceded by : space ( , ' " = )
NAMEDRE = re.compile(r"(?<=[:\s(,'\"=])(" + '|'.join(sorted(NAMED, key=len, reverse=True)) + r")(?=[\s;,)'\"}]|$)")

STYLE_EXTS = {'.css', '.scss', '.less'}

def transform(text, ext=''):
    text = HEX.sub(repl_hex, text)
    text = RGB.sub(repl_rgb, text)
    text = HSL.sub(repl_hsl, text)
    if ext in STYLE_EXTS:   # named CSS colors only in pure style files (never code identifiers)
        text = NAMEDRE.sub(repl_named, text)
    return text

EXTS = {'.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.less', '.json', '.html', '.svg', '.mjs', '.cjs'}

def main():
    args = sys.argv[1:]
    inplace = '--inplace' in args
    paths = [a for a in args if a != '--inplace']
    files = []
    for p in paths:
        if os.path.isdir(p):
            for root, _, names in os.walk(p):
                if 'node_modules' in root or '/.next' in root or '/build' in root or '/dist' in root or '/out' in root:
                    continue
                for n in names:
                    if os.path.splitext(n)[1] in EXTS:
                        files.append(os.path.join(root, n))
        else:
            files.append(p)
    changed = 0
    for f in files:
        try:
            with open(f, 'r', encoding='utf-8') as fh:
                orig = fh.read()
        except (UnicodeDecodeError, IsADirectoryError):
            continue
        new = transform(orig, os.path.splitext(f)[1])
        if new != orig:
            changed += 1
            if inplace:
                with open(f, 'w', encoding='utf-8') as fh:
                    fh.write(new)
            print(f"changed: {f}")
    print(f"\n{changed} file(s) {'updated' if inplace else 'would change'}")

if __name__ == '__main__':
    main()
