const axios = require("axios");

const API_URL = "http://localhost:5000";

async function testPayment() {
    try {
        console.log("1️⃣  Logging in...");
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: "user@cartly.com",
            password: "user123"
        });
        const { token, user } = loginRes.data;
        console.log("✅ Logged in as:", user.email);

        console.log("2️⃣  Fetching Products...");
        const productsRes = await axios.get(`${API_URL}/api/products`);
        const product = productsRes.data[0];
        if (!product) throw new Error("No products found to buy");
        console.log("✅ Selected Product:", product.name, "(Stock:", product.stock, ")");

        console.log("3️⃣  Adding to Cart...");
        await axios.post(
            `${API_URL}/api/cart/add`,
            { productId: product._id, quantity: 1 },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ Added to cart");

        console.log("4️⃣  Attempting COD Payment...");
        // Mock payload matching frontend
        const payload = {
            shippingAddress: {
                name: "Test User",
                address: "123 Test St",
                city: "Test City",
                state: "TS",
                zip: "12345",
                country: "India",
                phone: "9999999999"
            },
            paymentMethod: "COD",
            cartItems: [
                { productId: product._id, quantity: 1 }
            ] // Sending cartItems as current frontend does
        };

        const paymentRes = await axios.post(
            `${API_URL}/api/payment/cod`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ PAYMENT SUCCESS:", paymentRes.data);

    } catch (err) {
        if (err.response) {
            console.error("❌ PAYMENT FAILED:", err.response.status, err.response.data);
        } else {
            console.error("❌ NETWORK/SCRIPT ERROR:", err.message);
        }
    }
}

testPayment();
