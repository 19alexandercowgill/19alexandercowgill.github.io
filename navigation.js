let themeStylesheet;

        function initTheme() {
            // Find the first <link> that includes "styles.css"
            themeStylesheet = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');

            // If a theme was saved, apply it
            let savedTheme = localStorage.getItem("theme");
            if (savedTheme && themeStylesheet) {
                themeStylesheet.setAttribute("href", savedTheme);
            }
        }

        function toggleTheme() {
            if (!themeStylesheet) return; // Safety check

            let currentTheme = themeStylesheet.getAttribute("href");
            let newTheme = currentTheme.includes("/styles.css") ? "/darkstyles.css" : "/styles.css";
            themeStylesheet.setAttribute("href", newTheme);
            let button = document.getElementById("themeToggle");
    button.innerHTML = button.innerHTML === "🌞" ? "🌙" : "🌞";
            // Save the preference
            localStorage.setItem("theme", newTheme);
        }

        // Initialize on page load
        window.onload = initTheme;
function injectLinks(){
    const nav = document.getElementById("nav-head")
   
    nav.innerHTML = `
     <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/Computing/">Computer Science</a></li>
                <li><a href="/Politics/">Politics</a></li>
                <li><a href="/English/">English Language</a></li>
                <li><a href="/about/">About</a></li>
                <li><a href="/misc/">Misc</a></li>
                <li><a href="/search">Search</a></li>
                 <li><button id="themeToggle" onclick="toggleTheme()">Toggle Theme</button></li>
            </ul>
    `
    let button = document.getElementById("themeToggle");
    button.innerHTML = button.innerHTML === "🌞" ? "🌙" : "🌞";
}

function injectFooter(){
    const foot = document.getElementById("footer-foot");
    foot.innerHTML = `
          &copy; 2025 Alexander Cowgill <a style="color:#fff" href="https://alexco.dev/privacy">Privacy</a><br>This site is under construction. Your page probably isn't there. Sorry!
    `
}
injectLinks();
injectFooter();
function highlightText(targetText) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];

    while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.includes(targetText)) {
            nodes.push(walker.currentNode);
        }
    }

    nodes.forEach(node => {
        const parent = node.parentNode;
        const html = node.nodeValue.replace(
            new RegExp(`\\[${targetText}\\]`, 'g'),
            `<span style="font-weight: bold; color: red;">[${targetText}]</span>`
        );

        const span = document.createElement("span");
        span.innerHTML = html;
        parent.replaceChild(span, node);
    });
}

highlightText("Coming Soon");
