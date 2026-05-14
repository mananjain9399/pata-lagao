import { supabase } from "@/integrations/supabase/client";

export async function recordScore(
  game: "number" | "word",
  points: number,
  highestLevel: number,
) {
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) return;
  // upsert: keep max points and max level
  const { data: existing } = await supabase
    .from("leaderboard")
    .select("points, highest_level")
    .eq("user_id", uid)
    .eq("game", game)
    .maybeSingle();
  const next = {
    user_id: uid,
    game,
    points: Math.max(points, existing?.points ?? 0),
    highest_level: Math.max(highestLevel, existing?.highest_level ?? 1),
  };
  if (existing) {
    await supabase
      .from("leaderboard")
      .update({ points: next.points, highest_level: next.highest_level })
      .eq("user_id", uid)
      .eq("game", game);
  } else {
    await supabase.from("leaderboard").insert(next);
  }
}

export interface LeaderRow {
  user_id: string;
  game: string;
  points: number;
  highest_level: number;
  display_name: string;
}

export async function fetchLeaderboard(game: "number" | "word"): Promise<LeaderRow[]> {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("user_id, game, points, highest_level")
    .eq("game", game)
    .order("points", { ascending: false })
    .limit(50);
  if (error || !data) return [];
  const ids = data.map((r) => r.user_id);
  if (ids.length === 0) return [];
  const { data: profs } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", ids);
  const map = new Map((profs ?? []).map((p) => [p.id, p.display_name]));
  return data.map((r) => ({ ...r, display_name: map.get(r.user_id) ?? "Player" }));
}
