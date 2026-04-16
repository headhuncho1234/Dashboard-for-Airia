export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { agentId, userInput = "run" } = req.body;
  if (!agentId) {
    return res.status(400).json({ error: "agentId is required" });
  }
  const VALID_AGENTS = [
    "6c30db8e-f89f-463c-a724-30b4b2971d5c",
    "7be970e3-cdef-42c8-be4b-ae8664d2afe2",
    "ac8a9a6d-3688-4b1f-a9cd-5f35f2caa770",
    "f05848cf-0e05-4cfa-b704-a789757a6548",
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
        }),
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
