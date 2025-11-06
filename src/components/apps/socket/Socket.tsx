import { useReducer, type PropsWithChildren } from "react";
import { defaultSocketContextState, SocketContextProvider, socketReducer } from "../../../context/SocketContext";

export interface ISocketContextComponentProps extends PropsWithChildren { }

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;
    const [SocketState, SocketDispatch] = useReducer(socketReducer, defaultSocketContextState);

    return (
        <SocketContextProvider value={{ SocketState, SocketDispatch }}>
            {children}
        </SocketContextProvider>
    );
};

export default SocketContextComponent;