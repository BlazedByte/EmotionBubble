const htmlElement = document.documentElement;

if (localStorage.getItem("theme") === "dark") {
    htmlElement.setAttribute("data-bs-theme", "dark");
} else {
    htmlElement.setAttribute("data-bs-theme", "light");
}

const themeIcons = document.querySelectorAll(".theme-icon");

themeIcons.forEach((icon) => {
    const iconsrc = icon.getAttribute("src");
    const darkSrc = iconsrc.replace(".svg", "-white.svg");
    if (htmlElement.getAttribute("data-bs-theme") === "dark") {
        icon.setAttribute("src", darkSrc);
    }
});