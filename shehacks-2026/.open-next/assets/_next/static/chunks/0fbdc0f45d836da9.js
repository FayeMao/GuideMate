(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,90574,e=>{"use strict";var t=e.i(43476),n=e.i(71645),o=e.i(50461);function r(){let e=(0,n.useRef)(null),r=(0,n.useRef)(null),[i,a]=(0,n.useState)("Loading AR libraries..."),[l,s]=(0,n.useState)("exitdoor"),[d,c]=(0,n.useState)(!1),[u,h]=(0,n.useState)(!1),m=(0,n.useRef)(null),[p,f]=(0,n.useState)(null);return(0,n.useEffect)(()=>{if(window.AFRAME&&window.MINDAR)return void c(!0);let e=document.querySelector('script[src*="aframe"]'),t=document.querySelector('script[src*="mind-ar"]');if(e&&t){let e=setInterval(()=>{window.AFRAME&&window.MINDAR&&(c(!0),clearInterval(e))},100);return()=>clearInterval(e)}let n=!1,o=!1,r=()=>{n&&o&&window.AFRAME&&window.MINDAR&&c(!0)},i=document.createElement("script");i.src="https://aframe.io/releases/1.5.0/aframe.min.js",i.async=!1,i.onload=()=>{n=!0,r()},i.onerror=()=>{console.error("Failed to load A-Frame")},document.head.appendChild(i);let a=document.createElement("script");a.src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js",a.async=!1,a.onload=()=>{o=!0,r()},a.onerror=()=>{console.error("Failed to load MindAR")},document.head.appendChild(a)},[]),(0,n.useEffect)(()=>{if(!d||!window.AFRAME||!window.MINDAR)return;let e=()=>{let e=document.querySelector("a-scene");if(!e)return!1;if(e.systems&&e.systems["mindar-image-system"]){let t=e.systems["mindar-image-system"];if(t.video&&t.video instanceof HTMLVideoElement)return console.log("✅ Found MindAR video element via system"),f(t.video),!0}if(e.videoEl&&e.videoEl instanceof HTMLVideoElement)return console.log("✅ Found MindAR video element via videoEl property"),f(e.videoEl),!0;let t=e.querySelector("canvas");if(t){let e=t.parentElement;if(e){let t=e.querySelector("video")||Array.from(e.children).find(e=>"VIDEO"===e.tagName);if(t&&t instanceof HTMLVideoElement)return f(t),!0}}for(let e of Array.from(document.querySelectorAll("video")))if(e.srcObject&&e.readyState>0)return console.log("✅ Found video element in document"),f(e),!0;return console.log("⚠️ Could not find MindAR video element yet"),!1},t=setTimeout(()=>{if(e())return;let t=setInterval(()=>{e()&&clearInterval(t)},500);setTimeout(()=>clearInterval(t),1e4)},1500),n=document.querySelector("a-scene");return n&&n.addEventListener("loaded",()=>{setTimeout(()=>{e()},1e3)}),()=>{clearTimeout(t)}},[d]),(0,n.useEffect)(()=>{if(!d||!window.AFRAME||!window.MINDAR||!e.current)return;let t={elevator:{label:"Elevator"},washroom:{label:"Bathroom"},mainhall:{label:"Main hall"},exitdoor:{label:"Exit door"}},n={0:"elevator",1:"washroom",2:"mainhall",3:"exitdoor",4:"exitdoor"},o=new Set(["elevator","washroom","mainhall","exitdoor"]),r={elevator:[{to:"washroom",say:"Go right and walk straight."}],washroom:[{to:"mainhall",say:"Walk straight."},{to:"elevator",say:"Walk straight."}],mainhall:[{to:"exitdoor",say:"Go right and walk straight."},{to:"washroom",say:"Take a left then walk straight."}],exitdoor:[{to:"mainhall",say:"Do a 180, then walk straight."}]};function i(e,t){if(e===t)return[e];let n=[e],o={},i=new Set([e]);for(;n.length;){let a=n.shift();for(let l of r[a]||[]){let r=l.to;if(!i.has(r)){if(i.add(r),o[r]=a,r===t){let n=[t],r=t;for(;r!==e;)n.push(r=o[r]);return n.reverse(),n}n.push(r)}}}return null}let s=l,c=null,u=null,h=null,m=0,p="",f=!1;function w(e,{interrupt:t=!1}={}){if(p=e,a(e),!window.speechSynthesis)return void console.warn("SpeechSynthesis not supported");try{t&&window.speechSynthesis.cancel();let n=new SpeechSynthesisUtterance(e);n.lang="en-US",n.rate=1,n.pitch=1,n.volume=1,n.onerror=e=>{console.error("SpeechSynthesis error:",e)},window.speechSynthesis.speak(n)}catch(e){console.error("TTS Error:",e)}}function g(e){f=!0,h=null,m=0,y=!0,w(`${e} Choose next destination.`,{interrupt:!0})}let v=null,y=!1,x=0,b=!1,S=Date.now();function E(){c=null,u=null,h=null,m=0,y=!1,x=0,f=!1}function I(){let e;if(!h||!c)return;if(m>=h.length-1)return void g(`You have arrived at ${t[s].label}.`);let n=h[m],o=h[m+1],i=(e=(r[n]||[]).find(e=>e.to===o))?e.say:"Keep moving forward with caution.";w(`You are at ${t[n].label}. ${i}`,{interrupt:!0})}let A=null,R=0,j=setInterval(function(){f||!c||!h||y||Date.now()-x<4500||window.speechSynthesis&&window.speechSynthesis.speaking||(y=!0,w("Keep moving forward with caution.",{interrupt:!1}))},700);function T(e){g(`You are at ${t.washroom.label}. ${"elevator"===e?"Go left.":"Go right."} The door is in front of you. Walk with caution and open the door to enter.`)}function k(){p&&w(p,{interrupt:!0})}function M(){E()}function B(e){s=e.target.value,c=null,u=null,h=null,m=0,y=!1,x=0,f=!1,w(`Destination set to ${t[s].label}. Scan the room so we can locate you.`,{interrupt:!0})}let D=[];for(let e=0;e<5;e++){let r=()=>(function(e){let r,a=n[e];a&&(r=Date.now(),(A!==a?(A=a,R=r,!1):r-R>=500)&&function(e){if(!o.has(e))return;let n=Date.now();if(!b&&n-S<3e3||(b=!0,f))return;let r=c;x=Date.now(),y=!1;try{v||(v=new(window.AudioContext||window.webkitAudioContext));let e=v.createOscillator(),t=v.createGain();e.type="sine",e.frequency.value=880,t.gain.value=.08,e.connect(t),t.connect(v.destination),e.start(),setTimeout(()=>e.stop(),90)}catch(e){console.error(e)}try{navigator.vibrate&&navigator.vibrate(80)}catch(e){console.error(e)}if(!c||!h)return(u=c,h=i(c=e,s),m=0,y=!1,x=Date.now(),h)?I():w("No route found from here.",{interrupt:!0});m<h.length-1&&e===h[m+1]?(m+=1,u=r,c=e,"washroom"===s&&"washroom"===e)?T(u):I():e!==c?(u=r,h=i(c=e,s),m=0,h)?"washroom"===s&&"washroom"===e?T(u):(w(`You are at ${t[c].label}. Re routing.`,{interrupt:!0}),setTimeout(I,350)):w("I cannot find a route from here.",{interrupt:!0}):I()}(a))})(e);D.push(r)}let L=setTimeout(()=>{let e=document.getElementById("resetBtn"),t=document.getElementById("repeatBtn"),n=document.getElementById("dest");e&&e.addEventListener("click",M),t&&t.addEventListener("click",k),n&&n.addEventListener("change",B);for(let e=0;e<5;e++){let t=document.getElementById(`t${e}`);t&&t.addEventListener("targetFound",D[e])}b=!1,S=Date.now(),E()},200);return()=>{clearTimeout(L),clearInterval(j);let e=document.getElementById("resetBtn"),t=document.getElementById("repeatBtn"),n=document.getElementById("dest");e?.removeEventListener("click",M),t?.removeEventListener("click",k),n?.removeEventListener("change",B);for(let e=0;e<5;e++){let t=document.getElementById(`t${e}`);t&&D[e]&&t.removeEventListener("targetFound",D[e])}}},[d,l]),(0,n.useEffect)(()=>{if(!d)return;let e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e)return void console.warn("Speech Recognition not supported in this browser");let t={washroom:"Bathroom",elevator:"Elevator",mainhall:"Main hall",exitdoor:"Exit door"},n=!1,o=()=>{if(n)return;let r=new e;r.lang="en-US",r.continuous=!0,r.interimResults=!1,r.onstart=()=>h(!0),r.onend=()=>{h(!1),n||setTimeout(()=>{n||o()},100)},r.onresult=e=>{let n=e.results[e.results.length-1][0].transcript.toLowerCase(),o=null;for(let[e,t]of Object.entries({washroom:"washroom","wash room":"washroom",bathroom:"washroom","bath room":"washroom",restroom:"washroom",elevator:"elevator","main hall":"mainhall",mainhall:"mainhall","exit door":"exitdoor",exitdoor:"exitdoor",exit:"exitdoor"}))if(n.includes(e)){o=t;break}if(o){let e=t[o]||o;s(o),a(`Destination set to ${e} via voice command.`);var r=`Destination set to ${e}.`;if(window.speechSynthesis)try{window.speechSynthesis.cancel();let e=new SpeechSynthesisUtterance(r);e.lang="en-US",e.rate=1,e.pitch=1,e.volume=1,window.speechSynthesis.speak(e)}catch(e){console.error("TTS Error:",e)}}},r.onerror=e=>{console.error("Speech Recognition Error:",e.error),h(!1),"not-allowed"===e.error?(a("Microphone permission denied. Please enable microphone access."),n=!0):"aborted"===e.error||"no-speech"===e.error||n||setTimeout(()=>{n||o()},1e3)},m.current=r;try{r.start()}catch(e){console.error("Error starting recognition:",e),h(!1)}};return o(),()=>{if(n=!0,m.current)try{m.current.stop()}catch{}window.speechSynthesis&&window.speechSynthesis.cancel(),h(!1)}},[d,l]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{dangerouslySetInnerHTML:{__html:`
        body {
          margin: 0;
          overflow: hidden;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        #hud {
          position: fixed;
          left: 12px;
          right: 12px;
          top: 12px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          z-index: 10000;
          pointer-events: auto;
        }

        #row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        select,
        button {
          border: 0;
          border-radius: 10px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          font-size: 14px;
          cursor: pointer;
        }

        button:hover:not(:disabled),
        select:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        button:disabled {
          cursor: default;
          opacity: 0.9;
        }

        #status {
          margin-top: 10px;
          font-size: 18px;
          font-weight: 650;
          line-height: 1.25;
        }

        #small {
          margin-top: 6px;
          font-size: 13px;
          opacity: 0.9;
        }

        .integrated-scene {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
        }

        a-scene {
          z-index: 1 !important;
        }
      `}}),(0,t.jsxs)("div",{id:"hud",children:[(0,t.jsxs)("div",{id:"row",children:[(0,t.jsx)("label",{htmlFor:"dest",style:{fontSize:"14px",opacity:.9},children:"Destination"}),(0,t.jsxs)("select",{id:"dest",value:l,onChange:e=>s(e.target.value),children:[(0,t.jsx)("option",{value:"elevator",children:"Elevator"}),(0,t.jsx)("option",{value:"washroom",children:"Bathroom"}),(0,t.jsx)("option",{value:"mainhall",children:"Main hall"}),(0,t.jsx)("option",{value:"exitdoor",children:"Exit door"})]}),(0,t.jsx)("button",{id:"voiceBtn",className:"voice-btn",disabled:!0,style:{background:u?"rgba(34, 197, 94, 0.8)":"rgba(156, 163, 175, 0.8)",cursor:"default",opacity:1},children:u?"🎤 Listening...":"🎤 Voice (starting...)"}),(0,t.jsx)("button",{id:"resetBtn",children:"Reset"}),(0,t.jsx)("button",{id:"repeatBtn",children:"Repeat"})]}),(0,t.jsx)("div",{id:"status",ref:e,children:i}),(0,t.jsx)("div",{id:"small",children:"Hold phone steady at chest height. You will hear a beep when a landmark is confirmed."})]}),(0,t.jsx)("div",{className:"integrated-scene",ref:r,children:d?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{dangerouslySetInnerHTML:{__html:`<a-scene
                  style="position: fixed; inset: 0; width: 100vw; height: 100vh;"
                  mindar-image="imageTargetSrc: /targets.mind; autoStart: true;"
                  color-space="sRGB"
                  renderer="colorManagement: true"
                  vr-mode-ui="enabled: false"
                  device-orientation-permission-ui="enabled: true"
                >
                  <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
                  <a-entity id="t0" mindar-image-target="targetIndex: 0"></a-entity>
                  <a-entity id="t1" mindar-image-target="targetIndex: 1"></a-entity>
                  <a-entity id="t2" mindar-image-target="targetIndex: 2"></a-entity>
                  <a-entity id="t3" mindar-image-target="targetIndex: 3"></a-entity>
                  <a-entity id="t4" mindar-image-target="targetIndex: 4"></a-entity>
                </a-scene>`}}),p&&(0,t.jsx)(o.default,{externalVideoElement:p,showUI:!1})]}):(0,t.jsx)("div",{style:{padding:"20px",textAlign:"center",color:"white"},children:"Loading AR libraries..."})})]})}function i(){return(0,t.jsx)(r,{})}e.s(["default",()=>i],90574)}]);