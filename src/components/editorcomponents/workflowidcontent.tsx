
'use client'
import {
  useAddWorkflowNode,
  useDeleteWorkflowNode,
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
import { TrashIcon } from "lucide-react";




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

    const [nodes, setNodes] = useState<Node[]>(data.nodes);
    const [edges, setEdges] = useState<Edge[]>(data.edges as Edge[]);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [replaceNodeId, setReplaceNodeId] = useState<string | null>(null);
 
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
      if (type === Nodetype.HTTPREQUEST) {
        return {
          method: "GET",
          url: "https://api.example.com",
          body: '{\n  "example": "value"\n}',
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
      let initialNodeResult: {
        id: string;
        type: Nodetype;
        position: { x: number; y: number };
        data: Record<string, unknown>;
      } | null = null;

      try {
        for (const nodeId of uniqueNodeIds) {
          const result = await deleteNodeMutation.mutateAsync({
            workflowId: workflowid,
            nodeId,
          });

          if (result.initialNode) {
            initialNodeResult = result.initialNode;
            break;
          }
        }
      } catch {
        return;
      }

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
        return;
      }

      setNodes((current) =>
        current.filter((node) => !uniqueNodeIdsSet.has(node.id)),
      );
      setEdges((current) => {
        const nextEdges = current.filter(
          (edge) =>
            !uniqueNodeIdsSet.has(edge.source) &&
            !uniqueNodeIdsSet.has(edge.target),
        );
        persistEdges(nextEdges);
        return nextEdges;
      });
    }, [deleteNodeMutation, persistEdges, workflowid]);

    const handleDeleteNode = useCallback((nodeId: string) => {
      void handleDeleteNodes([nodeId]);
    }, [handleDeleteNodes]);
    const handleUpdateHttpRequestNode = useCallback((
      nodeId: string,
      payload: { method: string; url: string; body?: string },
    ) => {
      updateNodeMutation.mutate(
        {
          workflowId: workflowid,
          nodeId,
          type: Nodetype.HTTPREQUEST,
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
          },
        );
      } else {
        const nextPosition = findAvailablePosition(nodes);

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
                ...current,
                {
                  id: createdNode.id,
                  type: createdNode.type,
                  position: createdNode.position,
                  data: createdNode.data,
                },
              ]);
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
          onUpdateHttpRequestNode: handleUpdateHttpRequestNode,
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
