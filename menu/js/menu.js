const SHEET_ID = '1_nc-81bQPczFzhwT1qq7W1cNcb4vhCimmRmCdrEi0UE';

function getSheetURL(sheetName) {
    return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}
function cleanCSVCell(cell) {
    return cell.replace(/^"(.*)"$/, '$1').trim();
}
function getGoogleDriveImageURL(fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}
async function loadCSVFromSheet(sheetName) {
    try {
        const response = await fetch(getSheetURL(sheetName));
        const text = await response.text();
        return text
            .trim()
            .split('\n')
            .map(line => line.split(',').map(cleanCSVCell));
    } catch (e) {
        console.warn(`Failed to load sheet: ${sheetName}`, e);
        return [];
    }
}

async function renderMenu() {
    const sections = await loadCSVFromSheet('sections');
    const tabs = document.getElementById('category-tabs');
    const content = document.getElementById('categories-content');

    let firstTabId = null;

    for (const [name, arabic_name, desc, image] of sections) {
        const sheetName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_]/g, '');
        const tabId = `tab-${sheetName}`;
        if (!firstTabId) firstTabId = tabId;

        // Tab
        const tab = document.createElement('li');
        tab.className = 'tab col s3';
        tab.innerHTML = `<a href="#${tabId}">${arabic_name}</a>`;
        tabs.appendChild(tab);

        // Tab content
        const tabContent = document.createElement('div');
        tabContent.id = tabId;
        tabContent.className = 'category-tab-content';
        tabContent.innerHTML = `<div class="row" id="products-${sheetName}"></div>`;
        content.appendChild(tabContent);

        // Load products
        const products = await loadCSVFromSheet(sheetName);
        const productRow = tabContent.querySelector(`#products-${sheetName}`);
        for (const [pname, pdesc, price, pic1, pic2, pic3, pic4] of products) {
            const picsArr = [pic1, pic2, pic3, pic4].filter(Boolean);
            const imgSrc = picsArr.length ? getGoogleDriveImageURL(picsArr[0]) : '';
            const productCol = document.createElement('div');
            productCol.className = 'col s6';
            productCol.innerHTML = `
                <div class="entry product-entry" 
                    data-pname="${pname}" 
                    data-pdesc="${pdesc}" 
                    data-price="${price}" 
                    data-pics='${JSON.stringify(picsArr)}'>
                    <img src="${imgSrc}" alt="${pname}">
                    <h6>${pname}</h6>
                    <div class="price"><h5>${price} د.ع</h5></div>
                </div>
            `;
            productRow.appendChild(productCol);
        }
    }

    // Product modal logic
    document.body.addEventListener('click', function(e) {
        const entry = e.target.closest('.product-entry');
        if (entry) {
            const pname = entry.getAttribute('data-pname');
            const pdesc = entry.getAttribute('data-pdesc');
            const price = entry.getAttribute('data-price');
            const pics = JSON.parse(entry.getAttribute('data-pics'));
            let imagesHtml = pics.map(f => `<img src="${getGoogleDriveImageURL(f)}" class="modal-product-img mb-2" alt="${pname}">`).join('');
            document.getElementById('productModalContent').innerHTML = `
                <h4>${pname}</h4>
                <div>${imagesHtml}</div>
                <p>${pdesc}</p>
                <div class="price"><h5>${price} د.ع</h5></div>
            `;
            // Open the modal using Materialize v1.x method
            $('#productModal').modal('open');
        }
    });
}

document.addEventListener('DOMContentLoaded', renderMenu);