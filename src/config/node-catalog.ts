import { Nodetype } from "@/generated/prisma/enums";

export type CatalogNodeType =
  | typeof Nodetype.HTTPREQUEST
  | typeof Nodetype.SET
  | typeof Nodetype.CODE
  | typeof Nodetype.FILTER
  | typeof Nodetype.SORT
  | typeof Nodetype.LIMIT
  | typeof Nodetype.SUMMARIZE
  | typeof Nodetype.RENAMEKEYS
  | typeof Nodetype.REMOVEDUPES
  | typeof Nodetype.CONVERT
  | typeof Nodetype.FLATTEN
  | typeof Nodetype.GRAPHQL
  | typeof Nodetype.WEBSOCKET
  | typeof Nodetype.RESPONDTOWEBHOOK
  | typeof Nodetype.EMAILSEND
  | typeof Nodetype.EMAILREAD
  | typeof Nodetype.SLACK
  | typeof Nodetype.KAFKA
  | typeof Nodetype.RABBITMQ
  | typeof Nodetype.TELEGRAM
  | typeof Nodetype.DISCORD
  | typeof Nodetype.SMSWHATSAPP
  | typeof Nodetype.POSTGRESQL
  | typeof Nodetype.MYSQL
  | typeof Nodetype.MONGODB
  | typeof Nodetype.REDIS
  | typeof Nodetype.ELASTICSEARCH
  | typeof Nodetype.S3OBJECTSTORE
  | typeof Nodetype.GOOGLESHEETS
  | typeof Nodetype.AIRTABLE
  | typeof Nodetype.READFILE
  | typeof Nodetype.WRITEFILE
  | typeof Nodetype.SPREADSHEET
  | typeof Nodetype.COMPRESSEXTRACT
  | typeof Nodetype.PDFEXTRACT
  | typeof Nodetype.HTMLEXTRACT
  | typeof Nodetype.XMLPARSE
  | typeof Nodetype.FTPSFTP
  | typeof Nodetype.LLMCHAT
  | typeof Nodetype.EMBEDDINGS
  | typeof Nodetype.VECTORSTORE
  | typeof Nodetype.AIAGENT
  | typeof Nodetype.TEXTCLASSIFIER
  | typeof Nodetype.IMAGEGEN
  | typeof Nodetype.STTTTS
  | typeof Nodetype.MEMORYCONTEXT
  | typeof Nodetype.EXECUTECMD
  | typeof Nodetype.SSH
  | typeof Nodetype.CRYPTO
  | typeof Nodetype.DATETIME
  | typeof Nodetype.ERRORTRIGGER
  | typeof Nodetype.DEBUGLOG
  | typeof Nodetype.NOTIFICATION
  | typeof Nodetype.CUSTOMNODE;

export type CatalogField =
  | {
      key: string;
      label: string;
      type: "text" | "number";
      placeholder?: string;
    }
  | {
      key: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      rows?: number;
    }
  | {
      key: string;
      label: string;
      type: "select";
      options: Array<{ label: string; value: string }>;
    };

export type CatalogNodeDefinition = {
  type: CatalogNodeType;
  category: string;
  title: string;
  subtitle: string;
  badge: string;
  pickerDescription: string;
  description: string;
  useCase: string;
  bullets: string[];
  defaults: Record<string, unknown>;
  fields: CatalogField[];
  getSummary: (data: Record<string, unknown>) => string;
};

export type NodePickerOption = {
  type: Nodetype;
  category: string;
  title: string;
  description: string;
};

const selectField = (
  key: string,
  label: string,
  options: Array<{ label: string; value: string }>,
): CatalogField => ({
  key,
  label,
  type: "select",
  options,
});

const textField = (
  key: string,
  label: string,
  placeholder?: string,
): CatalogField => ({
  key,
  label,
  type: "text",
  placeholder,
});

const numberField = (
  key: string,
  label: string,
  placeholder?: string,
): CatalogField => ({
  key,
  label,
  type: "number",
  placeholder,
});

const textareaField = (
  key: string,
  label: string,
  placeholder?: string,
  rows = 5,
): CatalogField => ({
  key,
  label,
  type: "textarea",
  placeholder,
  rows,
});

export const CATALOG_NODE_TYPES = [
  Nodetype.HTTPREQUEST,
  Nodetype.SET,
  Nodetype.CODE,
  Nodetype.FILTER,
  Nodetype.SORT,
  Nodetype.LIMIT,
  Nodetype.SUMMARIZE,
  Nodetype.RENAMEKEYS,
  Nodetype.REMOVEDUPES,
  Nodetype.CONVERT,
  Nodetype.FLATTEN,
  Nodetype.GRAPHQL,
  Nodetype.WEBSOCKET,
  Nodetype.RESPONDTOWEBHOOK,
  Nodetype.EMAILSEND,
  Nodetype.EMAILREAD,
  Nodetype.SLACK,
  Nodetype.KAFKA,
  Nodetype.RABBITMQ,
  Nodetype.TELEGRAM,
  Nodetype.DISCORD,
  Nodetype.SMSWHATSAPP,
  Nodetype.POSTGRESQL,
  Nodetype.MYSQL,
  Nodetype.MONGODB,
  Nodetype.REDIS,
  Nodetype.ELASTICSEARCH,
  Nodetype.S3OBJECTSTORE,
  Nodetype.GOOGLESHEETS,
  Nodetype.AIRTABLE,
  Nodetype.READFILE,
  Nodetype.WRITEFILE,
  Nodetype.SPREADSHEET,
  Nodetype.COMPRESSEXTRACT,
  Nodetype.PDFEXTRACT,
  Nodetype.HTMLEXTRACT,
  Nodetype.XMLPARSE,
  Nodetype.FTPSFTP,
  Nodetype.LLMCHAT,
  Nodetype.EMBEDDINGS,
  Nodetype.VECTORSTORE,
  Nodetype.AIAGENT,
  Nodetype.TEXTCLASSIFIER,
  Nodetype.IMAGEGEN,
  Nodetype.STTTTS,
  Nodetype.MEMORYCONTEXT,
  Nodetype.EXECUTECMD,
  Nodetype.SSH,
  Nodetype.CRYPTO,
  Nodetype.DATETIME,
  Nodetype.ERRORTRIGGER,
  Nodetype.DEBUGLOG,
  Nodetype.NOTIFICATION,
  Nodetype.CUSTOMNODE,
] as const satisfies readonly CatalogNodeType[];

const CATALOG_NODE_TYPE_SET = new Set<CatalogNodeType>(CATALOG_NODE_TYPES);

export const isCatalogNodeType = (type: Nodetype): type is CatalogNodeType =>
  CATALOG_NODE_TYPE_SET.has(type as CatalogNodeType);

