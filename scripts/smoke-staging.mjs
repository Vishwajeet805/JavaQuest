const base = process.env.STAGING_URL?.replace(/\/$/, "");
if (!base?.startsWith("https://")) throw new Error("STAGING_URL must be an HTTPS URL");
async function expect(path, status, headers = {}) {
  const response = await fetch(`${base}${path}`, { headers, redirect: "error" });
  if (response.status !== status) throw new Error(`${path}: expected ${status}, received ${response.status}`);
  console.log(`✓ ${path} (${status})`);
}
await expect("/api/health/live", 200);
await expect("/api/health/ready", 200);
await expect("/api/metrics", 401);
if (process.env.METRICS_TOKEN) await expect("/api/metrics", 200, { authorization: `Bearer ${process.env.METRICS_TOKEN}` });
console.log("Staging smoke checks passed");
