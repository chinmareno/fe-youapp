export const api = async (
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> => {
  const baseUrl = process.env.NEXT_PUBLIC_YOUAPP_API ?? "";
  console.log(baseUrl);
  const res = await fetch(baseUrl + input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    throw new Error(String(res.status));
  }
  return res.json();
};
