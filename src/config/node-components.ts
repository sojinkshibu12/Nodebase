import { CatalogNode } from "@/components/editorcomponents/catalog-node";
import { Initialnode } from "@/components/editorcomponents/initialnode";
import { IfSwitchNode } from "@/components/editorcomponents/if-switch-node";
import { ManualTriggerNode } from "@/components/editorcomponents/manual-trigger-node";
import { MergeNode } from "@/components/editorcomponents/merge-node";
import { ScheduleNode } from "@/components/editorcomponents/schedule-node";
import { CATALOG_NODE_TYPES } from "@/config/node-catalog";
import { Nodetype} from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

const catalogNodeComponents = Object.fromEntries(
    CATALOG_NODE_TYPES.map((type) => [type, CatalogNode]),
) as Record<(typeof CATALOG_NODE_TYPES)[number], typeof CatalogNode>;

export const NodeComponents = {
    [Nodetype.INITIAL]:Initialnode,
    [Nodetype.EXECUTION]:ManualTriggerNode,
    MANUALLTRIGGER:ManualTriggerNode,
    [Nodetype.SCHEDULE]:ScheduleNode,
    [Nodetype.IFSWITCH]:IfSwitchNode,
    [Nodetype.MERGE]:MergeNode,
    ...catalogNodeComponents,
} as const satisfies NodeTypes


export type RegisteredNodeType = keyof typeof NodeComponents;
