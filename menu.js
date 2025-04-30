async function loadCSV(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text.trim().split('\n').map(line => line.split(','));
}

async function renderMenu() {
    const sections = await loadCSV('data/sections.csv');
    const menuContainer = document.getElementById('menu');

    for (const [name, desc, image] of sections) {
        const sectionId = name.toLowerCase().replace(/\s+/g, '-');
        const sectionDiv = document.createElement('div');
        sectionDiv.innerHTML = `
            <h2>${name}</h2>
            <p>${desc}</p>
            <img src="${image}" alt="${name}" width="200"/>
            <div id="${sectionId}-products" class="products"></div>
        `;
        menuContainer.appendChild(sectionDiv);

        const products = await loadCSV(`data/${sectionId}.csv`);
        const productsContainer = document.getElementById(`${sectionId}-products`);
        
        products.forEach(([pname, pdesc, price, pic1, pic2, pic3, pic4]) => {
            const pics = [pic1, pic2, pic3, pic4].filter(Boolean).map(src => `<img src="${src}" width="100"/>`).join('');
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <h3>${pname} - $${price}</h3>
                <p>${pdesc}</p>
                <div class="product-images">${pics}</div>
            `;
            productsContainer.appendChild(productDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', renderMenu);
