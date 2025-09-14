import{_ as c}from"./transformers.web-C-McvHSc.js";/* empty css              */class h{classifier=null;isAnalyzing=!1;textInput;analyzeBtn;clearBtn;resultDiv;highlightDiv;loadingIndicator;statsContainer;charCounter;modelLoadingContainer;progressBar;progressPercentage;modelLoadingTitle;colorMap={polite:{color:"#10b981",bg:"rgba(16, 185, 129, 0.15)"},"somewhat polite":{color:"#f59e0b",bg:"rgba(245, 158, 11, 0.15)"},neutral:{color:"#6b7280",bg:"rgba(107, 114, 128, 0.15)"},impolite:{color:"#ef4444",bg:"rgba(239, 68, 68, 0.15)"},"not polite":{color:"#ef4444",bg:"rgba(239, 68, 68, 0.15)"}};constructor(){this.initializeDOM(),this.setupEventListeners(),this.initializeModel()}initializeDOM(){const t=document.getElementById("app");t.innerHTML=`
   <div class="container" style="display:flex; justify-content:space-between;">
 <a href="./">NEA Utils</a>  <div style="display:flex; gap:10px;">
    <a href="./sentences">Sentences</a>
            <a href="./pronouns">Pronouns</a>
            <a href="./modal">Modal Verbs</a>
            <a href="./politeness">Politeness</a>
            <a href="./sentiment">Sentiment</a>
  </div>
</div>

    <br>
      <div class="container">
        <header class="header">
          <h1>Intel PoliteGuard Politeness Analyser</h1>
          <p class="subtitle">Use Intel's PoliteGuard AI model on Huggingface in your browser!</p>
          <p class="subtitle">This is not 100% accurate. AI has bias, though this should serve as a slightly more deterministic way to categorise text</p>
        </header>
        
        <div class="model-loading-container" id="modelLoadingContainer">
          <div class="model-loading-text">
            <div class="model-loading-title" id="modelLoadingTitle">Loading AI Model...</div>
            <div class="model-loading-subtitle">Downloading polite-guard model from Hugging Face. It will be cached for next time you visit this page!</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progressBar"></div>
          </div>
          <span class="progress-percentage" id="progressPercentage">0%</span>
        </div>
        
        <div class="input-section">
          <div class="input-wrapper">
            <textarea 
              id="textInput" 
              placeholder="Enter your text here to analyse its politeness and sentiment. Try multiple sentences to see detailed analysis..."
              maxlength="10000"
            ></textarea>
            <div class="char-counter">
              <span id="charCount">0</span> / 10000
            </div>
          </div>
        </div>

        <div class="controls">
          <button id="analyzeBtn" class="btn-primary" disabled>
            <span class="btn-text">Analyse Text</span>
          </button>
          <button id="clearBtn" class="btn-secondary">Clear All</button>
          
          <div class="loading-indicator" id="loadingIndicator">
            <div class="spinner"></div>
            <span>Analyzing...</span>
          </div>
        </div>

        <div id="result" class="status">Initializing...</div>

        <div class="results-section" id="resultsSection">
          <div class="analysis-panel">
            <h3 class="panel-title">Analysed Text</h3>
            <div id="highlightDiv" class="highlight-container"></div>
          </div>
          
          <div class="stats-panel">
            <h3 class="panel-title">Analysis Summary</h3>
            <div id="statsContainer"></div>
          </div>
        </div>
      </div>
    `,this.textInput=document.getElementById("textInput"),this.analyzeBtn=document.getElementById("analyzeBtn"),this.clearBtn=document.getElementById("clearBtn"),this.resultDiv=document.getElementById("result"),this.highlightDiv=document.getElementById("highlightDiv"),this.loadingIndicator=document.getElementById("loadingIndicator"),this.statsContainer=document.getElementById("statsContainer"),this.charCounter=document.getElementById("charCount"),this.modelLoadingContainer=document.getElementById("modelLoadingContainer"),this.progressBar=document.getElementById("progressBar"),this.progressPercentage=document.getElementById("progressPercentage"),this.modelLoadingTitle=document.getElementById("modelLoadingTitle")}setupEventListeners(){this.textInput.addEventListener("input",()=>this.updateCharCounter()),this.textInput.addEventListener("keydown",t=>this.handleKeydown(t)),this.analyzeBtn.addEventListener("click",()=>this.analyzeText()),this.clearBtn.addEventListener("click",()=>this.clearAll())}handleKeydown(t){t.key==="Enter"&&(t.ctrlKey||t.metaKey)&&!this.isAnalyzing&&(t.preventDefault(),this.analyzeText())}updateCharCounter(){const t=this.textInput.value.length;this.charCounter.textContent=t.toString(),this.charCounter.className=t>4500?"warning":""}updateProgress(t,e=""){const n=Math.round(t*100);this.progressBar.style.width=`${n}%`,this.progressPercentage.textContent=`${n}%`,e&&(this.modelLoadingTitle.textContent=e)}showModelLoading(){this.modelLoadingContainer.style.display="flex",this.resultDiv.style.display="none"}hideModelLoading(){this.modelLoadingContainer.style.display="none",this.resultDiv.style.display="block"}async initializeModel(){try{this.showModelLoading(),this.updateProgress(0,"Loading AI model..."),this.classifier=await c("text-classification","Intel/polite-guard",{progress_callback:t=>{if(t.progress!==void 0)this.updateProgress(t.progress,t.status||"Loading...");else if(t.loaded!==void 0&&t.total!==void 0){const e=t.loaded/t.total;this.updateProgress(e,`Downloading: ${(e*100).toFixed(1)}%`)}}}),this.updateProgress(1,"Model loaded successfully!"),await new Promise(t=>setTimeout(t,500)),this.hideModelLoading(),this.updateStatus('Model Loaded! Enter text and click "Analyse Text"',"success"),this.analyzeBtn.disabled=!1}catch(t){console.error("Model loading failed:",t),this.hideModelLoading(),this.updateStatus("Failed to load model. Check the browser console, or your network connection","error")}finally{}}updateStatus(t,e="info"){this.resultDiv.textContent=t,this.resultDiv.className=`status ${e}`}splitIntoSentences(t){t=t.replace(/\r\n/g,`
`);const e=t.split(/([.!?]+|\n)/g),n=[];let i="";for(let s of e)s=s.trim(),s&&(/^[.!?]+$/.test(s)||s===`
`?i&&(n.push(i+(s===`
`?"":s)),i=""):i+=(i?" ":"")+s);return i&&n.push(i),n}setLoadingState(t){this.isAnalyzing=t,this.loadingIndicator.style.display=t?"flex":"none",this.analyzeBtn.disabled=t||!this.classifier,t?this.analyzeBtn.classList.add("loading"):this.analyzeBtn.classList.remove("loading")}createHighlightedText(t){this.highlightDiv.innerHTML="";const e=document.createDocumentFragment();t.forEach((n,i)=>{const{sentence:s,result:a}=n,r=a.label.toLowerCase(),d=(a.score*100).toFixed(1),o=this.colorMap[r]||this.colorMap.neutral,l=document.createElement("span");l.className="sentence-highlight",l.textContent=s,l.style.color=o.color,l.style.backgroundColor=o.bg,l.style.borderLeft=`3px solid ${o.color}`,l.title=`${this.capitalizeFirst(r)} (${d}% confidence)`,l.setAttribute("data-label",r),l.setAttribute("data-score",d),e.appendChild(l),i<t.length-1&&e.appendChild(document.createTextNode(" "))}),this.highlightDiv.appendChild(e)}createStatistics(t){const e={};let n=0;t.forEach(s=>{const a=s.result.label.toLowerCase();e[a]=(e[a]||0)+1,n+=s.result.score});const i=(n/t.length*100).toFixed(1);this.statsContainer.innerHTML=`
      <div class="stat-item confidence-stat">
        <div class="stat-label">
         
          Average Confidence
        </div>
        <div class="stat-value">${i}%</div>
        <div class="confidence-bar">
          <div class="confidence-fill" style="width: ${i}%"></div>
        </div>
      </div>
      
      <div class="stat-item total-stat">
        <div class="stat-label">
          
          Total Sentences
        </div>
        <div class="stat-value">${t.length}</div>
      </div>
    `,Object.entries(e).sort(([,s],[,a])=>a-s).forEach(([s,a])=>{const r=this.colorMap[s]||this.colorMap.neutral,d=(a/t.length*100).toFixed(1),o=document.createElement("div");o.className="stat-item category-stat",o.innerHTML=`
          <div class="stat-label">
            <div class="stat-color" style="background: ${r.color};"></div>
            ${this.capitalizeFirst(s)}
          </div>
          <div class="stat-details">
            <div class="stat-value">${a}</div>
            <div class="stat-percentage">${d}%</div>
          </div>
        `,this.statsContainer.appendChild(o)})}capitalizeFirst(t){return t.charAt(0).toUpperCase()+t.slice(1)}async analyzeText(){const t=this.textInput.value.trim();if(!t){this.updateStatus("Please enter some text to analyze.","info"),this.hideResults();return}if(!this.classifier){this.updateStatus("Model is still loading. Please wait...","loading");return}this.setLoadingState(!0),this.updateStatus("Analyzing your text...","loading"),this.hideResults();try{const e=this.splitIntoSentences(t);if(e.length===0)throw new Error("No valid sentences found in the text");const n=await Promise.all(e.map(async s=>(await this.classifier(s)).map(a=>({label:a.label,score:a.score})))),i=e.map((s,a)=>({sentence:s,result:n[a][0]}));this.createHighlightedText(i),this.createStatistics(i),this.showResults(),this.updateStatus(`Analysis complete! Processed ${e.length} sentence${e.length!==1?"s":""}`,"success")}catch(e){console.error("Analysis failed:",e),this.updateStatus("Something went wrong when analysing the text","error"),this.hideResults()}finally{this.setLoadingState(!1)}}showResults(){const t=document.getElementById("resultsSection");t&&(t.style.display="grid")}hideResults(){const t=document.getElementById("resultsSection");t&&(t.style.display="none")}clearAll(){this.textInput.value="",this.highlightDiv.innerHTML="",this.statsContainer.innerHTML="",this.hideResults(),this.updateStatus(this.classifier?"Ready to analyze! Enter your text above.":"Model loading...",this.classifier?"success":"loading"),this.updateCharCounter(),this.textInput.focus()}}new h;
