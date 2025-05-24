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
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingOverlay.style.zIndex = '1050';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.innerHTML = `
        <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    document.body.appendChild(loadingOverlay);

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
    } finally {
        document.body.removeChild(loadingOverlay);
    }
}

async function renderMenu() {
    const sections = await loadCSVFromSheet('sections');
    const menuContainer = document.getElementById('menu');

    for (const [name,arabic_name, desc, image] of sections) {
        const sheetName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_]/g, '');
        const products = await loadCSVFromSheet(sheetName);

        const sectionCard = document.createElement('div');
        sectionCard.className = 'col-12 section-card';
        const imageURL = getGoogleDriveImageURL(image);
        sectionCard.innerHTML = `
            <div class="card shadow mb-4" id="section-${sheetName}">
                <img src="${imageURL}" class="card-img-top section-img" alt="${name}">
                <div class="card-body">
                    <h2 class="card-title">${arabic_name}</h2>
                    <p class="card-text">${desc}</p>
                    <div class="row g-3" id="products-${sheetName}"></div>
                </div>
            </div>
        `;
        menuContainer.appendChild(sectionCard);

        const navLinks = document.getElementById('nav-links');
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        navItem.innerHTML = `
          <a class="nav-link" href="#section-${sheetName}">${arabic_name}</a>
        `;
        navLinks.appendChild(navItem);

        const productRow = sectionCard.querySelector(`#products-${sheetName}`);
        for (const [pname, pdesc, price, pic1, pic2, pic3, pic4] of products) {
            const picsArr = [pic1, pic2, pic3, pic4].filter(Boolean);
            const pics = picsArr
                .map((fileId, idx) => `
                    <img src="${getGoogleDriveImageURL(fileId)}"
                        class="img-thumbnail me-2 mb-2 product-gallery-img"
                        alt="${pname}"
                        style="max-width: 100px; max-height: 100px; cursor:pointer;"
                        data-gallery='${JSON.stringify(picsArr)}'
                        data-index='${idx}'>
                `)
                .join('');

            const productCol = document.createElement('div');
            productCol.className = 'col-md-6 product-card';

            productCol.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title d-flex justify-content-between">
                            <span>${pname}</span>
                            <span class="text-muted">${price}د.ع</span>
                        </h5>
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

    // Gallery logic using Bootstrap Carousel
    const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
    const galleryCarouselInner = document.getElementById('galleryCarouselInner');
    let galleryCarousel; // Will hold the Bootstrap Carousel instance

    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('product-gallery-img')) {
            const gallery = JSON.parse(e.target.getAttribute('data-gallery'));
            const index = parseInt(e.target.getAttribute('data-index'));

            // Build carousel items
            galleryCarouselInner.innerHTML = gallery.map((fileId, idx) => `
                <div class="carousel-item${idx === index ? ' active' : ''}">
                    <img src="${getGoogleDriveImageURL(fileId)}" class="d-block w-100" alt="">
                </div>
            `).join('');

            // Show modal and reset carousel to the clicked image
            galleryModal.show();

            // Re-initialize carousel to set the correct active slide
            if (galleryCarousel) {
                galleryCarousel.dispose();
            }
            galleryCarousel = new bootstrap.Carousel(document.getElementById('galleryCarousel'), {
                interval: false,
                ride: false,
                wrap: true
            });
            galleryCarousel.to(index);
        }
    });
}

document.addEventListener('DOMContentLoaded', renderMenu);
