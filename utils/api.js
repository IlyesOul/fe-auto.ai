export async function askGPT(prompt, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, token }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return await res.json();
}
