export type NodeExecutionStatus = "executing" | "success" | "error";

export const getNodeExecutionClassName = (
  status?: NodeExecutionStatus,
) => {
  if (status === "executing") {
    return "node-executing-border border-sky-300 shadow-[0_0_0_2px_rgba(125,211,252,0.35)]";
  }

  if (status === "success") {
    return "border-emerald-300 shadow-[0_0_0_2px_rgba(134,239,172,0.45)]";
  }

  if (status === "error") {
    return "border-rose-300 shadow-[0_0_0_2px_rgba(252,165,165,0.45)]";
  }

  return "";
};
