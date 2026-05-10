import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

// ─── AUTH HELPERS ────────────────────────────────────────────────
export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
};

// ─── PROFILE ─────────────────────────────────────────────────────
export const useProfile = () => {
  const [user, setUser] = useState<any>(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/profile");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateProfile = async (data: { name?: string }) => {
    const res = await api.put("/users/profile", data);
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const res = await api.put("/users/change-password", { currentPassword, newPassword });
    return res.data;
  };

  return { user, loading, error, refetch: fetch, updateProfile, changePassword };
};

// ─── COURSES ─────────────────────────────────────────────────────
export const useCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses")
      .then(r => setCourses(r.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
};

// ─── ENROLLED COURSE (from progress) ─────────────────────────────
// Resolves the student's active course by reading their progress records
export const useEnrolledCourse = () => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Try learningProfile.course.id from profile
        const profileRes = await api.get("/users/profile");
        const profile = profileRes.data.user?.learningProfile;
        if (profile?.course?.id) {
          setCourseId(profile.course.id.toString());
          setCourseTitle(profile.course.title || "");
          return;
        }
        // 2. Fallback: read from XP endpoint to get progress, then hit admin courses
        // Use the progress xp endpoint to confirm enrollment, then get courses list
        const coursesRes = await api.get("/admin/courses");
        const allCourses = coursesRes.data.data || [];
        // pick first course that has progress
        for (const c of allCourses) {
          try {
            const p = await api.get(`/progress/course/${c._id}`);
            if (p.data.completedLessons > 0 || p.data.totalLessons > 0) {
              setCourseId(c._id);
              setCourseTitle(c.title);
              return;
            }
          } catch { continue; }
        }
        // 3. Last fallback: just pick first course
        if (allCourses.length > 0) {
          setCourseId(allCourses[0]._id);
          setCourseTitle(allCourses[0].title);
        }
      } catch {
        setCourseId(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { courseId, courseTitle, loading };
};

// ─── ROADMAP ─────────────────────────────────────────────────────
export const useRoadmap = (courseId: string | null) => {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    api.get(`/courses/${courseId}/roadmap`)
      .then(r => setLevels(r.data.levels || []))
      .catch(() => setLevels([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  return { levels, loading };
};

// ─── PROGRESS ────────────────────────────────────────────────────
export const useProgress = (courseId: string | null) => {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await api.get(`/progress/course/${courseId}`);
      setProgress(res.data);
    } catch { setProgress(null); }
    finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { fetch(); }, [fetch]);

  const completeLesson = async (lessonId: string) => {
    const res = await api.post(`/progress/lesson/${lessonId}/complete`);
    await fetch();
    // res.data = { success, message, xpEarned, totalXP } or { success, message, totalXP } if already done
    return res.data;
  };

  const updateScore = async (levelId: string, score: number) => {
    const res = await api.post("/progress/level/score", { levelId, score });
    await fetch();
    return res.data;
  };

  return { progress, loading, completeLesson, updateScore, refetch: fetch };
};

// ─── XP ──────────────────────────────────────────────────────────
export const useXP = () => {
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/progress/xp")
      .then(r => setTotalXP(r.data.totalXP || 0))
      .catch(() => setTotalXP(0))
      .finally(() => setLoading(false));
  }, []);

  return { totalXP, loading };
};

// ─── ACHIEVEMENTS ────────────────────────────────────────────────
export const useAchievements = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/achievements/my")
      .then(r => setAchievements(r.data.data || []))
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  return { achievements, loading };
};

// ─── LEADERBOARD ─────────────────────────────────────────────────
export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leaderboard")
      .then(r => setLeaderboard(r.data.data || r.data || []))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, []);

  return { leaderboard, loading };
};

// ─── SESSIONS ────────────────────────────────────────────────────
export const useSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const res = await api.get("/sessions/my");
      setSessions(res.data.data || []);
    } catch { setSessions([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const bookSession = async (data: { mentorId: string; date: string; meetingLink?: string }) => {
    const res = await api.post("/sessions", data);
    await fetch();
    return res.data;
  };

  const cancelSession = async (id: string) => {
    const res = await api.put(`/sessions/${id}/cancel`);
    await fetch();
    return res.data;
  };

  return { sessions, loading, bookSession, cancelSession, refetch: fetch };
};

// ─── MESSAGES ────────────────────────────────────────────────────
export const useMessages = (roomId: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      const res = await api.get(`/messages/${roomId}`);
      setMessages(res.data.data || []);
    } catch { setMessages([]); }
    finally { setLoading(false); }
  }, [roomId]);

  useEffect(() => { fetch(); }, [fetch]);

  const sendMessage = async (message: string) => {
    const res = await api.post("/messages", { roomId, message });
    await fetch();
    return res.data;
  };

  return { messages, loading, sendMessage, refetch: fetch };
};

// ─── AI FEATURES ─────────────────────────────────────────────────
export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const getSkillGap = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ai/skill-gap");
      return res.data.data;
    } finally { setLoading(false); }
  };

  const getLearningPath = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ai/learning-path");
      return res.data.data;
    } finally { setLoading(false); }
  };

  const summarize = async (courseId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/ai/summarize/${courseId}`);
      return res.data.data;
    } finally { setLoading(false); }
  };

  const suggestNext = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ai/suggest-next");
      return res.data.data;
    } finally { setLoading(false); }
  };

  const getProgressReport = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ai/progress-report");
      return res.data.data;
    } finally { setLoading(false); }
  };

  const getKeyConcepts = async (courseId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/ai/key-concepts/${courseId}`);
      return res.data.data;
    } finally { setLoading(false); }
  };

  const matchMentor = async () => {
    setLoading(true);
    try {
      const res = await api.post("/matches/ai-match");
      return res.data;
    } finally { setLoading(false); }
  };

  return { loading, getSkillGap, getLearningPath, summarize, suggestNext, getProgressReport, getKeyConcepts, matchMentor };
};

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────
export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/announcements")
      .then(r => setAnnouncements(r.data.data || r.data || []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  return { announcements, loading };
};

// ─── QUIZ ─────────────────────────────────────────────────────────
export const useQuiz = (lessonId: string | null) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    api.get(`/quizzes/lesson/${lessonId}`)
      .then(r => setQuiz(r.data.data))
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { quiz, loading };
};
