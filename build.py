import re
def rd(p): return open(p,encoding='utf-8').read()
logo=rd('assets/img/logo.svg')
icons={'ICON_SPEND':rd('assets/img/icon-spend.svg'),'ICON_P2P':rd('assets/img/icon-p2p.svg'),'ICON_AI':rd('assets/img/icon-ai.svg'),'ICON_LEAD':rd('assets/img/icon-lead.svg')}
def render(src,dst):
    h=rd(src).replace('{{LOGO}}',logo)
    for k,v in icons.items(): h=h.replace('{{'+k+'}}',v)
    assert '{{' not in h
    open(dst,'w',encoding='utf-8').write(h); print(dst,len(h))
render('index.tpl.html','index.html'); render('terms.tpl.html','terms-of-use/index.html')
