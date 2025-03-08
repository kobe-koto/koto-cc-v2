addEventListener("DOMContentLoaded", function () {
    //window.matchMedia('(prefers-color-scheme: dark)').matches
    if (
        (
            localStorage.getItem("Theme") === null &&
            matchMedia('(prefers-color-scheme: dark)').matches
            // doesnt have Theme & prefer dark => Dark Theme
        ) ||
        localStorage.getItem("Theme") === "Night"
    ) {
        let SwitcherElement = document.getElementsByClassName("DarkModeSwitcher")[0];
        let ThemeIcons = SwitcherElement.getElementsByTagName("a")[0].getElementsByTagName("i"),
            ThemeText = SwitcherElement.getElementsByTagName("a")[1];
        ThemeText.innerHTML = "Night";

        ThemeIcons[0].style.display = "none";
        ThemeIcons[1].style.display = "inline-block";
        document.body.setAttribute("theme", "Night");
    }
})


function SwitchTheme () {
    let SwitcherElement = document.getElementsByClassName("DarkModeSwitcher")[0];

    let ThemeIcons = SwitcherElement.getElementsByTagName("a")[0].getElementsByTagName("i"),
        ThemeText = SwitcherElement.getElementsByTagName("a")[1];

    let ThemeUpToDate = ThemeText.innerHTML === "Light" ? "Night" : "Light";

    ThemeIcons[0].style.display = ThemeUpToDate === "Light" ? "inline-block" : "none";
    ThemeIcons[1].style.display = ThemeUpToDate === "Light" ? "none" : "inline-block";

    document.body.setAttribute("theme", ThemeUpToDate);
    localStorage.setItem("Theme", ThemeUpToDate)
    ThemeText.innerHTML = ThemeUpToDate;
}