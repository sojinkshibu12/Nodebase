import { Initialnode } from "@/components/editorcomponents/initialnode";
import { Nodetype} from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";
export const NodeComponents = {
    [Nodetype.INITIAL]:Initialnode
} as const satisfies NodeTypes


export type RegisteredNodeType = keyof typeof NodeComponents;