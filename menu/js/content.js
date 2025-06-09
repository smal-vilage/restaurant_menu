const sections = {
	"LA MINESTRA": [1],
	"ANTIPASTI": [2,3],
	"APPETIZER": [4],
	"PASTA PIATTI": [5,6,7],
	"RISOTTO PIATTI": [7],
	"SECONDI PIATTI": [8],
	"PIZZA": [9,10,11],
	"DOLCI": [12,13,14],
	"BEVANDE CALDI": [15,16],
	"BEVANDE FREDDI": [17,18,20,21,22,23],
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
