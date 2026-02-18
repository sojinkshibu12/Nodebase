"use client";

import { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";
import { Trash2Icon } from "lucide-react";

type DeletableEdgeData = {
  onDeleteEdge?: (edgeId: string) => void;
};

export const DeletableEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    style,
    data,
    selected,
  } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const edgeData = (data ?? {}) as DeletableEdgeData;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {selected ? (
        <EdgeLabelRenderer>
          <button
            type="button"
            className="nodrag nopan absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background p-1 text-muted-foreground shadow-sm hover:text-destructive"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              edgeData.onDeleteEdge?.(id);
            }}
            aria-label="Delete edge"
          >
            <Trash2Icon className="size-3.5" />
          </button>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
});

DeletableEdge.displayName = "DeletableEdge";
