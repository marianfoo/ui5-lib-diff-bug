"use strict";

sap.ui.define(["sap/m/MessageBox", "./BaseController", "sap/ui/model/json/JSONModel"], function (MessageBox, __BaseController, JSONModel) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace de.marianzeis.ui5libdiff.controller
   */
  const Main = BaseController.extend("de.marianzeis.ui5libdiff.controller.Main", {
    onInit: async function _onInit() {
      this.getView().setModel(new JSONModel(), "changes");
      this.getView().setModel(new JSONModel(), "versionFrom");
      this.getView().setModel(new JSONModel(), "versionTo");
      this.loadData();
    },
    handleVersionChange: function _handleVersionChange(oEvent) {
      this.getView().setBusyIndicatorDelay(0);
      this.getView().setBusy(true);
      const versionFrom = this.getView().byId("versionFromSelect").getSelectedKey();
      const versionTo = this.getView().byId("versionToSelect").getSelectedKey();
      const versionObject = this.compareVersions(versionFrom, versionTo);
      const filterKey = this.getView().byId("SegmentedButton").getSelectedKey();
      if (versionFrom && versionTo) {
        const changes = this.getMergedChangesBetweenVersions(versionObject.versionFrom, versionObject.versionTo, filterKey);
        this.getView().getModel("changes").setData(changes);
      }
      this.getView().setBusy(false);
    },
    sayHello: function _sayHello() {
      MessageBox.show("Hello World!");
    },
    loadData: async function _loadData() {
      this.getView().setBusy(true);
      const url = "./data/consolidated.json";
      let data;
      try {
        data = await this.fetchJson(url);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      this.getView().setModel(new JSONModel(data), "data");
      this.getView().setBusy(false);
    },
    fetchJson: async function _fetchJson(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error.message);
        throw error; // or you might want to return a default value or handle it differently
      }
    },
    compareVersion: function _compareVersion(v1, v2) {
      const parts1 = v1.split('.').map(Number);
      const parts2 = v2.split('.').map(Number);
      for (let i = 0; i < parts1.length && i < parts2.length; i++) {
        if (parts1[i] < parts2[i]) return -1;
        if (parts1[i] > parts2[i]) return 1;
      }
      return parts1.length - parts2.length;
    },
    sortChanges: function _sortChanges(changes) {
      const sortBy = this.getView().byId("SegmentedButtonSort").getSelectedKey();
      return changes.sort((a, b) => {
        if (sortBy === "type") {
          if (a.type === 'DEPRECATED' && b.type !== 'DEPRECATED') {
            return -1;
          } else if (a.type !== 'DEPRECATED' && b.type === 'DEPRECATED') {
            return 1;
          } else if (a.type === 'FEATURE' && b.type !== 'FEATURE') {
            return -1;
          } else if (a.type !== 'FEATURE' && b.type === 'FEATURE') {
            return 1;
          } else {
            // when types are the same, default to sorting by text
            if (!a.text || !b.text) {
              console.warn('Undefined or null text detected:', a, b);
              return 0;
            }
            return a.text.localeCompare(b.text);
          }
        } else if (sortBy === "text") {
          if (!a.text || !b.text) {
            console.warn('Undefined or null text detected:', a, b);
            return 0;
          }
          return a.text.localeCompare(b.text);
        } else {
          // sortBy === "version"
          if (!a.version || !b.version) {
            console.warn('Undefined or null version detected:', a, b);
            return 0;
          }
          return this.compareVersionDesc(a.version, b.version);
        }
      });
    },
    mergeLibraries: function _mergeLibraries(versions) {
      const libraryMap = new Map();
      for (const version of versions) {
        for (const lib of version.libraries) {
          const changesWithVersion = lib.changes.map(change => ({
            ...change,
            version: version.version
          }));
          const existingChanges = libraryMap.get(lib.library) || [];
          libraryMap.set(lib.library, existingChanges.concat(changesWithVersion));
        }
      }
      return Array.from(libraryMap.entries()).map(_ref => {
        let [library, changes] = _ref;
        const uniqueChanges = [];
        const seenChanges = new Set();
        for (const change of this.sortChanges(changes)) {
          // we retain sorting changes based on their text
          const changeString = JSON.stringify({
            type: change.type,
            text: change.text
            // Version intentionally omitted from stringification 
          });

          if (!seenChanges.has(changeString)) {
            seenChanges.add(changeString);
            uniqueChanges.push(change);
          }
        }
        return {
          library,
          changes: uniqueChanges
        };
      }).sort((a, b) => {
        if (a.library === 'deprecated') {
          return -1;
        } else if (b.library === 'deprecated') {
          return 1;
        } else {
          return a.library.localeCompare(b.library); // sort by library name
        }
      });
    },
    getMergedChangesBetweenVersions: function _getMergedChangesBetweenVersions(startVersion, endVersion, filterType) {
      const data = this.getView().getModel("data").getData();
      const versionsInRange = data.filter(obj => this.compareVersion(obj.version, startVersion) > 0 && this.compareVersion(obj.version, endVersion) <= 0);
      const mergedLibraries = this.mergeLibraries(versionsInRange);
      if (filterType === "ALL") {
        return mergedLibraries;
      }

      // Filter changes based on the type
      return mergedLibraries.map(lib => {
        const filteredChanges = lib.changes.filter(change => change.type === filterType);
        return {
          library: lib.library,
          changes: filteredChanges
        };
      }).filter(lib => lib.changes.length > 0); // Remove libraries with no changes after filtering
    },
    compareVersions: function _compareVersions(v1, v2) {
      const v1Parts = v1.split('.').map(Number);
      const v2Parts = v2.split('.').map(Number);
      for (let i = 0; i < v1Parts.length; i++) {
        if (v1Parts[i] > v2Parts[i]) {
          return {
            versionFrom: v2,
            versionTo: v1
          };
        } else if (v1Parts[i] < v2Parts[i]) {
          return {
            versionFrom: v1,
            versionTo: v2
          };
        }
      }

      // If versions are equal, default to v1 as versionFrom and v2 as versionTo
      return {
        versionFrom: v1,
        versionTo: v2
      };
    },
    compareVersionDesc: function _compareVersionDesc(v1, v2) {
      const parts1 = v1.split('.').map(Number);
      const parts2 = v2.split('.').map(Number);
      for (let i = 0; i < parts1.length && i < parts2.length; i++) {
        if (parts1[i] > parts2[i]) return -1;
        if (parts1[i] < parts2[i]) return 1;
      }
      return parts2.length - parts1.length;
    }
  });
  return Main;
});