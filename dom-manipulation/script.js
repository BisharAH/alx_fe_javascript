 // ===============================
    // Simple utilities
    // ===============================
    const uid = () => "local-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    const now = () => Date.now();
    const byTextKey = (q) => q.text.trim().toLowerCase();

    // ===============================
    // App State (with LocalStorage support)
    // ===============================
    let quotes = [];
    let selectedCategory = "all";
    let searchQuery = "";
    let conflicts = []; // collected during last merge
    let lastSync = 0; // timestamp

    const STORAGE_KEYS = {
      QUOTES: "quotes",
      LAST_FILTER: "lastFilter",
      LAST_SEARCH: "lastSearch",
      LAST_SYNC: "lastSync",
    };

    function loadQuotes() {
      const storedQuotes = localStorage.getItem(STORAGE_KEYS.QUOTES);
      quotes = storedQuotes ? JSON.parse(storedQuotes) : [
        { id: uid(), text: "The best way to get started is to quit talking and begin doing.", category: "Motivation", source: "local", updatedAt: now() - 100000 },
        { id: uid(), text: "Don’t let yesterday take up too much of today.", category: "Wisdom", source: "local", updatedAt: now() - 90000 },
        { id: uid(), text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance", source: "local", updatedAt: now() - 80000 },
      ];
      selectedCategory = localStorage.getItem(STORAGE_KEYS.LAST_FILTER) || "all";
      searchQuery = localStorage.getItem(STORAGE_KEYS.LAST_SEARCH) || "";
      lastSync = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || "0", 10);
      saveQuotes(); // ensure structure is persisted
    }

    function saveQuotes() {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
      localStorage.setItem(STORAGE_KEYS.LAST_FILTER, selectedCategory);
      localStorage.setItem(STORAGE_KEYS.LAST_SEARCH, searchQuery);
    }

    // ===============================
    // Rendering helpers
    // ===============================
    function populateCategories() {
      const filter = document.getElementById("categoryFilter");
      filter.innerHTML = '<option value="all">All Categories</option>';
      const categories = [...new Set(quotes.map(q => q.category))].sort();
      for (const cat of categories) {
        const opt = document.createElement("option");
        opt.value = cat; opt.textContent = cat; filter.appendChild(opt);
      }
      filter.value = selectedCategory;
    }

    function renderQuotes() {
      let filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
      if (searchQuery) filtered = filtered.filter(q => q.text.toLowerCase().includes(searchQuery.toLowerCase()));

      const quoteDisplay = document.getElementById("quoteDisplay");
      if (filtered.length === 0) {
        quoteDisplay.innerHTML = `<p class="quote">No quotes found.</p>`;
      } else {
        quoteDisplay.innerHTML = filtered
          .map(q => `
            <div class="quote">
              “${q.text}”<br/>
              <span class="category">(${q.category}) · <b>${q.source || 'local'}</b> · <time datetime="${new Date(q.updatedAt).toISOString()}">${new Date(q.updatedAt).toLocaleString()}</time></span>
            </div>
          `)
          .join("");
      }
      document.getElementById('counts').textContent = `${filtered.length} shown · ${quotes.length} total`;
    }

    function filterQuotes() {
      const filter = document.getElementById("categoryFilter");
      if (filter) { selectedCategory = filter.value; localStorage.setItem(STORAGE_KEYS.LAST_FILTER, selectedCategory); }
      renderQuotes();
    }

    function searchQuotes(ev){
      searchQuery = ev.target.value.trim();
      localStorage.setItem(STORAGE_KEYS.LAST_SEARCH, searchQuery);
      renderQuotes();
    }

    function showRandomQuote(){
      if (quotes.length === 0) return;
      const idx = Math.floor(Math.random() * quotes.length);
      const q = quotes[idx];
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `
        <div class="quote">
          “${q.text}”<br/>
          <span class="category">(${q.category}) · <b>${q.source || 'local'}</b> · <time datetime="${new Date(q.updatedAt).toISOString()}">${new Date(q.updatedAt).toLocaleString()}</time></span>
        </div>
      `;
    }

    function addQuote(){
      const text = document.getElementById('newQuoteText').value.trim();
      const category = document.getElementById('newQuoteCategory').value.trim() || 'General';
      if (!text) { alert('Please enter a quote.'); return; }
      const item = { id: uid(), text, category, source: 'local', updatedAt: now() };
      quotes.push(item);
      saveQuotes();
      populateCategories();
      filterQuotes();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      toast(`Added new local quote.`, 'ok');
    }

    // ===============================
    // Export / Import
    // ===============================
    function exportToJsonFile(){
      const dataStr = JSON.stringify(quotes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'quotes.json'; a.click();
      URL.revokeObjectURL(url);
    }

    function importFromJsonFile(ev){
      const file = ev.target.files[0]; if (!file) return;
      const fr = new FileReader();
      fr.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (!Array.isArray(imported)) throw new Error('Invalid format');
          // normalize
          for (const q of imported){
            if (!q.id) q.id = uid();
            if (!q.updatedAt) q.updatedAt = now();
            if (!q.source) q.source = 'local';
            if (!q.category) q.category = 'General';
          }
          quotes.push(...imported);
          saveQuotes();
          populateCategories();
          filterQuotes();
          toast(`Imported ${imported.length} items.`, 'ok');
        } catch(err){
          alert('Error reading JSON file.');
        }
      };
      fr.readAsText(file);
      // reset input so same file can be selected again later
      ev.target.value = '';
    }

    // ===============================
    // Server Sync (Simulation using JSONPlaceholder)
    // ===============================
    const SERVER = {
      FETCH: 'https://jsonplaceholder.typicode.com/posts?_limit=8',
      CREATE: 'https://jsonplaceholder.typicode.com/posts', // JSONPlaceholder accepts POST but does not persist — good enough for demo
    };

    async function fetchServerQuotes(){
      try {
        const res = await fetch(SERVER.FETCH);
        const posts = await res.json();
        // Map posts -> quotes
        const serverQuotes = posts.map(p => ({
          id: `server-${p.id}`,
          text: String(p.title).replace(/\s+/g,' ').trim(),
          category: 'Server',
          source: 'server',
          updatedAt: now() - Math.floor(Math.random()*60000) // simulate last updated
        }));
        return serverQuotes;
      } catch(err){
        toast('Server fetch failed — working offline.', 'warn');
        return [];
      }
    }

    async function pushLocalChanges(){
      // For demo: push only items created since lastSync and with source==='local'
      const toPush = quotes.filter(q => q.source === 'local' && q.updatedAt > lastSync);
      for (const q of toPush){
        try{
          await fetch(SERVER.CREATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q) });
        }catch(err){ /* ignore; demo only */ }
      }
      return toPush.length;
    }

    function mergeServerData(serverQuotes){
      const before = quotes.length;
      const byId = new Map(quotes.map(q => [q.id, q]));
      const byKey = new Map(quotes.map(q => [byTextKey(q), q]));
      conflicts = [];

      for (const s of serverQuotes){
        if (byId.has(s.id)){
          // Exact same id exists: server wins (overwrite), track conflict if different
          const local = byId.get(s.id);
          if (JSON.stringify({text:local.text, category:local.category}) !== JSON.stringify({text:s.text, category:s.category})){
            conflicts.push({ type: 'same-id-different-content', server: s, local });
          }
          // server precedence
          Object.assign(local, s);
        } else {
          // Try to detect same text but different category (potential conflict)
          const key = byTextKey(s);
          if (byKey.has(key)){
            const local = byKey.get(key);
            if (local.category !== s.category || (s.updatedAt||0) !== (local.updatedAt||0)){
              // Conflict: we will keep server (auto), but allow manual override later
              conflicts.push({ type: 'same-text-different-meta', server: s, local });
              // Auto resolve: server precedence → convert local to server version
              local.id = s.id; local.category = s.category; local.source = 'server'; local.updatedAt = Math.max(local.updatedAt||0, s.updatedAt||0);
            }
          } else {
            // New item from server → add
            quotes.push(s);
          }
        }
      }

      const added = quotes.length - before;
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, String(now()));
      lastSync = now();
      saveQuotes();
      return { added, conflicts: conflicts.length };
    }

    function renderConflictsPanel(){
      const list = document.getElementById('conflictList');
      if (conflicts.length === 0){ list.innerHTML = `<p class="category">No conflicts to review.</p>`; return; }
      list.innerHTML = conflicts.map((c, i) => `
        <div class="conflict-item">
          <div><small class="muted">${c.type}</small></div>
          <div style="margin-top:6px">
            <div><b>Server</b>: “${c.server.text}” <span class="category">(${c.server.category})</span></div>
            <div><b>Local</b>: “${c.local.text}” <span class="category">(${c.local.category})</span></div>
          </div>
          <div class="conflict-actions">
            <button class="warning" data-idx="${i}" data-keep="local">Keep Local</button>
            <button class="primary" data-idx="${i}" data-keep="server">Keep Server</button>
          </div>
        </div>
      `).join('');

      list.querySelectorAll('button').forEach(btn => btn.addEventListener('click', (ev) => {
        const idx = Number(ev.currentTarget.dataset.idx);
        const keep = ev.currentTarget.dataset.keep;
        const c = conflicts[idx];
        if (!c) return;
        if (keep === 'local'){
          // restore / keep local version by overriding server-applied merge
          const targetKey = byTextKey(c.local);
          const pos = quotes.findIndex(q => q.id === c.server.id || byTextKey(q) === targetKey);
          if (pos !== -1){
            quotes[pos] = { ...c.local, source: 'local', updatedAt: now() };
          } else {
            quotes.push({ ...c.local, source: 'local', updatedAt: now() });
          }
        } else {
          // ensure server version present
          const pos = quotes.findIndex(q => q.id === c.server.id);
          if (pos === -1) quotes.push(c.server); else quotes[pos] = c.server;
        }
        conflicts.splice(idx,1);
        saveQuotes();
        renderConflictsPanel();
        populateCategories();
        renderQuotes();
      }));
    }

    function toast(msg, level='ok'){
      const banner = document.getElementById('syncBanner');
      banner.className = ''; // reset
      banner.classList.add(level === 'ok' ? 'ok' : level === 'warn' ? 'warn' : '');
      banner.innerHTML = `<span>${msg}</span>`;
      banner.style.display = 'flex';
      // auto-hide after 5s
      setTimeout(() => { banner.style.display = 'none'; }, 5000);
    }

    async function syncWithServer(){
      const pushed = await pushLocalChanges();
      const incoming = await fetchServerQuotes();
      const { added, conflicts: nconf } = mergeServerData(incoming);
      populateCategories();
      renderQuotes();
      renderConflictsPanel();
      let msg = `Synced. Added ${added} from server.`;
      if (pushed) msg += ` Pushed ${pushed} local change(s).`;
      if (nconf) msg += ` Resolved ${nconf} conflict(s) (server won).`;
      toast(msg, nconf ? 'warn' : 'ok');
    }

    function startSyncLoop(){
      // initial delayed sync to allow UI to mount
      setTimeout(syncWithServer, 1000);
      // periodic sync every 25 seconds
      setInterval(syncWithServer, 25000);
    }

    // ===============================
    // Boot
    // ===============================
    document.addEventListener('DOMContentLoaded', () => {
      loadQuotes();
      populateCategories();
      document.getElementById('searchInput').value = searchQuery;
      renderQuotes();
      renderConflictsPanel();

      // Wire up controls
      document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
      document.getElementById('searchInput').addEventListener('input', searchQuotes);
      document.getElementById('newQuote').addEventListener('click', showRandomQuote);
      document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
      document.getElementById('importFile').addEventListener('change', importFromJsonFile);
      document.getElementById('addBtn').addEventListener('click', addQuote);
      document.getElementById('syncNow').addEventListener('click', syncWithServer);

      startSyncLoop();
    });
