
'use client'
import {
  useAddWorkflowNode,
  useDeleteWorkflowNode,
  useExecuteWorkflow,
  useoneSuspenceWorkflow,
  useSetWorkflowConnections,
  useUpdateWorkflowNodePosition,
  useUpdateWorkflowNode,
} from "@/app/functionalities/workflows/servers/hooks/use-workflow"
import { Errorentity, Loadingentity } from "../entity-component"
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, reconnectEdge, type Node, type Edge, NodeChange, EdgeChange, Connection, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeComponents } from "@/config/node-components";
import { AddnodeButton } from "./addbutton";
import { Nodetype } from "@/generated/prisma/enums";
import { NodePickerSidebar } from "./node-picker-sidebar";
import { DeletableEdge } from "./deletable-edge";
import { PlayIcon, TrashIcon } from "lucide-react";
import { sortNodesTopologically } from "@/lib/topological-sort";
import type { NodeExecutionStatus } from "./node-execution-state";
import { getCatalogNodeDefaults, isCatalogNodeType } from "@/config/node-catalog";




interface Editorcontentprops{
    workflowid:string
}

const NODE_SIZE = 56;
const NODE_GAP = 16;
const GRID_STEP = NODE_SIZE + NODE_GAP;

const isOverlappingPosition = (
  position: { x: number; y: number },
  nodes: Node[],
  ignoreId?: string,
) => {
  return nodes.some((node) => {
    if (ignoreId && node.id === ignoreId) {
      return false;
    }

    const dx = Math.abs(position.x - node.position.x);
    const dy = Math.abs(position.y - node.position.y);

    return dx < GRID_STEP && dy < GRID_STEP;
  });
};

const findAvailablePosition = (nodes: Node[]) => {
  const baseX = 180;
  const baseY = 120;

  for (let row = 0; row < 20; row += 1) {
    for (let col = 0; col < 20; col += 1) {
      const candidate = {
        x: baseX + col * GRID_STEP,
        y: baseY + row * GRID_STEP,
      };

      if (!isOverlappingPosition(candidate, nodes)) {
        return candidate;
      }
    }
  }

  return {
    x: baseX + nodes.length * GRID_STEP,
    y: baseY + nodes.length * GRID_STEP,
  };
};

const edgeTypes = {
  deletable: DeletableEdge,
} as const;

