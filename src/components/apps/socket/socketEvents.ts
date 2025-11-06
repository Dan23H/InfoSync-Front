import { Socket } from "socket.io-client";
import type { Dispatch } from "react";
import type { TSocketContextActions } from "../../../context/SocketContext";

export const startSocketListeners = (
  socket: Socket,
  SocketDispatch: Dispatch<{ type: TSocketContextActions; payload: any }>
) => {
  // Reconnect event
  socket.io.on("reconnect", (attempt) => {
    console.log(`Socket.IO reconnected after ${attempt} attempts.`);
  });

  socket.io.on("reconnect_attempt", (attempt) => {
    console.log(`Socket.IO reconnect attempt: ${attempt}`);
  });

  socket.io.on("reconnect_error", (error) => {
    console.error("Socket.IO reconnection error:", error);
  });

  socket.io.on("reconnect_failed", () => {
    console.info("Socket.IO reconnection failed.");
    alert("Socket.IO reconnection failed.");
  });

  socket.on("like_update", ({ postId, likeCount }) => {
    console.log(`Like count updated for post ${postId}: ${likeCount}`);
    SocketDispatch({ type: "like_update", payload: { postId, likeCount } });
  });

  socket.on("dislike_update", ({ postId, dislikeCount }) => {
    console.log(`Dislike count updated for post ${postId}: ${dislikeCount}`);
    SocketDispatch({ type: "dislike_update", payload: { postId, dislikeCount } });
  });

  socket.on("comment_update", ({ postId, commentCount }) => {
    console.log(`Comment count updated for post ${postId}: ${commentCount}`);
    SocketDispatch({ type: "comment_update", payload: { postId, commentCount } });
  });

  socket.on("update_users", (users) => {
    console.log(`Connected users updated: ${users.length}`);
    SocketDispatch({ type: "update_users", payload: users });
  });

  socket.on("post_update", ({ postId, ...postData }) => {
    console.log(`Post updated: ${postId}`);
    SocketDispatch({ type: "post_update", payload: { postId, ...postData } });
  });

  return () => {
    socket.off("like_update");
    socket.off("dislike_update");
    socket.off("comment_update");
    socket.off("update_users");
    socket.off("post_update");
  };
};