'use client';
import React, { useEffect, useState } from 'react';

type Vote = {
    VoteId: number;
    VoteProtocolNo: number;
    VoteDate: string;
    VoteDateStr: string;
    VoteTimeStr: string;
    VoteType: string;
    ItemTitle: string;
    VoteDateLongStr: string;
    KnessetId: number;
    SessionId: number;
};

type VoteData = {
    Table: Vote[];
};

const VoteCount = () => {
    const [voteData, setVoteData] = useState<VoteData | null>(null); // Use VoteData type
    const [showItemTitles, setShowItemTitles] = useState(false); // State to toggle ItemTitles visibility

    useEffect(() => {
        // Fetching the data from the JSON file
        fetch('/mock_data_votes.json')
            .then((response) => response.json())
            .then((data) => {
                setVoteData(data);
            });
    }, []);

    if (!voteData) {
        return <div>Loading...</div>;
    }

    const toggleItemTitles = () => {
        setShowItemTitles(!showItemTitles); // Toggle visibility of ItemTitles
    };

    return (
        <div dir="rtl">
            <p onClick={toggleItemTitles} style={{ cursor: 'pointer' }}>
                {voteData.Table.length} הצבעות
            </p>
            {showItemTitles && (
                <ul>
                    {voteData.Table.map((vote) => (
                        <li key={vote.VoteId}>{vote.ItemTitle}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VoteCount;
