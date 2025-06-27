const fetch = require('node-fetch');

async function testEmailEditing() {
  const testData = {
    emailType: 'engage',
    currentContent: 'This is a test email content that needs to be edited.',
    currentSubject: 'Test Subject',
    businessData: {
      businessName: "Test Business",
      businessDescription: "A test business for email editing",
      targetAudience: "Test audience",
      leadMagnet: "Free test guide",
      primaryCTA: "book_call",
      secondaryCTA: "download",
      heroJourney: "Test founder story",
      resources: ["videos", "templates"]
    },
    aiPrompt: "Make this email more casual and friendly"
  };

  try {
    console.log('Testing email editing endpoint...');
    const response = await fetch('http://localhost:3001/api/edit-email', {
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

    console.log('✅ Email editing successful!');
    console.log('Updated Subject:', data.subject);
    console.log('Updated Content:', data.content.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('❌ Error testing email editing:', error.message);
  }
}

testEmailEditing(); 