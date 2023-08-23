"use strict";sap.ui.define(["sap/m/MessageBox","./BaseController","sap/ui/model/json/JSONModel"],function(e,t,r){function n(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const s=n(t);const o=s.extend("de.marianzeis.ui5libdiff.controller.Main",{onInit:async function e(){this.getView().setModel(new r,"changes");this.getView().setModel(new r,"versionFrom");this.getView().setModel(new r,"versionTo");this.loadData()},handleVersionChange:function e(t){this.getView().setBusyIndicatorDelay(0);this.getView().setBusy(true);const r=this.getView().byId("versionFromSelect").getSelectedKey();const n=this.getView().byId("versionToSelect").getSelectedKey();const s=this.compareVersions(r,n);const o=this.getView().byId("SegmentedButton").getSelectedKey();if(r&&n){const e=this.getMergedChangesBetweenVersions(s.versionFrom,s.versionTo,o);this.getView().getModel("changes").setData(e)}this.getView().setBusy(false)},sayHello:function t(){e.show("Hello World!")},loadData:async function e(){this.getView().setBusy(true);const t="./data/consolidated.json";let n;try{n=await this.fetchJson(t)}catch(e){console.error("Error fetching data:",e)}this.getView().setModel(new r(n),"data");this.getView().setBusy(false)},fetchJson:async function e(t){try{const e=await fetch(t);if(!e.ok){throw new Error("Network response was not ok")}const r=await e.json();return r}catch(e){console.error("There was a problem with the fetch operation:",e.message);throw e}},compareVersion:function e(t,r){const n=t.split(".").map(Number);const s=r.split(".").map(Number);for(let e=0;e<n.length&&e<s.length;e++){if(n[e]<s[e])return-1;if(n[e]>s[e])return 1}return n.length-s.length},sortChanges:function e(t){const r=this.getView().byId("SegmentedButtonSort").getSelectedKey();return t.sort((e,t)=>{if(r==="type"){if(e.type==="DEPRECATED"&&t.type!=="DEPRECATED"){return-1}else if(e.type!=="DEPRECATED"&&t.type==="DEPRECATED"){return 1}else if(e.type==="FEATURE"&&t.type!=="FEATURE"){return-1}else if(e.type!=="FEATURE"&&t.type==="FEATURE"){return 1}else{if(!e.text||!t.text){console.warn("Undefined or null text detected:",e,t);return 0}return e.text.localeCompare(t.text)}}else if(r==="text"){if(!e.text||!t.text){console.warn("Undefined or null text detected:",e,t);return 0}return e.text.localeCompare(t.text)}else{if(!e.version||!t.version){console.warn("Undefined or null version detected:",e,t);return 0}return this.compareVersionDesc(e.version,t.version)}})},mergeLibraries:function e(t){const r=new Map;for(const e of t){for(const t of e.libraries){const n=t.changes.map(t=>({...t,version:e.version}));const s=r.get(t.library)||[];r.set(t.library,s.concat(n))}}return Array.from(r.entries()).map(e=>{let[t,r]=e;const n=[];const s=new Set;for(const e of this.sortChanges(r)){const t=JSON.stringify({type:e.type,text:e.text});if(!s.has(t)){s.add(t);n.push(e)}}return{library:t,changes:n}}).sort((e,t)=>{if(e.library==="deprecated"){return-1}else if(t.library==="deprecated"){return 1}else{return e.library.localeCompare(t.library)}})},getMergedChangesBetweenVersions:function e(t,r,n){const s=this.getView().getModel("data").getData();const o=s.filter(e=>this.compareVersion(e.version,t)>0&&this.compareVersion(e.version,r)<=0);const i=this.mergeLibraries(o);if(n==="ALL"){return i}return i.map(e=>{const t=e.changes.filter(e=>e.type===n);return{library:e.library,changes:t}}).filter(e=>e.changes.length>0)},compareVersions:function e(t,r){const n=t.split(".").map(Number);const s=r.split(".").map(Number);for(let e=0;e<n.length;e++){if(n[e]>s[e]){return{versionFrom:r,versionTo:t}}else if(n[e]<s[e]){return{versionFrom:t,versionTo:r}}}return{versionFrom:t,versionTo:r}},compareVersionDesc:function e(t,r){const n=t.split(".").map(Number);const s=r.split(".").map(Number);for(let e=0;e<n.length&&e<s.length;e++){if(n[e]>s[e])return-1;if(n[e]<s[e])return 1}return s.length-n.length}});return o});
//# sourceMappingURL=Main.controller.js.map