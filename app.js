let CUR = "all";

function T(k, btn) {
    CUR = k;
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("on"));
    if (btn) btn.classList.add("on");
    render();
}

function go() {
    render();
}

function buildWordCard(item) {
    let genderClass = "pdas";
    if (item.art === "der") genderClass = "pder";
    if (item.art === "die") genderClass = "pdie";

    return `
        <div class="card" onclick="this.classList.toggle('open')">
            <div class="ct">
                <div>
                    <span class="cn">${item.art ? item.art + ' ' : ''}${item.de || ''}</span>
                    <div class="cpl">Plural: ${item.pl || '-'}</div>
                    <div class="ce">${item.en || ''}</div>
                </div>
                <span class="pill ${genderClass}">${item.k ? item.k.toUpperCase() : 'A1'}</span>
            </div>
            <div class="exp">
                <div class="dl"></div>
                <div class="sl">Examples & Context</div>
                ${item.v && item.v.length > 0 
                    ? item.v.map(vRow => `<div class="vrow"><b>${vRow[0]}</b> <span>${vRow[1]}</span></div>`).join('') 
                    : '<div class="et">No context phrases supplied.</div>'
                }
            </div>
        </div>
    `;
}

function buildExprCard(item) {
    return `
        <div class="expr-card">
            <div class="expr-de">${item.de || ''}</div>
            <div class="expr-en">${item.en || ''}</div>
        </div>
    `;
}

function buildVerbCard(f) {
    return `
        <div class="verb-card">
            <span class="cn" style="color: #ffd43b; font-size: 14px;">Stamm: ${f.root}</span>
            <div class="ce" style="margin-bottom: 8px; font-style: italic;">Concept: ${f.en}</div>
            <div class="dl"></div>
            ${f.m && f.m.length > 0 
                ? f.m.map(x => `<div class="vrow"><b>${x[0]}</b> <span style="color: #aaffcc;">${x[1]}</span></div>`).join("") 
                : '<div class="et">No variations mapped.</div>'
            }
        </div>
    `;
}

function render() {
    const q = document.getElementById("sb").value.toLowerCase().trim();
    const grid = document.getElementById("grid");
    const countBox = document.getElementById("ct");
    grid.innerHTML = "";

    if (CUR === "vfam") {
        const targetFam = typeof FAM !== 'undefined' ? FAM : [];
        let filteredFamilies = targetFam.filter(f => f.root.toLowerCase().includes(q) || f.en.toLowerCase().includes(q));
        if (filteredFamilies.length === 0) {
            grid.innerHTML = `<div class="nr">No matching verb families found.</div>`;
            countBox.innerHTML = `<b>0</b> verb families found`;
            return;
        }
        grid.innerHTML = filteredFamilies.map(buildVerbCard).join("");
        countBox.innerHTML = `<b>${filteredFamilies.length}</b> verb families matching`;
        return;
    }

    if (CUR === "expr") {
        const targetExpr = typeof EXPR !== 'undefined' ? EXPR : [];
        let filteredExpr = targetExpr.filter(item => item.de.toLowerCase().includes(q) || item.en.toLowerCase().includes(q));
        if (filteredExpr.length === 0) {
            grid.innerHTML = `<div class="nr">No matching phrases found.</div>`;
            countBox.innerHTML = `<b>0</b> phrases found`;
            return;
        }
        grid.innerHTML = filteredExpr.map(buildExprCard).join("");
        countBox.innerHTML = `<b>${filteredExpr.length}</b> phrases matching`;
        return;
    }

    const targetD = typeof D !== 'undefined' ? D : [];
    let filteredWords = targetD.filter(item => {
        if (CUR !== "all" && item.k !== CUR) return false;
        return item.de.toLowerCase().includes(q) || item.en.toLowerCase().includes(q);
    });

    if (filteredWords.length === 0) {
        grid.innerHTML = `<div class="nr">No items match your search parameters.</div>`;
        countBox.innerHTML = `<b>0</b> entries located`;
        return;
    }

    grid.innerHTML = filteredWords.map(buildWordCard).join("");
    countBox.innerHTML = `<b>${filteredWords.length}</b> entries found`;
}

window.addEventListener('DOMContentLoaded', () => {
    render();
});
