"use strict";

const axios = require("axios");

const OPERATOR_BASE_URL = process.env.OPERATOR_BASE_URL || "http://localhost:5050";
const SERVER_NAME = "shadow-operator-mcp";
const SERVER_VERSION = "1.0.0";

function writeResponse(id, result) {
  const payload = JSON.stringify({ jsonrpc: "2.0", id, result });
  const bytes = Buffer.byteLength(payload, "utf8");
  process.stdout.write(`Content-Length: ${bytes}\r\n\r\n${payload}`);
}

function writeError(id, code, message, data = null) {
  const payload = JSON.stringify({
    jsonrpc: "2.0",
    id,
    error: { code, message, data },
  });
  const bytes = Buffer.byteLength(payload, "utf8");
  process.stdout.write(`Content-Length: ${bytes}\r\n\r\n${payload}`);
}

async function callOperator(method, path, body) {
  const url = `${OPERATOR_BASE_URL}${path}`;
  const resp = await axios({
    method,
    url,
    data: body,
    timeout: 45000,
    validateStatus: () => true,
  });
  return {
    ok: resp.status >= 200 && resp.status < 300,
    status: resp.status,
    data: resp.data,
    url,
  };
}

function toolDefinitions() {
  return [
    {
      name: "create_content_job",
      description: "Create a new content job via Shadow Operator Core (WF-001 then WF-010).",
      inputSchema: {
        type: "object",
        properties: {
          topic: { type: "string" },
          context: { type: "string" },
          mode: { type: "string", enum: ["founder", "creator", "builder", "operator"] },
          route_id: { type: "string" },
        },
        required: ["topic"],
      },
    },
    {
      name: "inspect_dossier",
      description: "Inspect one dossier state and details.",
      inputSchema: {
        type: "object",
        properties: { dossier_id: { type: "string" } },
        required: ["dossier_id"],
      },
    },
    {
      name: "list_outputs",
      description: "List grouped outputs for a dossier.",
      inputSchema: {
        type: "object",
        properties: { dossier_id: { type: "string" } },
        required: ["dossier_id"],
      },
    },
    {
      name: "approve_output",
      description: "Approve a dossier output via WF-020.",
      inputSchema: {
        type: "object",
        properties: {
          dossier_id: { type: "string" },
          reviewer: { type: "string" },
          reason: { type: "string" },
        },
        required: ["dossier_id"],
      },
    },
    {
      name: "request_changes",
      description: "Request changes/remodify for a dossier via WF-021.",
      inputSchema: {
        type: "object",
        properties: {
          dossier_id: { type: "string" },
          instructions: { type: "string" },
          target_workflow: { type: "string" },
        },
        required: ["dossier_id", "instructions"],
      },
    },
    {
      name: "replay_stage",
      description: "Replay a workflow stage for a dossier via WF-021.",
      inputSchema: {
        type: "object",
        properties: {
          dossier_id: { type: "string" },
          target_workflow: { type: "string" },
          checkpoint: { type: "string" },
        },
        required: ["dossier_id"],
      },
    },
    {
      name: "check_errors",
      description: "Read current operator error queue.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "health_check",
      description: "Check operator and n8n health via Operator API.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "set_mode",
      description: "Set active operator mode.",
      inputSchema: {
        type: "object",
        properties: { mode: { type: "string" } },
        required: ["mode"],
      },
    },
    {
      name: "enable_operational_mode",
      description: "Enable one operational overlay mode.",
      inputSchema: {
        type: "object",
        properties: {
          mode_id: { type: "string" },
          actor_mode: { type: "string" },
        },
        required: ["mode_id"],
      },
    },
    {
      name: "disable_operational_mode",
      description: "Disable one operational overlay mode.",
      inputSchema: {
        type: "object",
        properties: { mode_id: { type: "string" } },
        required: ["mode_id"],
      },
    },
  ];
}

