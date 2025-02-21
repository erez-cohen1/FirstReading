import React from 'react';

interface Props {
  text: string;
}

// Define the 6 stages with their respective words
const wordLists = [
  // Stage 1: קריאה טרומית 1
  [
    'הונחה על שולחן הכנסת לדיון מוקדם',
    'במליאה לדיון מוקדם',
    'הוסבה להצעה לסדר היום',
    'בוועדת הכנסת לקביעת הוועדה המטפלת',
  ],
  // Stage 2: הכנה לקריאה ראשונה
  [
    'הכנה לקריאה ראשונה',
    'אושרה בוועדה לקריאה ראשונה',
    'הונחה על שולחן הכנסת לקריאה ראשונה',
    'לדיון במליאה לקראת הקריאה הראשונה',
  ],
  // Stage 3: קריאה ראשונה
  [
    'אושרה בקריאה ראשונה',
    'הודעה על בקשה להחלת דין רציפות',
    'לדיון במליאה על החלת דין רציפות',
    'הבקשה לדין רציפות נדחתה במליאה',
  ],
  // Stage 4: הכנה לקריאה שנייה ושלישית
  [
    'הכנה לקריאה שנייה ושלישית',
    'אושרה בוועדה לקריאה שנייה-שלישית',
    'הונחה על שולחן הכנסת לקריאה שנייה-שלישית',
    'לדיון במליאה לקראת קריאה שנייה-שלישית',
  ],
  // Stage 5: קריאה שנייה ושלישית
  [
    'אושרה בקריאה שנייה',
    'הוחזרה לוועדה להכנה לקריאה שלישית',
    'הכנה לקריאה שלישית',
    'הונחה על שולחן הכנסת לקריאה שלישית',
    'לדיון במליאה לקראת קריאה שלישית',
  ],
  // Stage 6: החוק עבר/לא עבר
  ['התקבלה בקריאה שלישית'],
];

const SquareFillComponent: React.FC<Props> = ({ text }) => {
  // Calculate how many squares should be filled based on the text
  let filledSquares = 1; // Default to 1 square if the text does not match any word
  for (let i = 0; i < wordLists.length; i++) {
    if (wordLists[i].includes(text)) {
      filledSquares = i + 1; // Map to the corresponding stage (1 to 6)
      break;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.2rem' }}>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          style={{
            width: '0.7rem',
            height: '0.7rem',
            backgroundColor: index < filledSquares ? '#FF6700' : 'transparent',
            border: '1.4px solid #0900BD',
          }}
        />
      ))}
    </div>
  );
};

export default SquareFillComponent;
