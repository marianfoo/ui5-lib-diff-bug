/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/each","sap/base/util/isEmptyObject","sap/ui/core/format/NumberFormat","sap/ui/model/CompositeType","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException"],function(t,e,r,o,i,s,a,n){"use strict";var u=i.extend("sap.ui.model.type.Currency",{constructor:function(t){i.apply(this,arguments);this.sName="Currency";this.bShowMeasure=!t||!("showMeasure"in t)||t.showMeasure;this.bShowNumber=!t||!("showNumber"in t)||t.showNumber;this.bUseRawValues=true}});u.prototype.formatValue=function(t,e){var r=t;if(t==undefined||t==null){return null}if(this.oInputFormat){r=this.oInputFormat.parse(t)}if(!Array.isArray(r)){throw new s("Cannot format currency: "+t+" has the wrong format")}if((r[0]==undefined||r[0]==null)&&this.bShowNumber){return null}switch(this.getPrimitiveType(e)){case"string":return this.oOutputFormat.format(r);default:throw new s("Don't know how to format currency to "+e)}};u.prototype.parseValue=function(t,e){var r;switch(this.getPrimitiveType(e)){case"string":r=this.oOutputFormat.parse(t);if(!Array.isArray(r)||this.bShowNumber&&isNaN(r[0])){throw this.getParseException()}break;default:throw new a("Don't know how to parse Currency from "+e)}if(this.oInputFormat){r=this.oInputFormat.format(r)}return r};u.prototype.validateValue=function(r){if(this.oConstraints){var o=sap.ui.getCore().getLibraryResourceBundle(),i=[],s=[],a=r,u;if(this.oInputFormat){a=this.oInputFormat.parse(r)}u=a[0];e(this.oConstraints,function(e,r){switch(e){case"minimum":if(u<r){i.push("minimum");s.push(o.getText("Currency.Minimum",[r]))}break;case"maximum":if(u>r){i.push("maximum");s.push(o.getText("Currency.Maximum",[r]))}break;default:t.warning("Unknown constraint '"+e+"': Value is not validated.",null,"sap.ui.model.type.Currency")}});if(i.length>0){throw new n(this.combineMessages(s),i)}}};u.prototype.setFormatOptions=function(t){this.oFormatOptions=Object.assign(t.style!=="short"&&t.style!=="long"?{preserveDecimals:true}:{},t);this._createFormats()};u.prototype._handleLocalizationChange=function(){this._createFormats()};u.prototype._createFormats=function(){var t=this.oFormatOptions.source;this.oOutputFormat=o.getCurrencyInstance(this.oFormatOptions);if(t){if(r(t)){t={groupingEnabled:false,groupingSeparator:",",decimalSeparator:"."}}this.oInputFormat=o.getCurrencyInstance(t)}};u.prototype.getParseException=function(){var t=sap.ui.getCore().getLibraryResourceBundle(),e;if(!this.bShowNumber){e=t.getText("Currency.InvalidMeasure")}else if(!this.bShowMeasure){e=t.getText("EnterNumber")}else{e=t.getText("Currency.Invalid")}return new a(e)};u.prototype.getPartsIgnoringMessages=function(){if(!this.bShowMeasure){return[1]}else if(!this.bShowNumber){return[0]}return[]};return u});
//# sourceMappingURL=Currency.js.map