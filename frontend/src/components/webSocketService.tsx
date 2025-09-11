import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function webSocketService(topic: string, callback: (msg: any) => void, maxReconnects = 5) {
  let attempts = 0; // ✅ agora é só uma variável

  const client = new Client({
    webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL}/ws`),
    connectHeaders: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("connect topic: ", topic);
      attempts = 0;
      client.subscribe(topic, (msg) => msg.body && callback(JSON.parse(msg.body)));
    },
    onStompError: (f) =>
      console.error("❌ STOMP error:", f.headers.message, f.body),
    onWebSocketClose: () => {
      if (++attempts > maxReconnects) client.deactivate();
    },
  });

  client.activate();
  return client;
}
