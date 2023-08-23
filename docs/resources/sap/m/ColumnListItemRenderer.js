/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/ui/core/library","sap/ui/core/Core","sap/base/Log","./library","./ListItemBaseRenderer"],function(e,t,a,n,r,i){"use strict";var l=r.PopinDisplay;var s=t.VerticalAlign;var o=e.extend(i);o.apiVersion=2;o.render=function(e,t){var a=t.getTable();if(!a){return}i.render.apply(this,arguments);if(t.getVisible()&&a.hasPopin()){this.renderPopin(e,t,a)}};o.renderHighlight=function(e,t){e.openStart("td");e.class("sapMListTblHighlightCell");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();i.renderHighlight.apply(this,arguments);e.close("td")};o.renderNavigated=function(e,t){e.openStart("td");e.class("sapMListTblNavigatedCell");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();i.renderNavigated.apply(this,arguments);e.close("td")};o.renderType=function(e,t){e.openStart("td");e.class("sapMListTblNavCol");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();i.renderType.apply(this,arguments);e.close("td")};o.renderModeContent=function(e,t){e.openStart("td");e.class("sapMListTblSelCol");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();i.renderModeContent.apply(this,arguments);e.close("td")};o.renderCounter=function(e,t){};o.getAriaRole=function(e){return""};o.renderLIAttributes=function(e,t){e.class("sapMListTblRow");var a=t.getVAlign();if(a!=s.Inherit){e.class("sapMListTblRow"+a)}var n=t.getTable();if(n&&n.getAlternateRowColors()){var r=n.indexOfItem(t);if(r%2==0){e.class("sapMListTblRowAlternate")}}};o.renderLIContentWrapper=function(e,t){var r=t.getTable();if(!r){return}var i=r.getColumns(true),l=t.getCells();t._destroyClonedHeaders();i.forEach(function(i,s){var o,d=true,p=l[i.getInitialOrder()];if(!p||!i.getVisible()||i.isHidden()){return}e.openStart("td",t.getId()+"_cell"+s);e.class("sapMListTblCell");e.attr("data-sap-ui-column",i.getId());if(i){var u=i.getStyleClass().split(" ").filter(Boolean);u.forEach(function(t){e.class(t)});o=i.getHeader();if(o){e.attr("headers",i.getId())}if(!r.hasPopin()&&i.getMergeDuplicates()){var c=i.getMergeFunctionName(),g=c.split("#"),b=g[1],f=g[0];if(typeof p[f]!="function"){n.warning("mergeFunctionName property is defined on "+i+" but this is not function of "+p)}else if(r._bRendering||!p.bOutput){var C=i.getLastValue(),L=p[f](b);if(C===L){d=a.getConfiguration().getAccessibility();p.addStyleClass("sapMListTblCellDupCnt");e.class("sapMListTblCellDup")}else{i.setLastValue(L)}}else if(p.hasStyleClass("sapMListTblCellDupCnt")){e.class("sapMListTblCellDup")}}i.getVAlign()!="Inherit"&&e.style("vertical-align",i.getVAlign().toLowerCase());e.style("text-align",i.getCssAlign())}e.openEnd();if(d){this.applyAriaLabelledBy(o,p);e.renderControl(p)}e.close("td")},this)};o.renderDummyCell=function(e,t){e.openStart("td");e.class("sapMListTblDummyCell");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();e.close("td")};o.applyAriaLabelledBy=function(e,t){if(e&&e.getText&&e.getVisible()&&t.getAriaLabelledBy&&(t.getAriaLabelledBy()||[]).indexOf(e.getId())==-1){t.addAriaLabelledBy(e)}};o.renderPopin=function(e,t,n){e.openStart("tr",t.getPopin());e.class("sapMListTblSubRow");e.attr("data-sap-ui-related",t.getId());if(t.isSelectable()){e.attr("aria-selected",t.getSelected())}e.openEnd();this.renderHighlight(e,t);e.openStart("td",t.getId()+"-subcell");e.class("sapMListTblSubRowCell");e.attr("colspan",n.getColCount()-2);e.attr("aria-labelledby",this.getAriaAnnouncement(null,"TABLE_POPIN_ROLE_DESCRIPTION"));e.openEnd();e.openStart("div");e.class("sapMListTblSubCnt");e.class("sapMListTblSubCnt"+n.getPopinLayout());e.openEnd();var r=t.getCells(),i=n.getColumns(true);i.forEach(function(i){if(!i.getVisible()||!i.isPopin()){return}var s=r[i.getInitialOrder()];var o=i.getHeader();if(!o&&!s){return}var d=i.getStyleClass().split(" ").filter(Boolean),p=i.getPopinDisplay(),u=o;e.openStart("div");e.class("sapMListTblSubCntRow");if(p==l.Inline){e.class("sapMListTblSubCntRowInline")}d.forEach(function(t){e.class(t)});e.openEnd();if(o&&p!=l.WithoutHeader){e.openStart("div").class("sapMListTblSubCntHdr").openEnd();if(n._aPopinHeaders.indexOf(o)===-1){n._aPopinHeaders.push(u)}o=o.clone();i.addDependent(o);t._addClonedHeader(o);e.renderControl(o);e.openStart("span").class("sapMListTblSubCntSpr");e.attr("data-popin-colon",a.getLibraryResourceBundle("sap.m").getText("TABLE_POPIN_LABEL_COLON"));e.openEnd().close("span");e.close("div")}if(s){e.openStart("div");e.class("sapMListTblSubCntVal");e.class("sapMListTblSubCntVal"+p);e.openEnd();this.applyAriaLabelledBy(u,s);e.renderControl(s);e.close("div")}e.close("div")},this);e.close("div");e.close("td");this.renderNavigated(e,t);e.close("tr")};o.addLegacyOutlineClass=function(e,t){var a=t.isA("sap.m.Table")?t:t.getTable();if(a&&!a.hasPopin()&&a.shouldRenderDummyColumn()){e.class("sapMTableRowCustomFocus")}};o.renderContentLatter=function(e,t){var a=t.getTable();if(a&&a.shouldRenderDummyColumn()){if(!a.hasPopin()){i.renderContentLatter.apply(this,arguments);o.renderDummyCell(e,a)}else{o.renderDummyCell(e,a);i.renderContentLatter.apply(this,arguments)}}else{i.renderContentLatter.apply(this,arguments)}};return o},true);
//# sourceMappingURL=ColumnListItemRenderer.js.map