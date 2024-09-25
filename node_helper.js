/*********************************

  Node Helper for MMM-FSAPI.

*********************************/

const NodeHelper = require("node_helper");
const needle = require("needle");
const radiodns = require("radiodns");
const {
    DOMParser
} = require("@xmldom/xmldom");
const xmljs = require("xml-js");
const jsonata = require("jsonata");
const Log = require("logger");

module.exports = NodeHelper.create({

    start: function () {
        Log.log("Starting node helper for: " + this.name);

        needle.defaults({
            parse_response: false,
            compressed: true, // sets 'Accept-Encoding' to 'gzip, deflate, br'
            follow_max: 5, // follow up to five redirects
        });

    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FSAPI_GETMODES") {

            var self = this;

            const getData = async () => {

                var modes = {};

                try {
                    //valid modes
                    var resp = await needle("get", "http://" + payload.ip + "/fsapi/LIST_GET_NEXT/netRemote.sys.caps.validModes/-1?pin=" + payload.pin + "&maxItems=20");

                    var resp_js = xmljs.xml2js(resp.body, {
                        compact: true
                    });

                    var expression = jsonata('fsapiResponse.item{_attributes.key: {"type": field[_attributes.name="id"].c8_array._text, "display": field[_attributes.name="label"].c8_array._text}}');

                    var modes = await expression.evaluate(resp_js);

                } catch (error) {

                }

                // send back
                self.sendSocketNotification("FSAPI_MODES", modes);
            };

            getData();
        }
        if (notification === "FSAPI_GETDATA") {

            var self = this;

            const getData = async () => {
                var xmlparser = new DOMParser();
                var resp;
                var xmlDoc;

                //power
                var power = "0";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.sys.power?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        power = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //friendlyName
                var friendlyName = "Device";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.sys.info.friendlyName?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        friendlyName = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //mode
                var mode = "0";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.sys.mode?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        mode = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //line1
                var line1 = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.info.name?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        line1 = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //line2
                var line2 = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.info.text?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        line2 = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //artist
                var artist = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.info.artist?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        artist = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //album
                var album = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.info.album?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        album = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //graphicUri
                var graphicUri = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.info.graphicUri?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        graphicUri = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //frequency
                var frequency = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.frequency?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        frequency = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //fmRdsPi
                var fmRdsPi = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.serviceIds.fmRdsPi?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        fmRdsPi = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //ecc
                var ecc = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.serviceIds.ecc?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        ecc = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //dabServiceId
                var dabServiceId = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.serviceIds.dabServiceId?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        dabServiceId = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //dabScids
                var dabScids = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.serviceIds.dabScids?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        dabScids = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                //dabEnsembleId
                var dabEnsembleId = "";
                resp = await needle("get", "http://" + payload.ip + "/fsapi/GET/netRemote.play.serviceIds.dabEnsembleId?pin=" + payload.pin);
                xmlDoc = xmlparser.parseFromString(resp.body, "text/xml");
                if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue === "FS_OK") {
                    try {
                        dabEnsembleId = xmlDoc.getElementsByTagName("value")[0].childNodes[0].childNodes[0].nodeValue;
                    } catch (error) {

                    }
                }

                var data = {
                    friendlyName: friendlyName,
                    power: power,
                    mode: mode,
                    type: "",
                    display: "",
                    graphicUri: graphicUri,
                    graphicUriStation: payload.graphicUriStation,
                    line1: line1,
                    artist: artist,
                    album: album,
                    line2: line2,
                    frequency: frequency,
                    fmRdsPi: fmRdsPi,
                    ecc: ecc,
                    dabServiceId: dabServiceId,
                    dabScids: dabScids,
                    dabEnsembleId: dabEnsembleId,
                    isoCountryCode: payload.isoCountryCode,
                    pi: ""
                };

                // send back
                self.sendSocketNotification("FSAPI_DATA", data);

            };

            getData();

        }
        if (notification === "FSAPI_GETRADIODNS_FQDN") {

            var self = this;

            var params = {};

            if (payload.type === "FM") {
                params.system = 'fm';
                params.frequency = payload.frequency / 1000; //Hz -> Mhz
                params.pi = parseInt(payload.fmRdsPi).toString(16);

                if (payload.ecc !== "0") {
                    params.ecc = parseInt(payload.ecc).toString(16);
                } else {
                    params.isoCountryCode = payload.isoCountryCode;
                }
            }

            if (payload.type === "DAB") {

                params = {
                    system: 'dab',
                    eid: parseInt(payload.dabEnsembleId).toString(16),
                    sid: parseInt(payload.dabServiceId).toString(16),
                    ecc: parseInt(payload.ecc).toString(16)
                }
            }

            //Log.log(self.name + "- constructFQDN Params: " + JSON.stringify(params));

            var fqdn = "";
            try {
                fqdn = radiodns.constructFQDN(params);
            } catch (error) {

            }

            //Log.log(self.name + " - FQDN: " + JSON.stringify(fqdn));

            self.sendSocketNotification("FSAPI_RADIODNS_FQDN", fqdn);
        }
        if (notification === "FSAPI_GETRADIODNS_IMAGE") {

            var self = this;

            var params = {};

            if (payload.type === "FM") {
                params.system = 'fm';
                params.frequency = payload.frequency / 1000; //Hz -> Mhz
                params.pi = parseInt(payload.fmRdsPi).toString(16);

                if (payload.ecc !== "0") {
                    params.ecc = parseInt(payload.ecc).toString(16);
                } else {
                    params.isoCountryCode = payload.isoCountryCode;
                }
            }

            if (payload.type === "DAB") {

                params = {
                    system: 'dab',
                    eid: parseInt(payload.dabEnsembleId).toString(16),
                    sid: parseInt(payload.dabServiceId).toString(16),
                    ecc: parseInt(payload.ecc).toString(16)
                }
            }

            Log.log(self.name + " - resolveApplication Params: " + JSON.stringify(params));

            try {
                radiodns.resolveApplication(params, 'radioepg', function (err, result) {

                    const getData = async () => {

                        var image = "";

                        try {
                          var options = {
                            compressed: true, // sets 'Accept-Encoding' to 'gzip,deflate'
                            follow_max: 5, // follow up to five redirects
                            rejectUnauthorized: false, // disable verify SSL certificate
                          };

                          var resp = await needle(
                            "get",
                            "http://" +
                              result[0].name +
                              "/radiodns/spi/3.1/SI.xml",
                            null,
                            options
                          );

                          if (resp.statusCode == 200) {
                            var bearer = "";

                            var fqdnArray = payload.radiodns_fqdn
                              .replace(".radiodns.org", "")
                              .split(".");

                            for (let i = fqdnArray.length - 1; i > -1; i--) {
                              if (bearer === "") {
                                bearer = fqdnArray[i] + ":";
                              } else if (i === 0) {
                                bearer = bearer + fqdnArray[i];
                              } else {
                                bearer = bearer + fqdnArray[i] + ".";
                              }
                            }

                            var radiodns_js = xmljs.xml2js(resp.body, {
                              compact: true,
                            });

                            var expression = jsonata(
                              'serviceInformation.services.service{$replace(bearer._attributes[id = "' +
                                bearer +
                                '"].id, "' +
                                bearer +
                                '", "url"): mediaDescription.multimedia._attributes[width = "600"].url}'
                            );

                            var result_url = expression.evaluate(radiodns_js);

                            image = result_url.url;
                          }
                        } catch (error) {}

                        // send back
                        self.sendSocketNotification("FSAPI_RADIODNS_IMAGE", image);
                    };

                    getData();

                })
            } catch (error) {

            }
        }
    },

});