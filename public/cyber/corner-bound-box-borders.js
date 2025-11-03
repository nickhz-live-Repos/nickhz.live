/* 
    Custom corner-borders generator script for https://nickhz.live/cyber
*/

{
    const borderWidthPx = 6;
    let boxes = document.getElementsByClassName('corner-bound-box');

    const applyCornerBorders = () => {
        for(const box of boxes) {
            box.style.border = `${borderWidthPx}px solid transparent`;

            const h = box.offsetHeight;
            const w = box.offsetWidth;

            const isSmall = h < 60;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('width', w);
            svg.setAttribute('height', h);

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('fill', getComputedStyle(document.documentElement).getPropertyValue('--primary-accent').trim());
            svg.appendChild(g);

            const paths = [
                document.createElementNS('http://www.w3.org/2000/svg', 'path'), 
                document.createElementNS('http://www.w3.org/2000/svg', 'path')
            ];
            g.append(...paths);

            // can't apply line breaks & indentation here, as border-image-source would be unable to use it
            paths[0].setAttribute('d',
                `M ${w / 2} 0 h ${w / 2} v ${isSmall ? h : h / 2} l -${borderWidthPx / 2} -${borderWidthPx / 2} v -${(isSmall ? h : h / 2) - 3 * borderWidthPx / 2} h -${w / 4 - borderWidthPx} l -${borderWidthPx / 2} -${borderWidthPx / 2} h -${w / 4 - borderWidthPx / 2} Z`
            );
            paths[1].setAttribute('d',
                `M ${w / 2} ${h} h -${w / 2} v -${isSmall ? h : h / 2} l ${borderWidthPx / 2} ${borderWidthPx / 2} v ${(isSmall ? h : h / 2) - 3 * borderWidthPx / 2} h ${w / 4 - borderWidthPx} l ${borderWidthPx / 2} ${borderWidthPx / 2} h ${w / 4 - borderWidthPx / 2} Z`
            );
            
            box.style.borderImageSource = `url('data:image/svg+xml;utf8,${encodeURIComponent(svg.outerHTML)}')`;
            box.style.borderImageSlice = `${borderWidthPx}`;
        }
    };

    applyCornerBorders();
    window.addEventListener('resize', () => { applyCornerBorders(); });
};