import toposort from "toposort";

export interface SortableConnection {
  source: string;
  target: string;
}

const MANUAL_TRIGGER_TYPES = new Set(["EXECUTION", "MANUALLTRIGGER", "SCHEDULE"]);

const isManualTriggerNode = (node: unknown) => {
  if (!node || typeof node !== "object") {
    return false;
  }

  const candidate = node as { type?: unknown; name?: unknown };
  const type = typeof candidate.type === "string" ? candidate.type : undefined;
  const name = typeof candidate.name === "string" ? candidate.name : undefined;

  return (
    (type ? MANUAL_TRIGGER_TYPES.has(type) : false) ||
    (name ? MANUAL_TRIGGER_TYPES.has(name) : false)
  );
};

type ToposortArray = typeof toposort.array;
type ToposortNodeId = Parameters<ToposortArray>[0][number];
type ToposortEdge = Parameters<ToposortArray>[1][number];

export const sortNodesTopologically = <T extends { id: string }>(
  nodes: T[],
  connections: SortableConnection[],
) => {
  if (nodes.length < 2) {
    return nodes;
  }

  const nodeIds = nodes.map((node) => node.id);
  const nodeIdsSet = new Set(nodeIds);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  const edges = connections
    .filter(
      (connection) =>
        connection.source !== connection.target &&
        nodeIdsSet.has(connection.source) &&
        nodeIdsSet.has(connection.target),
    )
    .map(
      (connection) =>
        // toposort expects directed edges as [from, to].
        [connection.source, connection.target] as ToposortEdge,
    );

  try {
    const sortedIds = toposort.array(
      nodeIds as ToposortNodeId[],
      edges,
    ) as string[];

    const startNodeIds = nodes
      .filter((node) => isManualTriggerNode(node))
      .map((node) => node.id);

    if (startNodeIds.length === 0) {
      return sortedIds
        .map((id) => nodeById.get(id))
        .filter((node): node is T => Boolean(node));
    }

    const adjacency = new Map<string, string[]>();
    for (const connection of connections) {
      if (!nodeIdsSet.has(connection.source) || !nodeIdsSet.has(connection.target)) {
        continue;
      }
      const targets = adjacency.get(connection.source) ?? [];
      targets.push(connection.target);
      adjacency.set(connection.source, targets);
    }

    const reachableFromExecution = new Set<string>();
    const queue = [...startNodeIds];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || reachableFromExecution.has(current)) {
        continue;
      }
      reachableFromExecution.add(current);
      const targets = adjacency.get(current) ?? [];
      for (const target of targets) {
        if (!reachableFromExecution.has(target)) {
          queue.push(target);
        }
      }
    }

    const orderedReachableIds = sortedIds.filter((id) =>
      reachableFromExecution.has(id),
    );
    const orderedRemainingIds = sortedIds.filter(
      (id) => !reachableFromExecution.has(id),
    );
    const finalIds = [...orderedReachableIds, ...orderedRemainingIds];

    return finalIds
      .map((id) => nodeById.get(id))
      .filter((node): node is T => Boolean(node));
  } catch {
    return nodes;
  }
};
