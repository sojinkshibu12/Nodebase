
'use client'
import {
  useAddWorkflowNode,
  useDeleteWorkflowNode,
  useoneSuspenceWorkflow,
  useUpdateWorkflowNode,
} from "@/app/functionalities/workflows/servers/hooks/use-workflow"
import { Errorentity, Loadingentity } from "../entity-component"
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, NodeChange, EdgeChange, Connection, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeComponents } from "@/config/node-components";
import { AddnodeButton } from "./addbutton";
import { Nodetype } from "@/generated/prisma/enums";
import { NodePickerSidebar } from "./node-picker-sidebar";




interface Editorcontentprops{
    workflowid:string
}

const NODE_SIZE = 80;
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


export const Editorcontent = ({workflowid}:Editorcontentprops)=>{
    const {data} = useoneSuspenceWorkflow(workflowid)
    const addNodeMutation = useAddWorkflowNode();
    const updateNodeMutation = useUpdateWorkflowNode();
    const deleteNodeMutation = useDeleteWorkflowNode();

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
    const onEdgesChange = useCallback(
        (changes:EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params:Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    const getNodeDefaultData = useCallback((type: Nodetype) => {
      if (type === Nodetype.HTTPREQUEST) {
        return { method: "GET", url: "https://api.example.com" };
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

    const handleDeleteNode = useCallback((nodeId: string) => {
      deleteNodeMutation.mutate(
        {
          workflowId: workflowid,
          nodeId,
        },
        {
          onSuccess: (result) => {
            if (result.initialNode) {
              setNodes([
                {
                  id: result.initialNode.id,
                  type: result.initialNode.type,
                  position: result.initialNode.position,
                  data: result.initialNode.data,
                },
              ]);
              setEdges([]);
              return;
            }

            setNodes((current) => current.filter((node) => node.id !== nodeId));
            setEdges((current) =>
              current.filter(
                (edge) => edge.source !== nodeId && edge.target !== nodeId,
              ),
            );
          },
        },
      );
    }, [deleteNodeMutation, workflowid]);

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
        },
      };
    });
    

    return(
    <div className="relative size-full overflow-hidden">
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NodeComponents}
        fitView
        proOptions={{
            hideAttribution:true
        }}
      >
        <Background/>
        <Controls/>
        <MiniMap/>
        <Panel position="top-right" >
            <AddnodeButton onClick={openPickerFromToolbar}/>
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
