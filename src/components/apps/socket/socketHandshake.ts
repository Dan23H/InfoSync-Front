import { Socket } from "socket.io-client";
import type { Dispatch } from "react";
import type { TSocketContextActions } from "../../../context/SocketContext";

export const sendSocketHandshake = (
    socket: Socket,
    SocketDispatch: Dispatch<{ type: TSocketContextActions; payload: any }>,
    setLoading: (loading: boolean) => void
) => {
    console.log("Sending handshake...");

    const token = localStorage.getItem("jwt");
    const user = localStorage.getItem("user");

    if (!token || !user) {
        console.error("Missing token or user in localStorage.");
        setLoading(false);
        return;
    }

    const parsedUser = JSON.parse(user);
    console.log("Parsed user: ", parsedUser);

    socket.emit("handshake", { 
        token,
        user: parsedUser
    }, (uid: string, users: string[]) => {
        console.log("Handshake acknowledged:", uid, users);

        SocketDispatch({ type: "update_uid", payload: uid });
        SocketDispatch({ type: "update_users", payload: users });

        setLoading(false);
    });
};

