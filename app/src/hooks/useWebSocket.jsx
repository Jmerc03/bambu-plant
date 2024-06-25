import { useEffect, useState } from "react";

const useWebSocket = () => {
  const [socketData, setSocketData] = useState(null);

  const HOST = location.hostname;
  const WS_SERVER = `ws://${HOST}:9999/`;

  useEffect(() => {
    const ws = new WebSocket(WS_SERVER);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setSocketData(message);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return socketData;
};

export default useWebSocket;
