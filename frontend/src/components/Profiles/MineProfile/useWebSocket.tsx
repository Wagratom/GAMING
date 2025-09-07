// useWebSocket.ts
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef } from "react";

export default function useWebSocket(topic?: string, callback?: (msg: any) => void, maxReconnects = 5) {
  const clientRef = useRef<Client | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (!topic || !callback) return; // só conecta se tiver tópico e callback

    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("connect topic: ", topic)
        attempts.current = 0;
        client.subscribe(topic, (msg) => msg.body && callback(JSON.parse(msg.body)));
      },
      onStompError: (f) => console.error("❌ STOMP error:", f.headers.message, f.body),
      onWebSocketClose: () => {
        if (++attempts.current > maxReconnects) client.deactivate();
      },
    });

    client.activate();
    clientRef.current = client;

    return () => void client.deactivate();
  }, [topic, callback, maxReconnects]);

  return clientRef;
}
