import React from 'react';

const SquaresWithText = () => {
  const numbers = [1, 2, 3, 4, 5, 6];  // Numbers from 1 to 6
  const texts = [
    '1 קריאה טרומית', '2 הכנה לקריאה ראשונה', '3 קריאה ראשונה', 
    '4 הכנה לקריאה שנייה ושלישית', '5 קריאה שנייה ושלישית', '6 החוק עבר',""
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',border: '0.2rem solid #0900BD', margin: '0.3rem', padding: '0.8rem', backgroundColor: '#ffead8', width: 'fit-content'
    }}>
      {/* Displaying the squares */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        {numbers.map((num, index) => (
          <div
            key={index}
            style={{
              width: '1.1rem',
              height: '1.1rem',
              margin: '0.2rem',
              backgroundColor: index === 0 ? '#FF6700' : 'transparent', // Fill only the first square (most right square)
              border: '1.4px solid #0900BD',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1rem',
              fontWeight: 'normal',
            }}
          >
            {num}
          </div>
          
          
        ))}
          {/* Adding the image (Vector.png) to the left of the squares */}
          <img 
          src="/Vector.png"  // Path to the image in the public folder
          alt="Vector" 
          style={{ width: '1.2rem', height: '1.2rem', marginRight: '1.5rem' }} // Space between image and squares
        />
      </div>
      
      {/* Displaying the rows of text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', fontWeight: 'normal' }}>
        {texts.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default SquaresWithText;