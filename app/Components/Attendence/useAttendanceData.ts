import { useState, useEffect } from "react";
import { MkData } from "./MkData";
import { govData } from "./posData";
import mkDetails from "./mk_Data281.json";
//import govData1 from "./govermentPos.json";

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
          json.mks.map((mk: any) => {
            // Extract roles for the current MK
            const rolesList = json.knessetPositions
              .filter((position: any) => position.MkId === mk.MkId)
              .map((position: any) => position.RoleName);

            return {
              MkId: mk.MkId,
              IsPresent: mk.IsPresent,
              IsCoalition: mk.IsCoalition,
              Name: `${mk.Firstname} ${mk.Lastname}`,
              MkImage: mk.ImagePath,
              FactionName: mk.FactionName,
              Phone: mk.Phone,
              Mail: mk.Email, // Add Mail field
              RolesList: rolesList, // Add RolesList field
              isGoverment: json.governmentPositions.some(
                (position: any) => position.IsMk && position.MkId === mk.MkId
              ),
            };
          })
        );

        // // Handle non-MK government positions, if needed
        // const nonMkGovernmentPositions = json.governmentPositions.map((position: any) => ({
        //   MkId: position.MkId,
        //   IsPresent: position.IsPresent,
        //   mkImage: position.ImagePath,
        //   PositionName: position.RoleName,
        //   IsMk: position.IsMk,
        // }));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  console.log(JSON.stringify(data, null, 2));
  return [data, loading, error];
};

export const useAttendanceDataFromFile = (date: Date): [MkData[], boolean, string | null] => {
  const [data, setData] = useState<MkData[]>([]);
  const [GovData, setGovData] = useState<govData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Step 1: Load data from mk_Data.json
        const localData: MkData[] = await mkDetails;
        //const govermentDetail: govData[] = await govData1;
        const today = new Date();
        const isToday = (date.toDateString() == today.toDateString());
        var updatedData = localData;
        //var updatedGovData = govData1;
        if (isToday){
          // Step 2: Fetch attendance mapping from the API
          const response = await fetch("https://knesset.gov.il/WebSiteApi/knessetapi/MkLobby/GetMkPresent?lang=he");
          if (!response.ok) throw new Error(`Error fetching attendance data: ${response.status}`);

          const attendanceMapping: { MkId: number, IsPresent: boolean }[] = await response.json();
          
          // Step 3: Update local data to reflect attendance status
          updatedData = localData.map((mk) => {
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
              Mail: mk.Mail,
              RolesList: mk.RolesList
            };
          });

          // updatedGovData = govermentDetail.map((mk) => {
          //   // Find the attendance for the current MkId
          //   const attendance = attendanceMapping.find((att) => att.MkId === mk.MkId);
          //   return {
          //     MkId: mk.MkId,
          //     mkImage: mk.mkImage,
          //     PositionName: mk.PositionName,
          //     IsMk: mk.IsMk,
          //     IsPresent: attendance ? attendance.IsPresent : false, // Default to false if not found
          //   };
          // });
        }

        

        setData(updatedData);
        //setGovData(updatedGovData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [date]);

  return [data, loading, error];
};

