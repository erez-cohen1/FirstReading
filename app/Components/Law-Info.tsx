import React from 'react';

const SquaresWithText = () => {
  const numbers = [1, 2, 3, 4, 5, 6];  // Numbers from 1 to 6
  const texts = [
    '1 קריאה טרומית', '2 הכנה לקריאה ראשונה', '3 קריאה ראשונה', 
    '4 הכנה לקריאה שנייה ושלישית', '5 קריאה שנייה ושלישית', '6 החוק עבר',""
  ];

  return (
    <div className='law-popup-div'>
      {/* Displaying the squares */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        {numbers.map((num, index) => (
          <div
            key={index}
            className='law-popup-squeres'
            style={{
              backgroundColor: index === 0 ? '#FF6700' : 'transparent', // Fill only the first square (most right square)
              color: index === 0 ? 'white' : '#0900BD', // Change the text color of the filled square
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
      <div className='law-popup-text'>
        {texts.map((text, index) => (
          <p key={index} style={{marginBottom:"0.2rem"}}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default SquaresWithText;