async function runTool(name, args = {}) {
  switch (name) {
    case "create_content_job":
      return callOperator("post", "/operator/new-content-job", {
        topic: args.topic,
        context: args.context || "YouTube video",
        mode: args.mode || "creator",
        route_id: args.route_id || "ROUTE_PHASE1_STANDARD",
      });
    case "inspect_dossier":
      return callOperator("get", `/operator/dossier/${encodeURIComponent(args.dossier_id)}`);
    case "list_outputs":
      return callOperator("get", `/operator/outputs/${encodeURIComponent(args.dossier_id)}`);
    case "approve_output":
      return callOperator("post", `/operator/approve/${encodeURIComponent(args.dossier_id)}`, {
        reviewer: args.reviewer || "operator",
        reason: args.reason || "Approved via MCP",
      });
    case "request_changes":
      return callOperator("post", `/operator/remodify/${encodeURIComponent(args.dossier_id)}`, {
        instructions: args.instructions,
        target_workflow: args.target_workflow || "WF-200",
      });
    case "replay_stage":
      return callOperator("post", `/operator/replay/${encodeURIComponent(args.dossier_id)}`, {
        stage: args.target_workflow || "WF-200",
        checkpoint: args.checkpoint || "latest",
      });
    case "check_errors":
      return callOperator("get", "/operator/errors");
    case "health_check":
      return callOperator("get", "/operator/health");
    case "set_mode":
      return callOperator("post", "/operator/modes/set", {
        mode: args.mode,
      });
    case "enable_operational_mode":
      return callOperator(
        "post",
        `/operator/modes/operational/${encodeURIComponent(args.mode_id)}/enable`,
        { actor_mode: args.actor_mode || "founder" }
      );
    case "disable_operational_mode":
      return callOperator("post", `/operator/modes/operational/${encodeURIComponent(args.mode_id)}/disable`, {});
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function handleMessage(msg) {
  const { id, method, params } = msg || {};
  try {
    if (method === "initialize") {
      return writeResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        },
      });
    }

    if (method === "tools/list") {
      return writeResponse(id, { tools: toolDefinitions() });
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const args = params?.arguments || {};
      const result = await runTool(toolName, args);
      return writeResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
        isError: !result.ok,
      });
    }

    if (method === "notifications/initialized") {
      return;
    }

    return writeError(id ?? null, -32601, `Method not found: ${method}`);
  } catch (err) {
    return writeError(id ?? null, -32000, err.message);
  }
}

let inputBuffer = Buffer.alloc(0);
let contentLength = null;

function consume() {
  while (true) {
    if (contentLength === null) {
      const headerEnd = inputBuffer.indexOf("\r\n\r\n");
      if (headerEnd === -1) return;
      const headerText = inputBuffer.slice(0, headerEnd).toString("utf8");
      const headers = headerText.split("\r\n");
      const cl = headers.find((h) => h.toLowerCase().startsWith("content-length:"));
      if (!cl) {
        process.stderr.write("[mcp] missing Content-Length header\n");
        inputBuffer = inputBuffer.slice(headerEnd + 4);
        continue;
      }
      contentLength = Number(cl.split(":")[1].trim());
      inputBuffer = inputBuffer.slice(headerEnd + 4);
    }

    if (inputBuffer.length < contentLength) return;
    const body = inputBuffer.slice(0, contentLength).toString("utf8");
    inputBuffer = inputBuffer.slice(contentLength);
    contentLength = null;
    let msg;
    try {
      msg = JSON.parse(body);
    } catch (err) {
      process.stderr.write(`[mcp] invalid json: ${err.message}\n`);
      continue;
    }
    handleMessage(msg);
  }
}

process.stdin.on("data", (chunk) => {
  inputBuffer = Buffer.concat([inputBuffer, chunk]);
  consume();
});

process.stderr.write(`[mcp] ${SERVER_NAME} listening (operator=${OPERATOR_BASE_URL})\n`);
