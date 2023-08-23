/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","./PlaceholderBaseRenderer"],function(e,t){"use strict";var r=e.extend(t);r.apiVersion=2;r.CSS_CLASS_PLACEHOLDER="sapFCardContentListPlaceholder";r.renderTitleAndDescription=function(e,t){if(t.attributes&&t.title&&t.description){this.renderRow(e,true);return}if(t.title){this.renderRow(e)}if(t.description){this.renderRow(e)}};r.renderRow=function(e,t){e.openStart("div").class("sapFCardListPlaceholderRow").class("sapFCardLoadingShimmer");if(t){e.class("sapFCardListPlaceholderRowCombined")}e.openEnd().close("div")};r.renderAttributes=function(e,t){if(!t.attributes){return}var r=t.attributes.length/2+1;for(var i=0;i<r;i++){e.openStart("div").class("sapFCardListPlaceholderRow").openEnd();var s=i===r-1?1:2;for(var a=0;a<s;a++){e.openStart("div").class("sapFCardListPlaceholderAttr").class("sapFCardLoadingShimmer").openEnd().close("div")}e.close("div")}};r.renderContent=function(e,t){var r=e.getMinItems(),i=e.getItem();for(var s=0;s<r;s++){t.openStart("div").class("sapFCardListPlaceholderItem").style("height",e.getItemHeight()).openEnd();if(i&&i.icon){t.openStart("div").class("sapFCardListPlaceholderImg").class("sapFCardLoadingShimmer").openEnd().close("div")}t.openStart("div").class("sapFCardListPlaceholderRows").openEnd();if(i){this.renderTitleAndDescription(t,i);this.renderAttributes(t,i);if(i.chart){this.renderRow(t)}if(i.actionsStrip){this.renderRow(t)}}t.close("div");t.close("div")}};r.addOuterAttributes=function(e,i){t.addOuterAttributes.apply(this,arguments);i.class(r.CSS_CLASS_PLACEHOLDER)};return r},true);
//# sourceMappingURL=ListPlaceholderRenderer.js.map