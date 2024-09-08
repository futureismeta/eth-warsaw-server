import React from "react";
import {Box} from "./box";

export interface BoxPosition {
    x: number;
    z: number;
    id: string;
}

const boxPositions: BoxPosition[] = [
    { id: "box_celo", x: 30, z: -16 }, // Position 1
    { id: "box_aleph_zero", x: 15, z: -10 }, // Position 2
    { id: "box_arweave", x: -5, z: 20 }, // Position 3
    { id: "box_ora", x: 8, z: 5 }, // Position 4
    { id: "box_worldcoin", x: -12, z: -8 }, // Position 5
    { id: "box_ethwarsaw", x: 25, z: 15 }, // Position 6
    { id: "box_future_meta", x: -10, z: 30 }, // Position 7
    { id: "box_mantle", x: 0, z: -25 }, // Position 8
];


export const Boxes = () => {
    return (
        <>
            {boxPositions.map((boxPosition, index) => (
                <m-group key={index}>
                    <Box position={boxPosition}/>
                </m-group>
            ))}
        </>
    );
}