export const NODE_CATALOG_DEFINITIONS: Record<CatalogNodeType, CatalogNodeDefinition> = {
  [Nodetype.HTTPREQUEST]: {
    type: Nodetype.HTTPREQUEST,
    category: "HTTP / Network",
    title: "HTTP Request",
    subtitle: "REST / GET / POST",
    badge: "HTTP",
    pickerDescription: "Outbound HTTP calls to external APIs and services.",
    description:
      "The most fundamental network node. It makes outbound HTTP calls to any external API or service.",
    useCase:
      "Call Spring Boot microservice endpoints, fetch job listings from external APIs, or trigger FFmpeg processing via REST.",
    bullets: [
      "Supports GET, POST, PUT, PATCH, and DELETE",
      "Configure headers, query params, request body, redirects, and timeouts",
      "Handle auth such as Bearer token, Basic auth, API key, or OAuth2",
      "Parse JSON, XML, and form-data style responses",
    ],
    defaults: {
      method: "GET",
      url: "https://api.example.com/jobs",
      authType: "none",
      headers: '{\n  "accept": "application/json"\n}',
      queryParams: '{\n  "page": "1"\n}',
      body: '{\n  "example": true\n}',
      timeoutMs: 10000,
      responseType: "json",
    },
    fields: [
      selectField("method", "Method", [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
        { label: "PATCH", value: "PATCH" },
        { label: "DELETE", value: "DELETE" },
      ]),
      textField("url", "Endpoint URL", "https://api.example.com/resource"),
      selectField("authType", "Auth", [
        { label: "None", value: "none" },
        { label: "Bearer token", value: "bearer" },
        { label: "Basic auth", value: "basic" },
        { label: "API key", value: "apikey" },
        { label: "OAuth2", value: "oauth2" },
      ]),
      textareaField("headers", "Headers", '{\n  "authorization": "Bearer {{token}}"\n}'),
      textareaField("queryParams", "Query params", '{\n  "page": "1"\n}'),
      textareaField("body", "Request body", '{\n  "example": true\n}', 6),
      numberField("timeoutMs", "Timeout (ms)", "10000"),
      selectField("responseType", "Response type", [
        { label: "JSON", value: "json" },
        { label: "XML", value: "xml" },
        { label: "Form data", value: "form-data" },
        { label: "Text", value: "text" },
      ]),
    ],
    getSummary: (data) => `${String(data.method ?? "GET")} ${String(data.url ?? "")}`.trim(),
  },
  [Nodetype.SET]: {
    type: Nodetype.SET,
    category: "Data Transformation",
    title: "Set",
    subtitle: "Map / assign fields",
    badge: "SET",
    pickerDescription: "Map, create, and overwrite fields on each item.",
    description:
      "Maps, creates, or overwrites fields on the data object passing through the workflow.",
    useCase:
      "After an HTTP response, extract only the fields you need and shape them before inserting into PostgreSQL.",
    bullets: [
      "Add new fields to an item",
      "Overwrite existing field values",
      "Rename or restructure the data shape before passing downstream",
      "Set static values or dynamic expressions",
    ],
    defaults: {
      mappingMode: "merge",
      assignments: "user.fullName = firstName + ' ' + lastName\nuser.status = 'active'",
    },
    fields: [
      selectField("mappingMode", "Mode", [
        { label: "Merge fields", value: "merge" },
        { label: "Overwrite target", value: "overwrite" },
        { label: "Restructure object", value: "restructure" },
      ]),
      textareaField("assignments", "Assignments", "user.fullName = firstName + ' ' + lastName"),
    ],
    getSummary: (data) => String(data.mappingMode ?? "merge"),
  },
  [Nodetype.CODE]: {
    type: Nodetype.CODE,
    category: "Data Transformation",
    title: "Code",
    subtitle: "JS / Python",
    badge: "CODE",
    pickerDescription: "Run custom JavaScript or Python logic.",
    description:
      "Write and execute custom logic directly inside the node using JavaScript or Python.",
    useCase:
      "Complex business logic like calculating ATS scores, parsing resumes, or custom Kafka message formatting.",
    bullets: [
      "Full scripting power with loops, conditionals, regex, and math",
      "Transform data in ways no built-in node can",
      "Access all incoming items and return modified items",
      "Import standard libraries",
    ],
    defaults: {
      language: "javascript",
      code: "return items.map((item) => ({ ...item, score: 100 }));",
    },
    fields: [
      selectField("language", "Language", [
        { label: "JavaScript", value: "javascript" },
        { label: "Python", value: "python" },
      ]),
      textareaField("code", "Script", "return items;", 8),
    ],
    getSummary: (data) => String(data.language ?? "javascript"),
  },
  [Nodetype.FILTER]: {
    type: Nodetype.FILTER,
    category: "Data Transformation",
    title: "Filter",
    subtitle: "Keep matching items",
    badge: "FLT",
    pickerDescription: "Keep only items that match a condition.",
    description:
      "Evaluates each item against a condition and only passes items that match.",
    useCase:
      "From a Kafka consumer receiving all video events, filter only VIDEO_UPLOADED events.",
    bullets: [
      "Drop items that do not meet criteria",
      "Supports equals, contains, greater than, and regex checks",
      "Acts like a WHERE clause in SQL or .filter() in Java streams",
    ],
    defaults: {
      field: "eventType",
      operator: "equals",
      value: "VIDEO_UPLOADED",
    },
    fields: [
      textField("field", "Field", "eventType"),
      selectField("operator", "Operator", [
        { label: "Equals", value: "equals" },
        { label: "Contains", value: "contains" },
        { label: "Greater than", value: "greater_than" },
        { label: "Regex", value: "regex" },
      ]),
      textField("value", "Value", "VIDEO_UPLOADED"),
    ],
    getSummary: (data) =>
      `${String(data.field ?? "field")} ${String(data.operator ?? "equals")}`,
  },
  [Nodetype.SORT]: {
    type: Nodetype.SORT,
    category: "Data Transformation",
    title: "Sort",
    subtitle: "Order items",
    badge: "SORT",
    pickerDescription: "Order items by a field value.",
    description: "Reorders the list of items based on a field value.",
    useCase:
      "Sort job listings by postedAt date before displaying or paginating results.",
    bullets: [
      "Sort ascending or descending",
      "Works on string, number, and date values",
      "Supports multi-field sorting strategies in downstream logic",
    ],
    defaults: {
      field: "postedAt",
      direction: "desc",
      valueType: "date",
    },
    fields: [
      textField("field", "Primary field", "postedAt"),
      selectField("direction", "Direction", [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ]),
      selectField("valueType", "Value type", [
        { label: "String", value: "string" },
        { label: "Number", value: "number" },
        { label: "Date", value: "date" },
      ]),
    ],
    getSummary: (data) =>
      `${String(data.field ?? "field")} ${String(data.direction ?? "asc")}`,
  },
  [Nodetype.LIMIT]: {
    type: Nodetype.LIMIT,
    category: "Data Transformation",
    title: "Limit",
    subtitle: "Slice N items",
    badge: "LIM",
    pickerDescription: "Slice the result set down to N items.",
    description: "Truncates the item list to a maximum number of items.",
    useCase:
      "After fetching search results from Elasticsearch, limit to top 10 before returning to client.",
    bullets: [
      "Keep only the first N items",
      "Pairs well with Sort for top-N queries",
      "Acts like LIMIT in SQL or .limit() in MongoDB",
    ],
    defaults: { count: 10 },
    fields: [numberField("count", "Max items", "10")],
    getSummary: (data) => `Top ${String(data.count ?? 10)}`,
  },
  [Nodetype.SUMMARIZE]: {
    type: Nodetype.SUMMARIZE,
    category: "Data Transformation",
    title: "Summarize",
    subtitle: "Aggregate / group",
    badge: "SUM",
    pickerDescription: "Group and aggregate items.",
    description: "Groups and aggregates items like a GROUP BY in SQL.",
    useCase:
      "Count total video views per user, or sum application counts per job posting.",
    bullets: [
      "Count, sum, average, min, and max across a field",
      "Group items by a specific key",
      "Collapse many items into summary statistics",
    ],
    defaults: {
      groupBy: "userId",
      operation: "count",
      field: "views",
    },
    fields: [
      textField("groupBy", "Group by", "userId"),
      selectField("operation", "Operation", [
        { label: "Count", value: "count" },
        { label: "Sum", value: "sum" },
        { label: "Average", value: "avg" },
        { label: "Min", value: "min" },
        { label: "Max", value: "max" },
      ]),
      textField("field", "Value field", "views"),
    ],
    getSummary: (data) =>
      `${String(data.operation ?? "count")} by ${String(data.groupBy ?? "group")}`,
  },
  [Nodetype.RENAMEKEYS]: {
    type: Nodetype.RENAMEKEYS,
    category: "Data Transformation",
    title: "Rename Keys",
    subtitle: "Field aliasing",
    badge: "KEY",
    pickerDescription: "Alias fields to a new schema.",
    description: "Renames fields on each item without changing their values.",
    useCase:
      "An external API returns jobTitle but your PostgreSQL schema expects job_title before insert.",
    bullets: [
      "Rename keys like userId to user_id",
      "Alias fields to match a target schema",
      "Map API response field names to database column names",
    ],
    defaults: {
      mappings: "jobTitle -> job_title\nuserId -> user_id",
    },
    fields: [textareaField("mappings", "Key mappings", "jobTitle -> job_title")],
    getSummary: () => "Field mapping",
  },
  [Nodetype.REMOVEDUPES]: {
    type: Nodetype.REMOVEDUPES,
    category: "Data Transformation",
    title: "Remove Dupes",
    subtitle: "Deduplicate",
    badge: "DUP",
    pickerDescription: "Deduplicate items by one or more keys.",
    description: "Removes duplicate items from the list based on one or more key fields.",
    useCase:
      "A Kafka topic replays events. Deduplicate by eventId before processing to ensure idempotency.",
    bullets: [
      "Compare items by one or more fields",
      "Keep only the first or last occurrence",
      "Acts like DISTINCT in SQL",
    ],
    defaults: {
      keyFields: "eventId",
      keep: "first",
    },
    fields: [
      textField("keyFields", "Key fields", "eventId"),
      selectField("keep", "Keep", [
        { label: "First occurrence", value: "first" },
        { label: "Last occurrence", value: "last" },
      ]),
    ],
    getSummary: (data) =>
      `${String(data.keyFields ?? "eventId")} · ${String(data.keep ?? "first")}`,
  },
  [Nodetype.CONVERT]: {
    type: Nodetype.CONVERT,
    category: "Data Transformation",
    title: "Convert",
    subtitle: "JSON / CSV / XML",
    badge: "CNV",
    pickerDescription: "Convert JSON, CSV, and XML payloads.",
    description: "Converts data between different serialization formats.",
    useCase:
      "Read a CSV job listing file, convert to JSON, then insert rows into MongoDB.",
    bullets: [
      "Convert between JSON, CSV, and XML",
      "Parse CSV strings into structured items",
      "Serialize items for XML or export flows",
    ],
    defaults: {
      fromFormat: "json",
      toFormat: "csv",
    },
    fields: [
      selectField("fromFormat", "From", [
        { label: "JSON", value: "json" },
        { label: "CSV", value: "csv" },
        { label: "XML", value: "xml" },
      ]),
      selectField("toFormat", "To", [
        { label: "JSON", value: "json" },
        { label: "CSV", value: "csv" },
        { label: "XML", value: "xml" },
      ]),
    ],
    getSummary: (data) =>
      `${String(data.fromFormat ?? "json")} -> ${String(data.toFormat ?? "csv")}`,
  },
  [Nodetype.FLATTEN]: {
    type: Nodetype.FLATTEN,
    category: "Data Transformation",
    title: "Flatten",
    subtitle: "Nested -> flat",
    badge: "FLAT",
    pickerDescription: "Turn nested objects or arrays into flat structures.",
    description:
      "Takes deeply nested objects or arrays and flattens them into a single-level structure.",
    useCase:
      "Flatten Elasticsearch _source payloads before mapping to DTO or entity structures.",
    bullets: [
      "Flatten nested object paths into a single-level shape",
      "Explode nested arrays into individual items",
      "Makes nested API responses easier to process downstream",
    ],
    defaults: {
      mode: "object",
      delimiter: ".",
    },
    fields: [
      selectField("mode", "Flatten mode", [
        { label: "Object keys", value: "object" },
        { label: "Explode arrays", value: "array" },
        { label: "Both", value: "both" },
      ]),
      textField("delimiter", "Path delimiter", "."),
    ],
    getSummary: (data) =>
      `${String(data.mode ?? "object")} · ${String(data.delimiter ?? ".")}`,
  },
  [Nodetype.GRAPHQL]: {
    type: Nodetype.GRAPHQL,
    category: "HTTP / Network",
    title: "GraphQL",
    subtitle: "Query / mutate",
    badge: "GQL",
    pickerDescription: "GraphQL-specific requests with query and mutation support.",
    description:
      "Makes GraphQL-specific requests with proper query or mutation syntax support.",
    useCase:
      "Query the GitHub GraphQL API for repos or interact with a Hasura or Apollo backend.",
    bullets: [
      "Send GraphQL queries and mutations",
      "Pass variables alongside operations",
      "Handle GraphQL error payloads with errors[] in the response body",
      "Can be used for subscription-style implementations depending on backend support",
    ],
    defaults: {
      endpoint: "https://api.github.com/graphql",
      operationType: "query",
      authType: "bearer",
      operation: "query SearchRepos($query: String!) {\n  search(type: REPOSITORY, query: $query, first: 10) {\n    nodes { ... on Repository { name url } }\n  }\n}",
      variables: '{\n  "query": "job board"\n}',
    },
    fields: [
      textField("endpoint", "Endpoint", "https://api.example.com/graphql"),
      selectField("operationType", "Operation type", [
        { label: "Query", value: "query" },
        { label: "Mutation", value: "mutation" },
        { label: "Subscription", value: "subscription" },
      ]),
      selectField("authType", "Auth", [
        { label: "None", value: "none" },
        { label: "Bearer token", value: "bearer" },
        { label: "API key", value: "apikey" },
      ]),
      textareaField("operation", "Operation", "query { viewer { login } }", 8),
      textareaField("variables", "Variables", '{\n  "id": "123"\n}'),
    ],
    getSummary: (data) =>
      `${String(data.operationType ?? "query")} ${String(data.endpoint ?? "")}`.trim(),
  },
  [Nodetype.WEBSOCKET]: {
    type: Nodetype.WEBSOCKET,
    category: "HTTP / Network",
    title: "WebSocket",
    subtitle: "Real-time events",
    badge: "WS",
    pickerDescription: "Persistent WebSocket connections for streaming events.",
    description:
      "Establishes a persistent WebSocket connection to receive or send real-time streaming data.",
    useCase:
      "Listen to real-time video processing status updates or consume live event feeds.",
    bullets: [
      "Connect to ws:// or wss:// endpoints",
      "Listen for inbound messages continuously",
      "Send outbound messages on the same connection",
      "Keep the connection alive instead of using one-shot requests",
    ],
    defaults: {
      endpoint: "wss://example.com/events",
      mode: "listen",
      keepAliveSec: 30,
      outgoingMessage: '{\n  "type": "ping"\n}',
    },
    fields: [
      textField("endpoint", "Endpoint", "wss://example.com/events"),
      selectField("mode", "Mode", [
        { label: "Listen", value: "listen" },
        { label: "Send", value: "send" },
        { label: "Bi-directional", value: "bidirectional" },
      ]),
      numberField("keepAliveSec", "Keep alive (sec)", "30"),
      textareaField("outgoingMessage", "Outgoing message", '{\n  "type": "ping"\n}'),
    ],
    getSummary: (data) =>
      `${String(data.mode ?? "listen")} ${String(data.endpoint ?? "")}`.trim(),
  },
  [Nodetype.RESPONDTOWEBHOOK]: {
    type: Nodetype.RESPONDTOWEBHOOK,
    category: "HTTP / Network",
    title: "Respond to WH",
    subtitle: "Send HTTP response",
    badge: "RWH",
    pickerDescription: "Send an HTTP response back to a webhook caller.",
    description:
      "Sends an HTTP response back to an incoming webhook caller and closes the request loop.",
    useCase:
      "Receive a webhook from a Spring Boot service, process the payload, and send back a final status response.",
    bullets: [
      "Set response status code, headers, and body",
      "Return JSON, text, or XML payloads",
      "Designed to pair with a webhook trigger node",
      "Without a response node the caller waits for completion",
    ],
    defaults: {
      statusCode: 200,
      responseType: "json",
      headers: '{\n  "content-type": "application/json"\n}',
      body: '{\n  "status": "processed"\n}',
    },
    fields: [
      numberField("statusCode", "Status code", "200"),
      selectField("responseType", "Response type", [
        { label: "JSON", value: "json" },
        { label: "Text", value: "text" },
        { label: "XML", value: "xml" },
      ]),
      textareaField("headers", "Headers", '{\n  "content-type": "application/json"\n}'),
      textareaField("body", "Response body", '{\n  "status": "processed"\n}'),
    ],
    getSummary: (data) => `${String(data.statusCode ?? 200)} ${String(data.responseType ?? "json")}`,
  },
  [Nodetype.EMAILSEND]: {
    type: Nodetype.EMAILSEND,
    category: "Messaging & Queues",
    title: "Email Send",
    subtitle: "SMTP / SES",
    badge: "MAIL",
    pickerDescription: "Send outbound email through SMTP or SES.",
    description: "Sends outbound emails through SMTP servers or AWS SES.",
    useCase:
      "Send job application confirmations, video processing completion emails, or weekly digests.",
    bullets: [
      "Supports To, CC, BCC, subject, and plain text or HTML body",
      "Can work with Gmail SMTP, SES, SendGrid SMTP, and custom SMTP servers",
      "Allows file attachments and template-based content patterns",
    ],
    defaults: {
      provider: "smtp",
      to: "user@example.com",
      subject: "Workflow notification",
      contentType: "html",
      body: "<p>Your workflow finished successfully.</p>",
    },
    fields: [
      selectField("provider", "Provider", [
        { label: "SMTP", value: "smtp" },
        { label: "AWS SES", value: "ses" },
        { label: "SendGrid SMTP", value: "sendgrid" },
      ]),
      textField("to", "To", "user@example.com"),
      textField("subject", "Subject", "Workflow notification"),
      selectField("contentType", "Content type", [
        { label: "HTML", value: "html" },
        { label: "Plain text", value: "text" },
      ]),
      textareaField("body", "Body", "<p>Your workflow finished successfully.</p>", 6),
    ],
    getSummary: (data) => `${String(data.provider ?? "smtp")} · ${String(data.to ?? "")}`.trim(),
  },
  [Nodetype.EMAILREAD]: {
    type: Nodetype.EMAILREAD,
    category: "Messaging & Queues",
    title: "Email Read",
    subtitle: "IMAP / Gmail",
    badge: "IMAP",
    pickerDescription: "Read incoming email from IMAP or Gmail.",
    description: "Reads and fetches incoming emails from a mailbox.",
    useCase:
      "Read incoming job alerts, parse recruiter replies, or extract resume attachments automatically.",
    bullets: [
      "Connect through IMAP or Gmail API style flows",
      "Fetch unread emails and filter by sender, subject, or date",
      "Extract message body, attachments, and metadata",
      "Optionally mark emails as read after processing",
    ],
    defaults: {
      provider: "imap",
      mailbox: "INBOX",
      filterBy: "unread",
      sender: "",
      subjectContains: "job",
    },
    fields: [
      selectField("provider", "Provider", [
        { label: "IMAP", value: "imap" },
        { label: "Gmail API", value: "gmail" },
      ]),
      textField("mailbox", "Mailbox", "INBOX"),
      selectField("filterBy", "Filter", [
        { label: "Unread only", value: "unread" },
        { label: "All mail", value: "all" },
      ]),
      textField("sender", "Sender contains", "recruiter@example.com"),
      textField("subjectContains", "Subject contains", "job"),
    ],
    getSummary: (data) => `${String(data.provider ?? "imap")} · ${String(data.mailbox ?? "INBOX")}`,
  },
  [Nodetype.SLACK]: {
    type: Nodetype.SLACK,
    category: "Messaging & Queues",
    title: "Slack",
    subtitle: "Send / receive msgs",
    badge: "SLK",
    pickerDescription: "Slack workspace messaging and event automation.",
    description: "Integrates with Slack workspaces for notification and event workflows.",
    useCase:
      "Notify a dev channel when a pod fails or post a daily job application summary.",
    bullets: [
      "Send channel messages or DMs",
      "Read or listen to Slack messages and events",
      "Supports rich blocks, attachments, reactions, and threads",
    ],
    defaults: {
      mode: "send",
      channel: "#engineering",
      message: "Deployment finished successfully.",
      format: "blocks",
    },
    fields: [
      selectField("mode", "Mode", [
        { label: "Send message", value: "send" },
        { label: "Listen for events", value: "listen" },
      ]),
      textField("channel", "Channel / DM", "#engineering"),
      selectField("format", "Message format", [
        { label: "Blocks", value: "blocks" },
        { label: "Plain text", value: "text" },
      ]),
      textareaField("message", "Message", "Deployment finished successfully."),
    ],
    getSummary: (data) => `${String(data.mode ?? "send")} · ${String(data.channel ?? "")}`.trim(),
  },
  [Nodetype.KAFKA]: {
    type: Nodetype.KAFKA,
    category: "Messaging & Queues",
    title: "Kafka",
    subtitle: "Produce / consume",
    badge: "KFK",
    pickerDescription: "Produce to or consume from Kafka topics.",
    description: "Produces and consumes messages from Apache Kafka topics.",
    useCase:
      "Produce VIDEO_UPLOADED events or consume TRANSCODING_COMPLETE events in your streaming platform.",
    bullets: [
      "Publish messages to a topic with key and headers",
      "Subscribe to a topic and trigger per message",
      "Configure brokers, topic, partition, consumer group, and offsets",
    ],
    defaults: {
      mode: "produce",
      brokers: "localhost:9092",
      topic: "video.events",
      consumerGroup: "nodebase-workers",
      payload: '{\n  "type": "VIDEO_UPLOADED"\n}',
    },
    fields: [
      selectField("mode", "Mode", [
        { label: "Produce", value: "produce" },
        { label: "Consume", value: "consume" },
      ]),
      textField("brokers", "Broker URLs", "localhost:9092"),
      textField("topic", "Topic", "video.events"),
      textField("consumerGroup", "Consumer group", "nodebase-workers"),
      textareaField("payload", "Message payload", '{\n  "type": "VIDEO_UPLOADED"\n}'),
    ],
    getSummary: (data) => `${String(data.mode ?? "produce")} · ${String(data.topic ?? "")}`.trim(),
  },
  [Nodetype.RABBITMQ]: {
    type: Nodetype.RABBITMQ,
    category: "Messaging & Queues",
    title: "RabbitMQ",
    subtitle: "AMQP queue",
    badge: "AMQP",
    pickerDescription: "Publish to or consume from RabbitMQ.",
    description: "Connects to RabbitMQ for AMQP-based messaging.",
    useCase:
      "Route job application events to different queues based on event type.",
    bullets: [
      "Publish messages to direct, fanout, or topic exchanges",
      "Consume messages from queues with ack and reject patterns",
      "Configure routing keys, bindings, and dead-letter handling",
    ],
    defaults: {
      mode: "publish",
      url: "amqp://localhost",
      exchange: "workflow.events",
      queue: "workflow.jobs",
      routingKey: "jobs.created",
      payload: '{\n  "status": "queued"\n}',
    },
    fields: [
      selectField("mode", "Mode", [
        { label: "Publish", value: "publish" },
        { label: "Consume", value: "consume" },
      ]),
      textField("url", "Connection URL", "amqp://localhost"),
      textField("exchange", "Exchange", "workflow.events"),
      textField("queue", "Queue", "workflow.jobs"),
      textField("routingKey", "Routing key", "jobs.created"),
      textareaField("payload", "Payload", '{\n  "status": "queued"\n}'),
    ],
    getSummary: (data) => `${String(data.mode ?? "publish")} · ${String(data.queue ?? "")}`.trim(),
  },
  [Nodetype.TELEGRAM]: {
    type: Nodetype.TELEGRAM,
    category: "Messaging & Queues",
    title: "Telegram",
    subtitle: "Bot messages",
    badge: "TG",
    pickerDescription: "Telegram bot messaging and inbound commands.",
    description: "Sends and receives messages through a Telegram bot.",
    useCase:
      "Alert yourself when a deployment finishes or when a job application gets a response.",
    bullets: [
      "Send text, images, and documents through a bot",
      "Receive user messages and commands",
      "Supports inline keyboards and callback buttons",
    ],
    defaults: {
      mode: "send",
      chatId: "@mychannel",
      message: "Deployment finished.",
      parseMode: "markdown",
    },
    fields: [
      selectField("mode", "Mode", [
        { label: "Send", value: "send" },
        { label: "Receive", value: "receive" },
      ]),
      textField("chatId", "Chat ID", "@mychannel"),
      selectField("parseMode", "Format", [
        { label: "Markdown", value: "markdown" },
        { label: "HTML", value: "html" },
        { label: "Plain text", value: "text" },
      ]),
      textareaField("message", "Message", "Deployment finished."),
    ],
    getSummary: (data) => `${String(data.mode ?? "send")} · ${String(data.chatId ?? "")}`.trim(),
  },
  [Nodetype.DISCORD]: {
    type: Nodetype.DISCORD,
    category: "Messaging & Queues",
    title: "Discord",
    subtitle: "Webhooks / bots",
    badge: "DISC",
    pickerDescription: "Discord webhook and bot integration.",
    description: "Integrates with Discord via webhooks or full bot APIs.",
    useCase:
      "Post project status updates or automated standups to a Discord server.",
    bullets: [
      "Post simple messages through webhooks",
      "Support richer bot integrations for reads, replies, and moderation",
      "Build embeds with colors, fields, and thumbnails",
    ],
    defaults: {
      mode: "webhook",
      destination: "https://discord.com/api/webhooks/...",
      message: "Daily standup summary",
      embeds: '{\n  "title": "Standup",\n  "color": 3447003\n}',
    },
    fields: [
      selectField("mode", "Mode", [
        { label: "Webhook", value: "webhook" },
        { label: "Bot", value: "bot" },
      ]),
      textField("destination", "Webhook / channel", "https://discord.com/api/webhooks/..."),
      textareaField("message", "Message", "Daily standup summary"),
      textareaField("embeds", "Embed JSON", '{\n  "title": "Standup"\n}'),
    ],
    getSummary: (data) => `${String(data.mode ?? "webhook")} · ${String(data.destination ?? "")}`.trim(),
  },
  [Nodetype.SMSWHATSAPP]: {
    type: Nodetype.SMSWHATSAPP,
    category: "Messaging & Queues",
    title: "SMS / WhatsApp",
    subtitle: "Twilio / Meta",
    badge: "SMS",
    pickerDescription: "Send SMS and WhatsApp notifications.",
    description: "Sends SMS and WhatsApp messages through Twilio or Meta APIs.",
    useCase:
      "Send OTP codes, interview reminders, and critical system alerts to users.",
    bullets: [
      "Send SMS to phone numbers through Twilio",
      "Send WhatsApp messages through Twilio WhatsApp or Meta Business API",
      "Support inbound message triggers and WhatsApp templates",
    ],
    defaults: {
      channel: "sms",
      provider: "twilio",
      to: "+15551234567",
      message: "Your verification code is 123456",
    },
    fields: [
      selectField("channel", "Channel", [
        { label: "SMS", value: "sms" },
        { label: "WhatsApp", value: "whatsapp" },
      ]),
      selectField("provider", "Provider", [
        { label: "Twilio", value: "twilio" },
        { label: "Meta", value: "meta" },
      ]),
      textField("to", "To", "+15551234567"),
      textareaField("message", "Message", "Your verification code is 123456"),
    ],
    getSummary: (data) => `${String(data.channel ?? "sms")} · ${String(data.to ?? "")}`.trim(),
  },
  [Nodetype.POSTGRESQL]: {
    type: Nodetype.POSTGRESQL,
    category: "Databases & Storage",
    title: "PostgreSQL",
    subtitle: "Query / execute",
    badge: "PG",
    pickerDescription: "Run SQL queries against PostgreSQL.",
    description: "Runs raw SQL or parameterized queries against a PostgreSQL database.",
    useCase:
      "Insert users, query job listings, or update application status in your core database.",
    bullets: [
      "Execute SELECT, INSERT, UPDATE, and DELETE statements",
      "Run parameterized queries and stored procedures",
      "Can participate in transaction-oriented flows",
    ],
    defaults: {
      operation: "query",
      connection: "primary-postgres",
      sql: "SELECT * FROM jobs ORDER BY posted_at DESC LIMIT 10;",
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Query", value: "query" },
        { label: "Execute", value: "execute" },
        { label: "Stored procedure", value: "procedure" },
      ]),
      textField("connection", "Connection name", "primary-postgres"),
      textareaField("sql", "SQL", "SELECT * FROM jobs ORDER BY posted_at DESC LIMIT 10;", 8),
    ],
    getSummary: (data) => `${String(data.operation ?? "query")} · ${String(data.connection ?? "")}`.trim(),
  },
  [Nodetype.MYSQL]: {
    type: Nodetype.MYSQL,
    category: "Databases & Storage",
    title: "MySQL",
    subtitle: "Query / execute",
    badge: "SQL",
    pickerDescription: "Run SQL queries against MySQL.",
    description: "Runs SQL queries against a MySQL database.",
    useCase:
      "Connect to legacy or shared-hosting systems that specifically use MySQL.",
    bullets: [
      "Execute standard SQL statements",
      "Supports parameterized queries and procedure-style calls",
      "Useful for MySQL-specific backends and integrations",
    ],
    defaults: {
      operation: "query",
      connection: "legacy-mysql",
      sql: "SELECT * FROM users LIMIT 20;",
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Query", value: "query" },
        { label: "Execute", value: "execute" },
      ]),
      textField("connection", "Connection name", "legacy-mysql"),
      textareaField("sql", "SQL", "SELECT * FROM users LIMIT 20;", 8),
    ],
    getSummary: (data) => `${String(data.operation ?? "query")} · ${String(data.connection ?? "")}`.trim(),
  },
  [Nodetype.MONGODB]: {
    type: Nodetype.MONGODB,
    category: "Databases & Storage",
    title: "MongoDB",
    subtitle: "CRUD ops",
    badge: "MGO",
    pickerDescription: "Perform document CRUD and aggregations in MongoDB.",
    description: "Performs document-level operations against a MongoDB collection.",
    useCase:
      "Store video metadata, watch history, or unstructured job application data.",
    bullets: [
      "Supports find, insert, update, delete, and aggregation operations",
      "Allows query filters, projections, and upserts",
      "Fits flexible document data structures well",
    ],
    defaults: {
      operation: "find",
      collection: "videos",
      filter: '{\n  "status": "active"\n}',
      update: '{\n  "$set": {\n    "processed": true\n  }\n}',
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Find", value: "find" },
        { label: "Insert one", value: "insertOne" },
        { label: "Update one", value: "updateOne" },
        { label: "Delete one", value: "deleteOne" },
        { label: "Aggregate", value: "aggregate" },
      ]),
      textField("collection", "Collection", "videos"),
      textareaField("filter", "Filter / pipeline", '{\n  "status": "active"\n}'),
      textareaField("update", "Update / document", '{\n  "$set": {\n    "processed": true\n  }\n}', 6),
    ],
    getSummary: (data) => `${String(data.operation ?? "find")} · ${String(data.collection ?? "")}`.trim(),
  },
  [Nodetype.REDIS]: {
    type: Nodetype.REDIS,
    category: "Databases & Storage",
    title: "Redis",
    subtitle: "Get / set / pub",
    badge: "RDS",
    pickerDescription: "Use Redis for cache, data structures, and pub/sub.",
    description: "Interacts with Redis for cache, session, and pub/sub operations.",
    useCase:
      "Cache JWTs, store rate limits, or publish real-time video processing status updates.",
    bullets: [
      "Supports GET, SET, DEL, publish, and subscribe flows",
      "Works with TTL-based cache values",
      "Can be used for lists, hashes, sets, and sorted sets conceptually",
    ],
    defaults: {
      operation: "set",
      key: "workflow:lastRun",
      value: '{"status":"ok"}',
      ttlSec: 300,
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "GET", value: "get" },
        { label: "SET", value: "set" },
        { label: "DEL", value: "del" },
        { label: "Publish", value: "publish" },
        { label: "Subscribe", value: "subscribe" },
      ]),
      textField("key", "Key / channel", "workflow:lastRun"),
      textareaField("value", "Value", '{"status":"ok"}'),
      numberField("ttlSec", "TTL (sec)", "300"),
    ],
    getSummary: (data) => `${String(data.operation ?? "set")} · ${String(data.key ?? "")}`.trim(),
  },
  [Nodetype.ELASTICSEARCH]: {
    type: Nodetype.ELASTICSEARCH,
    category: "Databases & Storage",
    title: "Elasticsearch",
    subtitle: "Index / search",
    badge: "ES",
    pickerDescription: "Index and search documents in Elasticsearch.",
    description: "Indexes documents and performs full-text search queries against Elasticsearch.",
    useCase:
      "Index video titles and descriptions or power a fuzzy search bar.",
    bullets: [
      "Index, search, update, and delete documents",
      "Use filters, aggregations, fuzzy search, and boosting",
      "Supports scoring, relevance, and geo or range-oriented queries",
    ],
    defaults: {
      operation: "search",
      index: "videos",
      query: '{\n  "query": {\n    "match": {\n      "title": "streaming"\n    }\n  }\n}',
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Search", value: "search" },
        { label: "Index", value: "index" },
        { label: "Update", value: "update" },
        { label: "Delete", value: "delete" },
      ]),
      textField("index", "Index", "videos"),
      textareaField("query", "Query / document", '{\n  "query": {\n    "match": {\n      "title": "streaming"\n    }\n  }\n}', 8),
    ],
    getSummary: (data) => `${String(data.operation ?? "search")} · ${String(data.index ?? "")}`.trim(),
  },
  [Nodetype.S3OBJECTSTORE]: {
    type: Nodetype.S3OBJECTSTORE,
    category: "Databases & Storage",
    title: "S3 / Object Store",
    subtitle: "Upload / read",
    badge: "S3",
    pickerDescription: "Read and write objects in S3-compatible storage.",
    description: "Uploads and retrieves files from S3-compatible object storage.",
    useCase:
      "Store uploaded videos, transcoded chunks, PDFs, and profile images.",
    bullets: [
      "Upload, download, list, and generate presigned URLs",
      "Works with AWS S3, MinIO, Cloudflare R2, and compatible providers",
      "Handles text, JSON, and binary-style objects",
    ],
    defaults: {
      operation: "upload",
      bucket: "nodebase-assets",
      key: "exports/report.json",
      provider: "aws-s3",
      payload: '{\n  "report": true\n}',
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Upload", value: "upload" },
        { label: "Download", value: "download" },
        { label: "List", value: "list" },
        { label: "Presign", value: "presign" },
      ]),
      textField("bucket", "Bucket", "nodebase-assets"),
      textField("key", "Object key", "exports/report.json"),
      textField("provider", "Provider", "aws-s3"),
      textareaField("payload", "Payload / metadata", '{\n  "report": true\n}'),
    ],
    getSummary: (data) => `${String(data.operation ?? "upload")} · ${String(data.bucket ?? "")}`.trim(),
  },
  [Nodetype.GOOGLESHEETS]: {
    type: Nodetype.GOOGLESHEETS,
    category: "Databases & Storage",
    title: "Google Sheets",
    subtitle: "Read / write rows",
    badge: "SHT",
    pickerDescription: "Read and write spreadsheet rows in Google Sheets.",
    description: "Reads and writes data in Google Sheets spreadsheets.",
    useCase:
      "Track job applications, export analytics, or maintain a simple content calendar.",
    bullets: [
      "Append rows, update cells, and read ranges",
      "Create new sheets and manage ranges",
      "Acts as a simple no-code database for lightweight workflows",
    ],
    defaults: {
      operation: "append",
      spreadsheetId: "sheet-id",
      range: "Applications!A:D",
      values: '[["Company","Role","Status"]]',
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Read", value: "read" },
        { label: "Append", value: "append" },
        { label: "Update", value: "update" },
      ]),
      textField("spreadsheetId", "Spreadsheet ID", "sheet-id"),
      textField("range", "Range", "Applications!A:D"),
      textareaField("values", "Values", '[["Company","Role","Status"]]'),
    ],
    getSummary: (data) => `${String(data.operation ?? "append")} · ${String(data.range ?? "")}`.trim(),
  },
  [Nodetype.AIRTABLE]: {
    type: Nodetype.AIRTABLE,
    category: "Databases & Storage",
    title: "Airtable",
    subtitle: "CRUD records",
    badge: "AIR",
    pickerDescription: "Perform CRUD operations on Airtable bases.",
    description: "Performs full CRUD operations on Airtable bases.",
    useCase:
      "Manage job application tracking as a spreadsheet-plus-database hybrid.",
    bullets: [
      "Create, read, update, and delete records",
      "Filter and sort using Airtable formula syntax",
      "Support linked records across tables",
    ],
    defaults: {
      operation: "create",
      baseId: "appBase123",
      table: "Applications",
      formula: "",
      record: '{\n  "Company": "OpenAI",\n  "Status": "Applied"\n}',
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Create", value: "create" },
        { label: "Read", value: "read" },
        { label: "Update", value: "update" },
        { label: "Delete", value: "delete" },
      ]),
      textField("baseId", "Base ID", "appBase123"),
      textField("table", "Table", "Applications"),
      textField("formula", "Filter formula", "{Status} = 'Applied'"),
      textareaField("record", "Record data", '{\n  "Company": "OpenAI"\n}'),
    ],
    getSummary: (data) => `${String(data.operation ?? "create")} · ${String(data.table ?? "")}`.trim(),
  },
  [Nodetype.READFILE]: {
    type: Nodetype.READFILE,
    category: "File & Document",
    title: "Read File",
    subtitle: "Binary / text",
    badge: "RDF",
    pickerDescription: "Read files from the filesystem.",
    description: "Reads a file from the filesystem as binary or text data.",
    useCase:
      "Read an uploaded resume PDF, config JSON file, or video chunk for processing.",
    bullets: [
      "Read text, JSON, PDF, image, and binary-style files",
      "Return raw bytes or decoded text",
      "Pass the file contents to downstream nodes",
    ],
    defaults: {
      path: "/tmp/input.json",
      mode: "text",
      encoding: "utf8",
    },
    fields: [
      textField("path", "File path", "/tmp/input.json"),
      selectField("mode", "Mode", [
        { label: "Text", value: "text" },
        { label: "Binary", value: "binary" },
      ]),
      selectField("encoding", "Encoding", [
        { label: "UTF-8", value: "utf8" },
        { label: "Base64", value: "base64" },
        { label: "Binary", value: "binary" },
      ]),
    ],
    getSummary: (data) => `${String(data.mode ?? "text")} · ${String(data.path ?? "")}`.trim(),
  },
  [Nodetype.WRITEFILE]: {
    type: Nodetype.WRITEFILE,
    category: "File & Document",
    title: "Write File",
    subtitle: "Save to disk",
    badge: "WRT",
    pickerDescription: "Write files to the filesystem.",
    description: "Writes text, JSON, or binary data to a file path.",
    useCase:
      "Save a tailored resume, persist FFmpeg output, or stage files before S3 upload.",
    bullets: [
      "Create new files or overwrite existing ones",
      "Supports text, JSON, and binary-like payloads",
      "Useful for staging workflow output on disk",
    ],
    defaults: {
      path: "/tmp/output.json",
      writeMode: "overwrite",
      encoding: "utf8",
      content: '{\n  "status": "ok"\n}',
    },
    fields: [
      textField("path", "File path", "/tmp/output.json"),
      selectField("writeMode", "Write mode", [
        { label: "Overwrite", value: "overwrite" },
        { label: "Append", value: "append" },
      ]),
      selectField("encoding", "Encoding", [
        { label: "UTF-8", value: "utf8" },
        { label: "Base64", value: "base64" },
        { label: "Binary", value: "binary" },
      ]),
      textareaField("content", "Content", '{\n  "status": "ok"\n}'),
    ],
    getSummary: (data) => `${String(data.writeMode ?? "overwrite")} · ${String(data.path ?? "")}`.trim(),
  },
  [Nodetype.SPREADSHEET]: {
    type: Nodetype.SPREADSHEET,
    category: "File & Document",
    title: "Spreadsheet",
    subtitle: "XLSX / CSV parse",
    badge: "XLS",
    pickerDescription: "Parse and generate XLSX and CSV files.",
    description: "Parses or generates Excel and CSV files directly.",
    useCase:
      "Import job postings from Excel or export application analytics to CSV.",
    bullets: [
      "Read XLSX or CSV into structured rows",
      "Write rows back into XLSX or CSV output",
      "Handle workbook sheet names and basic type-aware parsing",
    ],
    defaults: {
      operation: "read",
      format: "xlsx",
      path: "/tmp/jobs.xlsx",
      sheetName: "Sheet1",
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Read", value: "read" },
        { label: "Write", value: "write" },
      ]),
      selectField("format", "Format", [
        { label: "XLSX", value: "xlsx" },
        { label: "CSV", value: "csv" },
      ]),
      textField("path", "File path", "/tmp/jobs.xlsx"),
      textField("sheetName", "Sheet name", "Sheet1"),
    ],
    getSummary: (data) => `${String(data.operation ?? "read")} · ${String(data.format ?? "xlsx")}`,
  },
  [Nodetype.COMPRESSEXTRACT]: {
    type: Nodetype.COMPRESSEXTRACT,
    category: "File & Document",
    title: "Compress / Extract",
    subtitle: "ZIP / tar",
    badge: "ZIP",
    pickerDescription: "Create and extract archive files.",
    description: "Compresses files into archives or extracts existing archives.",
    useCase:
      "Bundle transcoded segments for download or extract uploaded resume archives.",
    bullets: [
      "Create ZIP or tar.gz archives",
      "Extract ZIP and tar archives",
      "Bundle multiple files for transfer or download",
    ],
    defaults: {
      operation: "compress",
      archiveType: "zip",
      sourcePath: "/tmp/input",
      targetPath: "/tmp/output.zip",
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Compress", value: "compress" },
        { label: "Extract", value: "extract" },
      ]),
      selectField("archiveType", "Archive type", [
        { label: "ZIP", value: "zip" },
        { label: "tar.gz", value: "tar.gz" },
      ]),
      textField("sourcePath", "Source path", "/tmp/input"),
      textField("targetPath", "Target path", "/tmp/output.zip"),
    ],
    getSummary: (data) => `${String(data.operation ?? "compress")} · ${String(data.archiveType ?? "zip")}`,
  },
  [Nodetype.PDFEXTRACT]: {
    type: Nodetype.PDFEXTRACT,
    category: "File & Document",
    title: "PDF Extract",
    subtitle: "Text / tables",
    badge: "PDF",
    pickerDescription: "Extract text and tables from PDFs.",
    description: "Extracts text and table content from PDF files.",
    useCase:
      "Extract resume text before passing it to an ATS analysis flow.",
    bullets: [
      "Extract raw text from all or selected pages",
      "Capture table structures from PDFs",
      "Return structured text for downstream AI or storage nodes",
    ],
    defaults: {
      path: "/tmp/resume.pdf",
      pages: "all",
      extractMode: "text",
    },
    fields: [
      textField("path", "PDF path", "/tmp/resume.pdf"),
      textField("pages", "Pages", "all"),
      selectField("extractMode", "Extract mode", [
        { label: "Text", value: "text" },
        { label: "Tables", value: "tables" },
        { label: "Both", value: "both" },
      ]),
    ],
    getSummary: (data) => `${String(data.extractMode ?? "text")} · ${String(data.path ?? "")}`.trim(),
  },
  [Nodetype.HTMLEXTRACT]: {
    type: Nodetype.HTMLEXTRACT,
    category: "File & Document",
    title: "HTML Extract",
    subtitle: "Scrape / parse",
    badge: "HTML",
    pickerDescription: "Scrape and parse HTML using selectors or XPath.",
    description: "Extracts structured content from HTML using CSS selectors or XPath.",
    useCase:
      "Scrape job postings, parse HTML email content, or extract links from markup.",
    bullets: [
      "Select specific elements using CSS selectors",
      "Support XPath-style extraction patterns",
      "Extract text, links, attributes, and table-like structures",
    ],
    defaults: {
      source: "https://example.com/jobs",
      strategy: "css",
      selector: ".job-card a",
      attribute: "text",
    },
    fields: [
      textField("source", "Source URL / HTML path", "https://example.com/jobs"),
      selectField("strategy", "Strategy", [
        { label: "CSS selector", value: "css" },
        { label: "XPath", value: "xpath" },
      ]),
      textField("selector", "Selector", ".job-card a"),
      textField("attribute", "Attribute", "text"),
    ],
    getSummary: (data) => `${String(data.strategy ?? "css")} · ${String(data.selector ?? "")}`.trim(),
  },
  [Nodetype.XMLPARSE]: {
    type: Nodetype.XMLPARSE,
    category: "File & Document",
    title: "XML Parse",
    subtitle: "SOAP / feeds",
    badge: "XML",
    pickerDescription: "Parse XML documents into structured data.",
    description: "Parses XML documents into structured workflow data.",
    useCase:
      "Consume SOAP API responses, RSS job feeds, or XML config files.",
    bullets: [
      "Parse SOAP and feed-style XML documents",
      "Convert XML into JSON-like structures",
      "Handle nested elements and namespace-oriented payloads",
    ],
    defaults: {
      sourcePath: "/tmp/feed.xml",
      mode: "xml_to_json",
      rootPath: "/rss/channel/item",
    },
    fields: [
      textField("sourcePath", "Source path", "/tmp/feed.xml"),
      selectField("mode", "Mode", [
        { label: "XML to JSON", value: "xml_to_json" },
        { label: "SOAP", value: "soap" },
        { label: "RSS / Atom", value: "feed" },
      ]),
      textField("rootPath", "Root path", "/rss/channel/item"),
    ],
    getSummary: (data) => `${String(data.mode ?? "xml_to_json")} · ${String(data.sourcePath ?? "")}`.trim(),
  },
  [Nodetype.FTPSFTP]: {
    type: Nodetype.FTPSFTP,
    category: "File & Document",
    title: "FTP / SFTP",
    subtitle: "Remote file ops",
    badge: "SFTP",
    pickerDescription: "Transfer files over FTP or SFTP.",
    description: "Transfers files to and from FTP or SFTP servers.",
    useCase:
      "Upload processed media to a CDN server or retrieve partner files from an SFTP drop.",
    bullets: [
      "Upload, download, list, and delete remote files",
      "Supports secure SFTP transfer over SSH",
      "Useful for partner file exchange and batch processing",
    ],
    defaults: {
      protocol: "sftp",
      operation: "upload",
      host: "files.example.com",
      remotePath: "/incoming/data.csv",
      localPath: "/tmp/data.csv",
    },
    fields: [
      selectField("protocol", "Protocol", [
        { label: "SFTP", value: "sftp" },
        { label: "FTP", value: "ftp" },
      ]),
      selectField("operation", "Operation", [
        { label: "Upload", value: "upload" },
        { label: "Download", value: "download" },
        { label: "List", value: "list" },
        { label: "Delete", value: "delete" },
      ]),
      textField("host", "Host", "files.example.com"),
      textField("remotePath", "Remote path", "/incoming/data.csv"),
      textField("localPath", "Local path", "/tmp/data.csv"),
    ],
    getSummary: (data) => `${String(data.protocol ?? "sftp")} · ${String(data.operation ?? "upload")}`,
  },
  [Nodetype.LLMCHAT]: {
    type: Nodetype.LLMCHAT,
    category: "AI / ML",
    title: "LLM Chat",
    subtitle: "OpenAI / Claude",
    badge: "LLM",
    pickerDescription: "Prompt large language models for generated responses.",
    description: "Sends prompts to large language models and returns generated responses.",
    useCase:
      "Tailor resumes, generate cover letters, analyze job descriptions, or answer workflow questions.",
    bullets: [
      "Supports provider, model, temperature, and max token style settings",
      "Compose system and user prompts together",
      "Can request structured JSON output for downstream nodes",
    ],
    defaults: {
      provider: "openai",
      model: "gpt-4o-mini",
      responseFormat: "text",
      systemPrompt: "You are a helpful assistant.",
      prompt: "Summarize this job description.",
    },
    fields: [
      selectField("provider", "Provider", [
        { label: "OpenAI", value: "openai" },
        { label: "Anthropic", value: "anthropic" },
      ]),
      textField("model", "Model", "gpt-4o-mini"),
      selectField("responseFormat", "Response format", [
        { label: "Text", value: "text" },
        { label: "JSON", value: "json" },
      ]),
      textareaField("systemPrompt", "System prompt", "You are a helpful assistant."),
      textareaField("prompt", "User prompt", "Summarize this job description.", 6),
    ],
    getSummary: (data) => `${String(data.provider ?? "openai")} · ${String(data.model ?? "")}`.trim(),
  },
  [Nodetype.EMBEDDINGS]: {
    type: Nodetype.EMBEDDINGS,
    category: "AI / ML",
    title: "Embeddings",
    subtitle: "Vectorize text",
    badge: "EMB",
    pickerDescription: "Convert text into vector embeddings.",
    description: "Converts text into numerical vector representations for similarity search.",
    useCase:
      "Embed resume content and job descriptions to rank candidate-job matches.",
    bullets: [
      "Generate dense float vectors from text",
      "Batch embed multiple texts",
      "Pairs naturally with vector store nodes for semantic search",
    ],
    defaults: {
      provider: "openai",
      model: "text-embedding-3-small",
      inputField: "content",
      batchSize: 20,
    },
    fields: [
      selectField("provider", "Provider", [
        { label: "OpenAI", value: "openai" },
        { label: "Other", value: "other" },
      ]),
      textField("model", "Model", "text-embedding-3-small"),
      textField("inputField", "Input field", "content"),
      numberField("batchSize", "Batch size", "20"),
    ],
    getSummary: (data) => `${String(data.model ?? "")} · ${String(data.inputField ?? "")}`.trim(),
  },
  [Nodetype.VECTORSTORE]: {
    type: Nodetype.VECTORSTORE,
    category: "AI / ML",
    title: "Vector Store",
    subtitle: "Pinecone / Qdrant",
    badge: "VEC",
    pickerDescription: "Store and query vectors for semantic search.",
    description: "Stores and queries vector embeddings in systems such as Pinecone or Qdrant.",
    useCase:
      "Back a job-matching semantic search or a retrieval-augmented generation workflow.",
    bullets: [
      "Upsert vectors with metadata",
      "Run nearest-neighbor similarity queries",
      "Filter by metadata during search",
    ],
    defaults: {
      provider: "pinecone",
      operation: "query",
      indexName: "jobs-index",
      metadataFilter: '{\n  "status": "active"\n}',
    },
    fields: [
      selectField("provider", "Provider", [
        { label: "Pinecone", value: "pinecone" },
        { label: "Qdrant", value: "qdrant" },
      ]),
      selectField("operation", "Operation", [
        { label: "Query", value: "query" },
        { label: "Upsert", value: "upsert" },
        { label: "Delete", value: "delete" },
      ]),
      textField("indexName", "Index / collection", "jobs-index"),
      textareaField("metadataFilter", "Metadata filter", '{\n  "status": "active"\n}'),
    ],
    getSummary: (data) => `${String(data.operation ?? "query")} · ${String(data.indexName ?? "")}`.trim(),
  },
  [Nodetype.AIAGENT]: {
    type: Nodetype.AIAGENT,
    category: "AI / ML",
    title: "AI Agent",
    subtitle: "Tool-calling loop",
    badge: "AGNT",
    pickerDescription: "Run an autonomous tool-using agent loop.",
    description: "Runs a goal-driven AI agent that can choose tools in a loop.",
    useCase:
      "Research a job, tailor a resume, draft a cover letter, and send an application in one run.",
    bullets: [
      "Give the model a goal and available tools",
      "Let the agent choose tool order and iterate until done",
      "Return a final result after multi-step reasoning",
    ],
    defaults: {
      provider: "openai",
      model: "gpt-4o-mini",
      goal: "Research this company and draft a tailored outreach email.",
      tools: "HTTP Request\nPostgreSQL\nLLM Chat",
      maxSteps: 8,
    },
    fields: [
      selectField("provider", "Provider", [
        { label: "OpenAI", value: "openai" },
        { label: "Anthropic", value: "anthropic" },
      ]),
      textField("model", "Model", "gpt-4o-mini"),
      textareaField("goal", "Goal", "Research this company and draft a tailored outreach email.", 5),
      textareaField("tools", "Available tools", "HTTP Request\nPostgreSQL\nLLM Chat"),
      numberField("maxSteps", "Max steps", "8"),
    ],
    getSummary: (data) => `${String(data.model ?? "")} · ${String(data.maxSteps ?? 8)} steps`.trim(),
  },
  [Nodetype.TEXTCLASSIFIER]: {
    type: Nodetype.TEXTCLASSIFIER,
    category: "AI / ML",
    title: "Text Classifier",
    subtitle: "Labels / sentiment",
    badge: "CLS",
    pickerDescription: "Classify text into labels or sentiment buckets.",
    description: "Classifies text into categories or performs sentiment analysis.",
    useCase:
      "Classify job descriptions by seniority or detect recruiter email sentiment.",
    bullets: [
      "Supports binary, multi-class, and custom label classification",
      "Can run sentiment scoring workflows",
      "Useful for routing and tagging text-heavy data",
    ],
    defaults: {
      mode: "custom",
      labels: "positive, negative, neutral",
      inputField: "message",
      threshold: 0.7,
    },
    fields: [
      selectField("mode", "Mode", [
        { label: "Custom labels", value: "custom" },
        { label: "Sentiment", value: "sentiment" },
      ]),
      textField("labels", "Labels", "positive, negative, neutral"),
      textField("inputField", "Input field", "message"),
      numberField("threshold", "Threshold", "0.7"),
    ],
    getSummary: (data) => `${String(data.mode ?? "custom")} · ${String(data.inputField ?? "")}`.trim(),
  },
  [Nodetype.IMAGEGEN]: {
    type: Nodetype.IMAGEGEN,
    category: "AI / ML",
    title: "Image Gen",
    subtitle: "DALL-E / SD",
    badge: "IMG",
    pickerDescription: "Generate images from text prompts.",
    description: "Generates images from text prompts using AI image models.",
    useCase:
      "Create thumbnails for video content or visual assets for listings.",
    bullets: [
      "Works with providers like DALL-E or Stable Diffusion style models",
      "Control size, style, and quality",
      "Returns generated image output for downstream use",
    ],
    defaults: {
      provider: "dalle",
      size: "1024x1024",
      style: "vivid",
      prompt: "A cinematic thumbnail for a cloud deployment tutorial",
    },
    fields: [
      selectField("provider", "Provider", [
        { label: "DALL-E", value: "dalle" },
        { label: "Stable Diffusion", value: "stable-diffusion" },
      ]),
      selectField("size", "Size", [
        { label: "1024x1024", value: "1024x1024" },
        { label: "1792x1024", value: "1792x1024" },
        { label: "1024x1792", value: "1024x1792" },
      ]),
      textField("style", "Style", "vivid"),
      textareaField("prompt", "Prompt", "A cinematic thumbnail for a cloud deployment tutorial", 5),
    ],
    getSummary: (data) => `${String(data.provider ?? "dalle")} · ${String(data.size ?? "")}`.trim(),
  },
  [Nodetype.STTTTS]: {
    type: Nodetype.STTTTS,
    category: "AI / ML",
    title: "STT / TTS",
    subtitle: "Audio transcription",
    badge: "AUDIO",
    pickerDescription: "Speech-to-text and text-to-speech conversion.",
    description: "Handles speech-to-text and text-to-speech workflows.",
    useCase:
      "Transcribe video audio for subtitles or generate spoken summaries of job descriptions.",
    bullets: [
      "Transcribe audio into text",
      "Generate spoken audio from text",
      "Supports multi-language and voice-oriented settings",
    ],
    defaults: {
      mode: "stt",
      provider: "openai",
      source: "/tmp/audio.mp3",
      language: "en",
      voice: "alloy",
    },
    fields: [
      selectField("mode", "Mode", [
        { label: "Speech to text", value: "stt" },
        { label: "Text to speech", value: "tts" },
      ]),
      textField("provider", "Provider", "openai"),
      textField("source", "Source text / path", "/tmp/audio.mp3"),
      textField("language", "Language", "en"),
      textField("voice", "Voice", "alloy"),
    ],
    getSummary: (data) => `${String(data.mode ?? "stt")} · ${String(data.provider ?? "")}`.trim(),
  },
  [Nodetype.MEMORYCONTEXT]: {
    type: Nodetype.MEMORYCONTEXT,
    category: "AI / ML",
    title: "Memory / Context",
    subtitle: "Conversation store",
    badge: "MEM",
    pickerDescription: "Persist and recall conversational context.",
    description: "Persists conversation history across multiple LLM interactions.",
    useCase:
      "Remember a user's skills, preferences, and past applications across sessions.",
    bullets: [
      "Store and retrieve chat history",
      "Inject previous context into future prompts",
      "Can use in-memory, Redis, or database-style backends",
    ],
    defaults: {
      backend: "redis",
      operation: "save",
      namespace: "user-123",
      maxItems: 20,
    },
    fields: [
      selectField("backend", "Backend", [
        { label: "In-memory", value: "memory" },
        { label: "Redis", value: "redis" },
        { label: "Database", value: "database" },
      ]),
      selectField("operation", "Operation", [
        { label: "Load", value: "load" },
        { label: "Save", value: "save" },
        { label: "Clear", value: "clear" },
      ]),
      textField("namespace", "Namespace", "user-123"),
      numberField("maxItems", "Max items", "20"),
    ],
    getSummary: (data) => `${String(data.operation ?? "save")} · ${String(data.backend ?? "redis")}`,
  },
  [Nodetype.EXECUTECMD]: {
    type: Nodetype.EXECUTECMD,
    category: "Utility & DevOps",
    title: "Execute Cmd",
    subtitle: "Shell / bash",
    badge: "CMD",
    pickerDescription: "Run shell commands on the host machine.",
    description: "Runs shell commands directly on the host machine.",
    useCase:
      "Trigger FFmpeg transcoding, run migration scripts, or launch deployment commands.",
    bullets: [
      "Capture stdout and stderr",
      "Run scripts, CLI tools, and system commands",
      "Useful for custom automation steps",
    ],
    defaults: {
      shell: "bash",
      command: "ffmpeg -i input.mp4 output.mp4",
      workingDirectory: "/tmp",
      timeoutMs: 60000,
    },
    fields: [
      textField("shell", "Shell", "bash"),
      textareaField("command", "Command", "ffmpeg -i input.mp4 output.mp4", 6),
      textField("workingDirectory", "Working directory", "/tmp"),
      numberField("timeoutMs", "Timeout (ms)", "60000"),
    ],
    getSummary: (data) => `${String(data.shell ?? "bash")} · ${String(data.workingDirectory ?? "")}`.trim(),
  },
  [Nodetype.SSH]: {
    type: Nodetype.SSH,
    category: "Utility & DevOps",
    title: "SSH",
    subtitle: "Remote command",
    badge: "SSH",
    pickerDescription: "Execute remote commands over SSH.",
    description: "Executes commands on a remote server via SSH.",
    useCase:
      "Restart a service, run maintenance scripts, or deploy a container remotely.",
    bullets: [
      "Connect with credentials or keys",
      "Run remote shell commands and scripts",
      "Can coordinate with SCP or file transfer flows",
    ],
    defaults: {
      host: "server.example.com",
      username: "ubuntu",
      port: 22,
      command: "systemctl restart app",
    },
    fields: [
      textField("host", "Host", "server.example.com"),
      textField("username", "Username", "ubuntu"),
      numberField("port", "Port", "22"),
      textareaField("command", "Command", "systemctl restart app", 5),
    ],
    getSummary: (data) => `${String(data.username ?? "user")}@${String(data.host ?? "")}`.trim(),
  },
  [Nodetype.CRYPTO]: {
    type: Nodetype.CRYPTO,
    category: "Utility & DevOps",
    title: "Crypto",
    subtitle: "Hash / encrypt",
    badge: "CRYP",
    pickerDescription: "Hash, encrypt, decrypt, and sign data.",
    description: "Performs cryptographic operations on workflow data.",
    useCase:
      "Hash passwords, verify webhook signatures, or encrypt sensitive values.",
    bullets: [
      "Supports hashing, HMAC, encryption, decryption, and token generation flows",
      "Can work with SHA-256, bcrypt, AES, and related algorithms conceptually",
      "Useful for webhook verification and secure data handling",
    ],
    defaults: {
      operation: "hash",
      algorithm: "sha256",
      input: "my-secret-data",
      secret: "",
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Hash", value: "hash" },
        { label: "Encrypt", value: "encrypt" },
        { label: "Decrypt", value: "decrypt" },
        { label: "HMAC", value: "hmac" },
        { label: "Random", value: "random" },
      ]),
      textField("algorithm", "Algorithm", "sha256"),
      textareaField("input", "Input", "my-secret-data"),
      textField("secret", "Secret / key", ""),
    ],
    getSummary: (data) => `${String(data.operation ?? "hash")} · ${String(data.algorithm ?? "sha256")}`,
  },
  [Nodetype.DATETIME]: {
    type: Nodetype.DATETIME,
    category: "Utility & DevOps",
    title: "Date / Time",
    subtitle: "Parse / format",
    badge: "TIME",
    pickerDescription: "Parse, format, and manipulate dates and times.",
    description: "Parses, formats, and manipulates date and time values.",
    useCase:
      "Format timestamps, calculate deadline countdowns, or convert timezones.",
    bullets: [
      "Parse date strings and format output",
      "Add or subtract time values",
      "Convert between timezones and compare dates",
    ],
    defaults: {
      operation: "format",
      input: "2026-04-04T10:00:00Z",
      format: "yyyy-MM-dd HH:mm",
      timezone: "UTC",
    },
    fields: [
      selectField("operation", "Operation", [
        { label: "Format", value: "format" },
        { label: "Parse", value: "parse" },
        { label: "Add / subtract", value: "adjust" },
        { label: "Compare", value: "compare" },
      ]),
      textField("input", "Input", "2026-04-04T10:00:00Z"),
      textField("format", "Format", "yyyy-MM-dd HH:mm"),
      textField("timezone", "Timezone", "UTC"),
    ],
    getSummary: (data) => `${String(data.operation ?? "format")} · ${String(data.timezone ?? "UTC")}`,
  },
  [Nodetype.ERRORTRIGGER]: {
    type: Nodetype.ERRORTRIGGER,
    category: "Utility & DevOps",
    title: "Error Trigger",
    subtitle: "Catch failures",
    badge: "ERR",
    pickerDescription: "Catch and route node failures.",
    description: "Catches errors from other nodes and triggers fallback logic.",
    useCase:
      "Write failed Kafka messages to a dead-letter table and alert via Slack.",
    bullets: [
      "Acts as a local or global error handler",
      "Receives error details such as message and source node",
      "Can trigger retries, alerts, and fallback branches",
    ],
    defaults: {
      scope: "local",
      match: "*",
      strategy: "fallback",
      fallbackNode: "Slack Alert",
    },
    fields: [
      selectField("scope", "Scope", [
        { label: "Local", value: "local" },
        { label: "Global", value: "global" },
      ]),
      textField("match", "Error match", "*"),
      selectField("strategy", "Strategy", [
        { label: "Fallback", value: "fallback" },
        { label: "Retry", value: "retry" },
        { label: "Continue", value: "continue" },
      ]),
      textField("fallbackNode", "Fallback target", "Slack Alert"),
    ],
    getSummary: (data) => `${String(data.scope ?? "local")} · ${String(data.strategy ?? "fallback")}`,
  },
  [Nodetype.DEBUGLOG]: {
    type: Nodetype.DEBUGLOG,
    category: "Utility & DevOps",
    title: "Debug / Log",
    subtitle: "Inspect data",
    badge: "LOG",
    pickerDescription: "Log workflow data for debugging.",
    description: "Logs workflow data for debugging and observability.",
    useCase:
      "Inspect Kafka message payloads before inserting them into MongoDB.",
    bullets: [
      "Print item data to execution logs",
      "Inspect values without mutating the pipeline",
      "Works like a workflow-level console.log",
    ],
    defaults: {
      level: "info",
      label: "After transform",
      template: "{{json input}}",
    },
    fields: [
      selectField("level", "Level", [
        { label: "Debug", value: "debug" },
        { label: "Info", value: "info" },
        { label: "Warn", value: "warn" },
        { label: "Error", value: "error" },
      ]),
      textField("label", "Label", "After transform"),
      textareaField("template", "Template", "{{json input}}"),
    ],
    getSummary: (data) => `${String(data.level ?? "info")} · ${String(data.label ?? "")}`.trim(),
  },
  [Nodetype.NOTIFICATION]: {
    type: Nodetype.NOTIFICATION,
    category: "Utility & DevOps",
    title: "Notification",
    subtitle: "Webhook / alert",
    badge: "NTFY",
    pickerDescription: "Send generic notifications to external systems.",
    description: "Sends generic notifications through webhooks or alerting channels.",
    useCase:
      "Trigger PagerDuty or another monitoring system when a processing SLA is breached.",
    bullets: [
      "POST a payload to any webhook URL",
      "Trigger systems such as PagerDuty or OpsGenie",
      "Send structured alert data with severity or metadata",
    ],
    defaults: {
      channel: "webhook",
      endpoint: "https://hooks.example.com/alerts",
      severity: "high",
      payload: '{\n  "message": "Workflow exceeded SLA"\n}',
    },
    fields: [
      selectField("channel", "Channel", [
        { label: "Webhook", value: "webhook" },
        { label: "PagerDuty", value: "pagerduty" },
        { label: "OpsGenie", value: "opsgenie" },
        { label: "Custom", value: "custom" },
      ]),
      textField("endpoint", "Endpoint", "https://hooks.example.com/alerts"),
      selectField("severity", "Severity", [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
        { label: "Critical", value: "critical" },
      ]),
      textareaField("payload", "Payload", '{\n  "message": "Workflow exceeded SLA"\n}'),
    ],
    getSummary: (data) => `${String(data.channel ?? "webhook")} · ${String(data.severity ?? "high")}`,
  },
  [Nodetype.CUSTOMNODE]: {
    type: Nodetype.CUSTOMNODE,
    category: "Utility & DevOps",
    title: "Custom Node",
    subtitle: "Plugin system",
    badge: "PLUG",
    pickerDescription: "Register and configure your own plugin-style node.",
    description: "Build and plug in your own custom node to extend the platform.",
    useCase:
      "Create a Spring Boot caller node with fixed auth or a custom FFmpeg workflow node.",
    bullets: [
      "Define custom inputs, outputs, and configuration UI",
      "Package and share plugin-style node logic",
      "Integrate any SDK or library not supported natively",
    ],
    defaults: {
      packageName: "@acme/nodebase-plugin",
      entrypoint: "dist/index.js",
      inputs: "payload\ncontext",
      configSchema: '{\n  "type": "object"\n}',
    },
    fields: [
      textField("packageName", "Package name", "@acme/nodebase-plugin"),
      textField("entrypoint", "Entrypoint", "dist/index.js"),
      textareaField("inputs", "Inputs", "payload\ncontext"),
      textareaField("configSchema", "Config schema", '{\n  "type": "object"\n}'),
    ],
    getSummary: (data) => `${String(data.packageName ?? "")} · ${String(data.entrypoint ?? "")}`.trim(),
  },
};

