"use strict";sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent","sap/ui/core/routing/History"],function(e,t,n){const o=e.extend("de.marianzeis.ui5libdiff.controller.BaseController",{getOwnerComponent:function t(){return e.prototype.getOwnerComponent.call(this)},getRouter:function e(){return t.getRouterFor(this)},getResourceBundle:function e(){const t=this.getOwnerComponent().getModel("i18n");return t.getResourceBundle()},getModel:function e(t){return this.getView().getModel(t)},setModel:function e(t,n){this.getView().setModel(t,n);return this},navTo:function e(t,n,o){this.getRouter().navTo(t,n,undefined,o)},onNavBack:function e(){const t=n.getInstance().getPreviousHash();if(t!==undefined){window.history.go(-1)}else{this.getRouter().navTo("main",{},undefined,true)}}});return o});
//# sourceMappingURL=BaseController.js.map