#!/usr/bin/env python3
"""Builds the Ribbon Rush site: one index.html per language, plus
sitemap.xml, robots.txt and llms.txt. Run from the repo root:

    python3 _src/build.py

Strings live in _src/strings.py. To move to a new domain, change BASE.
Jekyll skips folders that start with "_", so _src is not published.
"""
import html
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from strings import LANGS, T  # noqa: E402

BASE = 'https://aycabadem.github.io'
NAME = 'Ribbon Rush'
EMAIL = 'hello.framelabs@gmail.com'
UPDATED = '2026-10-01'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SHOTS = [('game-velvet', 'velvet'), ('game-winter', 'winter'), ('game-sweets', 'sweets'),
         ('game-travel', 'travel'), ('game-halloween', 'halloween'), ('home', 'velvet')]
CHARMS = ['bell', 'cupcake', 'plane', 'macaron', 'snowman', 'camera', 'gingerbread', 'icecream',
          'lighthouse', 'donut', 'globe', 'balloon']
HIDDEN = {'globe', 'balloon', 'donut'}  # shown as still-missing slots

APPLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.9-.8-3.1-.8C6.8 7.3 5.3 8.2 4.5 9.7c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.4 2.9 2.4s1.6-.8 3-.8 1.8.8 3 .8 2-1.2 2.8-2.3c.9-1.3 1.2-2.6 1.3-2.7-.1 0-2.3-.9-2.3-4.1zM14.1 5.8c.6-.8 1.1-1.8 1-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2-.5 2.7-1.3z"/></svg>'
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2.8v18.4c0 .5.5.8.9.6l10.4-9.2c.3-.3.3-.8 0-1.1L4.9 2.2c-.4-.2-.9.1-.9.6zM16.7 13.4l2.9-1.7c.5-.3.5-1.1 0-1.4l-2.9-1.7-2.2 2.4z"/></svg>'
STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#E9C46A" stroke="#8E5F1C" stroke-width=".8" d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>'
ICONS = {
    'free': '<path d="M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM3 7h18v4H3zM12 7v14M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7z"/>',
    'calm': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M4 4l16 16"/>',
    'offline': '<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10 18.5h4M9 7.5l6 6M15 7.5l-6 6"/>',
    'langs': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z"/>',
}


def path_of(code):
    return '/' if code == 'en' else f'/{LANGS[code]["path"]}/'


def esc(s):
    return html.escape(s, quote=True)


def jsonld(code, t):
    url = BASE + path_of(code)
    org = {'@type': 'Organization', '@id': BASE + '/#org', 'name': 'Frame Labs', 'url': BASE + '/',
           'email': EMAIL, 'logo': BASE + '/img/icon-512.png'}
    game = {
        '@type': ['VideoGame', 'MobileApplication'], '@id': BASE + '/#game', 'name': NAME,
        'alternateName': ['Ribbon Rush: Gift Block Puzzle', 'Gift Wrap Game'], 'url': url, 'description': t['desc'],
        'image': BASE + '/img/icon-512.png',
        'screenshot': [f'{BASE}/img/{s}.webp' for s, _ in SHOTS[:5]],
        'genre': ['Puzzle', 'Block puzzle', 'Casual'], 'gamePlatform': ['iOS', 'Android'],
        'operatingSystem': 'iOS, Android', 'applicationCategory': 'GameApplication',
        'applicationSubCategory': 'Puzzle', 'playMode': 'SinglePlayer',
        'inLanguage': [LANGS[c]['hreflang'] for c in LANGS],
        'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR'},
        'author': {'@id': BASE + '/#org'}, 'publisher': {'@id': BASE + '/#org'},
        'keywords': t['keywords'],
    }
    site = {'@type': 'WebSite', '@id': BASE + '/#site', 'name': NAME, 'url': BASE + '/', 'publisher': {'@id': BASE + '/#org'}}
    page = {'@type': 'WebPage', '@id': url + '#page', 'url': url, 'name': t['title'], 'description': t['desc'],
            'inLanguage': LANGS[code]['hreflang'], 'isPartOf': {'@id': BASE + '/#site'}, 'about': {'@id': BASE + '/#game'},
            'dateModified': UPDATED}
    faq = {'@type': 'FAQPage', '@id': url + '#faq', 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in t['faq']]}
    return json.dumps({'@context': 'https://schema.org', '@graph': [org, site, page, game, faq]}, ensure_ascii=False)