export const getCatalogNodeDefinition = (type: CatalogNodeType) =>
  NODE_CATALOG_DEFINITIONS[type];

export const getCatalogNodeDefaults = (type: CatalogNodeType) => ({
  ...NODE_CATALOG_DEFINITIONS[type].defaults,
});

export const NODE_PICKER_OPTIONS: NodePickerOption[] = [
  {
    type: Nodetype.MANUALLTRIGGER,
    category: "Core / Flow Control",
    title: "Manual Trigger",
    description: "Starts the workflow manually when you click run.",
  },
  {
    type: Nodetype.SCHEDULE,
    category: "Core / Flow Control",
    title: "Schedule",
    description: "Run the workflow on a cron or interval schedule.",
  },
  {
    type: Nodetype.IFSWITCH,
    category: "Core / Flow Control",
    title: "IF / Switch",
    description: "Branch logic based on conditions or cases.",
  },
  {
    type: Nodetype.MERGE,
    category: "Core / Flow Control",
    title: "Merge",
    description: "Join multiple branches into one flow.",
  },
  ...CATALOG_NODE_TYPES.map((type) => {
    const definition = NODE_CATALOG_DEFINITIONS[type];
    return {
      type,
      category: definition.category,
      title: definition.title,
      description: definition.pickerDescription,
    };
  }),
];
