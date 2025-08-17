// websocket.ts
import { Client, IMessage } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

export default function FriendWebsocket(userId: string) {
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() => {
        const stomp = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            debug: (str) => console.log("🛰️", str),
            onConnect: () => {
                console.log("✅ Conectado ao WebSocket");
                stomp.subscribe(`/topic/user/${userId}`, (msg: IMessage) => {
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
        });

        stomp.activate();
        setStompClient(stomp);

        return () => {
            stomp.deactivate();
        };
    }, [userId]);

    return stompClient;
}
