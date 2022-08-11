# Magic Mirror Module MMM-FSAPI

A module for your [MagicMirror](https://github.com/MichMich/MagicMirror) that shows what is playing on your Frontier Silicon powered radio. Examples of such devices are in the following list: <https://github.com/cweiske/frontier-silicon-firmwares>

Based on the source it will show some media information. For Spotify album art, song name, artist and album name are shown. For DAB and FM the image will be retrieved using the [RadioDNS](https://radiodns.org/campaigns/project-logo/walkthrough-finding-radio-station-logos/) service and the song information from the device itself (witch is sometimes garbage for FM).

![Example Spotify](/example_spotify.png?raw=true) ![Example DAB](/example_dab.png?raw=true)

## Installation

1\. Execute the following commands to install the module:

```bash
cd ~/MagicMirror/modules # navigate to module folder
git clone https://github.com/MarcLandis/MMM-FSAPI.git # clone this repository
npm install # install dependencies
```

2\. Then, add the following into the `modules` section of your `config/config.js` file:

```javascript
{
    module: 'MMM-MMM-FSAPI',
    position: 'top_right',
    config: {
        // See 'Configuration options' for more information.
    }
},
```

## Configuration options

The following properties can be configured:

| Option               | Description                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ip`                 | The IP address of the device.                                                                                                                          |
| `pin`                | The PIN for the API. It defaults to 1234. <br><br> **Default value:** `"1234"`                                                                         |
| `updateInterval`     | The interval in seconds the API is fetched. Minimum is 2. <br><br> **Default value:** `10`                                                             |
| `alwaysShowAlbumArt` | Show a generic album art image if non could be retrieved from the API. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `false` |
| `isoCountryCode`     | Fallback to this country code for retrieving the RadioDNS data. <br><br> **Possible values:**   https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2             |
