import { MutableRefObject, useEffect, useRef, useState } from "react"

export const CommandService = () => {
    const [message, setMessage] = useState<string>();
    const socketRef: MutableRefObject<WebSocket | null> = useRef<WebSocket>(null);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:8000/ws");

        socketRef.current.onopen = () => {
            console.log("Connect!");
        }

        socketRef.current.onclose = () => {
            console.log("closed!");
        }

        socketRef.current.onerror = (event) => {
            console.error("ws error:" + event);
        }

        socketRef.current.onmessage = (event: MessageEvent) => {
            setMessage(event.data);
            console.log("receive:" + event.data);
        }

        // return () => {
        //     if (socketRef.current !== null && socketRef.current.readyState === 1) { socketRef.current.close(); }
        // }
    }, []);

    const sendMessage = (text: string) => {
        socketRef.current?.send(text);
    }

    const close = () => {
        socketRef.current?.close();
    }

    return { message, sendMessage, close };
}