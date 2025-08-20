// websocket.ts
import { Client, IMessage } from "@stomp/stompjs";
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";

export default function FriendWebsocket(userId: string, maxReconnects = 5) {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const reconnectAttempts = useRef(0);

    useEffect(() => {
        const stomp = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            reconnectDelay: 5000, // tempo entre tentativas
            onConnect: () => {
                console.log("✅ Conectado ao WebSocket");
                reconnectAttempts.current = 0; // reset no sucesso
                stomp.subscribe(`/topic/friends/${userId}`, (msg: IMessage) => {
                    if (msg.body) {
                        const payload = JSON.parse(msg.body);
                        console.log("📩 Nova mensagem:", payload);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("❌ STOMP error:", frame.headers["message"]);
                console.error("Detalhes:", frame.body);
            },
            onWebSocketClose: () => {
                // Bloqueia reconexão se atingir o limite
                if (reconnectAttempts.current >= maxReconnects) {
                    console.warn("⚠️ Limite de reconexões atingido, não reconectando.");
                    stomp.deactivate();
                } else {
                    reconnectAttempts.current += 1;
                }
            },
        });

        stomp.activate();
        setStompClient(stomp);

        return () => {
            stomp.deactivate();
        };
    }, [userId, maxReconnects]);

    return stompClient;
}
