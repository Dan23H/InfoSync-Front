import { useEffect, useState } from "react";
import { getUserById, getReports } from "../api";
export function useModerationReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);

        const uniqueUserIds = [...new Set(data.map(r => r.userId))];
        const authorMap: Record<string, string> = {};
        await Promise.all(uniqueUserIds.map(async (id) => {
          try {
            const user = await getUserById(id);
            authorMap[id] = user.userName;
          } catch {
            authorMap[id] = id;
          }
        }));
        setAuthors(authorMap);
      } catch (err) {
        // Manejo de error
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const removeReport = (id: string) => setReports(reports => reports.filter(r => r._id !== id));

  return { reports, authors, loading, setReports, removeReport };
}