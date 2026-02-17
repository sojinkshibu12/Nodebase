import { Initialnode } from "@/components/editorcomponents/initialnode";
import { HttpRequestNode } from "@/components/editorcomponents/http-request-node";
import { ManualTriggerNode } from "@/components/editorcomponents/manual-trigger-node";
import { Nodetype} from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";
export const NodeComponents = {
    [Nodetype.INITIAL]:Initialnode,
    [Nodetype.EXECUTION]:ManualTriggerNode,
    MANUALLTRIGGER:ManualTriggerNode,
    [Nodetype.HTTPREQUEST]:HttpRequestNode
} as const satisfies NodeTypes


export type RegisteredNodeType = keyof typeof NodeComponents;
