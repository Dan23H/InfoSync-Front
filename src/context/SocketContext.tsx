import { createContext } from "react";
import type { Socket } from "socket.io-client";

export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string;
  users: string[];
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: "",
  users: [],
};

export type TSocketContextActions =
  | 'update_socket'
  | 'update_uid'
  | 'update_users'
  | 'remove_user'
  | 'like_update'
  | 'dislike_update'
  | 'comment_update'
  | 'comment_added'
  | 'comment_updated'
  | 'post_update'
  | 'join_post_room'
  | 'handshake'
  | 'register_post_listeners';

export type TSocketContextPayload =
  | string
  | string[]
  | Socket
  | { postId: string; likeCount?: number; dislikeCount?: number; commentCount?: number }
  | { postId: string }
  | { userId: string }
  | { token: string; user: any }
  | { postId: string; onLikeUpdate: (likeCount: number) => void; onDislikeUpdate: (dislikeCount: number) => void };

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload: TSocketContextPayload;
}

export const socketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
  console.log(`Dispatching action: ${action.type} with payload:`, action.payload);

  switch (action.type) {
    case 'update_socket':
      return { ...state, socket: action.payload as Socket };
    case 'update_users':
      return { ...state, users: action.payload as string[] };
    case 'remove_user':
      return { ...state, users: state.users.filter((uid) => uid != action.payload as string) };
    case 'like_update': {
      const { postId, likeCount } = action.payload as { postId: string; likeCount: number };
      console.log(`Emitting like_update for postId: ${postId} with likeCount: ${likeCount}`);
      state.socket?.emit('like_update', { postId, likeCount }, (response: any) => {
        console.log(`Backend response for like_update:`, response);
      });
      return state;
    }
    case 'dislike_update': {
      const { postId, dislikeCount } = action.payload as { postId: string; dislikeCount: number };
      console.log(`Emitting dislike_update for postId: ${postId} with dislikeCount: ${dislikeCount}`);
      state.socket?.emit('dislike_update', { postId, dislikeCount }, (response: any) => {
        console.log(`Backend response for dislike_update:`, response);
      });
      return state;
    }
    case 'comment_update': {
      const { postId, commentCount } = action.payload as { postId: string; commentCount: number };
      console.log(`Emitting comment_update for postId: ${postId} with commentCount: ${commentCount}`);
      state.socket?.emit('comment_update', { postId, commentCount });
      return state;
    }
    case 'post_update': {
      const { postId, ...postData } = action.payload as { postId: string; [key: string]: any };
      console.log(`Emitting post_update for postId: ${postId} with data:`, postData);
      state.socket?.emit('post_update', { postId, ...postData });
      return state;
    }
    case 'join_post_room': {
      const { postId } = action.payload as { postId: string };
      console.log(`Joining post room: post_${postId}`);
      state.socket?.emit('joinPostRoom', postId);
      return state;
    }
    case 'update_uid': {
      const { userId } = action.payload as { userId: string };
      console.log(`Updating user ID: ${userId}`);
      state.socket?.emit('update_uid', userId);
      return { ...state, uid: userId };
    }
    case 'handshake': {
      const { token, user } = action.payload as { token: string; user: any };
      console.log(`Performing handshake with token: ${token}`);
      state.socket?.emit('handshake', { token, user }, (userId: string, users: string[]) => {
        console.log(`Handshake successful. User ID: ${userId}, Connected users:`, users);
      });
      return state;
    }
    case 'register_post_listeners': {
      const { postId, onLikeUpdate, onDislikeUpdate, onCommentAdded, onCommentUpdated } = action.payload as {
        postId: string;
        onLikeUpdate: (likeCount: number) => void;
        onDislikeUpdate: (dislikeCount: number) => void;
        onCommentAdded: (comment: any) => void;
        onCommentUpdated: (comment: any) => void;
      };

      console.log(`Registering listeners for postId: ${postId}`);

      state.socket?.on('like_update', ({ postId: eventPostId, likeCount }) => {
        if (eventPostId === postId) {
          console.log(`Received like_update for postId: ${eventPostId} with likeCount: ${likeCount}`);
          onLikeUpdate(likeCount);
        }
      });

      state.socket?.on('dislike_update', ({ postId: eventPostId, dislikeCount }) => {
        if (eventPostId === postId) {
          console.log(`Received dislike_update for postId: ${eventPostId} with dislikeCount: ${dislikeCount}`);
          onDislikeUpdate(dislikeCount);
        }
      });

      state.socket?.on('comment_added', ({ postId: eventPostId, comment }) => {
        if (eventPostId === postId) {
          console.log(`Received comment_added for postId: ${eventPostId}`);
          onCommentAdded(comment);
        }
      });

      state.socket?.on('comment_updated', ({ postId: eventPostId, comment }) => {
        if (eventPostId === postId) {
          console.log(`Received comment_updated for postId: ${eventPostId}`);
          onCommentUpdated(comment);
        }
      });

      return state;
    }
    default:
      return { ...state };
  }
};

export interface ISocketContextProps {
  SocketState: ISocketContextState;
  SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;