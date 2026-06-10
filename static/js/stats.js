/**
 * Quetoo Stats — leaderboard and player detail UI.
 * Fetches data from https://giblets.quetoo.org/api/stats
 */

const API = 'https://giblets.quetoo.org/api/stats';
const API_OPTIONS = 'https://giblets.quetoo.org/api/options';

// Names suppressed from the leaderboard (must match LEADERBOARD_SUPPRESS_NAMES in config.php).
const SUPPRESS_NAMES = new Set(['newbie']);

const elLeaderboard     = document.getElementById('stats-leaderboard');
const elLeaderboardBody = document.getElementById('stats-leaderboard-body');
const elPlayer          = document.getElementById('stats-player');
const elPlayerBody      = document.getElementById('stats-player-body');
const elPlayerName      = document.getElementById('stats-player-name');
const elPlayerSummary   = document.getElementById('stats-player-summary');
const elSearch          = document.getElementById('stats-search');
const elServer          = document.getElementById('stats-server');
const elLevel           = document.getElementById('stats-level');
const elAi              = document.getElementById('stats-ai');
const elLimit           = document.getElementById('stats-limit');
const elPeriod          = document.getElementById('stats-period');
const elBack            = document.getElementById('stats-back');

// ------------------------------------------------------------------
// Period helpers — compute from/to from a named period
// ------------------------------------------------------------------

function getDateParams() {
  const period = elPeriod.value;
  if (!period) return {};
  const now   = new Date();
  const pad   = n => String(n).padStart(2, '0');
  const fmt   = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = fmt(now);
  let from;
  if (period === 'today') {
    from = today;
  } else if (period === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay());
    from = fmt(d);
  } else if (period === 'month') {
    from = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  } else if (period === 'year') {
    from = `${now.getFullYear()}-01-01`;
  }
  return from ? { from, to: today } : {};
}

elPeriod.addEventListener('change', () => reloadActive());

// ------------------------------------------------------------------
// Options — populate server and map dropdowns from the API
// ------------------------------------------------------------------

async function loadOptions() {
  try {
    const res  = await fetch(API_OPTIONS);
    if (!res.ok) return;
    const data = await res.json();

    (data.servers || []).forEach(s => {
      const opt = document.createElement('option');
      opt.value       = s;
      opt.textContent = stripColors(s);
      elServer.appendChild(opt);
    });

    (data.levels || []).forEach(l => {
      const opt = document.createElement('option');
      opt.value       = l;
      opt.textContent = stripColors(l);
      elLevel.appendChild(opt);
    });
  } catch (_) { /* silently ignore */ }
}

elServer.addEventListener('change', loadLeaderboard);
elLevel.addEventListener('change',  loadLeaderboard);
elAi.addEventListener('change',  reloadActive);

function reloadActive() {
  const guid = getHash();
  if (guid) {
    showPlayer(guid);
  } else {
    loadLeaderboard();
  }
}

// ------------------------------------------------------------------
// Routing — hash encodes the selected player's hashed guid
// ------------------------------------------------------------------

function getHash() {
  const h = location.hash.slice(1);
  return /^[a-f0-9]{64}$/.test(h) ? h : null;
}

function navigate(guid) {
  location.hash = guid ? '#' + guid : '';
}

window.addEventListener('hashchange', () => {
  const guid = getHash();
  if (guid) {
    showPlayer(guid);
  } else {
    showLeaderboard();
  }
});

// ------------------------------------------------------------------
// Leaderboard
// ------------------------------------------------------------------

let searchTimer = null;
let sortState   = { key: 'frags', dir: 'desc' };

