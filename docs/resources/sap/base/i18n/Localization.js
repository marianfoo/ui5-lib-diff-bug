/*!
* OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/base/config","sap/base/Eventing","sap/base/Log","sap/base/i18n/LanguageTag","sap/base/i18n/date/CalendarType","sap/base/i18n/date/TimezoneUtils"],function(e,a,n,t,g,r){"use strict";var i;var u=e.getWritableInstance();var o=false;var l={"ar-SA":g.Islamic,fa:g.Persian,th:g.Buddhist,default:g.Gregorian};var s={ZH:"zh-Hans",ZF:"zh-Hant",SH:"sr-Latn","6N":"en-GB","1P":"pt-PT","1X":"es-MX","3F":"fr-CA","1Q":"en-US-x-saptrc","2Q":"en-US-x-sappsd","3Q":"en-US-x-saprigi"};var f={iw:"he",ji:"yi"};var p=c(s);function c(e){return Object.keys(e).reduce(function(a,n){a[e[n]]=n;return a},{})}function v(e){if(e){var a=/-(saptrc|sappsd|saprigi)(?:-|$)/i.exec(e);return a&&"en-US-x-"+a[1].toLowerCase()}}function d(e){var a=/\$([-a-z0-9A-Z._]+)(?::([^$]*))?\$/.exec(e);return a&&a[2]?a[2].split(/,/):null}var L=d("$cldr-rtl-locales:ar,fa,he$")||[];var T=d("$core-i18n-locales:,ar,bg,ca,cs,da,de,el,en,en_GB,es,es_MX,et,fi,fr,hi,hr,hu,it,iw,ja,kk,ko,lt,lv,ms,nl,no,pl,pt,ro,ru,sh,sk,sl,sv,th,tr,uk,vi,zh_CN,zh_TW$");function h(e){var a=e.language||"";a=C.getModernLanguage(e.language);var n=e.region||"";if(n&&L.indexOf(a+"_"+n)>=0){return true}return L.indexOf(a)>=0}function y(e){var a;if(e&&typeof e==="string"){e=s[e.toUpperCase()]||e;try{a=new t(e)}catch(e){}}return{languageTag:a,SAPLogonLanguage:e}}function m(e){var a;if(e){a=new t(e)}return a}function S(){return globalThis.navigator?globalThis.navigator.languages&&globalThis.navigator.languages[0]||globalThis.navigator.language||"en":(new Intl.Collator).resolvedOptions().locale||"en"}function b(e,a){if(!e){throw new Error(a)}}function z(){return Array.prototype.filter.call(arguments,Boolean).join("-")}function x(e){var a=r.isValidTimezone(e);if(!a){n.error("The provided timezone '"+e+"' is not a valid IANA timezone ID."+" Falling back to browser's local timezone '"+r.getLocalTimezone()+"'.")}return a}var C={attachChange:function(e){C.attachEvent("change",e)},detachChange:function(e){C.detachEvent("change",e)},getLanguage:function(){var a,t;var g=u.get({name:"sapUiLanguage",type:e.Type.String,external:true});var r=u.get({name:"sapLocale",type:e.Type.String,external:true});var i=u.get({name:"sapLanguage",type:e.Type.String,external:true});if(r){a=m(r);t=r}else if(i){if(!g&&!o){n.warning("sap-language '"+i+"' is not a valid BCP47 language tag and will only be used as SAP logon language");o=true}var l=y(i);a=l.languageTag;t=l.languageTag&&l.SAPLogonLanguage}if(!a){if(g){a=m(g);t=g}else{t=S();a=m(g)}}return t},getModernLanguage:function(e){return f[e]||e},setLanguage:function(a,n){var t=m(a),g=C.getRTL();b(t,"Configuration.setLanguage: sLanguage must be a valid BCP47 language tag");b(n==null||typeof n==="string"&&/^[A-Z0-9]{2,2}$/i.test(n),"Configuration.setLanguage: sSAPLogonLanguage must be null or be a string of length 2, consisting of digits and latin characters only");n=n||"";if(t.toString()!=C.getLanguageTag().toString()||n!==u.get({name:"sapLanguage",type:e.Type.String,external:true})){u.set("sapLanguage",n);u.set("sapUiLanguage",a);i={};i.language=C.getLanguageTag().toString();var r=C.getRTL();if(g!=r){i.rtl=r}A()}},getTimezone:function(){var a=u.get({name:"sapTimezone",type:e.Type.String,external:true,defaultValue:u.get({name:"sapUiTimezone",type:e.Type.String,external:true})});if(!a||!x(a)){a=r.getLocalTimezone()}return a},setTimezone:function(e){b(e==null||typeof e==="string","Configuration.setTimezone: sTimezone must be null or be a string");var a=C.getTimezone();e=e===null||!x(e)?undefined:e;u.set("sapTimezone",e);if(C.getTimezone()!==a){i={};i.timezone=C.getTimezone();A()}return this},getLanguageTag:function(){var e=new t(C.getLanguage());var a=e.toString();var n=C.getModernLanguage(e.language);var g=e.script;if(n==="sr"&&g==="Latn"){a=a.replace("sr-Latn","sh")}else{a=a.replace(e.language,n)}return new t(a)},getRTL:function(){return u.get({name:"sapRtl",type:e.Type.Boolean,external:true,defaultValue:u.get({name:"sapUiRtl",type:e.Type.Boolean,defaultValue:function(){return h(C.getLanguageTag())},external:true})})},setRTL:function(e){b(e===null||typeof e==="boolean","bRTL must be null or a boolean");e=e===null?undefined:e;var a=C.getRTL();u.set("sapRtl",e);var n=C.getRTL();if(a!=n){i={};i.rtl=n;A()}return this},_getSAPLogonLanguage:function(e){var a=e.language||"";if(a.indexOf("-")>=0){a=a.slice(0,a.indexOf("-"))}a=C.getModernLanguage(a);if(a==="zh"&&!e.script&&e.region==="TW"){return"ZF"}return p[z(a,e.script)]||p[z(a,e.region)]||p[v(e.privateUse)]||a.toUpperCase()},getSAPLogonLanguage:function(){var a,t=u.get({name:"sapLanguage",type:e.Type.String,external:true}).toUpperCase();try{a=y(t).languageTag}catch(e){}if(t&&!a){n.warning("sap-language '"+t+"' is not a valid BCP47 language tag and will only be used as SAP logon language")}return t||C._getSAPLogonLanguage(C.getLanguageTag())},getPreferredCalendarType:function(){var e=C.getLanguageTag();return l[e.language+"-"+e.region]||l[e.language]||l["default"]},getLanguagesDeliveredWithCore:function(){return T},getSupportedLanguages:function(){var a=e.get({name:"sapUiXxSupportedLanguages",type:e.Type.StringArray,external:true});if(a.length===0||a.length===1&&a[0]==="*"){a=[]}else if(a.length===1&&a[0]==="default"){a=this.getLanguagesDeliveredWithCore()||[]}return a}};function A(){C.fireEvent("change",i);i=undefined}a.apply(C);return C});
//# sourceMappingURL=Localization.js.map