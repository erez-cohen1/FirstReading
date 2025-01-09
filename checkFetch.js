fetch(
  "https://knesset.gov.il/WebSiteApi/knessetapi/KnessetMainEvents/GetEventsToday",
  {
    method: "POST",
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/json",
      Origin: "https://main.knesset.gov.il",
      Referer: "https://main.knesset.gov.il/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
    body: JSON.stringify({
      SelectedDate: "2025-01-05T16:08:47.423Z",
      SelectedMonth: null,
      SelectedYear: null,
    }),
  }
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
