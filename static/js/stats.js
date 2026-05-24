/**
 * Quetoo Stats — leaderboard and player detail UI.
 * Fetches data from https://giblets.quetoo.org/api/stats
 */

const API = 'https://giblets.quetoo.org/api/stats';

const elLeaderboard     = document.getElementById('stats-leaderboard');
const elLeaderboardBody = document.getElementById('stats-leaderboard-body');
const elPlayer          = document.getElementById('stats-player');
const elPlayerBody      = document.getElementById('stats-player-body');
const elPlayerName      = document.getElementById('stats-player-name');
const elPlayerSummary   = document.getElementById('stats-player-summary');
const elSearch          = document.getElementById('stats-search');
const elLimit           = document.getElementById('stats-limit');
const elBack            = document.getElementById('stats-back');
const elDateFrom        = document.getElementById('stats-date-from');
const elDateTo          = document.getElementById('stats-date-to');
const elDateClear       = document.getElementById('stats-date-clear');

// ------------------------------------------------------------------
// Date range helpers
// ------------------------------------------------------------------

function getDateParams() {
  const params = {};
  if (elDateFrom.value) params.from = elDateFrom.value;
  if (elDateTo.value)   params.to   = elDateTo.value;
  return params;
}

function updateDateClear() {
  elDateClear.hidden = !(elDateFrom.value || elDateTo.value);
}

elDateFrom.addEventListener('change', () => { updateDateClear(); reloadActive(); });
elDateTo.addEventListener('change',   () => { updateDateClear(); reloadActive(); });
elDateClear.addEventListener('click', () => {
  elDateFrom.value = '';
  elDateTo.value   = '';
  updateDateClear();
  reloadActive();
});

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

function showLeaderboard() {
  elPlayer.classList.add('hidden');
  elLeaderboard.classList.remove('hidden');
  loadLeaderboard();
}

async function loadLeaderboard() {
  const name  = elSearch.value.trim();
  const limit = elLimit.value;

  const params = new URLSearchParams({ limit, ...getDateParams() });
  if (name) params.set('name', name);

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
    const rank       = row.rank;
    const frags      = Number(row.frags).toLocaleString();
    const deaths     = Number(row.deaths).toLocaleString();
    const damage     = Number(row.damage).toLocaleString();
    const timePlayed = formatDuration(row.time_played);
    const cls        = rank <= 3 ? ` stats-rank-${rank}` : '';
    return `<tr data-guid="${esc(row.guid)}" data-name="${esc(row.name)}">
      <td class="stats-rank${cls}">${rank}</td>
      <td class="stats-player-name">${esc(row.name)}</td>
      <td class="stats-num">${frags}</td>
      <td class="stats-num">${deaths}</td>
      <td class="stats-num stats-damage">${damage}</td>
      <td class="stats-num stats-damage">${timePlayed}</td>
    </tr>`;
  }).join('');

  elLeaderboardBody.innerHTML = `
    <table class="stats-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th style="text-align:right">Frags</th>
          <th style="text-align:right">Deaths</th>
          <th style="text-align:right">Damage</th>
          <th style="text-align:right">Time</th>
        </tr>
      </thead>
      <tbody>${tbody}</tbody>
    </table>`;

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
  // Try to recover player name from leaderboard rows already in the DOM
  const nameEl = elLeaderboardBody.querySelector(`tr[data-guid="${guid}"]`);
  const name   = nameEl ? nameEl.dataset.name : (guid.slice(0, 8) + '\u2026');

  elPlayerName.textContent    = name;
  elPlayerSummary.textContent = '';

  const frags  = Number(data.frags);
  const deaths = Number(data.deaths);
  const kd     = deaths > 0 ? (frags / deaths).toFixed(2) : frags.toFixed(2);

  function tile(label, value, extra = '') {
    return `<div class="stats-tile"${extra}><div class="stats-tile-value">${value}</div><div class="stats-tile-label">${label}</div></div>`;
  }

  const rankTile    = tile('Rank',    data.rank ? `#${data.rank}` : '—');
  const fragsTile   = tile('Frags',   frags.toLocaleString());
  const deathsTile  = tile('Deaths',  deaths.toLocaleString());
  const kdTile      = tile('K/D',     kd);
  const damageTile  = tile('Damage',  Number(data.damage).toLocaleString());
  const timeTile    = tile('Played',  formatDuration(data.time_played));
  let   nemesisTile = '';
  if (data.nemesis) {
    nemesisTile = `<div class="stats-tile stats-tile-nemesis" data-guid="${esc(data.nemesis.guid)}" title="Killed you ${Number(data.nemesis.deaths).toLocaleString()} times">
      <div class="stats-tile-value">${esc(data.nemesis.name)}</div>
      <div class="stats-tile-label">Nemesis &middot; ${Number(data.nemesis.deaths).toLocaleString()} kills</div>
    </div>`;
  }

  const tilesHtml = `<div class="stats-tiles">${rankTile}${fragsTile}${deathsTile}${kdTile}${damageTile}${timeTile}${nemesisTile}</div>`;

  elPlayerBody.innerHTML = `
    ${tilesHtml}
    <div class="stats-detail-grid">
      ${detailCard('Kills by Weapon',   data.kills_by_weapon,    ['Weapon',   'Frags',  'Damage'], r => [r.weapon||'unknown', r.frags,  r.damage])}
      ${detailCard('Deaths by Weapon',  data.deaths_by_weapon,   ['Weapon',   'Deaths'],           r => [r.weapon||'unknown', r.deaths])}
      ${detailCard('Kills by Player',   data.kills_by_target,    ['Player',   'Frags',  'Damage'], r => [r.name,              r.frags,  r.damage])}
      ${detailCard('Deaths by Player',  data.deaths_by_attacker, ['Player',   'Deaths'],           r => [r.name,              r.deaths])}
      ${detailCard('Kills by Level',    data.kills_by_level,     ['Level',    'Frags',  'Damage'], r => [r.level,             r.frags,  r.damage])}
      ${detailCard('Deaths by Level',   data.deaths_by_level,    ['Level',    'Deaths'],           r => [r.level,             r.deaths])}
    </div>`;

  const nemesisEl = elPlayerBody.querySelector('.stats-tile-nemesis');
  if (nemesisEl) {
    nemesisEl.addEventListener('click', () => navigate(nemesisEl.dataset.guid));
  }
}

function detailCard(title, rows, headers, rowFn) {
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
      return `<td class="${i === 0 ? '' : 'stats-num'}">${esc(String(val))}</td>`;
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
  const guid = getHash();
  if (guid) {
    // Load leaderboard in background so the back button can restore context
    loadLeaderboard();
    showPlayer(guid);
  } else {
    showLeaderboard();
  }
})();