function formatTime(seconds) {
  const s = Number(seconds ?? 0);
  if (s <= 0) return '—';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// key: null marks non-sortable columns (rank is derived from frags order)
const SORT_COLS = [
  { label: '#',        key: null,       align: 'left'  },
  { label: 'Player',   key: 'name',     align: 'left',  defaultDir: 'asc'  },
  { label: 'Frags',    key: 'frags',    align: 'right', defaultDir: 'desc' },
  { label: 'Deaths',   key: 'deaths',   align: 'right', defaultDir: 'desc' },
  { label: 'K/D',      key: 'kd',       align: 'right', defaultDir: 'desc' },
  { label: 'Captures', key: 'captures',    align: 'right', defaultDir: 'desc' },
  { label: 'Time',     key: 'time_played', align: 'right', defaultDir: 'desc' },
];

function showLeaderboard() {
  elPlayer.classList.add('hidden');
  elLeaderboard.classList.remove('hidden');
  loadLeaderboard();
}

async function loadLeaderboard() {
  const name   = elSearch.value.trim();
  const limit  = elLimit.value;
  const server = elServer.value;
  const level  = elLevel.value;
  const ai     = elAi.value;

  const params = new URLSearchParams({ limit, ...getDateParams() });
  if (name)   params.set('name',   name);
  if (server) params.set('server', server);
  if (level)  params.set('level',  level);
  params.set('ai', ai);
  params.set('sort', sortState.key);
  params.set('dir',  sortState.dir);

  elLeaderboardBody.innerHTML = '<div class="stats-loading">Loading\u2026</div>';

  try {
    const res  = await fetch(`${API}?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    renderLeaderboard(rows);
  } catch (err) {
    elLeaderboardBody.innerHTML = `<div class="stats-error">Failed to load leaderboard: ${err.message}</div>`;
  }
}

function renderLeaderboard(rows) {
  if (!rows.length) {
    elLeaderboardBody.innerHTML = '<div class="stats-empty">No players found.</div>';
    return;
  }

  const tbody = rows.map((row) => {
    const rank     = row.rank;
    const fragsN   = Number(row.frags);
    const deathsN  = Number(row.deaths);
    const frags    = fragsN.toLocaleString();
    const deaths   = deathsN.toLocaleString();
    const kd       = (deathsN > 0 ? fragsN / deathsN : fragsN).toFixed(2);
    const captures    = Number(row.captures ?? 0).toLocaleString();
    const time_played = formatTime(row.time_played);
    const cls      = rank <= 3 ? ` stats-rank-${rank}` : '';
    return `<tr data-guid="${esc(row.guid)}" data-name="${esc(stripColors(row.name))}">
        <td class="stats-rank${cls}">${rank}</td>
        <td class="stats-player-name">${colorize(row.name)}</td>
        <td class="stats-num">${frags}</td>
        <td class="stats-num">${deaths}</td>
        <td class="stats-num">${kd}</td>
        <td class="stats-num">${captures}</td>
        <td class="stats-num">${time_played}</td>
      </tr>`;
  }).join('');

  const thead = SORT_COLS.map(col => {
    const active  = col.key && sortState.key === col.key;
    const arrow   = active ? (sortState.dir === 'asc' ? ' ▲' : ' ▼') : '';
    const align   = col.align === 'right' ? 'text-align:right;' : '';
    const pointer = col.key ? 'cursor:pointer;user-select:none;' : '';
    const attrs   = col.key ? ` data-sort="${col.key}"` : '';
    return `<th${attrs} style="${align}${pointer}">${col.label}${arrow}</th>`;
  }).join('');

  elLeaderboardBody.innerHTML = `
    <table class="stats-table">
      <thead><tr>${thead}</tr></thead>
      <tbody>${tbody}</tbody>
    </table>`;

  elLeaderboardBody.querySelectorAll('thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      const col = SORT_COLS.find(c => c.key === key);
      if (sortState.key === key) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.key = key;
        sortState.dir = col.defaultDir;
      }
      loadLeaderboard();
    });
  });

  elLeaderboardBody.querySelectorAll('tbody tr').forEach(tr => {
    tr.addEventListener('click', () => navigate(tr.dataset.guid));
  });
}

// Reload on search input (debounced) or limit change
elSearch.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadLeaderboard, 300);
});

elLimit.addEventListener('change', loadLeaderboard);

// ------------------------------------------------------------------
// Player detail
// ------------------------------------------------------------------

async function showPlayer(guid) {
  elLeaderboard.classList.add('hidden');
  elPlayer.classList.remove('hidden');
  elPlayerName.textContent = '\u2026';
  elPlayerSummary.textContent = '';
  elPlayerBody.innerHTML = '<div class="stats-loading">Loading\u2026</div>';

  const params = new URLSearchParams(getDateParams());
  params.set('ai', elAi.value);
  const url    = params.toString() ? `${API}/${guid}?${params}` : `${API}/${guid}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderPlayer(guid, data);
  } catch (err) {
    elPlayerBody.innerHTML = `<div class="stats-error">Failed to load player stats: ${err.message}</div>`;
  }
}

function renderPlayer(guid, data) {
  // Use the most-fragged non-suppressed alias as the display name, falling
  // back to the leaderboard row already in the DOM, then a guid prefix.
  const aliases      = (data.aliases || []);
  const primaryAlias = aliases.find(a => !SUPPRESS_NAMES.has(stripColors(a.name).toLowerCase()))
                    || aliases[0];
  const nameEl = elLeaderboardBody.querySelector(`tr[data-guid="${guid}"]`);
  const name   = primaryAlias ? primaryAlias.name
               : nameEl       ? nameEl.dataset.name
               :                (guid.slice(0, 8) + '\u2026');

  elPlayerName.innerHTML      = colorize(name);
  if (aliases.length > 1) {
    elPlayerSummary.innerHTML = `Aliases: ${aliases.slice(1).map(a => colorize(a.name)).join(' <span aria-hidden="true">&middot;</span> ')}`;
  } else {
    elPlayerSummary.textContent = '';
  }

  const frags  = Number(data.frags);
  const deaths = Number(data.deaths);
  const kd     = deaths > 0 ? (frags / deaths).toFixed(2) : frags.toFixed(2);

  function tile(label, value, extra = '') {
    return `<div class="stats-tile"${extra}><div class="stats-tile-value">${value}</div><div class="stats-tile-label">${label}</div></div>`;
  }

  const rankColors   = { 1: '#ffd700', 2: '#c0c0c0', 3: '#cd7f32' };
  const rankColor    = rankColors[data.rank];
  const rankExtra    = rankColor ? ` style="border-color:${rankColor}33"` : '';
  const rankValue    = data.rank ? `<span${rankColor ? ` style="color:${rankColor}"` : ''}>#${data.rank}</span>` : '—';
  const rankTile     = tile('Rank', rankValue, rankExtra);
  const fragsTile    = tile('Frags',    frags.toLocaleString());
  const deathsTile   = tile('Deaths',   deaths.toLocaleString());
  const kdTile       = tile('K/D',      kd);
  const capturesTile = tile('Captures', Number(data.captures ?? 0).toLocaleString());
  const timeTile     = tile('Time Played', formatTime(data.time_played));
  let   nemesisTile  = '';
  if (data.nemesis) {
    nemesisTile = `<div class="stats-tile stats-tile-nemesis" data-guid="${esc(data.nemesis.guid)}" title="Killed you ${Number(data.nemesis.deaths).toLocaleString()} times">
      <div class="stats-tile-value">${colorize(data.nemesis.name)}</div>
      <div class="stats-tile-label">Nemesis &middot; ${Number(data.nemesis.deaths).toLocaleString()} kills</div>
    </div>`;
  }

  const tilesHtml = `<div class="stats-tiles">${rankTile}${fragsTile}${deathsTile}${kdTile}${capturesTile}${timeTile}${nemesisTile}</div>`;

  elPlayerBody.innerHTML = `
    ${tilesHtml}
    <div class="stats-detail-grid">
      ${detailCard('Kills by Weapon',   data.kills_by_weapon,    ['Weapon',   'Frags'],           r => [r.weapon||'unknown', r.frags])}
      ${detailCard('Deaths by Weapon',  data.deaths_by_weapon,   ['Weapon',   'Deaths'],           r => [r.weapon||'unknown', r.deaths])}
      ${detailCard('Kills by Player',   data.kills_by_target,    ['Player',   'Frags'],           r => [r.name,              r.frags],           true)}
      ${detailCard('Deaths by Player',  data.deaths_by_attacker, ['Player',   'Deaths'],           r => [r.name,              r.deaths],           true)}
      ${detailCard('Kills by Level',    data.kills_by_level,     ['Level',    'Frags'],           r => [r.level,             r.frags])}
      ${detailCard('Deaths by Level',   data.deaths_by_level,    ['Level',    'Deaths'],           r => [r.level,             r.deaths])}
      ${detailCard('Captures by Level', data.captures_by_level,  ['Level',    'Captures'],         r => [r.level,             r.captures])}
    </div>`;

  const nemesisEl = elPlayerBody.querySelector('.stats-tile-nemesis');
  if (nemesisEl) {
    nemesisEl.addEventListener('click', () => navigate(nemesisEl.dataset.guid));
  }
}

function detailCard(title, rows, headers, rowFn, colorizeFirst = false) {
  if (!rows || !rows.length) {
    return `<div class="stats-detail-card"><h3>${title}</h3><div class="stats-empty">No data.</div></div>`;
  }
  const thead = headers.map((h, i) =>
    `<th${i > 0 ? ' style="text-align:right"' : ''}>${h}</th>`
  ).join('');
  const tbody = rows.map(r => {
    const cells = rowFn(r);
    return '<tr>' + cells.map((c, i) => {
      const val = (i > 0 && Number.isFinite(+c)) ? Number(c).toLocaleString() : c;
      const rendered = (i === 0 && colorizeFirst) ? colorize(String(val)) : esc(String(val));
      return `<td class="${i === 0 ? '' : 'stats-num'}">${rendered}</td>`;
    }).join('') + '</tr>';
  }).join('');
  return `<div class="stats-detail-card">
    <h3>${title}</h3>
    <table class="stats-table">
      <thead><tr>${thead}</tr></thead>
      <tbody>${tbody}</tbody>
    </table>
  </div>`;
}

// ------------------------------------------------------------------
// Back button
// ------------------------------------------------------------------

elBack.addEventListener('click', () => navigate(null));

// ------------------------------------------------------------------
// Quetoo color escape rendering (^0–^7)
// ------------------------------------------------------------------

const Q_COLORS = [
  '#ffffff', // ^0 black — renders as white (matches game behaviour)
  '#ff0000', // ^1 red
  '#00ff00', // ^2 green
  '#ffff00', // ^3 yellow
  '#0000ff', // ^4 blue
  '#00ffff', // ^5 cyan
  '#ff00ff', // ^6 magenta
  '#ffffff', // ^7 white
  '#ff8800', // ^8 orange
  '#888888', // ^9 grey
];

/** Strip color escapes, returning plain text. */
function stripColors(str) {
  return String(str).replace(/\^[0-9]/g, '');
}

/**
 * Render color escapes as <span style="color:…"> elements.
 * Text segments are HTML-escaped to prevent XSS.
 */
function colorize(str) {
  if (!str) return '';
  const s = String(str);
  if (!/\^[0-9]/.test(s)) return esc(s);  // fast path — no escapes

  const parts  = s.split(/(\^[0-9])/);
  let result   = '';
  let inSpan   = false;

  for (const part of parts) {
    if (/^\^[0-9]$/.test(part)) {
      if (inSpan) result += '</span>';
      result += `<span style="color:${Q_COLORS[parseInt(part[1])]}">`;
      inSpan = true;
    } else if (part) {
      result += esc(part);
    }
  }

  if (inSpan) result += '</span>';
  return result;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDuration(seconds) {
  seconds = parseInt(seconds, 10);
  if (!seconds || seconds < 60) return '<1m';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ------------------------------------------------------------------
// Init
// ------------------------------------------------------------------

(function init() {
  loadOptions();
  const guid = getHash();
  if (guid) {
    // Load leaderboard in background so the back button can restore context
    loadLeaderboard();
    showPlayer(guid);
  } else {
    showLeaderboard();
  }
})();
