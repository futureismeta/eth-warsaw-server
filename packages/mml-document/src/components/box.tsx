import {useCallback, useState} from "react";
import {useWebSocket} from "../core/hooks/useWebSocket";
import {BoxPosition} from "./boxes";

interface BoxProps {
    position: BoxPosition
}

export const Box = ({position}: BoxProps) => {
    const {sendMessage} = useWebSocket();
    const [visible, setVisible] = useState(true);

    const onClick = useCallback(async (event: any) => {
        sendMessage(
            event.detail.connectionId,
            JSON.stringify({
                type: "box_clicked",
                box_id: position.id
            }),
        );
        setVisible(false);
    }, [sendMessage]);

    return (
        <m-group>
            <m-model
                src="/assets/buildings/box.glb"
                x={position.x}
                z={position.z}
                sz={3}
                sx={3}
                sy={3}
                onClick={onClick}
                visible={visible}
            ></m-model>
        </m-group>
    );
}