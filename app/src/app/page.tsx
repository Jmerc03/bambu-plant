"use client";
import Box from "@mui/material/Box";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import * as React from "react";
import useWebSocket from "../hooks/useWebSocket";

// Array of serial codes for all the printers
const serials: string[] = [
  "00M09A342600260",
  "00M09A342600271", //2
  "00M09C412401291",
  "00M09C411300736", //4
  "00M09C431500177",
  "00M09C431501094", //6
  "00M09A351803089",
  "00M09A381800295", //8
  "00M00A2C0603600",
  "00M09A381601473", //10
  "00M09C431903109",
  "00M09C431903549", //12
];

// Printer class that represents on 3-d printer
class Printer {
  public id: string;
  public name: string;
  public printJob: string;
  public temp: string;
  public timeLeft: string;
  public percent: number;
  public currentTray: number;
  public filName: string;
  public filColor: string;
  public error: string;
  public gcodeState: string;

  constructor(sNum: string) {
    this.id = sNum;
    this.name = "";
    this.printJob = "";
    this.temp = "";
    this.timeLeft = "";
    this.percent = 0;
    this.currentTray = 0;
    this.filName = "";
    this.filColor = "";
    this.error = "";
    this.gcodeState = "";
  }
}

// Array of printers
var printerArray: Printer[] = [];

// Updates printer with the given socketData
const update = (socketData: any, device: Printer, serialNum: string) => {
  device = new Printer(serialNum);
  device.name = JSON.stringify(
    socketData?.printer?.name,
    replacer,
    2
  ).replaceAll('"', "");
  device.printJob = JSON.stringify(
    socketData?.data?.subtask_name,
    replacer,
    2
  ).replaceAll('"', "");
  device.temp = JSON.stringify(
    socketData?.data?.ams?.ams[0]?.temp,
    replacer,
    2
  ).replaceAll('"', "");
  device.timeLeft = JSON.stringify(
    socketData?.data?.mc_remaining_time,
    replacer,
    2
  ).replaceAll('"', "");
  device.percent = parseFloat(
    JSON.stringify(socketData?.data?.mc_percent, replacer, 2).replaceAll(
      '"',
      ""
    )
  );
  device.currentTray = parseInt(
    JSON.stringify(socketData?.data?.ams?.ams[0]?.id, replacer, 2).replaceAll(
      '"',
      ""
    )
  );
  device.filName = identifyTray(socketData);
  device.filColor = "#".concat(
    JSON.stringify(
      socketData?.data?.ams?.ams[0]?.tray[device.currentTray - 1]?.tray_color,
      replacer,
      2
    ).replaceAll('"', "")
  );
  device.error = JSON.stringify(
    socketData?.data?.print_error,
    replacer,
    2
  ).replaceAll('"', "");
  device.gcodeState = JSON.stringify(
    socketData?.data?.gcode_state,
    replacer,
    2
  ).replaceAll('"', "");
  return device;
};

// Loops through the known seialrs and calls update() when the known serial# and socketData serial# match
const updatePrinterArray = (socketData: any) => {
  for (let i = 0; i < serials.length; i++) {
    if (
      serials[i] ==
      JSON.stringify(socketData?.printer?.id, replacer, 2).replaceAll('"', "")
    ) {
      delete printerArray[i];
      printerArray[i] = update(socketData, printerArray[i], serials[i]);
      break;
    }
  }
};

// Material UI progess bar with custom CSS
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; state: string }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", marginRight: 1 }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          id={`hope-${props.state}`}
          className="loadingBar"
          sx={{ height: 20 }}
          variant="determinate"
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="white"
          fontSize={20}
        >{`${props.value}%`}</Typography>
      </Box>
    </Box>
  );
}

// Replacer for JSON.stringify
const replacer = (key: any, value: any) =>
  typeof value === "undefined" ? null : value;

// Gets current tray and returns the name of the filament on the current tray
const identifyTray = (socketData: any) => {
  const currentTray = JSON.stringify(socketData?.data?.ams?.tray_now);
  switch (currentTray) {
    case '"0"':
      return JSON.stringify(
        socketData?.data?.ams?.ams[0]?.tray[0]?.name,
        replacer,
        2
      ).replaceAll('"', "");
    case '"1"':
      return JSON.stringify(
        socketData?.data?.ams?.ams[0]?.tray[1]?.name,
        replacer,
        2
      ).replaceAll('"', "");
    case '"2"':
      return JSON.stringify(
        socketData?.data?.ams?.ams[0]?.tray[2]?.name,
        replacer,
        2
      ).replaceAll('"', "");
    case '"3"':
      return JSON.stringify(
        socketData?.data?.ams?.ams[0]?.tray[3]?.name,
        replacer,
        2
      ).replaceAll('"', "");
    case '"255"':
      return "None being used";
    default:
      return "Null";
  }
};

export default function Home() {
  const socketData = useWebSocket() as any;

  //useEffect for whenever socketData changes to update the printerArray
  React.useEffect(() => {
    updatePrinterArray(socketData);
  }, [socketData]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          margin={0}
          container
          spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
        >
          {printerArray.map((printerArray) => (
            <Grid xs={2} sm={4} md={4} lg={4}>
              <div id={`main-${printerArray?.gcodeState}`} className="box">
                <div className="innerContainer">
                  <div className="title">
                    <p>{printerArray.name}</p>
                  </div>
                  <p>Print: {printerArray.printJob}</p>
                  <p>Active Filament: {printerArray.filName}</p>
                  <p>
                    Status:{" "}
                    {printerArray?.error === "0"
                      ? "OK"
                      : printerArray?.error === "117473284"
                        ? "Spagetti"
                        : "ERROR CODE: " + printerArray?.error}
                  </p>
                  <div className="time">
                    <p>Time Remaining:</p>
                    <p
                      style={{
                        fontSize: 20,
                        paddingLeft: 4,
                        fontWeight: "bold",
                      }}
                    >
                      {printerArray.timeLeft === "0"
                        ? "DONE!"
                        : printerArray.timeLeft}
                    </p>
                  </div>
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel
                      value={printerArray.percent}
                      state={printerArray.gcodeState}
                    />
                  </Box>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div>
        {" "}
        {/* ↓↓↓ All socketData/printer info ↓↓↓ */}
        {/* <h1>Device socketData</h1>
        {socketData ? (
          <pre>{JSON.stringify(socketData, null, 100)}</pre>
        ) : (
          <p>No socketData received yet...</p>
        )} */}
      </div>
    </main>
  );
}
