const https = require('http'); // using http since it's localhost:8000

// ==========================================
// 🚨 REPLACE THIS WITH YOUR GENERATED API KEY
// ==========================================
const API_KEY = "6|QtYoLWv8gZNGmLzrdle1TJ6FKfUJi76NC2q0at6806ab35f8";

const orderData = JSON.stringify({
    customer_name: "Ahmed External",
    customer_phone: "0600112233",
    customer_address: "123 API Avenue, Maârif",
    city: "Casablanca",
    amount_cod: 450.00,
    delivery_notes: "Please call before arrival. Order imported from website."
});

const options = {
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/orders',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(orderData)
    }
};

console.log("🚀 Sending Order from 'External Website' to LogisMaghreb...");

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 201) {
            console.log("\n✅ SUCCESS! Order imported successfully.");
            console.log("📦 Response data:", JSON.parse(responseBody));
            console.log("\n👉 Go check your Merchant Dashboard Order List or Driver Available Orders, you will see it there instantly!");
        } else {
            console.log(`\n❌ FAILED with status: ${res.statusCode}`);
            console.log("Error details:", responseBody);
        }
    });
});

req.on('error', (error) => {
    console.error("\n❌ Request error:", error);
});

req.write(orderData);
req.end();
