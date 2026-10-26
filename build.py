import re
def rd(p): return open(p,encoding='utf-8').read()
logo=rd('assets/img/logo.svg')
# tag parts of the logo for CSS animation
logo=logo.replace('<svg ','<svg class="a3logo" ',1)
logo=re.sub(r'<path opacity=".35"','<path class="orbit" opacity=".35"',logo,1)
arcs=re.findall(r'<path\b[^>]*stroke-width="30"[^>]*>',logo)
assert len(arcs)==3,len(arcs)
for i,a in enumerate(arcs):
    logo=logo.replace(a,('<g class="spin">' if i==0 else '')+a.replace('<path ','<path class="arc arc%d" '%(i+1))+('</g>' if i==2 else ''),1)
logo=logo.replace('<path stroke-linejoin="round" stroke-width="7.2"','<path class="tri" stroke-linejoin="round" stroke-width="7.2"',1)
logo=re.sub(r'<path opacity="(\.06|\.12|\.25)" fill="#5FE3FF"',r'<path class="ring" opacity="\1" fill="#5FE3FF"',logo)
logo=logo.replace('<path fill="#5FE3FF" d="M164.2','<path class="dot" fill="#5FE3FF" d="M164.2',1)
logo=re.sub(r'<path fill="#F4F4F2" d="(M253|M110|M134)',r'<path class="node" fill="#F4F4F2" d="\1',logo)
logo=logo.replace('<path fill="#F4F4F2" d="m302','<path class="word" fill="#F4F4F2" d="m302',1)
logo=logo.replace('<path fill="#5FE3FF" d="M1100','<path class="three" fill="#5FE3FF" d="M1100',1)
logo=logo.replace('<path fill="#B9BDC2"','<path class="tag" fill="#B9BDC2"',1)
icons={'ICON_SPEND':rd('assets/img/icon-spend.svg'),'ICON_P2P':rd('assets/img/icon-p2p.svg'),'ICON_AI':rd('assets/img/icon-ai.svg'),'ICON_LEAD':rd('assets/img/icon-lead.svg')}
mark=re.sub(r'viewBox="[^"]*"','viewBox="20 30 290 290"',logo,1).replace('class="a3logo"','class="a3logo a3mark"',1)
def render(src,dst):
    h=rd(src).replace('{{LOGO}}',logo).replace('{{MARK}}',mark)
    for k,v in icons.items(): h=h.replace('{{'+k+'}}',v)
    assert '{{' not in h
    open(dst,'w',encoding='utf-8').write(h); print(dst,len(h))
render('index.tpl.html','index.html')
