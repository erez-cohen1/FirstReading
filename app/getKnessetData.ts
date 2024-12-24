interface ScheduleDataProps {
  SelectedDate: string;
  SelectedMonth: string | null;
  SelectedYear: string | null;
}

export async function getScheduleData(props: ScheduleDataProps) {
  // Make the HTTP POST request to the API
  const payload = {
    SelectedDate: "2024-12-23T00:00:00.000Z",
    SelectedMonth: null,
    SelectedYear: null,
  };
  const response = await fetch(
    "https://knesset.gov.il/WebSiteApi/knessetapi/KnessetMainEvents/GetEventsToday",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    }
  );
  // Check if the response is successful
  if (!response.ok) {
    console.log("Error fetching data:", response.status, response.statusText);
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  console.log(await response.json());
}

const prop: ScheduleDataProps = {
  SelectedDate: "2024-12-23T00:00:00.000Z",
  SelectedMonth: null,
  SelectedYear: null,
};

// getScheduleData(prop);
