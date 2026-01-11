module.exports=[18622,(a,b,c)=>{b.exports=a.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},24361,(a,b,c)=>{b.exports=a.x("util",()=>require("util"))},42602,(a,b,c)=>{"use strict";b.exports=a.r(18622)},87924,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].ReactJsxRuntime},72131,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].React},9064,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(4819);function e(){let a=(0,c.useRef)(null),e=(0,c.useRef)(null),[f,g]=(0,c.useState)("Loading AR libraries..."),[h,i]=(0,c.useState)("exitdoor"),[j,k]=(0,c.useState)(!1),[l,m]=(0,c.useState)(!1);(0,c.useRef)(null);let[n,o]=(0,c.useState)(null);return(0,c.useEffect)(()=>{},[]),(0,c.useEffect)(()=>{},[j]),(0,c.useEffect)(()=>{},[j,h]),(0,c.useEffect)(()=>{},[j,h]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{dangerouslySetInnerHTML:{__html:`
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
      `}}),(0,b.jsxs)("div",{id:"hud",children:[(0,b.jsxs)("div",{id:"row",children:[(0,b.jsx)("label",{htmlFor:"dest",style:{fontSize:"14px",opacity:.9},children:"Destination"}),(0,b.jsxs)("select",{id:"dest",value:h,onChange:a=>i(a.target.value),children:[(0,b.jsx)("option",{value:"elevator",children:"Elevator"}),(0,b.jsx)("option",{value:"washroom",children:"Bathroom"}),(0,b.jsx)("option",{value:"mainhall",children:"Main hall"}),(0,b.jsx)("option",{value:"exitdoor",children:"Exit door"})]}),(0,b.jsx)("button",{id:"voiceBtn",className:"voice-btn",disabled:!0,style:{background:l?"rgba(34, 197, 94, 0.8)":"rgba(156, 163, 175, 0.8)",cursor:"default",opacity:1},children:l?"🎤 Listening...":"🎤 Voice (starting...)"}),(0,b.jsx)("button",{id:"resetBtn",children:"Reset"}),(0,b.jsx)("button",{id:"repeatBtn",children:"Repeat"})]}),(0,b.jsx)("div",{id:"status",ref:a,children:f}),(0,b.jsx)("div",{id:"small",children:"Hold phone steady at chest height. You will hear a beep when a landmark is confirmed."})]}),(0,b.jsx)("div",{className:"integrated-scene",ref:e,children:j?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{dangerouslySetInnerHTML:{__html:`<a-scene
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
                </a-scene>`}}),n&&(0,b.jsx)(d.default,{externalVideoElement:n,showUI:!1})]}):(0,b.jsx)("div",{style:{padding:"20px",textAlign:"center",color:"white"},children:"Loading AR libraries..."})})]})}function f(){return(0,b.jsx)(e,{})}a.s(["default",()=>f],9064)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__87770a5b._.js.map