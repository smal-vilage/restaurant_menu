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
	"BEVANDE FREDDI": [19, 21, 22, 23, 24],
};

const sectionBar = document.getElementById("sectionBar");
const gallery = document.getElementById("menuGallery");

// Render buttons for each section
Object.entries(sections).forEach(([name, indices]) => {
	const btn = document.createElement("button");
	btn.textContent = name;
	btn.addEventListener("click", () => {
		const el = document.getElementById(`section-${name}`);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	});
	sectionBar.appendChild(btn);
});

// Render images with section anchors
let imageIndex = 1;
for (const [sectionName, imageList] of Object.entries(sections)) {
	const anchor = document.createElement("div");
	anchor.id = `section-${sectionName}`;
	anchor.style.scrollMarginTop = "100px"; // offset for fixed navbar
	gallery.appendChild(anchor);

	imageList.forEach((i) => {
		const padded = String(i).padStart(3, '0');
		const img = document.createElement("img");
		img.src = `img/menu jor's hacos_${padded}.png`;
		img.alt = `${sectionName} Page ${i}`;
		gallery.appendChild(img);
	});
}
