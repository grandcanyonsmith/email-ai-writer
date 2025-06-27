const fetch = require('node-fetch');

async function testEmailGeneration() {
  const testData = {
    businessName: "Test Business",
    businessDescription: "A test business for email generation",
    targetAudience: "Test audience",
    leadMagnet: "Free test guide",
    primaryCTA: "book_call",
    secondaryCTA: "download",
    heroJourney: "Test founder story",
    resources: ["videos", "templates"],
    engageCount: 2,
    guideCount: 1,
    offerCount: 1
  };

  try {
    console.log('Testing email generation endpoint...');
    const response = await fetch('http://localhost:3001/api/generate-sequence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error:', data);
      return;
    }

    console.log('✅ Email generation successful!');
    console.log(`Generated ${data.sequence.emailCount} emails`);
    console.log('Business:', data.sequence.businessName);
    console.log('Distribution:', data.sequence.distribution);
    
  } catch (error) {
    console.error('❌ Error testing email generation:', error.message);
  }
}

testEmailGeneration(); 