const defaultSites = [
    {
        id: "1",
        client: "brand-kopi",
        site: "sudirman-01",
        resolution: "1920x1080",
        trigger: "Panas (>30°C)",
        status: "ONLINE"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('unplug_sites')) {
        localStorage.setItem('unplug_sites', JSON.stringify(defaultSites));
    }
    renderUI();

    document.getElementById('addSiteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const client = document.getElementById('clientInput').value.trim();
        const site = document.getElementById('siteInput').value.trim();
        const resolution = document.getElementById('resInput').value;

        const sites = getSites();
        sites.push({
            id: Date.now().toString(),
            client,
            site,
            resolution,
            trigger: "Default (Normal)",
            status: "ONLINE"
        });

        localStorage.setItem('unplug_sites', JSON.stringify(sites));
        e.target.reset();
        renderUI();
    });
});

function getSites() {
    return JSON.parse(localStorage.getItem('unplug_sites')) || [];
}

function toggleStatus(id) {
    const sites = getSites();
    const target = sites.find(s => s.id === id);
    if (target) {
        target.status = target.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        localStorage.setItem('unplug_sites', JSON.stringify(sites));
        renderUI();
    }
}

function changeTrigger(id, newTrigger) {
    const sites = getSites();
    const target = sites.find(s => s.id === id);
    if (target) {
        target.trigger = newTrigger;
        localStorage.setItem('unplug_sites', JSON.stringify(sites));
        renderUI();
    }
}

function deleteSite(id) {
    let sites = getSites();
    sites = sites.filter(s => s.id !== id);
    localStorage.setItem('unplug_sites', JSON.stringify(sites));
    renderUI();
}

function renderUI() {
    const sites = getSites();
    const tableBody = document.getElementById('siteTableBody');

    // Update Counter
    document.getElementById('totalSites').innerText = sites.length;
    document.getElementById('onlineSites').innerText = sites.filter(s => s.status === 'ONLINE').length;
    document.getElementById('offlineSites').innerText = sites.filter(s => s.status === 'OFFLINE').length;

    if (sites.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">Belum ada site kampanye.</td></tr>`;
        return;
    }

    tableBody.innerHTML = sites.map(s => `
        <tr class="hover:bg-gray-900 transition">
            <td class="p-3 font-semibold text-white">${s.client}</td>
            <td class="p-3 text-gray-300">${s.site} <span class="text-xs text-gray-500">(${s.resolution})</span></td>
            <td class="p-3">
                <select onchange="changeTrigger('${s.id}', this.value)" class="bg-gray-950 border border-gray-800 text-xs text-gray-300 rounded px-2 py-1">
                    <option value="Panas (>30°C)" ${s.trigger === 'Panas (>30°C)' ? 'selected' : ''}>Panas (>30°C)</option>
                    <option value="Hujan" ${s.trigger === 'Hujan' ? 'selected' : ''}>Hujan</option>
                    <option value="Default (Normal)" ${s.trigger === 'Default (Normal)' ? 'selected' : ''}>Default (Normal)</option>
                </select>
            </td>
            <td class="p-3">
                <button onclick="toggleStatus('${s.id}')" class="text-xs font-bold px-2.5 py-1 rounded ${s.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}">
                    ${s.status === 'ONLINE' ? '🟢 ONLINE' : '🔴 OFFLINE'}
                </button>
            </td>
            <td class="p-3 flex gap-2">
                <a href="./campaigns/${s.client}/${s.site}/index.html" target="_blank" class="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1 rounded transition">
                    Preview Screen
                </a>
                <button onclick="deleteSite('${s.id}')" class="bg-red-900 hover:bg-red-800 text-white text-xs px-2 py-1 rounded transition">
                    Hapus
                </button>
            </td>
        </tr>
    `).join('');
}