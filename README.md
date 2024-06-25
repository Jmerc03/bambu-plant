### Bambu Plant

## Display info

This is an example screen for 10 bambu X1C printers running:
![example screen](./images/plant-growing.png)

Outline:

- Blue - Printer is currently running
- Green - The printer is done printing
- Red - Error
- Yellow - idle rarely actually displays for some reason the printer is always done or running

Information:

- Print: displays the current or last print job
- Active filament: This displays the filament currently being used by the printer. These printers have four options and only can use one at a time (duh) this displays which of the four the printer is using
- Status: Displays OK or Displays ERROR: [error code]. For some error codes they have been hardcoded for their acutal meaning
- Time remaining: Displays the time estimate remaining on the printer.

## Setup

There are a few things that need to be done/gathered with the printers:

- Enable "LAN Mode Liveview" (Not LAN Only)
  - From the Bambu icon on the printer, tap "General"
  - Enable the box next to "LAN Mode Liveview"
  - Write down the number next to "Device Info" (This is the device serial number)
- Grab the Access Code and IP Address
  - From the Bambu icon on the printer, tap "Network"
  - Write down the "Access Code"
  - Write down the "IP"

Now, create a `config.json` file in the ./server directory that looks like this:

```json
{
  "machines": [
    {
      "id": "<Device Serial Number>",
      "name": "<Display Name of the printer>",
      "token": "<Access Code>",
      "ip": "<IP Address>"
    },
    {
      "id": "<Device Serial Number>",
      "name": "<Display Name of the printer>",
      "token": "<Access Code>",
      "ip": "<IP Address>"
    }
  ]
}
```

Create an entry for each printer you want to display.

In the file ./app/src/app/pages.txt you need to add all of the serial numbers of the printers in the order you want them displayed

## Launching

In one ternimal run `node ./server/index.js` to launch the mqtt subscribers, and in another ternimal run `cd app`, `yarn`, and then `yarn dev` to launch the app

Go to http://localhost:3000/ to view the app

## Issues

I have only tested the following printers:

- X1C (X1 Carbon): Worked
- P1P: Failed (possible in LAN only mode, but I wanted access to Bambu Studio)

No this will not work with P1P printers. I tried for a while and cannot get it to work but you are welcome to try. This is becuase at some point Bambu Labs discontinued mqtt connection while not in LAN only mode. If you turn on LAN only mode I believe you can no longer send prints via Bambu Studio (not 100% sure).

When listening to the mqtt of the P1P I would get all of the important data the first time then every 30 sec or so I would get partial information.

If you want more information I highly suggest you read: [Bambu Lab X1 X1C MQTT](https://community.home-assistant.io/t/bambu-lab-x1-x1c-mqtt/489510). Its really long but extremely helpful in understanding stuff.

Also, if you are looking to connect to multiple types of Bambu printers, be able to send prints, and moniter their progress, then I suggest looking into home assistant or node red. I have not done either, but lots of people seem to have success with it.

bambu-plant is a play on both bamboo being a plant, can be short for plantation, and a power plant monitering many different systems.

## Credit

I worked a little with [andresev](https://github.com/andresev) on [bambu-ranch](https://github.com/andresev/bambu-ranch/) which was inspired from [davglass'](https://github.com/davglass) [bambu-farm](https://github.com/davglass/bambu-farm)
