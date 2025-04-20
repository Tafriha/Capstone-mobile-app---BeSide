require("dotenv").config();
const mongoose = require("mongoose");
const connectDb = require("../config/db");

const dummyVerificationData = [
    {
        firstName: "John",
        lastName: "Doe",
        wwcc: {
            number: "11111111-11",
            expiryDate: "21-10-2029",
        },
        license: {
            number: "123456789",
            expiryDate: "21-10-2025",
        },
        dob: "01-01-1990",
    },
    {
        firstName: "Emily",
        lastName: "Smith",
        wwcc: {
            number: "22222222-22",
            expiryDate: "15-06-2030",
        },
        license: {
            number: "234567891",
            expiryDate: "15-06-2027",
        },
        dob: "12-03-1985",
    },
    {
        firstName: "Michael",
        lastName: "Brown",
        wwcc: {
            number: "33333333-33",
            expiryDate: "10-12-2028",
        },
        license: {
            number: "345678912",
            expiryDate: "10-12-2026",
        },
        dob: "23-07-1992",
    },
    {
        firstName: "Sarah",
        lastName: "Johnson",
        wwcc: {
            number: "44444444-44",
            expiryDate: "01-01-2031",
        },
        license: {
            number: "456789123",
            expiryDate: "01-01-2028",
        },
        dob: "14-11-1988",
    },
    {
        firstName: "David",
        lastName: "Taylor",
        wwcc: {
            number: "55555555-55",
            expiryDate: "30-09-2029",
        },
        license: {
            number: "567891234",
            expiryDate: "30-09-2026",
        },
        dob: "05-09-1995",
    },
    {
        firstName: "Jessica",
        lastName: "Lee",
        wwcc: {
            number: "66666666-66",
            expiryDate: "20-05-2030",
        },
        license: {
            number: "678912345",
            expiryDate: "20-05-2027",
        },
        dob: "29-04-1993",
    },
    {
        firstName: "Chris",
        lastName: "Martin",
        wwcc: {
            number: "77777777-77",
            expiryDate: "15-07-2028",
        },
        license: {
            number: "789123456",
            expiryDate: "15-07-2026",
        },
        dob: "08-08-1989",
    },
    {
        firstName: "Olivia",
        lastName: "Williams",
        wwcc: {
            number: "88888888-88",
            expiryDate: "10-11-2030",
        },
        license: {
            number: "891234567",
            expiryDate: "10-11-2027",
        },
        dob: "03-12-1991",
    },
    {
        firstName: "Daniel",
        lastName: "Anderson",
        wwcc: {
            number: "99999999-99",
            expiryDate: "05-03-2031",
        },
        license: {
            number: "912345678",
            expiryDate: "05-03-2028",
        },
        dob: "17-06-1987",
    },
    {
        firstName: "Sophie",
        lastName: "Thomas",
        wwcc: {
            number: "10101010-10",
            expiryDate: "19-08-2029",
        },
        license: {
            number: "102938475",
            expiryDate: "19-08-2026",
        },
        dob: "27-10-1994",
    },
    {
        firstName: "Liam",
        lastName: "White",
        wwcc: {
            number: "11121314-11",
            expiryDate: "12-12-2030",
        },
        license: {
            number: "112233445",
            expiryDate: "12-12-2027",
        },
        dob: "11-01-1990",
    },
    {
        firstName: "Grace",
        lastName: "Harris",
        wwcc: {
            number: "12121212-12",
            expiryDate: "28-02-2031",
        },
        license: {
            number: "223344556",
            expiryDate: "28-02-2028",
        },
        dob: "09-03-1986",
    },
    {
        firstName: "Nathan",
        lastName: "Walker",
        wwcc: {
            number: "13131313-13",
            expiryDate: "07-09-2029",
        },
        license: {
            number: "334455667",
            expiryDate: "07-09-2026",
        },
        dob: "22-08-1992",
    },
    {
        firstName: "Isabella",
        lastName: "King",
        wwcc: {
            number: "14141414-14",
            expiryDate: "03-06-2030",
        },
        license: {
            number: "445566778",
            expiryDate: "03-06-2027",
        },
        dob: "31-05-1991",
    },
    {
        firstName: "Jack",
        lastName: "Hall",
        wwcc: {
            number: "15151515-15",
            expiryDate: "16-04-2028",
        },
        license: {
            number: "556677889",
            expiryDate: "16-04-2025",
        },
        dob: "02-02-1993",
    },
    {
        firstName: "Chloe",
        lastName: "Allen",
        wwcc: {
            number: "16161616-16",
            expiryDate: "13-01-2031",
        },
        license: {
            number: "667788990",
            expiryDate: "13-01-2028",
        },
        dob: "10-10-1988",
    },
    {
        firstName: "Lucas",
        lastName: "Scott",
        wwcc: {
            number: "17171717-17",
            expiryDate: "25-07-2030",
        },
        license: {
            number: "778899001",
            expiryDate: "25-07-2027",
        },
        dob: "18-04-1995",
    },
    {
        firstName: "Ava",
        lastName: "Young",
        wwcc: {
            number: "18181818-18",
            expiryDate: "02-03-2029",
        },
        license: {
            number: "889900112",
            expiryDate: "02-03-2026",
        },
        dob: "06-06-1989",
    },
    {
        firstName: "Ethan",
        lastName: "Green",
        wwcc: {
            number: "19191919-19",
            expiryDate: "29-09-2030",
        },
        license: {
            number: "990011223",
            expiryDate: "29-09-2027",
        },
        dob: "04-05-1990",
    },
    {
        firstName: "Zoe",
        lastName: "Baker",
        wwcc: {
            number: "20202020-20",
            expiryDate: "11-11-2029",
        },
        license: {
            number: "100200300",
            expiryDate: "11-11-2026",
        },
        dob: "13-07-1992",
    }
];

const dummyVerificationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    wwcc: {
        number: String,
        expiryDate: String
    },
    license: {
        number: String,
        expiryDate: String
    },
    dob: String
});

const seedDummyData = async () => {
    try {
        await connectDb();
        console.log("Connected to MongoDB");

        const dummyVerification = mongoose.models.dummyVerification || mongoose.model("dummyVerification", dummyVerificationSchema);
        await dummyVerification.deleteMany({}); // Clear existing data
        // Clear existing data
        await dummyVerification.deleteMany({});

        // Insert dummy data
        await dummyVerification.insertMany(dummyVerificationData);
        console.log("Dummy data seeded successfully");

        await mongoose.connection.close();

    }
    catch (error) {
        console.error("Error seeding dummy data:", error);
    }

}
seedDummyData();

