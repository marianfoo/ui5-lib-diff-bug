/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/library","sap/base/Log"],function(e,t,l){"use strict";var i=t.TitleLevel;var n={apiVersion:2};n.render=function(e,t){this.startCell(e,t);this.addContent(e,t);this.endCell(e)};n.startCell=function(e,t){var l=this.getCellColor(e,t);e.openStart("div",t).class("sapUiBlockLayoutCell");l&&e.class(l);this.setWidth(e,t);e.openEnd()};n.getCellColor=function(e,t){var i=t.getBackgroundColorSet(),n=t.getBackgroundColorShade();if(!i&&!n){return""}else if(i&&!n||!i&&n){l.warning("Both, backgroundColorSet and backgroundColorShade should be defined. ColoSet is not applied to "+t.getId()+".");return""}i=i.replace("ColorSet","");n=n.replace("Shade","");return"sapUiBlockLayoutCellColor"+i+n};n.setWidth=function(e,t){var l=t.getWidth();if(t._getParentRowScrollable()){if(l!==0){e.style("width",l+"%")}}else{this.addFlex(e,t._getFlexWidth())}};n.addFlex=function(e,t){e.style("-webkit-flex",t);e.style("-ms-flex",t);e.style("flex",t)};n.addTitle=function(e,t){var l=t.getTitleLink();var n=t.getTitle();if(n||l){var o="sapUiBlockCell"+t.getTitleAlignment(),r="sapUiBlockCellTitle "+o;if(t.getContent().length===0){r+=" sapUiBlockCellTitleNoContent"}var a=t.getTitleLevel(),s=a===i.Auto,d=s?"h2":a.toLowerCase();var c=r.split(" ");e.openStart(d,this.getTitleId(t));for(var C=0;C<c.length;C++){e.class(c[C])}e.openEnd();if(l){e.renderControl(l)}else{e.text(n)}e.close(d)}};n.getTitleId=function(e){return e.getId()+"-Title"};n.hasTitle=function(e){return e.getTitleLink()||e.getTitle()};n.addContent=function(e,t){var l=t.getContent(),i=this.hasTitle(t);e.openStart("div").class("sapUiBlockCellContent");if(t.getTitleAlignment()==="Center"){e.class("sapUiBlockCellCenteredContent")}e.openEnd();if(i){this.addTitle(e,t)}l.forEach(e.renderControl,e);e.close("div")};n.endCell=function(e){e.close("div")};return n},true);
//# sourceMappingURL=BlockLayoutCellRenderer.js.map