def head_links(code):
    out = []
    for c in LANGS:
        out.append(f'<link rel="alternate" hreflang="{LANGS[c]["hreflang"]}" href="{BASE}{path_of(c)}">')
    out.append(f'<link rel="alternate" hreflang="x-default" href="{BASE}/">')
    return '\n'.join(out)


def lang_menu(code, t):
    opts = ''.join(f'<option value="{path_of(c)}"{" selected" if c == code else ""}>{esc(LANGS[c]["name"])}</option>' for c in LANGS)
    return f'<label class="lang"><span class="skip">{esc(t["lang"])}</span><select id="lang" aria-label="{esc(t["lang"])}">{opts}</select></label>'


def soon_badges(t):
    return (f'<span class="soon"><span class="dot"></span>{esc(t["soon"])}</span>'
            f'<span class="soon">{APPLE}App Store</span><span class="soon">{PLAY}Google Play</span>')


def page(code):
    t = T[code]
    L = LANGS[code]
    p = path_of(code)
    dirattr = ' dir="rtl"' if L.get('rtl') else ''
    demo_t = {k: t['demo'][k] for k in t['demo']}
    steps = t['steps']
    shots = ''.join(
        f'<figure class="shot"><div class="phone"><img src="/img/{s}.webp" width="520" height="1131" loading="lazy" '
        f'alt="{esc(t["shot_alt"].format(theme=t["themes"][th]))}"></div><figcaption>{esc(t["themes"][th])}</figcaption></figure>'
        for s, th in SHOTS[:5])
    charms = ''.join(
        f'<div class="charm{" hidden" if c in HIDDEN else ""}" style="--k:{i}"><img src="/img/charms/{c}.webp" width="160" height="160" loading="lazy" alt=""></div>'
        for i, c in enumerate(CHARMS))
    feats = ''.join(
        f'<div class="feat reveal d{i}"><div class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[k]}</svg></div>'
        f'<h3>{esc(h)}</h3><p>{esc(d)}</p></div>'
        for i, (k, (h, d)) in enumerate(zip(['free', 'calm', 'offline', 'langs'], t['feats'])))
    faq = ''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in t['faq'])
    ring = ''.join('<i class="center"><span id="ringGift"></span></i>' if k == 4 else
                   f'<i style="--k:{[0,1,2,7,0,3,6,5,4][k]};--c:var(--r{k % 4})"></i>' for k in range(9))
    return f'''<!doctype html>
<html lang="{L["hreflang"]}"{dirattr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{esc(t["title"])}</title>
<meta name="description" content="{esc(t["desc"])}">
<meta name="keywords" content="{esc(t["keywords"])}">
<meta name="author" content="Frame Labs">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#250e1d">
<link rel="canonical" href="{BASE}{p}">
{head_links(code)}
<meta property="og:type" content="website">
<meta property="og:site_name" content="{NAME}">
<meta property="og:title" content="{esc(t["title"])}">
<meta property="og:description" content="{esc(t["desc"])}">
<meta property="og:url" content="{BASE}{p}">
<meta property="og:image" content="{BASE}/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="{L["og"]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(t["title"])}">
<meta name="twitter:description" content="{esc(t["desc"])}">
<meta name="twitter:image" content="{BASE}/img/og.jpg">
<link rel="icon" type="image/png" href="/img/favicon-64.png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@500;700;800&display=swap">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">{jsonld(code, t)}</script>
</head>
<body>
<a class="skip" href="#main">{esc(t["skip"])}</a>
<canvas class="sparkles" id="sparkles" aria-hidden="true"></canvas>
<header class="top"><div class="wrap">
  <a class="brand" href="{p}"><img src="/img/favicon-64.png" width="34" height="34" alt="">{NAME}</a>
  <nav class="links" aria-label="{esc(t["nav_label"])}"><a href="#how">{esc(t["nav"][0])}</a><a href="#play">{esc(t["nav"][1])}</a><a href="#themes">{esc(t["nav"][2])}</a><a href="#faq">{esc(t["nav"][3])}</a></nav>
  {lang_menu(code, t)}
</div></header>

<main id="main">
<section class="hero"><div class="wrap">
  <div>
    <span class="kicker rise">{esc(t["kicker"])}</span>
    <h1 class="rise d1">{t["h1"]}</h1>
    <p class="sub rise d2">{esc(t["sub"])}</p>
    <div class="actions rise d3"><a class="btn" href="#play">{esc(t["cta"])} <span aria-hidden="true">→</span></a><span class="soon"><span class="dot"></span>{esc(t["soon"])}</span></div>
  </div>
  <div class="stage" aria-hidden="true">
    <div class="phone a"><img src="/img/game-velvet.webp" width="520" height="1131" alt="" fetchpriority="high"></div>
    <div class="phone b"><img src="/img/game-winter.webp" width="520" height="1131" alt=""></div>
    <div class="hero-gift" id="heroGift" title="{esc(t["tap"])}"></div>
    <i class="floaty rib" style="--c:var(--r1);left:2%;top:58%"></i>
    <i class="floaty rib" style="--c:var(--r0);right:0;top:4%;animation-delay:-3s"></i>
    <i class="floaty rib" style="--c:var(--r2);left:44%;top:-2%;width:26px;height:26px;animation-delay:-5s"></i>
    <i class="floaty rib" style="--c:var(--r3);right:8%;bottom:6%;animation-delay:-1.5s"></i>
  </div>
</div></section>

<section id="how"><div class="wrap">
  <div class="head reveal"><h2>{esc(t["how_h"])}</h2><p>{esc(t["how_p"])}</p></div>
  <div class="steps">
    <article class="step reveal"><div class="mini-stage s1" aria-hidden="true"><div class="m-grid">{"<i></i>" * 16}<div class="m-piece"><b class="rib" style="--c:var(--r1)"></b><b class="rib" style="--c:var(--r1)"></b><b class="rib" style="--c:var(--r1)"></b></div></div></div>
      <span class="num">01</span><h3>{esc(steps[0][0])}</h3><p>{esc(steps[0][1])}</p></article>
    <article class="step reveal d1"><div class="mini-stage" aria-hidden="true"><div class="ring-demo">{ring}</div></div>
      <span class="num">02</span><h3>{esc(steps[1][0])}</h3><p>{esc(steps[1][1])}</p></article>
    <article class="step reveal d2"><div class="mini-stage s3" aria-hidden="true"><div id="stepGift" style="position:relative;width:120px;height:120px"></div></div>
      <span class="num">03</span><h3>{esc(steps[2][0])}</h3><p>{esc(steps[2][1])}</p></article>
  </div>
</div></section>

<section id="play"><div class="wrap demo">
  <div class="head reveal"><span class="kicker">{esc(t["demo_kicker"])}</span><h2>{esc(t["demo_h"])}</h2><p>{esc(t["demo_p"])}</p></div>
  <div class="demo-card reveal d1">
    <div class="d-top"><div class="d-stars" id="dStarsPill">{STAR}<span id="dStars">0</span></div>
      <div style="text-align:end"><div class="d-label">{esc(t["demo"]["score"])}</div><div class="d-score" id="dScore">0</div></div></div>
    <div class="board-wrap" id="boardWrap"><div class="grid" id="grid"></div></div>
    <div class="tray" id="tray"></div>
    <p class="d-hint" id="dHint"></p>
  </div>
</div></section>

<section id="themes">
  <div class="wrap"><div class="head reveal"><h2>{esc(t["themes_h"])}</h2><p>{esc(t["themes_p"])}</p></div></div>
  <div class="marquee"><div class="track">{shots}{shots.replace('<figure class="shot">', '<figure class="shot" aria-hidden="true">')}</div></div>
</section>

<section id="charms"><div class="wrap charms">
  <div class="head reveal" style="text-align:start;margin:0"><h2>{esc(t["charms_h"])}</h2><p>{esc(t["charms_p"])}</p>
    <div class="bar"><i></i></div><div class="bar-label">9 / 12</div></div>
  <div class="charm-wall reveal d1">{charms}</div>
</div></section>

<section id="features"><div class="wrap">
  <div class="head reveal"><h2>{esc(t["feat_h"])}</h2></div>
  <div class="feats">{feats}</div>
</div></section>

<section id="faq"><div class="wrap">
  <div class="head reveal"><h2>{esc(t["faq_h"])}</h2></div>
  <div class="faq reveal">{faq}</div>
</div></section>

<section class="final"><div class="wrap">
  <div class="gift-host" id="finalGift" style="position:relative;width:170px;height:170px;margin:0 auto 30px;cursor:pointer" title="{esc(t["tap"])}"></div>
  <h2 class="reveal">{esc(t["final_h"])}</h2>
  <p class="reveal d1">{esc(t["final_p"])}</p>
  <div class="actions reveal d2">{soon_badges(t)}</div>
</div></section>
</main>

<footer><div class="wrap">
  <span>© 2026 Frame Labs · {esc(t["made"])}</span>
  <nav><a href="/privacy.html">{esc(t["privacy"])}</a><a href="/support.html">{esc(t["support"])}</a><a href="mailto:{EMAIL}">{EMAIL}</a></nav>
</div></footer>
<canvas id="fx" aria-hidden="true"></canvas>
<script>window.GW_T = {json.dumps(demo_t, ensure_ascii=False)};</script>
<script src="/assets/site.js" defer></script>
</body>
</html>
'''


