/*global QUnit*/

sap.ui.define([
	"comnewcustinvoiceqrnewcustinvoiceqr/qr-invoice/controller/custinvoice.controller"
], function (Controller) {
	"use strict";

	QUnit.module("custinvoice Controller");

	QUnit.test("I should test the custinvoice controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
