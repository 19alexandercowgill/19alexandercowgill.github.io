function getNav() {
    const navBar = document.getElementById("nav-top")
    navBar.innerHTML = `<h1 id="title"><a id="title-link" href="/Computing/">Computing</a></h1>
            <div id="links">
                <li tabindex="0" class="nav-item has-dropdown link">
                    <a tabindex="0" href="#">Component 1</a>
                    <ul class="dropdown">
                        <a tabindex="0" href="/Computing/component-1/processors-io-storage/"><li class="overview-item">Key Features of Processors, I/O, and Storage Devices</li></a>
                        <a tabindex="0" href="/Computing/component-1/software-software-dev/"><li class="overview-item">Software and software development</li></a>
                        <a tabindex="0" href="/Computing/component-1/exchanging-data/"><li class="overview-item">Exchanging data</li></a>
                        <a tabindex="0" href="/Computing/component-1/data-algorithms/"><li class="overview-item">Data types, data structures and algorithms</li></a>
                        <a tabindex="0" href="/Computing/component-1/legal-moral-ethics/"><li class="overview-item">Legal, moral, cultural and ethical issues</li></a>
                    <hr>
                        <li class="dropdown-item"><a tabindex="0" href="/Computing/component-1/">Component 1</a></li>
                   
                    </ul>
                </li>
                <li tabindex="0" class="nav-item has-dropdown link">
                    <a tabindex="0" href="#">Component 2</a>
                    <ul class="dropdown">
                        <a tabindex="0" href="/Computing/component-2/computer-thinking/"><li class="overview-item">Computational Thinking</li></a>
                        <a tabindex="0" href="/Computing/component-2/problems-programming/"><li class="overview-item">Problem Solving and Programming</li></a>
                        <a tabindex="0" href="/Computing/component-2/algorithms/"><li class="overview-item">Algorithms</li></a>
                   <hr>
                        <li class="dropdown-item"><a tabindex="0" href="/Computing/component-2/">Component 2</a></li>
                   
                    </ul>
                </li>
                <li tabindex="0" class="nav-item has-dropdown link">
                    <a tabindex="0" href="#">Component 3</a>
                    <ul class="dropdown">
                        <a tabindex="0" href="/Computing/component-3/problem-analysis/"><li class="overview-item">Analysis of the problem</li></a>
                        <a tabindex="0" href="/Computing/component-3/solution-design/"><li class="overview-item">Design of the solution</li></a>
                        <a tabindex="0" href="/Computing/component-3/solution-dev/"><li class="overview-item">Developing the solution</li></a>
                        <a tabindex="0" href="/Computing/component-3/evaluation/"><li class="overview-item">Evaluation</li></a>
                   <hr>
                        <li class="dropdown-item"><a tabindex="0" href="/Computing/component-3/">Component 3</a></li>
                    </ul>
                </li>
            </div>`
}

function getFooter() {
    const footer = document.getElementById("footer")
    footer.innerHTML = ` <p>2024 Alexander Cowgill</p><p style="background-color:gray;border-radius:15px;padding:10px">This site is under construction. Not all pages will exist yet. <a href="/404.html">404</a></p><p>Found an issue? Report it at <a style="text-decoration:solid; text-decoration-line: underline;" href="https://github.com/19alexandercowgill/19alexandercowgill.github.io/issues/new">GitHub Issues<a>`
}


getNav()
getFooter()
