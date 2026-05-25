/**
 * Quetoo Server Browser — live server list from /api/servers.
 * Sorting is server-side: clicking a column header re-fetches with updated
 * sort/dir params, consistent with the stats/leaderboard page.
 */

const API_SERVERS     = 'https://giblets.quetoo.org/api/servers';
const REFRESH_MS      = 30000;

const elList          = document.getElementById('servers-list');
const elRefreshStatus = document.getElementById('servers-refresh-status');

// Strip Quetoo color escape sequences (^0–^9).
function stripColors(str) {
  return (str || '').replace(/\^[0-9]/g, '');
}

// ── Sort state ────────────────────────────────────────────────────────────────

const SORT_COLS = [
  { label: 'Server',   key: 'hostname',    align: 'left',  defaultDir: 'asc'  },
  { label: 'Map',      key: 'map',         align: 'left',  defaultDir: 'asc'  },
  { label: 'Gameplay', key: 'gameplay',    align: 'left',  defaultDir: 'asc'  },
  { label: 'Players',  key: 'num_clients', align: 'right', defaultDir: 'desc' },
];

let sortState = { key: 'num_clients', dir: 'desc' };

// ── Rendering ─────────────────────────────────────────────────────────────────

function renderServers(servers) {
  if (!servers.length) {
    elList.innerHTML = '<div class="servers-empty">No servers online.</div>';
    return;
  }

  const thead = SORT_COLS.map(col => {
    const active = sortState.key === col.key;
    const arrow  = active ? (sortState.dir === 'asc' ? ' ▲' : ' ▼') : '';
    const align  = col.align === 'right' ? 'text-align:right;' : '';
    return `<th data-sort="${col.key}" style="${align}cursor:pointer;user-select:none;">${col.label}${arrow}</th>`;
  }).join('') + '<th></th>';

  const tbody = servers.map((s, idx) => {
    const dotClass   = s.num_clients > 0 ? 'servers-dot-online' : 'servers-dot-empty';
    const playerRows = s.players.length
      ? s.players.map(p => `
          <tr>
            <td>${stripColors(p.name)}</td>
            <td class="servers-cell-num">${p.score}</td>
            <td class="servers-cell-num">${p.ping} ms</td>
          </tr>`).join('')
      : '<tr><td colspan="3" class="servers-no-players">No players</td></tr>';

    return `
      <tr class="servers-row" data-idx="${idx}" onclick="togglePlayers(${idx})">
        <td>
          <span class="servers-dot ${dotClass}"></span>
          <span class="servers-hostname">${stripColors(s.hostname)}</span>
        </td>
        <td class="servers-map">${s.map || '—'}</td>
        <td class="servers-gameplay">${s.gameplay || '—'}</td>
        <td class="servers-cell-num">${s.num_clients}/${s.max_clients}</td>
        <td class="servers-join-cell">
          <a class="servers-join btn btn-sm"
             href="https://quetoo.org/join/?${s.ip}:${s.port}"
             onclick="event.stopPropagation()">Join</a>
        </td>
      </tr>
      <tr class="servers-players hidden" id="players-${idx}">
        <td colspan="5" class="servers-players-td">
          <table class="servers-players-table">
            <thead><tr>
              <th>Player</th>
              <th class="servers-cell-num">Score</th>
              <th class="servers-cell-num">Ping</th>
            </tr></thead>
            <tbody>${playerRows}</tbody>
          </table>
        </td>
      </tr>`;
  }).join('');

  elList.innerHTML = `
    <table class="servers-table">
      <thead><tr>${thead}</tr></thead>
      <tbody>${tbody}</tbody>
    </table>`;

  elList.querySelectorAll('thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      const col = SORT_COLS.find(c => c.key === key);
      if (sortState.key === key) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.key = key;
        sortState.dir = col.defaultDir;
      }
      loadServers();
    });
  });
}

function togglePlayers(idx) {
  document.getElementById(`players-${idx}`)?.classList.toggle('hidden');
}

// ── Data loading ──────────────────────────────────────────────────────────────

async function loadServers() {
  const params = new URLSearchParams({ sort: sortState.key, dir: sortState.dir });
  try {
    const res  = await fetch(`${API_SERVERS}?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderServers(data);
    elRefreshStatus.textContent = `· updated ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    elList.innerHTML = `<div class="servers-error">Failed to load servers: ${e.message}</div>`;
  }
}

loadServers();
setInterval(loadServers, REFRESH_MS);
