import {useWebSocket} from "../core/hooks/useWebSocket";
import {useCallback, useState} from "react";

export const Model = () => {
    const {sendMessage} = useWebSocket();

    const onClick = useCallback(async (event: any) => {
        sendMessage(
            event.detail.connectionId,
            JSON.stringify({
                type: "box_clicked",
            }),
        );
    }, [sendMessage]);

    return (
        <m-group>
            <m-model
                onClick={onClick}
                src="/assets/buildings/model.glb"
            ></m-model>
        </m-group>
    );
};
