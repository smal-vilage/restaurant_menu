const SHEET_ID = '1_nc-81bQPczFzhwT1qq7W1cNcb4vhCimmRmCdrEi0UE';

function getSheetURL(sheetName) {
    return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
}

async function loadCSVFromSheet(sheetName) {
    try {
        const response = await fetch(getSheetURL(sheetName));
        const text = await response.text();
        return text.trim().split('\n').map(line => line.split(','));
    } catch (e) {
        console.warn(`Failed to load sheet: ${sheetName}`, e);
        return [];
    }
}

async function renderMenu() {
    const sections = await loadCSVFromSheet('sections');
    const menuContainer = document.getElementById('menu');

    for (const [name, desc, image] of sections) {
        const sheetName = name.toLowerCase().replace(/[^a-z0-9\-]/g, '-');
        const products = await loadCSVFromSheet(sheetName);

        const sectionCard = document.createElement('div');
        sectionCard.className = 'col-12 section-card';
        sectionCard.innerHTML = `
            <div class="card shadow">
                <img src="${image}" class="card-img-top section-img" alt="${name}">
                <div class="card-body">
                    <h2 class="card-title">${name}</h2>
                    <p class="card-text">${desc}</p>
                    <div class="row" id="${sheetName}-products"></div>
                </div>
            </div>
        `;
        menuContainer.appendChild(sectionCard);

        const productRow = sectionCard.querySelector(`#${sheetName}-products`);
        for (const [pname, pdesc, price, pic1, pic2, pic3, pic4] of products) {
            const pics = [pic1, pic2, pic3, pic4].filter(Boolean).map(src => `
                <img src="${src}" class="img-fluid" alt="" />
            `).join('');

            const productCol = document.createElement('div');
            productCol.className = 'col-md-6 product-card';

            productCol.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${pname} <span class="text-muted float-end">$${price}</span></h5>
                        <p class="card-text">${pdesc}</p>
                        <div class="product-images d-flex flex-wrap">
                            ${pics}
                        </div>
                    </div>
                </div>
            `;
            productRow.appendChild(productCol);
        }
    }
}

document.addEventListener('DOMContentLoaded', renderMenu);
