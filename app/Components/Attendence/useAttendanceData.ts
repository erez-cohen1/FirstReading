// import { useState, useEffect } from "react";
// import { MkData } from "./MkData";

// export const useAttendanceData = (): [MkData[], boolean, string | null] => {
//   const [data, setData] = useState<MkData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       try {
//         const response = await fetch("https://knesset.gov.il/WebSiteApi/knessetapi/MkLobby/GetMkLobbyData?lang=he");
//         if (!response.ok) throw new Error(`Error: ${response.status}`);

//         const json = await response.json();
//         setData(
//           json.mks.map((mk: any) => ({
//             MkId: mk.MkId,
//             IsPresent: mk.IsPresent,
//             IsCoalition: mk.IsCoalition,
//             Name: `${mk.Firstname} ${mk.Lastname}`,
//             MkImage: mk.ImagePath,
//             FactionName: mk.FactionName,
//             Phone: mk.Phone,
//             isGoverment: json.governmentPositions.some(
//               (position: any) => position.IsMk && position.MkId === mk.MkId
//             ),
//           }))

          
//         );
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAttendanceData();
//   }, []);

//   return [data, loading, error];
// };

import { useState, useEffect } from "react";
import { MkData } from "./MkData";
import mkDetails from "./mk_Data.json";

export const attendanceDataFromFile = (): [MkData[], boolean, string | null] => {
  const [data, setData] = useState<MkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Step 1: Load data from mk_Data.json
        const localData: MkData[] = await mkDetails;

        // Step 2: Fetch attendance mapping from the API
        const response = await fetch("https://knesset.gov.il/WebSiteApi/knessetapi/MkLobby/GetMkPresent?lang=he");
        if (!response.ok) throw new Error(`Error fetching attendance data: ${response.status}`);

        const attendanceMapping: { MkId: number, IsPresent: boolean }[] = await response.json();

        // Step 3: Update local data to reflect attendance status
        const updatedData = localData.map((mk) => {
          // Find the attendance for the current MkId
          const attendance = attendanceMapping.find((att) => att.MkId === mk.MkId);
          return {
            MkId: mk.MkId,
            IsCoalition: mk.IsCoalition,
            Name: mk.Name,
            MkImage: mk.MkImage,
            FactionName: mk.FactionName,
            Phone: mk.Phone,
            isGoverment: mk.isGoverment,
            IsPresent: attendance ? attendance.IsPresent : false, // Default to false if not found
          };
        });

        setData(updatedData);
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

