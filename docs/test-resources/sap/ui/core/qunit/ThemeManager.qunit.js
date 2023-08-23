/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/core/theming/ThemeManager",
	"sap/ui/qunit/utils/waitForThemeApplied",
	"sap/ui/core/Configuration"
], function(ThemeManager, themeApplied, Configuration) {
	"use strict";

	// Wait until the theme is changed
	function themeChanged() {
		return new Promise(function(resolve) {
			function onChanged() {
				sap.ui.getCore().detachThemeChanged(onChanged);
				resolve();
			}
			sap.ui.getCore().attachThemeChanged(onChanged);
		});
	}

	function getSheetHref(oLink) {
		if (oLink.sheet) {
			return oLink.sheet.href;
		} else if (oLink.styleSheet) {
			return oLink.styleSheet.href;
		}
		return undefined;
	}


	var aLibraries = ["sap.ui.core", "sap.ui.testlib"];

	function testApplyTheme(assert, sTheme) {

		var aLibraryCss = aLibraries.map(function(lib) {
			return {
				name: lib,
				domRef: document.getElementById("sap-ui-theme-" + lib)
			};
		});

		// for the test we need to delay the theme changed event to avoid the cleanup
		// of the old stylesheet which will be performed by the ThemeManager
		var fncheckThemeChanged = ThemeManager.checkThemeChanged;
		ThemeManager.checkThemeChanged = function(bOnlyOnInitFail) {
			aLibraryCss.forEach(function(lib) {
				assert.equal(lib.domRef.parentNode, document.head, "Old stylesheet for library " + lib.name + " still exits in the DOM.");
				assert.equal(lib.domRef.getAttribute("data-sap-ui-foucmarker"), "sap-ui-theme-" + lib.name, "Attribute for ThemeManager has been added to old stylesheet.");
			});

			setTimeout(fncheckThemeChanged.bind(this, bOnlyOnInitFail), 0);
		};

		sap.ui.getCore().applyTheme(sTheme);

		ThemeManager.checkThemeChanged = fncheckThemeChanged;

	}

	function testThemeLoaded(assert) {
		aLibraries.forEach(function(lib) {
			var oLibraryCss = document.getElementById("sap-ui-theme-" + lib);
			var sSheetHref = getSheetHref(oLibraryCss);
			assert.equal(sSheetHref, oLibraryCss.href, "href of loaded " + lib + " stylesheet should be equal with link href.");
		});
	}

	function testThemeManagerCleanup(assert) {
		aLibraries.forEach(function(lib) {
			var oOldLibraryCss = document.querySelectorAll("link[data-sap-ui-foucmarker='sap-ui-theme-" + lib + "']");
			assert.equal(oOldLibraryCss && oOldLibraryCss.length || 0, 0, "Old stylesheet for library " + lib + " has been removed.");
		});
	}


	QUnit.test("Initial theme check", function(assert) {
		var done = assert.async();

		themeApplied().then(function() {

			// Check if the declared library stylesheets have been fully loaded
			testThemeLoaded(assert);

			done();
		});
	});

	QUnit.test("After theme change with legacy custom.css", function(assert) {
		var done = assert.async();

			themeChanged().then(function() {

			// Check if the declared library stylesheets have been fully loaded
			testThemeLoaded(assert);

			// Check if the old stylesheets have been removed again
			testThemeManagerCleanup(assert);

			// Check if the custom.css has been included
			var oCustomCss = document.getElementById("sap-ui-core-customcss");
			if (!oCustomCss) {
				assert.ok(false, "Custom CSS file hasn't been included");
			} else {
				var oCustomCssHref = oCustomCss.getAttribute("href");
				var sExpectedCustomCssPath = "test-resources/sap/ui/core/qunit/testdata/customcss/sap/ui/core/themes/legacy/custom.css";
				assert.equal(oCustomCssHref, sExpectedCustomCssPath, "Custom CSS file gets loaded from the correct location.");
			}

			done();
		});
		testApplyTheme(assert, "legacy");
	});

	QUnit.test("After theme change with custom.css", function(assert) {
		var done = assert.async();

			themeChanged().then(function() {

			// Check if the declared library stylesheets have been fully loaded
			testThemeLoaded(assert);

			// Check if the old stylesheets have been removed again
			testThemeManagerCleanup(assert);

			// Check if the custom.css has been included
			var oCustomCss = document.getElementById("sap-ui-core-customcss");
			if (!oCustomCss) {
				assert.ok(false, "Custom CSS file hasn't been included");
			} else {
				var oCustomCssHref = oCustomCss.getAttribute("href");
				var sExpectedCustomCssPath = "test-resources/sap/ui/core/qunit/testdata/customcss/sap/ui/core/themes/customcss/custom.css";
				assert.equal(oCustomCssHref, sExpectedCustomCssPath, "Custom CSS file gets loaded from the correct location.");
			}

			done();
		});
		testApplyTheme(assert, "customcss");
	});

	QUnit.test("After theme change without custom.css", function(assert) {
		var done = assert.async();

			themeChanged().then(function() {

			// Check if the declared library stylesheets have been fully loaded
			testThemeLoaded(assert);

			// Check if the old stylesheets have been removed again
			testThemeManagerCleanup(assert);

			// Check if the custom.css has been included
			var oCustomCss = document.getElementById("sap-ui-core-customcss");
			assert.strictEqual(oCustomCss, null, "Custom CSS file should not be included.");

			done();
		});
		testApplyTheme(assert, "sap_hcb");
	});

	QUnit.test("Provide custom css using metadata of custom lib after core was booted and theme fully applied", function(assert) {
		assert.expect(3);
		var mExpectedLinkURIs = {
			"sap-ui-theme-sap.ui.core": "/sap/ui/core/themes/sap_hcb/library.css", // Fallback to sap_hcb for core lib because of theme metadata
			"sap-ui-theme-testlibs.customCss.lib1": "/libraries/customCss/lib1/themes/customTheme/library.css"
		};
		var checkLoadedCss = function () {
			var aAllThemeLinksForLibs = document.querySelectorAll("link[id^=sap-ui-theme]");
			var aCustomCssLink = document.querySelectorAll("link[id=sap-ui-core-customcss]");
			aAllThemeLinksForLibs.forEach(function ($link) {
				// Depending on order of test execution there could be more link tags as expected by this test
				// Only do asserts here for the expected link tags and check for complete test execution by assert.expect
				if (mExpectedLinkURIs[$link.id]) {
					assert.ok($link.getAttribute("href").endsWith(mExpectedLinkURIs[$link.id]), "URI of library.css link tag is correct");
				}
			});
			assert.ok(aCustomCssLink[0].getAttribute("href")
				.endsWith("/libraries/customCss/sap/ui/core/themes/customTheme/custom.css"), "URI of custom.css link tag is correct");
		};
		sap.ui.getCore().applyTheme("customTheme");

		return themeApplied().then(function () {
			return sap.ui.getCore().loadLibrary("testlibs.customCss.lib1", true).then(function () {
				return themeApplied().then(checkLoadedCss);
			});
		});
	});

	QUnit.test("RTL switch doesn't use suppress FOUC feature", function(assert) {

		Configuration.setRTL(true);
		aLibraries.forEach(function(lib) {
			var oLibraryCss = document.getElementById("sap-ui-theme-" + lib);
			assert.ok(oLibraryCss, "Link for " + lib + " stylesheet should be available.");
			var oOldLibraryCss = document.querySelectorAll("link[data-sap-ui-foucmarker='sap-ui-theme-" + lib + "']");
			assert.equal(oOldLibraryCss && oOldLibraryCss.length || 0, 0, "Old stylesheet for library " + lib + " has been removed.");
		});
		Configuration.setRTL(false);

	});

	QUnit.test("Check link tags modified by defineProperty (e.g. AppCacheBuster) are handled correctly", function (assert) {
		assert.expect(2);

		var oDescriptor = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, "href");
		var oCheckThemeSpy = sinon.spy(ThemeManager, "checkThemeChanged");
		var pThemeChanged;

		Object.defineProperty(HTMLLinkElement.prototype, "href", {
			get: oDescriptor.get,
			set: function(val) {
				if (!val.endsWith("-qunit")) {
					val = val + "-qunit";
				}
				oDescriptor.set.call(this, val);
			}
		});

		pThemeChanged = themeChanged().then(function () {
			ThemeManager.includeLibraryTheme("sap.ui.fakeLib");

			assert.ok(oCheckThemeSpy.notCalled, "checkThemeChanged was not called because no link tag changed.");

			Object.defineProperty(HTMLLinkElement.prototype, "href", oDescriptor);
			oCheckThemeSpy.restore();
		});
		// setTimeout is only relevant in single test execution
		// Core is not attached to themeChanged event of ThemeManager in case the core did not call _getThemeManager yet
		// but the ThemeManager was already loaded from somewhere else. Because attachEvent("themeChanged") by core is done within
		// an (immediately resolved) promise, the handler will be attached async within the next stack execution
		// Because the library loaded by includeLibraryTheme does not exist the themeChanged event is fired sync
		setTimeout(function () {
			ThemeManager.includeLibraryTheme("sap.ui.fakeLib");

			assert.ok(oCheckThemeSpy.calledOnce, "checkThemeChanged was called once because a was modified by '-qunit' suffix.");
			oCheckThemeSpy.reset();
		});

		return pThemeChanged;
	});


	QUnit.module("Library Loading");

	QUnit.test("sap.ui.getCore().loadLibrary()", function(assert) {
		var done = assert.async();

		themeChanged().then(function() {
			assert.ok(true, "ThemeChanged event has been fired");
			done();
		});

		sap.ui.getCore().loadLibrary("sap.ui.customthemefallback.testlib", {async: true});
	});

	QUnit.test("sap.ui.getCore().loadLibraries()", function(assert) {
		var done = assert.async();

		themeChanged().then(function() {
			assert.ok(true, "ThemeChanged event has been fired");
			done();
		});

		sap.ui.getCore().loadLibraries(["sap.ui.failingcssimport.testlib"], {
			async: true
		});
	});

	QUnit.test("require without loadLibrary/loadLibraries", function(assert) {
		var done = assert.async();

		themeChanged().then(function() {
			assert.ok(true, "ThemeChanged event has been fired");
			done();
		});

		// Fake direct require to a library.js module by just calling initLibrary
		sap.ui.getCore().initLibrary({
			name : "sap.ui.fake.testlib",
			version: "1.0.0",
			dependencies : ["sap.ui.core"],
			types: [],
			controls: [],
			elements: []
		});
	});


	QUnit.module("CORS", {
		beforeEach: function(assert) {

			this.descLinkSheet = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, "sheet");

			Object.defineProperty(HTMLLinkElement.prototype, "sheet", {
				get: function() {
					var obj = {
						href: this.href
					};
					Object.defineProperty(obj, "cssRules", {
						get: function() {
							throw new Error();
						},
						set: function() {}
					});
					return obj;
				},
				set: function() {},
				configurable: true
			});
			var Log = sap.ui.require("sap/base/Log");
			assert.ok(Log, "Log module should be available");
			sinon.spy(Log, "error");
		},
		afterEach: function(assert) {

			Object.defineProperty(HTMLLinkElement.prototype, "sheet", this.descLinkSheet);
			var Log = sap.ui.require("sap/base/Log");
			assert.ok(Log, "Log module should be available");
			Log.error.restore();
		}
	});

	QUnit.test("Accessing HTMLLinkElement#sheet.cssRules throws exception", function(assert) {
		var done = assert.async();

		var Log = sap.ui.require("sap/base/Log");
		assert.ok(Log, "Log module should be available");

		themeChanged().then(function() {

			// Check if the declared library stylesheets have been fully loaded
			testThemeLoaded(assert);

			// Check if the old stylesheets have been removed again
			testThemeManagerCleanup(assert);

			sinon.assert.neverCalledWithMatch(Log.error, sinon.match("Error during check styles"));

			done();
		});
		testApplyTheme(assert, "customcss");
	});
});