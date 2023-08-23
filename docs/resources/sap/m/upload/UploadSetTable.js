/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Table","sap/m/ToolbarSpacer","sap/m/upload/UploadSetTableRenderer","sap/ui/unified/FileUploader","sap/m/upload/UploadSetToolbarPlaceholder","sap/m/upload/UploaderHttpRequestMethod","sap/m/OverflowToolbar","sap/m/upload/UploadSetTableItem","sap/base/util/deepEqual","sap/base/Log","sap/m/library","sap/m/IllustratedMessageType","sap/m/IllustratedMessage","sap/m/IllustratedMessageSize","sap/m/upload/UploaderTableItem","sap/ui/core/dnd/DragDropInfo","sap/ui/core/dnd/DropInfo","sap/ui/core/dnd/DragInfo"],function(e,t,i,a,o,l,r,s,p,n,d,u,h,f,g,m,c,y){"use strict";var U=e.extend("sap.m.upload.UploadSetTable",{library:"sap.m",metadata:{properties:{fileTypes:{type:"string[]",defaultValue:null},maxFileNameLength:{type:"int",defaultValue:null},maxFileSize:{type:"float",defaultValue:null},mediaTypes:{type:"string[]",defaultValue:null},noDataText:{type:"string",defaultValue:null},noDataDescription:{type:"string",defaultValue:null},dragDropText:{type:"string",defaultValue:null},dragDropDescription:{type:"string",defaultValue:null},uploadUrl:{type:"string",defaultValue:null},httpRequestMethod:{type:"sap.m.upload.UploaderHttpRequestMethod",defaultValue:l.Post},multiple:{type:"boolean",group:"Behavior",defaultValue:false},uploadButtonInvisible:{type:"boolean",group:"Appearance",defaultValue:false},instantUpload:{type:"boolean",defaultValue:true},customDropFilesHandler:{type:"function",defaultValue:null},uploadEnabled:{type:"boolean",defaultValue:true}},aggregations:{headerToolbar:{type:"sap.m.OverflowToolbar",multiple:false},uploader:{type:"sap.m.upload.UploaderTableItem",multiple:false},headerFields:{type:"sap.ui.core.Item",multiple:true,singularName:"headerField"}},defaultAggregation:"items",events:{fileRenamed:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"}}},afterItemRemoved:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"}}},beforeUploadStarts:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"}},allowPreventDefault:true},uploadCompleted:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"},response:{type:"string"},readyState:{type:"string"},status:{type:"string"},responseXML:{type:"string"},responseText:{type:"string"},headers:{type:"object"}}},fileTypeMismatch:{parameters:{item:{type:"object"}}},fileNameLengthExceeded:{parameters:{item:{type:"object"}}},fileSizeExceeded:{parameters:{item:{type:"object"}}},mediaTypeMismatch:{parameters:{item:{type:"object"}}},beforeInitiatingItemUpload:{parameters:{item:{type:"sap.m.upload.UploadSetTableItem"}}},itemDragStart:{},itemDrop:{}}},renderer:i});var F=d.UploadState;U.prototype.init=function(){e.prototype.init.call(this);this._setDragDropConfig();this._filesTobeUploaded=[]};U.prototype.onBeforeRendering=function(){e.prototype.onBeforeRendering.call(this);this._setIllustratedMessage()};U.prototype.onAfterRendering=function(){e.prototype.onAfterRendering.call(this)};U.prototype.exit=function(){e.prototype.exit.call(this);if(this._oToolbar){this._oToolbar.destroy();this._oToolbar=null}if(this._oFileUploader){this._oFileUploader.destroy();this._oFileUploader=null}if(this._illustratedMessage){this._illustratedMessage.destroy();this._illustratedMessage=null}};U.prototype.getHeaderToolbar=function(){if(!this._oToolbar){this._oToolbar=this.getAggregation("headerToolbar");if(!this._oToolbar){this._oToolbar=new r(this.getId()+"-toolbar",{content:[new t,this.getDefaultFileUploader()]});this._iFileUploaderPH=2;this.addDependent(this._oToolbar)}else{this._iFileUploaderPH=this._getFileUploaderPlaceHolderPosition(this._oToolbar);if(this._oToolbar&&this._iFileUploaderPH>-1){this._setFileUploaderInToolbar(this.getDefaultFileUploader())}else if(this._oToolbar){this._oToolbar.addContent(this.getDefaultFileUploader())}}}return this._oToolbar};U.prototype.setFileTypes=function(e){var t=e||null;if(typeof t==="string"){t=t.split(",")}t=(t||[]).map(function(e){return e?e.toLowerCase():""});if(!p(this.getFileTypes(),t)){this.setProperty("fileTypes",t,true);this.getDefaultFileUploader().setFileType(t)}return this};U.prototype.setMaxFileNameLength=function(e){if(this.getMaxFileNameLength()!==e){this.setProperty("maxFileNameLength",e,true);this.getDefaultFileUploader().setMaximumFilenameLength(e)}return this};U.prototype.setMaxFileSize=function(e){if(this.getMaxFileSize()!==e){this.setProperty("maxFileSize",e,true);this.getDefaultFileUploader().setMaximumFileSize(e)}return this};U.prototype.setMediaTypes=function(e){var t=e||null;if(typeof t==="string"){t=t.split(",")}t=(t||[]).map(function(e){return e?e.toLowerCase():""});if(!p(this.getMediaTypes(),t)){this.setProperty("mediaTypes",t,true);this.getDefaultFileUploader().setMimeType(t)}return this};U.prototype.setUploadButtonInvisible=function(e){if(e!==this.getUploadButtonInvisible()){this._setFileUploaderVisibility(e);this.setProperty("uploadButtonInvisible",e,true)}return this};U.prototype.setMultiple=function(e){if(this.getMultiple()!==e){this.setProperty("multiple",e);this.getDefaultFileUploader().setMultiple(e)}return this};U.prototype.setUploadEnabled=function(e){if(e!==this.getUploadEnabled()){this.getDefaultFileUploader().setEnabled(e);this.setProperty("uploadEnabled",e,false)}return this};U.prototype.getDefaultFileUploader=function(){var e="Upload";if(!this._oFileUploader){this._oFileUploader=new a(this.getId()+"-uploader",{buttonOnly:true,buttonText:e,tooltip:e,iconOnly:false,enabled:this.getUploadEnabled(),icon:"",iconFirst:false,style:"Transparent",name:"uploadSetTableFileUploader",sameFilenameAllowed:true,fileType:this.getFileTypes(),mimeType:this.getMediaTypes(),maximumFilenameLength:this.getMaxFileNameLength(),maximumFileSize:this.getMaxFileSize(),multiple:this.getMultiple(),useMultipart:false,sendXHR:true,change:[this._onFileUploaderChange,this],typeMissmatch:[this._fireFileTypeMismatch,this],fileSizeExceed:[this._fireFileSizeExceed,this],filenameLengthExceed:[this._fireFilenameLengthExceed,this],visible:true})}return this._oFileUploader};U.getIconForFileType=function(e,t){return s._getIconByMimeType(e,t)};U.prototype.downloadItems=function(e){if(e&&e.length){e.forEach(function(e){var t=e&&e instanceof s?true:false;var i=e&&e.getParent?e.getParent():null;if(t&&i===this){this._getActiveUploader().download(e,[],true)}else{n.warning("Download cannot proceed without a parent association.")}}.bind(this))}};U.prototype.registerUploaderEvents=function(e){e.attachUploadStarted(this._onUploadStarted.bind(this));e.attachUploadCompleted(this._onUploadCompleted.bind(this))};U.prototype.fileSelectionHandler=function(e){if(!(typeof e==="function")){n.warning("Invalid Callback function passed.");return}this._fnSelectedItemsCallback=e;var t=this.getDefaultFileUploader();if(t&&t.oFileUpload&&t.oFileUpload.click){t.oFileUpload.click()}};U.prototype.uploadItems=function(e){if(!this.getUploadEnabled()){n.warning("Upload is currently disabled for this upload set with Table.");return}if(!Array.isArray(e)){return}e=e.filter(function(e){return e instanceof s});e.forEach(function(e){if(this.getInstantUpload()){this._uploadItemIfGoodToGo(e)}}.bind(this))};U.getFileSizeWithUnits=function(e){var t=1024;var i=t*1024;var a=i*1024;if(typeof e==="number"){if(e<i){return(e/t).toFixed(2)+" KB"}else if(e<a){return(e/i).toFixed(2)+" MB"}else{return(e/a).toFixed(2)+" GB"}}return e};U.prototype.uploadItemViaUrl=function(e,t){var i=new File([new Blob([])],e);this._fnSelectedItemsCallback=null;this._processSelectedFileObjects([i],t)};U.prototype.uploadItemWithoutFile=function(e){var t=new File([new Blob([])],"-");this._fnSelectedItemsCallback=null;this._processSelectedFileObjects([t],e)};U.prototype._setFileUploaderInToolbar=function(e){this._oToolbar.getContent()[this._iFileUploaderPH].setVisible(false);this._oToolbar.insertContent(e,this._iFileUploaderPH)};U.prototype._getFileUploaderPlaceHolderPosition=function(e){for(var t=0;t<e.getContent().length;t++){if(e.getContent()[t]instanceof o){return t}}return-1};U.prototype._onFileUploaderChange=function(e){var t=e.getParameter("files");if(t&&t.length){this._processSelectedFileObjects(t)}else{this._fnSelectedItemsCallback=null}};U.prototype._processSelectedFileObjects=function(e,t){var i=[];for(var a=0;a<e.length;a++){i.push(e[a])}var o=[];i.forEach(function(e){var i=new s({uploadState:F.Ready});i._setFileObject(e);i.setFileName(e.name);o.push(i);if(t&&t.length){t.forEach(function(e){i.addHeaderField(e)})}this.fireBeforeInitiatingItemUpload({item:i});if(this.getInstantUpload()&&!this._fnSelectedItemsCallback){this._uploadItemIfGoodToGo(i)}}.bind(this));if(this._fnSelectedItemsCallback){this._fnSelectedItemsCallback({selectedItems:o});this._fnSelectedItemsCallback=null}};U.prototype._fireFileTypeMismatch=function(e){var t=this.getMediaTypes();var i=this.getFileTypes();var a=e.getParameter("fileType");var o=e.getParameter("mimeType");var l=!!t&&t.length>0&&!!o&&t.indexOf(o)===-1;var r=!!i&&i.length>0&&!!a&&i.indexOf(a)===-1;var s={fileType:a,mimeType:o};if(l){this.fireMediaTypeMismatch({item:s})}else if(r){this.fireFileTypeMismatch({item:s})}};U.prototype._fireFilenameLengthExceed=function(e){this.fireFileNameLengthExceeded({item:e})};U.prototype._fireFileSizeExceed=function(e){this.fireFileSizeExceeded({item:e})};U.prototype._onUploadStarted=function(e){var t=e.getParameter("item");t.setUploadState(F.Uploading)};U.prototype._onUploadCompleted=function(e){var t=e.getParameter("item"),i=e.getParameter("responseXHR"),a=null;if(i.responseXML){a=i.responseXML.documentElement.textContent}var o={item:t,response:i.response,responseXML:a,responseText:i.responseText,readyState:i.readyState,status:i.status,headers:i.headers};t.setUploadState(F.Complete);this.fireUploadCompleted(o)};U.prototype._uploadItemIfGoodToGo=function(e){if(e.getUploadState()===F.Ready&&!e._isRestricted()){if(this.fireBeforeUploadStarts({item:e})){var t=e.getHeaderFields().length?e.getHeaderFields():this.getHeaderFields();this._getActiveUploader().uploadItem(e,t)}}};U.prototype._getActiveUploader=function(){return this.getUploader()||this._getImplicitUploader()};U.prototype._getImplicitUploader=function(){if(!this._oUploader){this._oUploader=new g({httpRequestMethod:this.getHttpRequestMethod()});this._oUploader.setUploadUrl(this.getUploadUrl());this.registerUploaderEvents(this._oUploader);this.addDependent(this._oUploader)}return this._oUploader};U.prototype._setIllustratedMessage=function(){if(!this._illustratedMessage){this._illustratedMessage=new h({illustrationType:u.UploadCollection,illustrationSize:f.Spot,title:this.getNoDataText()?this.getNoDataText():"No Data Available",description:this.getNoDataDescription()?this.getNoDataDescription():"Drag and Drop files here to upload"})}this.setAggregation("_noColumnsMessage",this._illustratedMessage);this.setAggregation("noData",this._illustratedMessage)};U.prototype._setFileUploaderVisibility=function(e){if(this._oFileUploader){var t=this._oFileUploader.oBrowse&&this._oFileUploader.oBrowse?this._oFileUploader:null;if(t){if(e){t.addStyleClass("sapMUSTFileUploaderVisibility")}else{t.removeStyleClass("sapMUSTFileUploaderVisibility")}}}};U.prototype._setDragDropConfig=function(){var e=new m({sourceAggregation:"items",targetAggregation:"items",dragStart:[this._onDragStartItem,this],drop:[this._onDropItem,this]});var t=new c({targetAggregation:"",dropEffect:"Move",dropPosition:"OnOrBetween",dragEnter:[this._onDragEnterFile,this],drop:[this._onDropFile,this]});this.addDragDropConfig(e);this.addDragDropConfig(t)};U.prototype._onDragStartItem=function(e){this.fireItemDragStart(e)};U.prototype._onDropItem=function(e){this.fireItemDrop(e)};U.prototype._onDragEnterFile=function(e){var t=e.getParameter("dragSession");var i=t.getDragControl();this._oDragIndicator=true;if(i){e.preventDefault()}};U.prototype._onDropFile=function(e){this._oDragIndicator=false;e.preventDefault();if(this.getUploadEnabled()){var t=e.getParameter("browserEvent").dataTransfer.files;if(t&&t.length&&t.length>1&&!this.getMultiple()){n.warning("Multiple files upload is retsricted for this multiple property set");return}if(t&&t.length){var i=this.getDefaultFileUploader();if(i&&i._areFilesAllowed&&i._areFilesAllowed(t)){var a=[];for(var o=0;o<t.length;o++){a.push(t[o])}var l=[];a.forEach(function(e){var t=new s({uploadState:F.Ready});t._setFileObject(e);t.setFileName(e.name);l.push(t);this.fireBeforeInitiatingItemUpload({item:t});if(this.getInstantUpload()&&!this.getCustomDropFilesHandler()){this._uploadItemIfGoodToGo(t)}}.bind(this));if(this.getCustomDropFilesHandler()){this.getCustomDropFilesHandler()({selectedItems:l})}}}}};return U});
//# sourceMappingURL=UploadSetTable.js.map