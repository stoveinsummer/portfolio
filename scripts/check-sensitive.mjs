import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const gitCandidates = [
  "git",
  process.env.ProgramFiles ? join(process.env.ProgramFiles, "Git", "cmd", "git.exe") : "",
  join(homedir(), ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "native", "git", "cmd", "git.exe"),
].filter(Boolean);
let trackedOutput;
for (const git of gitCandidates) {
  try { trackedOutput = execFileSync(git, ["ls-files", "-z"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); break; } catch { /* 다음 설치 위치 확인 */ }
}
if (trackedOutput === undefined) {
  console.error("Git 실행 파일을 찾지 못해 민감정보 검사를 시작할 수 없습니다.");
  process.exit(1);
}
const tracked = trackedOutput.split("\0").filter(Boolean);
const forbiddenFiles = [
  /(^|\/)\.env($|\.)/i,
  /(^|\/)(credentials|service-account|secrets?)[^/]*\.json$/i,
  /\.(?:key|p12|pfx|jks|keystore|sqlite3?|db|bak|backup)$/i,
  /(^|\/)(?:private|captures|screenshots)(\/|$)/i,
];
const secretPatterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["GitHub token", /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/],
  ["OpenAI key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
];

const findings = [];
for (const file of tracked) {
  if (forbiddenFiles.some((pattern) => pattern.test(file)) && !/\.env(?:\.[^/]+)?\.example$/i.test(file)) findings.push(`${file}: 추적 금지 파일`);
  let content;
  try { content = readFileSync(file, "utf8"); } catch { continue; }
  for (const [label, pattern] of secretPatterns) if (pattern.test(content)) findings.push(`${file}: ${label} 형식 발견`);
}

if (findings.length) {
  console.error("민감정보 검사가 실패했습니다.\n" + findings.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`민감정보 검사 통과: 추적 파일 ${tracked.length}개`);
