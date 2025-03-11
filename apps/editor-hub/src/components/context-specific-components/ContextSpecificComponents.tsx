import { NodeWrapper } from "@/business-logic/node.wrapper";
import { CSInterfaceWrapper } from "@/business-logic/premire-api/CSInterface.wrapper";
import React, { ReactNode } from "react";

interface AEComponentProps {
    disable?: boolean;
    children?: ReactNode;
}

const node = new NodeWrapper()

export const AEComponent: React.FC<AEComponentProps> = ({children, disable}) => {
    const cs = new CSInterfaceWrapper();

    if (node.isNodeEnv && !disable && cs.hostEnvironment?.appId !== 'AEFT') {
        return null;
    }

    return <>{children}</>;
};

export const PRComponent: React.FC<AEComponentProps> = ({children, disable}) => {
    const cs = new CSInterfaceWrapper();

    if (node.isNodeEnv && !disable && cs.hostEnvironment?.appId !== 'PPRO') {
        return null;
    }

    return <>{children}</>;
};