export const Editorcontent = ({workflowid}:Editorcontentprops)=>{
    const {data} = useoneSuspenceWorkflow(workflowid)
    const addNodeMutation = useAddWorkflowNode();
    const updateNodeMutation = useUpdateWorkflowNode();
    const updateNodePositionMutation = useUpdateWorkflowNodePosition();
    const deleteNodeMutation = useDeleteWorkflowNode();
    const setConnectionsMutation = useSetWorkflowConnections();
    const executeWorkflowMutation = useExecuteWorkflow();

    const [nodes, setNodes] = useState<Node[]>(data.nodes);
    const [edges, setEdges] = useState<Edge[]>(data.edges as Edge[]);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [replaceNodeId, setReplaceNodeId] = useState<string | null>(null);
    const [nodeExecutionStatuses, setNodeExecutionStatuses] = useState<Record<string, NodeExecutionStatus>>({});
 
    const onNodesChange = useCallback(
        (changes:NodeChange[]) =>
          setNodes((nodesSnapshot) => {
            const nextNodes = applyNodeChanges(changes, nodesSnapshot);
            const previousById = new Map(
              nodesSnapshot.map((node) => [node.id, node]),
            );

            const movedNodeIds = changes
              .filter((change) => change.type === "position")
              .map((change) => change.id);

            if (movedNodeIds.length === 0) {
              return nextNodes;
            }

            return nextNodes.map((node) => {
              if (!movedNodeIds.includes(node.id)) {
                return node;
              }

              const overlaps = isOverlappingPosition(
                node.position,
                nextNodes,
                node.id,
              );

              if (!overlaps) {
                return node;
              }

              const previousNode = previousById.get(node.id);
              if (!previousNode) {
                return node;
              }

              return {
                ...node,
                position: previousNode.position,
              };
            });
          }),
        [],
    );
    const persistEdges = useCallback((nextEdges: Edge[]) => {
      setConnectionsMutation.mutate({
        workflowId: workflowid,
        edges: nextEdges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
        })),
      });
    }, [setConnectionsMutation, workflowid]);
    const onEdgesChange = useCallback(
        (changes:EdgeChange[]) => setEdges((edgesSnapshot) => {
          const nextEdges = applyEdgeChanges(changes, edgesSnapshot);
          const shouldPersist = changes.some(
            (change) =>
              change.type === "remove" ||
              change.type === "add" ||
              change.type === "replace",
          );

          if (shouldPersist) {
            persistEdges(nextEdges);
          }

          return nextEdges;
        }),
        [persistEdges],
    );
    const onConnect = useCallback(
        (params:Connection) => setEdges((edgesSnapshot) => {
          const nextEdges = addEdge(params, edgesSnapshot);
          persistEdges(nextEdges);
          return nextEdges;
        }),
        [persistEdges],
    );
    const onReconnect = useCallback(
        (oldEdge: Edge, newConnection: Connection) =>
          setEdges((edgesSnapshot) => {
            const nextEdges = reconnectEdge(oldEdge, newConnection, edgesSnapshot);
            persistEdges(nextEdges);
            return nextEdges;
          }),
        [persistEdges],
    );
    const handleDeleteEdge = useCallback((edgeId: string) => {
      setEdges((current) => {
        const nextEdges = current.filter((edge) => edge.id !== edgeId);
        persistEdges(nextEdges);
        return nextEdges;
      });
    }, [persistEdges]);
    const handleExecuteWorkflow = useCallback(async () => {
      setNodeExecutionStatuses({});

      const sortedNodeIds = sortNodesTopologically(
        nodes.map((node) => ({ id: node.id, type: String(node.type ?? ""), data: node.data })),
        edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
      ).map((node) => node.id);

      if (sortedNodeIds.length > 0) {
        setNodeExecutionStatuses(
          Object.fromEntries(
            sortedNodeIds.map((nodeId) => [nodeId, "executing" as const]),
          ),
        );
      }

      try {
        await setConnectionsMutation.mutateAsync({
          workflowId: workflowid,
          edges: edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle ?? null,
            targetHandle: edge.targetHandle ?? null,
          })),
        });

        const execution = await executeWorkflowMutation.mutateAsync({
          workflowId: workflowid,
        });

        const nextStatuses: Record<string, NodeExecutionStatus> = {};
        for (const result of execution.results) {
          if (result.status === "success" || result.status === "error") {
            nextStatuses[result.nodeId] = result.status;
          }
        }
        setNodeExecutionStatuses(nextStatuses);
      } catch {
        setNodeExecutionStatuses({});
      }
    }, [edges, executeWorkflowMutation, nodes, setConnectionsMutation, workflowid]);
    const onNodeDragStop = useCallback((_event: unknown, node: Node) => {
      const currentNode = nodes.find((item) => item.id === node.id);
      if (!currentNode) {
        return;
      }

      updateNodePositionMutation.mutate({
        workflowId: workflowid,
        nodeId: node.id,
        position: currentNode.position,
      });
    }, [nodes, updateNodePositionMutation, workflowid]);

    const getNodeDefaultData = useCallback((type: Nodetype) => {
      if (isCatalogNodeType(type)) {
        return getCatalogNodeDefaults(type);
      }

      if (type === Nodetype.SCHEDULE) {
        return {
          scheduleType: "cron",
          cronExpression: "0 9 * * 1",
          intervalValue: 5,
          intervalUnit: "minutes",
          timezone: "UTC",
        };
      }

      if (type === Nodetype.IFSWITCH) {
        return {
          mode: "if",
          leftOperand: "input.status",
          operator: "equals",
          rightOperand: "success",
          switchValue: "input.type",
          defaultLabel: "Default",
          cases: [
            { label: "Pending", value: "pending" },
            { label: "Active", value: "active" },
          ],
        };
      }

      if (type === Nodetype.MERGE) {
        return {
          strategy: "wait_all",
          joinField: "user_id",
        };
      }

      return {};
    }, []);

    const openPickerFromToolbar = useCallback(() => {
      setReplaceNodeId(null);
      setPickerOpen(true);
    }, []);

    const openPickerFromInitial = useCallback((nodeId: string) => {
      setReplaceNodeId(nodeId);
      setPickerOpen(true);
    }, []);

    const handleDeleteNodes = useCallback(async (nodeIds: string[]) => {
      if (nodeIds.length === 0) {
        return;
      }

      const uniqueNodeIds = Array.from(new Set(nodeIds));
      const uniqueNodeIdsSet = new Set(uniqueNodeIds);
      const previousNodes = nodes;
      const previousEdges = edges;
      const nextNodes = previousNodes.filter(
        (node) => !uniqueNodeIdsSet.has(node.id),
      );
      const nextEdges = previousEdges.filter(
        (edge) =>
          !uniqueNodeIdsSet.has(edge.source) &&
          !uniqueNodeIdsSet.has(edge.target),
      );
      const optimisticInitialNode =
        nextNodes.length === 0
          ? {
              id: `temp-initial-${crypto.randomUUID()}`,
              type: Nodetype.INITIAL,
              position: { x: 0, y: 0 },
              data: {},
            }
          : null;

      setNodes(optimisticInitialNode ? [optimisticInitialNode] : nextNodes);
      setEdges(nextEdges);
      persistEdges(nextEdges);

      try {
        const results = await Promise.all(
          uniqueNodeIds.map((nodeId) =>
            deleteNodeMutation.mutateAsync({
              workflowId: workflowid,
              nodeId,
            }),
          ),
        );

        const initialNodeResult =
          results.find((result) => result.initialNode)?.initialNode ?? null;

        if (initialNodeResult) {
          setNodes([
            {
              id: initialNodeResult.id,
              type: initialNodeResult.type,
              position: initialNodeResult.position,
              data: initialNodeResult.data,
            },
          ]);
          setEdges([]);
          persistEdges([]);
        }
      } catch {
        setNodes(previousNodes);
        setEdges(previousEdges);
        persistEdges(previousEdges);
        return;
      }
    }, [deleteNodeMutation, edges, nodes, persistEdges, workflowid]);

    const handleDeleteNode = useCallback((nodeId: string) => {
      void handleDeleteNodes([nodeId]);
    }, [handleDeleteNodes]);
    const handleUpdateScheduleNode = useCallback((
      nodeId: string,
      payload: {
        scheduleType: "cron" | "interval";
        cronExpression: string;
        intervalValue: number;
        intervalUnit: "minutes" | "hours" | "days";
        timezone: string;
      },
    ) => {
      updateNodeMutation.mutate(
        {
          workflowId: workflowid,
          nodeId,
          type: Nodetype.SCHEDULE,
          data: payload,
        },
        {
          onSuccess: (updatedNode) => {
            setNodes((current) =>
              current.map((node) => {
                if (node.id !== nodeId) {
                  return node;
                }

                return {
                  ...node,
                  type: updatedNode.type,
                  data: updatedNode.data,
                };
              }),
            );
          },
        },
      );
    }, [updateNodeMutation, workflowid]);
    const handleUpdateIfSwitchNode = useCallback((
      nodeId: string,
      payload: {
        mode: "if" | "switch";
        leftOperand: string;
        operator: string;
        rightOperand: string;
        switchValue: string;
        defaultLabel: string;
        cases: Array<{ label: string; value: string }>;
      },
    ) => {
      updateNodeMutation.mutate(
        {
          workflowId: workflowid,
          nodeId,
          type: Nodetype.IFSWITCH,
          data: payload,
        },
        {
          onSuccess: (updatedNode) => {
            setNodes((current) =>
              current.map((node) => {
                if (node.id !== nodeId) {
                  return node;
                }

                return {
                  ...node,
                  type: updatedNode.type,
                  data: updatedNode.data,
                };
              }),
            );
          },
        },
      );
    }, [updateNodeMutation, workflowid]);
    const handleUpdateMergeNode = useCallback((
      nodeId: string,
      payload: {
        strategy: "wait_all" | "wait_any" | "by_index" | "by_key" | "append";
        joinField: string;
      },
    ) => {
      updateNodeMutation.mutate(
        {
          workflowId: workflowid,
          nodeId,
          type: Nodetype.MERGE,
          data: payload,
        },
        {
          onSuccess: (updatedNode) => {
            setNodes((current) =>
              current.map((node) => {
                if (node.id !== nodeId) {
                  return node;
                }

                return {
                  ...node,
                  type: updatedNode.type,
                  data: updatedNode.data,
                };
              }),
            );
          },
        },
      );
    }, [updateNodeMutation, workflowid]);
    const handleUpdateCatalogNode = useCallback((
      nodeId: string,
      type: Nodetype,
      payload: Record<string, unknown>,
    ) => {
      updateNodeMutation.mutate(
        {
          workflowId: workflowid,
          nodeId,
          type,
          data: payload,
        },
        {
          onSuccess: (updatedNode) => {
            setNodes((current) =>
              current.map((node) => {
                if (node.id !== nodeId) {
                  return node;
                }

                return {
                  ...node,
                  type: updatedNode.type,
                  data: updatedNode.data,
                };
              }),
            );
          },
        },
      );
    }, [updateNodeMutation, workflowid]);

    const handleSelectNode = useCallback((type: Nodetype) => {
      const nodeData = getNodeDefaultData(type);
      const singleInitialNodeId =
        nodes.length === 1 && nodes[0]?.type === Nodetype.INITIAL
          ? nodes[0].id
          : null;
      const targetNodeId = replaceNodeId ?? singleInitialNodeId;

      if (targetNodeId) {
        const previousNodes = nodes;
        setNodes((current) =>
          current.map((node) => {
            if (node.id !== targetNodeId) {
              return node;
            }

            return {
              ...node,
              type,
              data: nodeData,
            };
          }),
        );

        updateNodeMutation.mutate(
          {
            workflowId: workflowid,
            nodeId: targetNodeId,
            type,
            data: nodeData,
          },
          {
            onSuccess: (updatedNode) => {
              setNodes((current) =>
                current.map((node) => {
                  if (node.id !== targetNodeId) {
                    return node;
                  }

                  return {
                    ...node,
                    type: updatedNode.type,
                    data: updatedNode.data,
                  };
                }),
              );
            },
            onError: () => {
              setNodes(previousNodes);
            },
          },
        );
      } else {
        const nextPosition = findAvailablePosition(nodes);
        const tempNodeId = `temp-${crypto.randomUUID()}`;

        setNodes((current) => [
          ...current,
          {
            id: tempNodeId,
            type,
            position: nextPosition,
            data: nodeData,
          },
        ]);

        addNodeMutation.mutate(
          {
            workflowId: workflowid,
            type,
            position: nextPosition,
            data: nodeData,
          },
          {
            onSuccess: (createdNode) => {
              setNodes((current) => [
                ...current.filter((node) => node.id !== tempNodeId),
                {
                  id: createdNode.id,
                  type: createdNode.type,
                  position: createdNode.position,
                  data: createdNode.data,
                },
              ]);
            },
            onError: () => {
              setNodes((current) =>
                current.filter((node) => node.id !== tempNodeId),
              );
            },
          },
        );
      }

      setPickerOpen(false);
      setReplaceNodeId(null);
    }, [addNodeMutation, getNodeDefaultData, nodes, replaceNodeId, updateNodeMutation, workflowid]);

    const flowNodes = nodes.map((node) => {
      if (node.type !== Nodetype.INITIAL) {
        return node;
      }

      return {
        ...node,
        data: {
          ...(node.data as Record<string, unknown>),
          onOpenPicker: openPickerFromInitial,
          onDeleteNode: handleDeleteNode,
          executionStatus: nodeExecutionStatuses[node.id],
        },
      };
    }).map((node) => {
      if (node.type === Nodetype.INITIAL) {
        return node;
      }

      return {
        ...node,
        data: {
          ...(node.data as Record<string, unknown>),
          onDeleteNode: handleDeleteNode,
          onUpdateScheduleNode: handleUpdateScheduleNode,
          onUpdateIfSwitchNode: handleUpdateIfSwitchNode,
          onUpdateMergeNode: handleUpdateMergeNode,
          onUpdateCatalogNode: handleUpdateCatalogNode,
          executionStatus: nodeExecutionStatuses[node.id],
        },
      };
    });

    const flowEdges = edges.map((edge) => ({
      ...edge,
      type: "deletable",
      data: {
        ...(edge.data as Record<string, unknown>),
        onDeleteEdge: handleDeleteEdge,
      },
    }));
    const selectedNodeIds = nodes
      .filter((node) => node.selected)
      .map((node) => node.id);
    const hasManualTriggerNode = nodes.some(
      (node) =>
        node.type === Nodetype.MANUALLTRIGGER ||
        node.type === Nodetype.EXECUTION ||
        node.type === Nodetype.SCHEDULE ||
        node.type === "MANUALLTRIGGER" ||
        node.type === "EXECUTION" ||
        node.type === "SCHEDULE",
    );
    

    return(
    <div className="relative size-full overflow-hidden">
      <ReactFlow
        key={workflowid}
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        edgesReconnectable
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: "deletable" }}
        nodeTypes={NodeComponents}
        fitView

        proOptions={{
            hideAttribution:true
        }}
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background/>
        <Controls/>
        <MiniMap/>
        <Panel position="top-right" >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                void handleDeleteNodes(selectedNodeIds);
              }}
              disabled={selectedNodeIds.length === 0}
              aria-label="Delete selected nodes"
            >
              <TrashIcon size={16} />
            </button>
            <AddnodeButton onClick={openPickerFromToolbar}/>
          </div>
        </Panel>
        {hasManualTriggerNode && (
          <Panel position="bottom-center">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => {
                void handleExecuteWorkflow();
              }}
              disabled={executeWorkflowMutation.isPending || setConnectionsMutation.isPending}
            >
              <PlayIcon size={16} />
              {executeWorkflowMutation.isPending ? "Executing..." : "Execute Workflow"}
            </button>
          </Panel>
        )}

      </ReactFlow>
      <NodePickerSidebar
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setReplaceNodeId(null);
        }}
        onSelect={handleSelectNode}
      />
    </div>
    )
}

export const EditorLoading = ()=>{
    return(
        <Loadingentity message="Loading Editor"/>
    )
}

export const EditorError = ()=>{
    return(
        <Errorentity message="Casused an error while loading the editor.." />
    )
}
