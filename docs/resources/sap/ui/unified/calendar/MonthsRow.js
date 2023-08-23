/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/LocaleData","sap/ui/core/delegate/ItemNavigation","sap/ui/unified/calendar/CalendarUtils","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/library","sap/ui/core/format/DateFormat","sap/ui/core/library","sap/ui/core/Locale","./MonthsRowRenderer","sap/ui/dom/containsOrEquals","sap/ui/thirdparty/jquery","sap/ui/unified/DateRange","sap/ui/core/Configuration","sap/ui/core/Core","sap/ui/core/date/UI5Date"],function(e,t,a,r,i,o,s,n,l,h,g,jQuery,p,c,u,f){"use strict";var d=e.extend("sap.ui.unified.calendar.MonthsRow",{metadata:{library:"sap.ui.unified",properties:{date:{type:"object",group:"Data"},startDate:{type:"object",group:"Data"},months:{type:"int",group:"Appearance",defaultValue:12},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},showHeader:{type:"boolean",group:"Appearance",defaultValue:false},primaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},focus:{parameters:{date:{type:"object"},notVisible:{type:"boolean"}}}}},renderer:h});d.prototype.init=function(){var e=this._getPrimaryCalendarType();this._oFormatYyyymm=s.getInstance({pattern:"yyyyMMdd",calendarType:e});this._oFormatOnlyYearLong=s.getInstance({pattern:"yyyy",calendarType:e});this._oFormatLong=s.getInstance({pattern:"MMMM y",calendarType:e});this._mouseMoveProxy=jQuery.proxy(this._handleMouseMove,this);this._rb=u.getLibraryResourceBundle("sap.ui.unified")};d.prototype.setPrimaryCalendarType=function(e){this.setProperty("primaryCalendarType",e);this._oFormatYyyymm=s.getInstance({pattern:"yyyyMMdd",calendarType:e});this._oFormatLong=s.getInstance({pattern:"MMMM y",calendarType:e});return this};d.prototype._getPrimaryCalendarType=function(){return this.getProperty("primaryCalendarType")||c.getCalendarType()};d.prototype.setSecondaryCalendarType=function(e){this.setProperty("secondaryCalendarType",e);this._oFormatYearInSecType=s.getDateInstance({format:"y",calendarType:e});this._oFormatLongInSecType=s.getInstance({pattern:"MMMM y",calendarType:e});return this};d.prototype._getSecondaryCalendarType=function(){var e=this.getSecondaryCalendarType();if(e===this._getPrimaryCalendarType()){return undefined}return e};d.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation}if(this._sInvalidateMonths){clearTimeout(this._sInvalidateMonths)}};d.prototype.onAfterRendering=function(){y.call(this);L.call(this)};d.prototype.onsapfocusleave=function(e){if(!e.relatedControlId||!g(this.getDomRef(),sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){if(this._bMouseMove){T.call(this,true);b.call(this,this._getDate());this._bMoveChange=false;this._bMousedownChange=false;M.call(this)}if(this._bMousedownChange){this._bMousedownChange=false;M.call(this)}}};d.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var e=this.removeAllAggregation("selectedDates");return e};d.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var e=this.destroyAggregation("selectedDates");return e};d.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var e=this.removeAllAggregation("specialDates");return e};d.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var e=this.destroyAggregation("specialDates");return e};d.prototype.setDate=function(e){if(e){var t=i.fromLocalJSDate(e,this.getProperty("primaryCalendarType"));this._oDate=t;S.call(this,t,false)}return this.setProperty("date",e)};d.prototype._getDisplayedSecondaryDates=function(e,t){var a=this._getSecondaryCalendarType(),o,s,n;if(this._oDate){o=new i(this._oDate)}else{o=new i(i.fromLocalJSDate(f.getInstance()),this._getPrimaryCalendarType())}o.setYear(t);o.setMonth(e);o.setDate(1);s=new i(o,a);o.setDate(r._daysInMonth(o));n=new i(o,a);return{start:s,end:n}};d.prototype._getDate=function(){if(!this._oDate){this._oDate=i.fromLocalJSDate(f.getInstance(),this.getProperty("primaryCalendarType"))}return this._oDate};d.prototype.setStartDate=function(e){r._checkJSDateObject(e);var t,a,o;a=e.getFullYear();r._checkYearInValidRange(a);t=i.fromLocalJSDate(e,this.getProperty("primaryCalendarType"));this.setProperty("startDate",e,true);this._oStartDate=t;this._oStartDate.setDate(1);if(this.getDomRef()){o=this._getDate().toLocalJSDate();this._bNoRangeCheck=true;this.displayDate(e);this._bNoRangeCheck=false;if(o&&this.checkDateFocusable(o)){this.setDate(o)}}return this};d.prototype._getStartDate=function(){if(!this._oStartDate){this._oStartDate=i.fromLocalJSDate(f.getInstance(),this.getProperty("primaryCalendarType"));this._oStartDate.setDate(1)}return this._oStartDate};d.prototype.displayDate=function(e){S.call(this,i.fromLocalJSDate(e,this.getProperty("primaryCalendarType")),true);return this};d.prototype._getLocale=function(){var e=this.getParent();if(e&&e.getLocale){return e.getLocale()}else if(!this._sLocale){this._sLocale=c.getFormatSettings().getFormatLocale().toString()}return this._sLocale};d.prototype._getLocaleData=function(){var e=this.getParent();if(e&&e._getLocaleData){return e._getLocaleData()}else if(!this._oLocaleData){var a=this._getLocale();var r=new l(a);this._oLocaleData=t.getInstance(r)}return this._oLocaleData};d.prototype._getFormatLong=function(){var e=this._getLocale();if(this._oFormatLong.oLocale.toString()!=e){var t=new l(e);this._oFormatLong=s.getInstance({style:"long",calendarType:this.getProperty("primaryCalendarType")},t)}return this._oFormatLong};d.prototype.getIntervalSelection=function(){var e=this.getParent();if(e&&e.getIntervalSelection){return e.getIntervalSelection()}else{return this.getProperty("intervalSelection")}};d.prototype.getSingleSelection=function(){var e=this.getParent();if(e&&e.getSingleSelection){return e.getSingleSelection()}else{return this.getProperty("singleSelection")}};d.prototype.getSelectedDates=function(){var e=this.getParent();if(e&&e.getSelectedDates){return e.getSelectedDates()}else{return this.getAggregation("selectedDates",[])}};d.prototype.getSpecialDates=function(){var e=this.getParent();if(e&&e.getSpecialDates){return e.getSpecialDates()}else{return this.getAggregation("specialDates",[])}};d.prototype._getShowHeader=function(){var e=this.getParent();if(e&&e._getShowItemHeader){return e._getShowItemHeader()}else{return this.getProperty("showHeader")}};d.prototype.getAriaLabelledBy=function(){var e=this.getParent();if(e&&e.getAriaLabelledBy){return e.getAriaLabelledBy()}else{return this.getAssociation("ariaLabelledBy",[])}};d.prototype._setLegendControlOrigin=function(e){this._oLegendControlOrigin=e};d.prototype.getLegend=function(){var e=this.getParent();if(this._oLegendControlOrigin){return this._oLegendControlOrigin.getLegend()}if(e&&e.getLegend){return e.getLegend()}else{return this.getAssociation("ariaLabelledBy",[])}};d.prototype._setAriaRole=function(e){this._ariaRole=e;return this};d.prototype._getAriaRole=function(){return this._ariaRole?this._ariaRole:"gridcell"};d.prototype._checkDateSelected=function(e){var t,a,o,s,n=0,l=0,h=0,g=this.getProperty("primaryCalendarType"),p,c,u;r._checkCalendarDate(e);c=this.getSelectedDates();u=new i(e);u.setDate(1);s=u.toUTCJSDate().getTime();for(p=0;p<c.length;p++){t=c[p];a=t.getStartDate();n=0;if(a){a=i.fromLocalJSDate(a,g);a.setDate(1);n=a.toUTCJSDate().getTime()}o=t.getEndDate();l=0;if(o){o=i.fromLocalJSDate(o,g);o.setDate(1);l=o.toUTCJSDate().getTime()}if(s==n&&!o){h=1;break}else if(s==n&&o){h=2;if(o&&s==l){h=5}break}else if(o&&s==l){h=3;break}else if(o&&s>n&&s<l){h=4;break}if(this.getSingleSelection()){break}}return h};d.prototype._getDateType=function(e){r._checkCalendarDate(e);var t,a,o,s,n=0,l,h=0,g,p=this.getSpecialDates(),c=new i(e),u=this.getProperty("primaryCalendarType");c.setDate(1);g=c.toUTCJSDate().getTime();for(o=0;o<p.length;o++){a=p[o];s=a.getStartDate();n=0;if(s){s=i.fromLocalJSDate(s,u);s.setDate(1);n=s.toUTCJSDate().getTime()}l=a.getEndDate();h=0;if(l){l=i.fromLocalJSDate(l,u);l.setDate(r._daysInMonth(l));h=l.toUTCJSDate().getTime()}if(g==n&&!l||g>=n&&g<=h){t={type:a.getType(),tooltip:a.getTooltip_AsString()};break}}return t};d.prototype._checkMonthEnabled=function(e){r._checkCalendarDate(e);var t=this.getParent();if(t&&t._oMinDate&&t._oMaxDate){if(r._isOutside(e,t._oMinDate,t._oMaxDate)){return false}}return true};d.prototype._handleMouseMove=function(e){if(!this.$().is(":visible")){T.call(this,true)}var t=jQuery(e.target);if(t.hasClass("sapUiCalItemText")){t=t.parent()}if(t.hasClass("sapUiCalItem")){var a=this._getDate();var r=i.fromLocalJSDate(this._oFormatYyyymm.parse(t.attr("data-sap-month"),this.getProperty("primaryCalendarType")));r.setDate(1);if(!r.isSame(a)){this.setDate(r.toLocalJSDate());b.call(this,r,true);this._bMoveChange=true}}};d.prototype.onmouseup=function(e){if(this._bMouseMove){T.call(this,true);var t=this._getDate();var a=this._oItemNavigation.getItemDomRefs();for(var r=0;r<a.length;r++){var o=jQuery(a[r]);if(o.attr("data-sap-month")==this._oFormatYyyymm.format(t.toUTCJSDate(),true)){o.trigger("focus");break}}if(this._bMoveChange){var s=jQuery(e.target);if(s.hasClass("sapUiCalItemText")){s=s.parent()}if(s.hasClass("sapUiCalItem")){t=i.fromLocalJSDate(this._oFormatYyyymm.parse(s.attr("data-sap-month")));t.setDate(1)}b.call(this,t);this._bMoveChange=false;this._bMousedownChange=false;M.call(this)}}if(this._bMousedownChange){this._bMousedownChange=false;M.call(this)}};d.prototype.onsapselect=function(e){var t=b.call(this,this._getDate());if(t){M.call(this)}e.stopPropagation();e.preventDefault()};d.prototype.onsapselectmodifiers=function(e){this.onsapselect(e)};d.prototype.onsappageupmodifiers=function(e){var t=new i(this._getDate());var a=t.getYear();if(e.metaKey||e.ctrlKey){t.setYear(a-10)}else{var r=this.getMonths();if(r<=12){t.setYear(a-1)}else{t.setMonth(t.getMonth()-r)}}this.fireFocus({date:t.toLocalJSDate(),notVisible:true});e.preventDefault()};d.prototype.onsappagedownmodifiers=function(e){var t=new i(this._getDate());var a=t.getYear();if(e.metaKey||e.ctrlKey){t.setYear(a+10)}else{var r=this.getMonths();if(r<=12){t.setYear(a+1)}else{t.setMonth(t.getMonth()+r)}}this.fireFocus({date:t.toLocalJSDate(),notVisible:true});e.preventDefault()};d.prototype.onThemeChanged=function(){if(this._bNoThemeChange){return}this._bNamesLengthChecked=undefined;this._bLongWeekDays=undefined;var e=this._getLocaleData();var t=e.getMonthsStandAlone("wide",this.getProperty("primaryCalendarType"));var a=this.$("months").children();var r=this._getStartDate().getMonth();for(var i=0;i<a.length;i++){var o=jQuery(jQuery(a[i]).children(".sapUiCalItemText"));o.text(t[(i+r)%12])}L.call(this)};d.prototype.checkDateFocusable=function(e){r._checkJSDateObject(e);if(this._bNoRangeCheck){return false}var t=this._getStartDate();var a=new i(t);a.setDate(1);a.setMonth(a.getMonth()+this.getMonths());var o=i.fromLocalJSDate(e,this.getProperty("primaryCalendarType"));return o.isSameOrAfter(t)&&o.isBefore(a)};d.prototype.applyFocusInfo=function(e){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());return this};function y(){var e=this._getDate();var t=this._oFormatYyyymm.format(e.toUTCJSDate(),true);var r=0;var i=this.$("months").get(0);var o=this.$("months").children(".sapUiCalItem");for(var s=0;s<o.length;s++){var n=jQuery(o[s]);if(n.attr("data-sap-month")===t){r=s;break}}if(!this._oItemNavigation){this._oItemNavigation=new a;this._oItemNavigation.attachEvent(a.Events.AfterFocus,m,this);this._oItemNavigation.attachEvent(a.Events.FocusAgain,D,this);this._oItemNavigation.attachEvent(a.Events.BorderReached,v,this);this.addDelegate(this._oItemNavigation);this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(1,true)}this._oItemNavigation.setRootDomRef(i);this._oItemNavigation.setItemDomRefs(o);this._oItemNavigation.setFocusedIndex(r);this._oItemNavigation.setPageSize(o.length)}function m(e){var t=e.getParameter("index");var a=e.getParameter("event");if(!a){return}var r=this._getDate();var o=new i(r);var s=this._oItemNavigation.getItemDomRefs();var n=jQuery(s[t]);o=i.fromLocalJSDate(this._oFormatYyyymm.parse(n.attr("data-sap-month")));o.setDate(1);this.setDate(o.toLocalJSDate());this.fireFocus({date:o.toLocalJSDate(),notVisible:false});if(a.type=="mousedown"){_.call(this,a,o,t)}}function D(e){var t=e.getParameter("index");var a=e.getParameter("event");if(!a){return}if(a.type=="mousedown"){var r=this._getDate();_.call(this,a,r,t)}}function v(e){var t=e.getParameter("event");var a=this.getMonths();var r=this._getDate();var o=new i(r);if(t.type){switch(t.type){case"sapnext":case"sapnextmodifiers":o.setMonth(o.getMonth()+1);break;case"sapprevious":case"sappreviousmodifiers":o.setMonth(o.getMonth()-1);break;case"sappagedown":o.setMonth(o.getMonth()+a);break;case"sappageup":o.setMonth(o.getMonth()-a);break;default:break}this.fireFocus({date:o.toLocalJSDate(),notVisible:true})}}function _(e,t,a){if(e.button){return}var r=b.call(this,t);if(r){this._bMousedownChange=true}if(this._bMouseMove){T.call(this,true);this._bMoveChange=false}else if(r&&this.getIntervalSelection()&&this.$().is(":visible")){I.call(this,true)}e.preventDefault();e.setMark("cancelAutoClose")}function S(e,t){r._checkCalendarDate(e);var a=e.getYear();r._checkYearInValidRange(a);var o=true;if(!this.getDate()||!e.isSame(i.fromLocalJSDate(this.getDate(),this.getProperty("primaryCalendarType")))){var s=new i(e);s.setDate(1);o=this.checkDateFocusable(e.toLocalJSDate());if(!this._bNoRangeCheck&&!o){throw new Error("Date must be in visible date range; "+this)}this.setProperty("date",e.toLocalJSDate());this._oDate=s}if(this.getDomRef()){if(o){C.call(this,this._oDate,t)}}}function C(e,t){var a=this._oFormatYyyymm.format(e.toUTCJSDate(),true);var r=this._oItemNavigation.getItemDomRefs();var i;for(var o=0;o<r.length;o++){i=jQuery(r[o]);if(i.attr("data-sap-month")==a){if(document.activeElement!=r[o]){if(t){this._oItemNavigation.setFocusedIndex(o)}else{this._oItemNavigation.focusItem(o)}}break}}}function b(e,t){if(!this._checkMonthEnabled(e)){return false}var a=this.getSelectedDates();var r;var o=0;var s=this.getParent();var n=this;var l;if(s&&s.getSelectedDates){n=s}if(this.getSingleSelection()){if(a.length>0){r=a[0];l=r.getStartDate();if(l){l=i.fromLocalJSDate(l,this.getProperty("primaryCalendarType"));l.setDate(1)}}else{r=new p;n.addAggregation("selectedDates",r)}if(this.getIntervalSelection()&&(!r.getEndDate()||t)&&l){var h;if(e.isBefore(l)){h=l;l=e;if(!t){r.setProperty("startDate",l.toLocalJSDate());r.setProperty("endDate",h.toLocalJSDate())}}else if(e.isSameOrAfter(l)){h=e;if(!t){r.setProperty("endDate",h.toLocalJSDate())}}}else{r.setProperty("startDate",e.toLocalJSDate());r.setProperty("endDate",undefined)}}else{if(this.getIntervalSelection()){throw new Error("Calender don't support multiple interval selection")}else{var g=this._checkDateSelected(e);if(g>0){for(o=0;o<a.length;o++){l=a[o].getStartDate();if(l){l=i.fromLocalJSDate(l,this.getProperty("primaryCalendarType"));l.setDate(1);if(e.isSame(l)){n.removeAggregation("selectedDates",o);break}}}}else{r=new p({startDate:e.toLocalJSDate()});n.addAggregation("selectedDates",r)}}}return true}function M(){if(this._bMouseMove){T.call(this,true)}this.fireSelect()}function L(){if(!this._bNamesLengthChecked){var e=0;var t=this.$("months").children();var a=false;var r=this.getMonths();var i=Math.ceil(12/r);var o=0;var s=this._getLocaleData();var n=s.getMonthsStandAlone("wide",this.getProperty("primaryCalendarType"));var l;for(var h=0;h<i;h++){if(r<12){for(e=0;e<t.length;e++){l=jQuery(jQuery(t[e]).children(".sapUiCalItemText"));l.text(n[(e+o)%12])}o=o+r;if(o>11){o=11}}for(e=0;e<t.length;e++){var g=t[e];if(Math.abs(g.clientWidth-g.scrollWidth)>1){a=true;break}}if(a){break}}if(r<12){o=this._getStartDate().getMonth();for(e=0;e<t.length;e++){l=jQuery(jQuery(t[e]).children(".sapUiCalItemText"));l.text(n[(e+o)%12])}}if(a){this._bLongMonth=false;var p=s.getMonthsStandAlone("abbreviated",this.getProperty("primaryCalendarType"));o=this._getStartDate().getMonth();for(e=0;e<t.length;e++){l=jQuery(jQuery(t[e]).children(".sapUiCalItemText"));l.text(p[(e+o)%12])}}else{this._bLongMonth=true}this._bNamesLengthChecked=true}}function I(){jQuery(window.document).on("mousemove",this._mouseMoveProxy);this._bMouseMove=true}function T(){jQuery(window.document).off("mousemove",this._mouseMoveProxy);this._bMouseMove=undefined}return d});
//# sourceMappingURL=MonthsRow.js.map