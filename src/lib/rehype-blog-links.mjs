// Apply link behavior at build time to both Markdown and MDX blog articles.
export default function rehypeBlogLinks() {
  return (tree, file) => {
    if (!/[/\\]content[/\\]blog[/\\]/.test(file.path || '')) return;

    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && href) {
          const url = new URL(href, 'https://jayyu.dev/');
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            node.properties.target = '_blank';
            const rel = node.properties.rel || [];
            node.properties.rel = [...new Set([
              ...(Array.isArray(rel) ? rel : rel.split(/\s+/)),
              'noopener',
              'noreferrer',
            ])];
          }
        }
      }
      node.children?.forEach(visit);
    };

    visit(tree);
  };
}
