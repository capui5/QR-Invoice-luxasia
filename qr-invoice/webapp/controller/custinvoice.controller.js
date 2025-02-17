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
            return UIComponent.getRouterFor(this);
          },

        Onroutetotranspage: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          var oCustomerNoModel = this.getView().getModel("CustomerNoModel");
    
          if (!oCustomerNoModel || !oCustomerNoModel.getProperty("/Firstnames") || oCustomerNoModel.getProperty("/Firstnames").length === 0) {
            // CustomerNo not found or empty array, display a message or take necessary action
            // For example, show a message and prevent navigation
            sap.m.MessageBox.error("Customer No not found. Please create a new customer and try again.", {
              onClose: function () {
                // Handle the action when the message box is closed
                // For example, stay on the current page or navigate elsewhere
              }
            });
          } else {
            // CustomerNo found in the model, proceed with navigation
            oRouter.navTo("transaction");
          }
        },
    

        CountrySetData: function () {
          var that = this;
    
          $.ajax({
            type: "GET",
            url: "./sap/opu/odata/sap/ZSDGW_CE_APP_SRV/CountrySet",
            headers: {
    
            },
            dataType: "json",
            success: function (data) {
              console.log(data.d.results);
    
              // Create a new JSON model
              var oModel = new sap.ui.model.json.JSONModel();
    
              // Set received data to the JSON model
              oModel.setData(data.d.results);
    
              // Set the JSON model to your view or component
              that.getView().setModel(oModel, "CountryModel");
              console.log(oModel);
            },
            error: function (error) {
              console.error("Error fetching country data:", error);
              // Handle error scenarios here
            }
          });
        },
        CountryCodeData: function () {
          var that = this;
    
    
          $.ajax({
            type: "GET",
            url: "./sap/opu/odata/sap/ZSDGW_CE_APP_SRV/CountryTelCodeSet",
            headers: {
    
    
            },
            dataType: "json",
            success: function (data) {
              console.log(data.d.results);
    
              // Create a new JSON model
              var oModel = new sap.ui.model.json.JSONModel();
    
              // Set received data to the JSON model
              oModel.setData(data.d.results);
    
              // Set the JSON model to your view or component
              that.getView().setModel(oModel, "CountryTelCodeModel");
              console.log(oModel);
            },
            error: function (error) {
              console.error("Error fetching country data:", error);
              // Handle error scenarios here
            }
          });
        },
        onCreateProfile: function () {
          this.onValidateinvoiceCustomer();
        },
        onValidateinvoiceCustomer: function () {
            var that = this;
            var decryptedData = atob(window.location.search.split("?CD=")[1]);
            var sStoreId = decryptedData.split("##")[0];
            var UserEmail = decryptedData.split("##")[1];
            var CDUserID = decryptedData.split("##")[3];
            console.log(CDUserID);


            // Get input fields
        var oEmailField = this.getView().byId("email");
        var oSalesOrderField = this.getView().byId("Salesordernumber");

        // Get values
        var sEmail = oEmailField.getValue().trim();
        var sSalesOrder = oSalesOrderField.getValue().trim();

        // Reset previous validation states
        oEmailField.setValueState(sap.ui.core.ValueState.None);
        oSalesOrderField.setValueState(sap.ui.core.ValueState.None);

        var missingFields = [];

        // Validate required fields
        if (!sEmail) {
          oEmailField.setValueState(sap.ui.core.ValueState.Error);
          oEmailField.setValueStateText("Email is required.");
          missingFields.push("Email");
        }
        if (!sSalesOrder) {
          oSalesOrderField.setValueState(sap.ui.core.ValueState.Error);
          oSalesOrderField.setValueStateText("Sales Order Number is required.");
          missingFields.push("Sales Order Number");
        }

        // Email format validation
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (sEmail && !emailPattern.test(sEmail)) {
          oEmailField.setValueState(sap.ui.core.ValueState.Error);
          oEmailField.setValueStateText("Invalid email format.");
          missingFields.push("Valid Email Address");
        }

        // If there are missing fields, show error message
        if (missingFields.length > 0) {
          sap.m.MessageBox.error("Please fill the following required fields:\n\n" + missingFields.join("\n"));
          return;
        }
           
            var payload = {
              // "SalesDocument": that.getView().byId("Salesordernumber").getValue(),
              "SalesDocument": sSalesOrder,
              "CustomerName": that.getView().byId("cname").getValue(),
              "AddrLine1": that.getView().byId("add1").getValue(),
              "AddrLine2": that.getView().byId("add2").getValue(),
              "AddrLine3": that.getView().byId("add3").getValue(),
              "TelNumber": that.getView().byId("phoneno").getValue(),
              // "Email": that.getView().byId("email").getValue(),
              "Email": sEmail,
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
          },
          oncancelinvoiceCustomer: function () {
            var oView = this.getView();
            oView.byId("salesemployeeinputinvoice").setValue("");
            oView.byId("cname").setValue("");
            oView.byId("add1").setValue("");
            oView.byId("add2").setValue("");
            oView.byId("add3").setValue("");
            oView.byId("phoneno").setValue("");
            oView.byId("email").setValue("");
            oView.byId("city").setValue("");
            oView.byId("pcode").setValue("");
            oView.byId("NRIC").setValue("");
            oView.byId("sstno").setValue("");
            oView.byId("regno").setValue("");
          },
    });
});
