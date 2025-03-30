const htmlElementS = document.documentElement;
const formChoixDuTheme = document.getElementById("formChoixDuTheme");

if (localStorage.getItem("theme") === "dark") {
    htmlElementS.setAttribute("data-bs-theme", "dark");
    document.querySelector('input[name="theme"][value="2"]').checked = true;
} else {
    htmlElementS.setAttribute("data-bs-theme", "light");
    document.querySelector('input[name="theme"][value="1"]').checked = true;
}

function updateThemeIcons() {
    const themeIcons = document.querySelectorAll(".theme-icon");

    themeIcons.forEach((icon) => {
        let iconsrc = icon.getAttribute("src");
        if (iconsrc.includes("-white")) {
            iconsrc = iconsrc.replace("-white", "");
        }
        const darkSrc = iconsrc.replace(".svg", "-white.svg");
        if (htmlElementS.getAttribute("data-bs-theme") === "dark") {
            icon.setAttribute("src", darkSrc);
        } else {
            icon.setAttribute("src", iconsrc);
        }
    });
}

updateThemeIcons();

formChoixDuTheme.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    if (selectedTheme == '1') {
        htmlElementS.setAttribute("data-bs-theme", "light");
        localStorage.setItem("theme", "light");
    } else if (selectedTheme == '2') {
        htmlElementS.setAttribute("data-bs-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        console.log("Thème inconnu sélectionné");
    }
    updateThemeIcons();
});