def main():
    for code in LANGS:
        out = os.path.join(ROOT, path_of(code).strip('/'), 'index.html')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, 'w', encoding='utf-8') as f:
            f.write(page(code))
    # sitemap with language alternates
    urls = []
    for code in LANGS:
        alts = ''.join(f'<xhtml:link rel="alternate" hreflang="{LANGS[c]["hreflang"]}" href="{BASE}{path_of(c)}"/>' for c in LANGS)
        urls.append(f'<url><loc>{BASE}{path_of(code)}</loc><lastmod>{UPDATED}</lastmod>{alts}'
                    f'<xhtml:link rel="alternate" hreflang="x-default" href="{BASE}/"/></url>')
    for extra in ('privacy.html', 'support.html'):
        urls.append(f'<url><loc>{BASE}/{extra}</loc><lastmod>{UPDATED}</lastmod></url>')
    with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
                'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + '\n'.join(urls) + '\n</urlset>\n')
    with open(os.path.join(ROOT, 'robots.txt'), 'w', encoding='utf-8') as f:
        f.write('# Search engines and AI assistants are welcome.\nUser-agent: *\nAllow: /\n\n'
                + ''.join(f'User-agent: {b}\nAllow: /\n\n' for b in
                          ('Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User',
                           'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot', 'Applebot-Extended'))
                + f'Sitemap: {BASE}/sitemap.xml\n')
    en = T['en']
    faq = '\n'.join(f'### {q}\n{a}\n' for q, a in en['faq'])
    langs = ', '.join(LANGS[c]['name'] for c in LANGS)
    with open(os.path.join(ROOT, 'llms.txt'), 'w', encoding='utf-8') as f:
        f.write(f'''# {NAME}

> {en["desc"]}

{NAME} (full store name: Ribbon Rush: Gift Block Puzzle) is a free, cozy block puzzle game for iPhone and Android, made by the independent studio Frame Labs. It is coming soon to the App Store and Google Play.

## How it plays
- {en["steps"][0][0]}: {en["steps"][0][1]}
- {en["steps"][1][0]}: {en["steps"][1][1]}
- {en["steps"][2][0]}: {en["steps"][2][1]}

## What makes it different
- {en["themes_p"]}
- {en["charms_p"]}
- {" ".join(h + ": " + d for h, d in en["feats"])}
- Languages: {langs}.

## Questions
{faq}
## Links
- Website: {BASE}/
- Play a demo in the browser: {BASE}/#play
- Privacy policy: {BASE}/privacy.html
- Support: {BASE}/support.html
- Contact: {EMAIL}
''')
    print('built', len(LANGS), 'languages')


if __name__ == '__main__':
    main()
