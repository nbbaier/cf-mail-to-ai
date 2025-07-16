/// <reference types="@types/node" />

import alchemy from "alchemy";
import { GitHubComment } from "alchemy/github";
import { Worker } from "alchemy/cloudflare";


const stage = process.env.STAGE || process.env.BRANCH_PREFIX || "dev";
const app = await alchemy("my-alchemy-app", {
  stage,
});

export const worker = await Worker("worker", {
  name: "my-alchemy-app",
  entrypoint: "src/worker.ts",
  version: stage === "prod" ? undefined : stage,
});

console.log(worker.url);


if (process.env.PULL_REQUEST) {
  const previewUrl = worker.url;
  
  await GitHubComment("pr-preview-comment", {
    owner: process.env.GITHUB_REPOSITORY_OWNER || "your-username",
    repository: process.env.GITHUB_REPOSITORY_NAME || "cf-mail-to-ai",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `
## 🚀 Preview Deployed

Your preview is ready! 

**Preview URL:** ${previewUrl}

This preview was built from commit ${process.env.GITHUB_SHA}

---
<sub>🤖 This comment will be updated automatically when you push new commits to this PR.</sub>`,
  });
}

await app.finalize();
