import { getChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import WorkoutApp from "../workout-app";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getChatGPTUser();
  return <WorkoutApp displayName={user?.fullName?.split(" ")[0] ?? "주환"} authenticated={Boolean(user)} signOutPath={chatGPTSignOutPath("/")} />;
}
