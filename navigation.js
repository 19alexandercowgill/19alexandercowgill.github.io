function injectLinks(){
    const nav = document.getElementById("nav-head")
   
    nav.innerHTML = `
     <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/Computing/">Computer Science</a></li>
                <li><a href="#">Politics</a></li>
                <li><a href="#">English Language</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Misc</a></li>
            </ul>
    `
}
function injectFooter(){
    const foot = document.getElementById("footer-foot");
    foot.innerHTML = `
          &copy; 2025 Alexander Cowgill<br>This site is under construction. Your page probably isn't there. Sorry!
    `
}
injectLinks();
injectFooter();