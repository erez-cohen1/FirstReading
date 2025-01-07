'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LawSummaryProps {
    queryId: number;
    apiKey: string;
}

const LawSummary: React.FC<LawSummaryProps> = ({ queryId, apiKey }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState<boolean>(false);

    const columnNames: Record<string, string> = {
        Name: 'שם החוק',
        SummaryLaw: 'תקציר החוק',
        LastUpdatedDate: 'תאריך עדכון אחרון',
        StatusID: 'סטטוס',
        NameHistoryTypeDesc: 'סטטוס החוק',
        FirstName: 'שם פרטי',
        LastName: 'שם משפחה',
        billname: 'שם החוק',
        committeename: 'שם הוועדה',
        initiatorsfullnames: 'יוזמה של',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://thingproxy.freeboard.io/fetch/https://redash.hasadna.org.il/api/queries/1433/results.json', {
                    headers: {
                        Authorization: `Key ${apiKey}`,
                    },
                });
                const responseData = response.data as { query_result: { data: { rows: any[] } } };
                setData(responseData.query_result.data.rows);
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [queryId, apiKey]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Sort rows by LastUpdatedDate in descending order
    const sortedData = [...data].sort((a, b) => new Date(b.LastUpdatedDate).getTime() - new Date(a.LastUpdatedDate).getTime());

    // Format LastUpdatedDate to only show date and time
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('he-IL')} ${date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;
    };

    // Show either all rows or top 3 rows based on `showAll`
    const displayedData = showAll ? sortedData : sortedData.slice(0, 3);

    return (
        <>
            <div className="Component" id="Schedule">
                <header className="Component-header">
                    <h1>הצעות חוק</h1>
                </header>

                <main className="Component-main">
                    <section className="Schedule-section" id="General-Assembly">
                        {displayedData.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    width: '50rem', // Set the width to a fixed value
                                }}                                
                            >
                                {Object.entries(item)
                                    .filter(([key, value]) => value !== null && key !== 'StatusID') // Skip null values and StatusID
                                    .map(([key, value]) => (
                                        <p key={key} style={{ margin: '5px 0' }}>
                                            <strong>{columnNames[key] || key}:</strong>{' '}
                                            {key === 'LastUpdatedDate' ? formatDate(value as string) : value as string}
                                        </p>
                                    ))}
                            </div>
                        ))}
                    </section>

                    <button
                        onClick={() => setShowAll(!showAll)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            margin: '20px auto',
                            display: 'block',
                        }}
                    >
                        {showAll ? 'הצג פחות' : 'הצג הכל'}
                    </button>
                </main>
            </div>
        </>
    );
};

export default LawSummary;
