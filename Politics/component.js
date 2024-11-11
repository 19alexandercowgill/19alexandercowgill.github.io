function injHeader(){
    document.getElementById("header").innerHTML = `  <nav id="navigation-container">
            <a href="/Politics/"><h1>Politics</h1></a>
            <div id="components">
                <a href="/Politics/component-1/">Component 1</a>
                <a href="/Politics/component-2/">Component 2</a>
                <a href="/Politics/component-3/">Component 3</a>
            </div>
        </nav>`
}
injHeader()

function injFooter(){
    document.getElementById("footer").innerHTML = `  <div class="fab-container">
            <div class="fab">
              
              <icon>warning</icon>
              <span class="fab-label">This site is under Construction! Don't expect all pages to exist</span>
            </div>
          </div>`
}
injFooter()