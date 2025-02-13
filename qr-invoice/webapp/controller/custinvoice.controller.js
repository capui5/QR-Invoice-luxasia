sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, JSONModel, MessageBox, History) {
    "use strict";

    return Controller.extend("com.newcustinvoiceqr.newcustinvoiceqr.qrinvoice.controller.custinvoice", {
        onInit: function () {
            var searchParams = new URLSearchParams(window.location.search);
            var encodedData = searchParams.get("CD"); 
            
            if (encodedData) { 
                try {
                    var decryptedData = atob(encodedData);
                    var dataParts = decryptedData.split("##");

                    if (dataParts.length >= 4) { 
                        var UserEmail = dataParts[0];
                        var CountryCode = dataParts[2];
                        var qrCodeGeneratedDateTime = new Date(dataParts[3]);

                        sap.ui.getCore().getConfiguration().setLanguage(CountryCode);

                        var currentDateTime = new Date();
                        var differenceValue = (currentDateTime.getTime() - qrCodeGeneratedDateTime.getTime()) / 1000 / 60;
                        var result = Math.abs(differenceValue);
                        
                        if (result <= 5) {
                            // Load simple form
                        }

                        if (CountryCode) {
                            var oCountrySelect = this.byId("country");
                            var oCountryCodeSelect = this.byId("countrycode");
                            oCountrySelect.setSelectedKey(CountryCode);
                            oCountryCodeSelect.setSelectedKey(CountryCode);
                        } else {
                            console.warn("Selected country not found in StoreModel.");
                        }

                        this.CustomerInterest();
                        var aModel = this.getOwnerComponent().getModel("CustomerNoModel");
                        this.getView().setModel(aModel, "CustomerNoModel");

                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        var oModel = this.getOwnerComponent().getModel("BrandStoreModel");
                        this.oRouter = this.getOwnerComponent().getRouter();

                        var oOwnerComponent = this.getOwnerComponent();
                        var oStoreModel = oOwnerComponent.getModel("StoreModel");

                        if (oStoreModel) {
                            var selectedStoreId = oStoreModel.getProperty("/selectedStoreId");
                            if (selectedStoreId) {
                                console.log("Selected Store ID found:", selectedStoreId);
                            } else {
                                console.log("Selected Store ID not found.");
                            }
                        } else {
                            console.error("StoreModel not found.");
                        }
                    }
                } catch (error) {
                    console.error("Error decoding QR data:", error);
                }
            }
            this.CountrySetData();
            this.CountryCodeData();
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        Onroutetotranspage: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oCustomerNoModel = this.getView().getModel("CustomerNoModel");
            
            if (!oCustomerNoModel || !oCustomerNoModel.getProperty("/Firstnames") || oCustomerNoModel.getProperty("/Firstnames").length === 0) {
                sap.m.MessageBox.error("Customer No not found. Please create a new customer and try again.");
            } else {
                oRouter.navTo("transaction");
            }
        },

        CountrySetData: function () {
            var that = this;
            $.ajax({
                type: "GET",
                url: "./sap/opu/odata/sap/ZSDGW_CE_APP_SRV/CountrySet",
                dataType: "json", 
                success: function (data) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(data.d.results);
                    that.getView().setModel(oModel, "CountryModel");
                },
                error: function (error) {
                    console.error("Error fetching country data:", error);
                }
            });
        },

        CountryCodeData: function () {
            var that = this;
            $.ajax({
                type: "GET",
                url: "./sap/opu/odata/sap/ZSDGW_CE_APP_SRV/CountryTelCodeSet",
                dataType: "json", 
                success: function (data) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(data.d.results);
                    that.getView().setModel(oModel, "CountryTelCodeModel");
                },
                error: function (error) {
                    console.error("Error fetching country code data:", error);
                }
            });
        }
    });
});
