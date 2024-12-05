async function testWebhook() {
  const testPayload = {
    call_id: "test-123",
    timestamp: new Date().toISOString(),
    duration: 120,
    status: "completed",
    test_data: true
  };

  try {
    const response = await fetch('http://localhost:3000/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

// Run the test
testWebhook(); 