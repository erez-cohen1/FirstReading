import { useState, useEffect } from "react";
import { MkData } from "./MkData";

export const useAttendanceData = (): [MkData[], boolean, string | null] => {
  const [data, setData] = useState<MkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch("https://knesset.gov.il/WebSiteApi/knessetapi/MkLobby/GetMkLobbyData?lang=he");
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const json = await response.json();
        setData(
          json.mks.map((mk: any) => ({
            MkId: mk.MkId,
            IsPresent: mk.IsPresent,
            IsCoalition: mk.IsCoalition,
            Name: `${mk.Firstname} ${mk.Lastname}`,
            MkImage: mk.ImagePath,
            FactionName: mk.FactionName,
            Phone: mk.Phone,
            isGoverment: json.governmentPositions.some(
              (position: any) => position.IsMk && position.MkId === mk.MkId
            ),
          }))
        );
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  return [data, loading, error];
};
