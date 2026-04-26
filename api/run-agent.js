export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { agentId, userInput = "run" } = req.body;
  if (!agentId) {
    return res.status(400).json({ error: "agentId is required" });
  }
 const VALID_AGENTS = [
  "6c30db8e-f89f-463c-a724-30b4b2971d5c", // Agent 1 - Data Processing & Guest Segmentation_with evaluation
  "7be970e3-cdef-42c8-be4b-ae8664d2afe2", // Agent 2 - Signal Discovery
  "ac8a9a6d-3688-4b1f-a9cd-5f35f2caa770", // Agent 3 - Pattern Clusering
  "f05848cf-0e05-4cfa-b704-a789757a6548", // Agent 4 - Person Synthesis
  "197b7527-226d-46ce-a79e-1f97b3108aa4", // Agent 5 — Master Orchestrator
  "6c9002a0-7b57-415a-bc83-9e547c08f94e", // Agent 6 — Campaign execution
  "d50a4471-9198-48ae-8072-3bfef9d83b73", // Agent 7 — Feedback loop
];
  if (!VALID_AGENTS.includes(agentId)) {
    return res.status(400).json({ error: "Invalid agentId" });
  }
  const apiKey = process.env.AIRIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }
  try {
    const response = await fetch(
      `https://api.airia.ai/v2/PipelineExecution/${agentId}`,
      {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          asyncOutput: false,
          userId: "019c90b7-30e0-7eb1-ae16-9fb1404489a6",
        }),
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    if (data?.success === false) {
      return res.status(500).json({ error: data.result || "Agent execution failed" });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
