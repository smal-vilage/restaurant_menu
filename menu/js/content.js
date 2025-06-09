const sections = {
	"LA MINESTRA": [2],
	"ANTIPASTI": [3, 4],
	"APPETIZER": [5],
	"PASTA PIATTI": [6, 7, 8],
	"RISOTTO PIATTI": [9],
	"SECONDI PIATTI": [10],
	"PIZZA": [11, 12, 13],
	"DOLCI": [14, 15, 16],
	"BEVANDE CALDI": [17, 18],
	"BEVANDE FREDDI": [19, 20, 21, 22, 23, 24],
};


const sectionBar = document.getElementById("sectionBar");
const gallery = document.getElementById("menuGallery");

const titleImg = document.createElement("img");
titleImg.src = `img/menu jor's hacos_001.png`;
titleImg.alt = "Title Page";
gallery.appendChild(titleImg);

for (const section in sections) {
	const button = document.createElement("button");
	button.textContent = section;
	button.onclick = () => {
		const target = document.getElementById(`section-${section}`);
		if (target) {
			target.scrollIntoView({ behavior: "smooth" });
		}
	};
	sectionBar.appendChild(button);
}

for (const [section, indexes] of Object.entries(sections)) {
	const anchor = document.createElement("div");
	anchor.id = `section-${section}`;
	anchor.style.scrollMarginTop = "100px";
	gallery.appendChild(anchor);

	indexes.forEach(i => {
		const padded = String(i).padStart(3, '0');
		const img = document.createElement("img");
		img.src = `img/menu jor's hacos_${padded}.png`;
		img.alt = `${section} Page ${i}`;
		gallery.appendChild(img);
	});
}
