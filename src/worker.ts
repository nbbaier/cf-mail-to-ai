import type { worker } from "../alchemy.run.ts";

export default {
	async fetch(_req: Request, env: typeof worker.Env) {
		await env.CACHE.put("key", "foo");
		const value = await env.CACHE.get("key");
		return Response.json({
			cache: value,
			apiHost: env.API_HOST || "not set",
		});
	},
};
