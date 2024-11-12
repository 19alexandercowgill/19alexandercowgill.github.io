function injHeader(){
    document.getElementById("header").innerHTML = `  <nav id="navigation-container">
            <a href="/Politics/"><h1>Politics</h1></a>
            <div id="components">
                <a href="/Politics/component-1/">Component 1</a>
                <a href="#">Component 2</a>
                <a href="#">Component 3</a>
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
function injPreFooter(){
    document.getElementById("pre-footer").innerHTML = `<span style="display:flex;margin-right:-40px"><icon style="margin-right:45px">info</icon><span>2024 Alexander Cowgill</span><span>`
}
injPreFooter()