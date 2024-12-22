const fetchVotes = async () => {
  const url = 'https://knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVotesHeaders';
  
  const payload = {
    SearchType: 1,
    FromDate: "2024-12-18",
    ToDate: "2024-12-18"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);  // Handle the response data as needed
  } catch (error) {
    console.error('Error fetching votes:', error);
  }
};

fetchVotes();
