function getNav() {
    const navBar = document.getElementById("nav-top")
    navBar.innerHTML = `<h1 id="title"><a id="title-link" href="/Computing/">Computing</a></h1>
            <div id="links">
            <menu>
    <li tabindex="0" class="nav-item has-dropdown link">
        <a tabindex="0" href="#">Component 1</a>
        <ul class="dropdown">
            <li class="overview-item"><a tabindex="0" href="/Computing/component-1/processors-io-storage/">Key Features of Processors, I/O, and Storage Devices</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-1/software-software-dev/">Software and software development</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-1/exchanging-data/">Exchanging data</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-1/data-algorithms/">Data types, data structures and algorithms</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-1/legal-moral-ethics/">Legal, moral, cultural and ethical issues</a></li>
            <hr>
            <li class="dropdown-item"><a tabindex="0" href="/Computing/component-1/">Component 1</a></li>
        </ul>
    </li>
    <li tabindex="0" class="nav-item has-dropdown link">
        <a tabindex="0" href="#">Component 2</a>
        <ul class="dropdown">
            <li class="overview-item"><a tabindex="0" href="/Computing/component-2/computer-thinking/">Computational Thinking</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-2/problems-programming/">Problem Solving and Programming</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-2/algorithms/">Algorithms</a></li>
            <hr>
            <li class="dropdown-item"><a tabindex="0" href="/Computing/component-2/">Component 2</a></li>
        </ul>
    </li>
    <li tabindex="0" class="nav-item has-dropdown link">
        <a tabindex="0" href="#">Component 3</a>
        <ul class="dropdown">
            <li class="overview-item"><a tabindex="0" href="/Computing/component-3/problem-analysis/">Analysis of the problem</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-3/solution-design/">Design of the solution</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-3/solution-dev/">Developing the solution</a></li>
            <li class="overview-item"><a tabindex="0" href="/Computing/component-3/evaluation/">Evaluation</a></li>
            <hr>
            <li class="dropdown-item"><a tabindex="0" href="/Computing/component-3/">Component 3</a></li>
        </ul>
    </li>
</menu>

            </div>`
}

function getFooter() {
    const footer = document.getElementById("footer")
    footer.innerHTML = ` <p>2024 Alexander Cowgill</p><p style="background-color:gray;border-radius:15px;padding:10px">This site is under construction. Not all pages will exist yet. <a href="/404.html">404</a></p><p>Found an issue? Report it at <a style="text-decoration:solid; text-decoration-line: underline;" href="https://github.com/19alexandercowgill/19alexandercowgill.github.io/issues/new">GitHub Issues</a>`
}


getNav()
getFooter()
