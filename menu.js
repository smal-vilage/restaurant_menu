async function loadCSV(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error("File not found");
        const text = await response.text();
        return text.trim().split('\n').map(line => line.split(','));
    } catch (e) {
        console.warn(`Missing file: ${path}`);
        return [];
    }
}

async function renderMenu() {
    const sections = await loadCSV('data/sections.csv');
    const menuContainer = document.getElementById('menu');

    for (const [name, desc, image] of sections) {
        const sectionId = name.toLowerCase().replace(/\s+/g, '-');
        const products = await loadCSV(`data/${sectionId}.csv`);

        // Section Card
        const sectionCard = document.createElement('div');
        sectionCard.className = 'col-12 section-card';
        sectionCard.innerHTML = `
            <div class="card shadow">
                <img src="${image}" class="card-img-top section-img" alt="${name}">
                <div class="card-body">
                    <h2 class="card-title">${name}</h2>
                    <p class="card-text">${desc}</p>
                    <div class="row" id="${sectionId}-products"></div>
                </div>
            </div>
        `;
        menuContainer.appendChild(sectionCard);

        const productRow = sectionCard.querySelector(`#${sectionId}-products`);
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

