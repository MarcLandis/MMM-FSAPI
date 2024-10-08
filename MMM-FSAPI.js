/*********************************
  MagicMirror² Module:
  MMM-FSAPI
  https://github.com/MarcLandis/MMM-FSAPI
  
  By Marc Landis
  MIT Licensed
*********************************/

Module.register("MMM-FSAPI", {
    /*
      This module uses the Nunjucks templating system introduced in
      version 2.2.0 of MagicMirror².  If you're seeing nothing on your
      display where you expect this module to appear, make sure your
      MagicMirror² version is at least 2.2.0.
    */
    requiresVersion: "2.2.0",

    // Default module config.
    defaults: {
        ip: "192.168.1.1",
        pin: "1234",
        updateInterval: 10, // Seconds, minimum 2
        alwaysShowAlbumArt: false,
        isoCountryCode: "",
        showPI: false
    },

    getScripts: function() {
        return ["moment.js"];
    },

    getStyles: function () {
        return ["MMM-FSAPI.css"];
    },

    getTemplate: function () {
        return "MMM-FSAPI.njk";
    },

    getTemplateData: function () {
        return {
            phrases: {
                loading: this.translate("LOADING")
            },
            loading: this.data == null ? true : false,
            config: this.config,
            data: this.fsapidata
        };
    },

    start: function () {
        Log.info("Starting module: " + this.name);

        this.fsapimodes = null;
        this.fsapidata = {
            graphicUriStation: ""
        };

        this.radiodns_fqdn_old = "";
        this.radiodns_lastupdated = moment().subtract(10, "minutes");

        var self = this;

        self.getModes();

        self.getData();

        setInterval(function () {
            self.getData();
        }, self.config.updateInterval * 1000); //convert to milliseconds

    },

    getModes: function () {
        this.sendSocketNotification("FSAPI_GETMODES", {
            ip: this.config.ip,
            pin: this.config.pin
        });
    },

    getData: function () {
        this.sendSocketNotification("FSAPI_GETDATA", {
            ip: this.config.ip,
            pin: this.config.pin,
            isoCountryCode: this.config.isoCountryCode,
            graphicUriStation: this.fsapidata.graphicUriStation
        });
    },

    socketNotificationReceived: function (notification, payload) {

        if (notification === "FSAPI_MODES") {

            this.fsapimodes = payload;
        }
        if (notification === "FSAPI_DATA") {
            this.fsapidata = payload;

            this.fsapidata.type = this.fsapimodes[this.fsapidata.mode].type;
            this.fsapidata.display = this.fsapimodes[this.fsapidata.mode].display;

            if (this.fsapidata.graphicUri === "" && this.config.alwaysShowAlbumArt) {
                this.fsapidata.graphicUri = this.file("./images/cover.svg")
            }

            this.updateDom();

            switch(this.fsapidata.type) {
                case "FM":
                    this.fsapidata.pi = parseInt(this.fsapidata.fmRdsPi).toString(16) + ".png";
                  break;
                case "DAB":
                    this.fsapidata.pi = parseInt(this.fsapidata.dabServiceId).toString(16) + ".png";
                  break;
                default:

            }

            if (this.fsapidata.graphicUri === "" && (payload.type === "FM" || payload.type === "DAB")) {

                this.sendSocketNotification("FSAPI_GETRADIODNS_FQDN", this.fsapidata);
            }
        }
        if (notification === "FSAPI_RADIODNS_FQDN") {
            if (payload !== "") {
                this.fsapidata.radiodns_fqdn = payload;

                if ((this.fsapidata.radiodns_fqdn !== this.radiodns_fqdn_old) || (this.radiodns_lastupdated.isBefore(moment().subtract(5, "minutes")))) {
                    this.radiodns_fqdn_old = this.fsapidata.radiodns_fqdn;
                    this.radiodns_lastupdated = moment();
                    this.fsapidata.graphicUriStation = "";

                    Log.info("MMM-FSAPI RADIODNS_FQDN: " + payload);

                    this.sendSocketNotification("FSAPI_GETRADIODNS_IMAGE", this.fsapidata);
                }
            }

        }
        if (notification === "FSAPI_RADIODNS_IMAGE") {
            if (payload !== "") {
                this.fsapidata.graphicUriStation = payload;
                Log.info("MMM-FSAPI RADIODNS_IMAGE: " + payload);
                this.updateDom();
            }
            else
            {
                switch(this.fsapidata.type) {
                    case "FM":
                        this.fsapidata.graphicUriStation = this.file("./images/stations/" + parseInt(this.fsapidata.fmRdsPi).toString(16) + ".png");
                      break;
                    case "DAB":
                        this.fsapidata.graphicUriStation = this.file("./images/stations/" + parseInt(this.fsapidata.dabServiceId).toString(16) + ".png");
                      break;
                    default:
                        this.fsapidata.graphicUriStation = "";
                }

                this.updateDom();
            }
        }
    }

});