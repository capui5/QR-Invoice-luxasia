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
    
            var decryptedData = atob(window.location.search.split("?CD=")[1]); 
            var UserEmail = decryptedData.split("##")[0];
            var CountryCode = decryptedData.split("##")[2];
            sap.ui.getCore().getConfiguration().setLanguage(CountryCode);
            var CDUserID = decryptedData.split("##")[2];
            var qrCodeGeneratedDateTime = new Date(decryptedData.split("##")[2]);
            var currentDateTime = new Date();
            var differenceValue = (currentDateTime.getTime() - qrCodeGeneratedDateTime.getTime()) / 1000;
            differenceValue /= 60;
            var result = Math.abs(differenceValue);
            if (result <= 5) {
              //load simpleform
            } else {
            
            }
      
              if (CountryCode) {
      
                var oCountrySelect = this.byId("country");
                var oCountryCodeSelect = this.byId("countrycode")
                oCountrySelect.setSelectedKey(CountryCode);
                oCountryCodeSelect.setSelectedKey(CountryCode)
              } else {
                console.warn("Selected country not found in StoreModel.");
              }
              
            var aModel = this.getOwnerComponent().getModel("CustomerNoModel")
            this.getView().setModel(aModel, "CustomerNoModel");
           
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      
            var oModel = this.getOwnerComponent().getModel("BrandStoreModel");
            console.log(oModel);
      
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
            // Initialize the JSON model for CSRF token
      
         
      
          
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
        },
        onValidateinvoiceCustomer: function () {
            var that = this;
            var decryptedData = atob(window.location.search.split("?CD=")[1]);
            var sStoreId = decryptedData.split("##")[0];
            var UserEmail = decryptedData.split("##")[1];
            var CDUserID = decryptedData.split("##")[3];
            console.log(CDUserID);
           
            var payload = {
              "SalesDocument": that.getView().byId("Salesordernumber").getValue(),
              "CustomerName": that.getView().byId("cname").getValue(),
              "AddrLine1": that.getView().byId("add1").getValue(),
              "AddrLine2": that.getView().byId("add2").getValue(),
              "AddrLine3": that.getView().byId("add3").getValue(),
              "TelNumber": that.getView().byId("phoneno").getValue(),
              "Email": that.getView().byId("email").getValue(),
              "City": that.getView().byId("city").getValue(),
              "PostalCode": that.getView().byId("pcode").getValue(),
              "Land": that.getView().byId("country").getSelectedKey(),
              "Tin": that.getView().byId("NRIC").getValue(),
              "SstNumber": that.getView().byId("sstno").getValue(),
              "RegNumber": that.getView().byId("regno").getValue()
          };
          
      
            // var csrfToken = this.getView().getModel("csrfModel").getProperty("/csrfToken");
            // console.log(csrfToken);
            sap.ui.core.BusyIndicator.show(0);
            $.ajax({
              type: "POST",
              url: "./sap/opu/odata/sap/ZSDGW_MYEINV_CE_APP_SRV/EinvoiceMySet",
              data: JSON.stringify(payload),
              contentType: "application/json",
              headers: {
      
              },
           
              
              success: function (response) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.show("Record Submitted successfully!", {
                    icon: sap.m.MessageBox.Icon.SUCCESS,
                    title: "Success",
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function () {
                        
                    }
                });
            },
      
      
      
      
              error: function (oError) {
                sap.ui.core.BusyIndicator.hide();
                let errorMessage = "An Unexpected Error Occurred";
                try {
                    errorMessage = JSON.parse(oError.responseText).error.message.value;
                } catch (e) {}
                console.error("Error Response:", oError);
                sap.m.MessageBox.show(errorMessage, {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Error",
                });
            }
            });
          }
    });
});
