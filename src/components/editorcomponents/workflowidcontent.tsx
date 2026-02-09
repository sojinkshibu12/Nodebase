
'use client'
import { useoneSuspenceWorkflow } from "@/app/functionalities/workflows/servers/hooks/use-workflow"
import { Errorentity, Loadingentity } from "../entity-component"
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, NodeChange, EdgeChange, Connection, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeComponents } from "@/config/node-components";




interface Editorcontentprops{
    workflowid:string
}


export const Editorcontent = ({workflowid}:Editorcontentprops)=>{
    const {data} = useoneSuspenceWorkflow(workflowid)

    const [nodes, setNodes] = useState<Node[]>(data.nodes);
    const [edges, setEdges] = useState<Edge[]>(data.edges as Edge[]);
 
    const onNodesChange = useCallback(
        (changes:NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
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
    

    return(
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
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
      </ReactFlow>
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