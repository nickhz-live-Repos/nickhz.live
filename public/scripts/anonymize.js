
const anonymize = () => {
    const getTextNodes = (el) => {
        const children = [] // Type: Node[]
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        while(walker.nextNode()) {
        children.push(walker.currentNode)
        }
        return children
    }

    const nodes = getTextNodes(document.body);

    for(const node of nodes) {
        let str = '';
        const content = node.textContent;
        const len = content.length;
        
        for(let i = 0; i < len; i++) {
            let addend;

            if(/\s/.test(content[i])) {
                addend = content[i];
            } else {
                addend = '#';
            }

            str = str + addend;
        }

        node.textContent = str;
    }
}

anonymize();
