import mongoose from "mongoose"

// ⚠️  Passwords are PLAIN TEXT here.
//     The seeder script must hash them with bcryptjs before inserting:
//     e.g.  user.password = await bcrypt.hash(user.password, 10)

export const USER_IDS = {
  admin:  new mongoose.Types.ObjectId("65b000000000000000000001"),
  user1:  new mongoose.Types.ObjectId("65b000000000000000000002"),
  user2:  new mongoose.Types.ObjectId("65b000000000000000000003"),
  user3:  new mongoose.Types.ObjectId("65b000000000000000000004"),
  user4:  new mongoose.Types.ObjectId("65b000000000000000000005"),
}

const users = [
  // ── Admin ────────────────────────────────────────────────
  {
    _id:            USER_IDS.admin,
    name:           "Admin TechMart",
    email:          "admin@techmart.dev",
    password:       "TechMart@Admin2026",   // ← HASH BEFORE INSERT
    confirmedEmail: true,
    isAdmin:        true,
    delivery: [
      {
        phone: "+1-800-000-0000",
        address: [
          {
            streetNumber:    "1",
            buildingNumber:  "HQ Tower",
            floorNumber:     "12",
            apartmentNumber: "1201",
            city:            "San Francisco",
            country:         "United States",
            landmark:        "Near Salesforce Park",
            notes:           "Corporate headquarters",
            postalCode:      94105,
          },
        ],
      },
    ],
  },

  // ── User 1 ───────────────────────────────────────────────
  {
    _id:            USER_IDS.user1,
    name:           "Ahmed Al-Rashid",
    email:          "ahmed@example.com",
    password:       "Ahmed@2026",           // ← HASH BEFORE INSERT
    confirmedEmail: true,
    isAdmin:        false,
    delivery: [
      {
        phone: "+971-50-123-4567",
        address: [
          {
            streetNumber:    "14",
            buildingNumber:  "Marina Heights",
            floorNumber:     "5",
            apartmentNumber: "502",
            city:            "Dubai",
            country:         "United Arab Emirates",
            landmark:        "Near Dubai Marina Mall",
            notes:           "Ring doorbell twice",
            postalCode:      "00000",
          },
          {
            streetNumber:    "88",
            buildingNumber:  "Jumeirah Villas",
            floorNumber:     "1",
            apartmentNumber: "Villa 3",
            city:            "Dubai",
            country:         "United Arab Emirates",
            landmark:        "Off Jumeirah Beach Road",
            postalCode:      "00000",
          },
        ],
      },
    ],
  },

  // ── User 2 ───────────────────────────────────────────────
  {
    _id:            USER_IDS.user2,
    name:           "Sarah Mitchell",
    email:          "sarah@example.com",
    password:       "Sarah@2026",           // ← HASH BEFORE INSERT
    confirmedEmail: true,
    isAdmin:        false,
    delivery: [
      {
        phone: "+1-415-555-0192",
        address: [
          {
            streetNumber:    "742",
            buildingNumber:  "Evergreen Terrace",
            floorNumber:     "2",
            apartmentNumber: "2B",
            city:            "New York",
            country:         "United States",
            landmark:        "Corner of 5th and Broadway",
            notes:           "Leave with concierge if not home",
            postalCode:      10001,
          },
        ],
      },
    ],
  },

  // ── User 3 ───────────────────────────────────────────────
  {
    _id:            USER_IDS.user3,
    name:           "Yuki Tanaka",
    email:          "yuki@example.com",
    password:       "Yuki@2026",            // ← HASH BEFORE INSERT
    confirmedEmail: true,
    isAdmin:        false,
    delivery: [
      {
        phone: "+81-90-1234-5678",
        address: [
          {
            streetNumber:    "3-7",
            buildingNumber:  "Shibuya Crossing Tower",
            floorNumber:     "8",
            apartmentNumber: "801",
            city:            "Tokyo",
            country:         "Japan",
            landmark:        "Above Shibuya Station",
            postalCode:      150_0002,
          },
        ],
      },
    ],
  },

  // ── User 4 ───────────────────────────────────────────────
  {
    _id:            USER_IDS.user4,
    name:           "Carlos Mendes",
    email:          "carlos@example.com",
    password:       "Carlos@2026",          // ← HASH BEFORE INSERT
    confirmedEmail: false,
    isAdmin:        false,
    delivery: [
      {
        phone: "+55-11-91234-5678",
        address: [
          {
            streetNumber:    "450",
            buildingNumber:  "Edifício Central",
            floorNumber:     "3",
            apartmentNumber: "301",
            city:            "São Paulo",
            country:         "Brazil",
            landmark:        "Perto do Parque Ibirapuera",
            notes:           "Portão azul",
            postalCode:      4094000,
          },
        ],
      },
    ],
  },
]

export default users
