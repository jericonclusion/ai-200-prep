(() => {
  const entries = window.AI200_LIBRARY;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  function inline(text, base) {
    const tokens = [];
    const hold = markup => { tokens.push(markup); return `\u0000${tokens.length - 1}\u0000`; };
    text = text.replace(/`([^`]+)`/g, (_, code) => hold(`<code>${esc(code)}</code>`));
    text = text.replace(/!?\[([^\]]+)\]\(([^)]+)\)/g, (_, label, target) => {
      try {
        const url = new URL(target, base);
        if (!['http:', 'https:', 'file:'].includes(url.protocol)) return label;
        return hold(`<a href="${esc(url.href)}" target="_blank" rel="noopener">${esc(label)}</a>`);
      } catch { return label; }
    });
    return esc(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[+i]);
  }
  function markdown(text, base) {
    const lines = text.replace(/^---\n[\s\S]*?\n---\n/, '').split(/\r?\n/);
    let output = '', code = null, list = false, table = false;
    const close = () => { if (list) { output += '</ul>'; list = false; } if (table) { output += '</tbody></table>'; table = false; } };
    for (const line of lines) {
      if (/^```/.test(line)) { close(); if (code !== null) { output += `<pre><code>${esc(code.join('\n'))}</code></pre>`; code = null; } else code = []; continue; }
      if (code !== null) { code.push(line); continue; }
      if (/^\s*\|/.test(line)) {
        if (/^\s*\|?\s*:?-+/.test(line)) continue;
        if (!table) { close(); output += '<table><tbody>'; table = true; }
        output += '<tr>' + line.trim().replace(/^\||\|$/g, '').split('|').map(c => `<td>${inline(c.trim(), base)}</td>`).join('') + '</tr>'; continue;
      }
      const bullet = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)/);
      if (bullet) { if (!list) { close(); output += '<ul>'; list = true; } output += `<li>${inline(bullet[1], base)}</li>`; continue; }
      close();
      const heading = line.match(/^(#{1,6})\s+(.+)/);
      if (heading) { const level = Math.min(heading[1].length + 1, 6); output += `<h${level}>${inline(heading[2], base)}</h${level}>`; }
      else if (line.trim()) output += `<p>${inline(line.replace(/^>\s?/, ''), base)}</p>`;
    }
    close(); if (code !== null) output += `<pre><code>${esc(code.join('\n'))}</code></pre>`;
    return output;
  }
  const container = document.getElementById('guides');
  container.innerHTML = entries.map((entry, i) => `<details class="guide" id="guide-${i}"><summary>${esc(entry.group)} · ${esc(entry.title)}</summary><div class="guide-body"></div></details>`).join('');
  const details = [...container.querySelectorAll('details')];
  details.forEach((detail, i) => detail.addEventListener('toggle', () => {
    if (!detail.open || detail.dataset.loaded) return;
    const entry = entries[i], base = new URL(entry.path, location.href).href;
    const notes = entry.notes?.length ? `<details class="topic-notes"><summary>Topic review notes · ${entry.notes.length} notes · 11 October 2026</summary>${entry.notes.map(note => `<p>${inline(note.text, base)}</p><p><a href="${esc(note.source)}" target="_blank" rel="noopener">${esc(note.source)}</a></p>`).join('')}</details>` : '';
    detail.querySelector('.guide-body').innerHTML = notes + markdown(entry.text, base) + `<p><a href="${esc(base)}" target="_blank" rel="noopener">Source file</a></p>`;
    detail.dataset.loaded = 'true';
  }));
  function filter() {
    const query = document.getElementById('search').value.toLowerCase().trim();
    let count = 0;
    details.forEach((detail, i) => { const entry = entries[i]; detail.hidden = !(`${entry.group} ${entry.title} ${entry.text}`.toLowerCase().includes(query)); if (!detail.hidden) count++; });
    document.getElementById('count').textContent = `${count} of ${entries.length} guides and labs`;
  }
  document.getElementById('search').addEventListener('input', filter);
  filter();
})();
