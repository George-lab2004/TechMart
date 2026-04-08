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
  user5:  new mongoose.Types.ObjectId("65b000000000000000000101"),
  user6:  new mongoose.Types.ObjectId("65b000000000000000000102"),
  user7:  new mongoose.Types.ObjectId("65b000000000000000000103"),
  user8:  new mongoose.Types.ObjectId("65b000000000000000000104"),
  user9:  new mongoose.Types.ObjectId("65b000000000000000000105"),
  user10: new mongoose.Types.ObjectId("65b000000000000000000106"),
  user11: new mongoose.Types.ObjectId("65b000000000000000000107"),
  user12: new mongoose.Types.ObjectId("65b000000000000000000108"),
  user13: new mongoose.Types.ObjectId("65b000000000000000000109"),
  user14: new mongoose.Types.ObjectId("65b000000000000000000110"),
  user15: new mongoose.Types.ObjectId("65b000000000000000000111"),
  user16: new mongoose.Types.ObjectId("65b000000000000000000112"),
  user17: new mongoose.Types.ObjectId("65b000000000000000000113"),
  user18: new mongoose.Types.ObjectId("65b000000000000000000114"),
  user19: new mongoose.Types.ObjectId("65b000000000000000000115"),
  user20: new mongoose.Types.ObjectId("65b000000000000000000116"),
  user21: new mongoose.Types.ObjectId("65b000000000000000000117"),
  user22: new mongoose.Types.ObjectId("65b000000000000000000118"),
  user23: new mongoose.Types.ObjectId("65b000000000000000000119"),
  user24: new mongoose.Types.ObjectId("65b000000000000000000120"),
}

const users = [
  // ── Existing ───────────────────────────────────────────────
  { _id: USER_IDS.admin, name: "Admin TechMart", email: "admin@techmart.dev", password: "TechMart@Admin2026", confirmedEmail: true, isAdmin: true, delivery: [] },
  { _id: USER_IDS.user1, name: "Ahmed Al-Rashid", email: "ahmed@example.com", password: "Ahmed@2026", confirmedEmail: true, isAdmin: false, delivery: [] },
  { _id: USER_IDS.user2, name: "Sarah Mitchell", email: "sarah@example.com", password: "Sarah@2026", confirmedEmail: true, isAdmin: false, delivery: [] },
  { _id: USER_IDS.user3, name: "Yuki Tanaka", email: "yuki@example.com", password: "Yuki@2026", confirmedEmail: true, isAdmin: false, delivery: [] },
  { _id: USER_IDS.user4, name: "Carlos Mendes", email: "carlos@example.com", password: "Carlos@2026", confirmedEmail: true, isAdmin: false, delivery: [] },

  // ── New 20 Users ────────────────────────────────────────────
  { _id: USER_IDS.user5, name: "Ethan Walker", email: "ethan.walker@example.com", password: "Ethan@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Home", phone: "+1-202-555-0111", address: [{ city: "Washington", country: "USA", postalCode: "20001" }] }] },
  { _id: USER_IDS.user6, name: "Sofia Alvarez", email: "sofia.alvarez@example.com", password: "Sofia@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Apartment", phone: "+34-611-222-333", address: [{ city: "Madrid", country: "Spain", postalCode: "28013" }] }] },
  { _id: USER_IDS.user7, name: "Arjun Mehta", email: "arjun.mehta@example.com", password: "Arjun@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Home", phone: "+91-98765-11111", address: [{ city: "Mumbai", country: "India", postalCode: "400050" }] }] },
  { _id: USER_IDS.user8, name: "Yara Hassan", email: "yara.hassan@example.com", password: "Yara@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Home", phone: "+20-100-123-4567", address: [{ city: "Cairo", country: "Egypt", postalCode: "11765" }] }] },
  { _id: USER_IDS.user9, name: "Lucas Pereira", email: "lucas.pereira@example.com", password: "Lucas@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Apartment", phone: "+55-11-98888-7777", address: [{ city: "São Paulo", country: "Brazil", postalCode: "01310" }] }] },
  { _id: USER_IDS.user10, name: "Hiroshi Sato", email: "hiroshi.sato@example.com", password: "Hiroshi@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Office", phone: "+81-90-1111-2222", address: [{ city: "Tokyo", country: "Japan", postalCode: "1600022" }] }] },
  { _id: USER_IDS.user11, name: "Oliver Brown", email: "oliver.brown@example.com", password: "Oliver@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Home", phone: "+44-7700-123456", address: [{ city: "London", country: "UK", postalCode: "NW1" }] }] },
  { _id: USER_IDS.user12, name: "Emma Fischer", email: "emma.fischer@example.com", password: "Emma@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Apartment", phone: "+49-151-9999-8888", address: [{ city: "Berlin", country: "Germany", postalCode: "10178" }] }] },
  { _id: USER_IDS.user13, name: "Daniel Kim", email: "daniel.kim@example.com", password: "Daniel@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Home", phone: "+82-10-2222-3333", address: [{ city: "Seoul", country: "South Korea", postalCode: "06164" }] }] },
  { _id: USER_IDS.user14, name: "Isabella Rossi", email: "isabella.rossi@example.com", password: "Isabella@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Apartment", phone: "+39-345-777-6666", address: [{ city: "Rome", country: "Italy", postalCode: "00184" }] }] },
  { _id: USER_IDS.user15, name: "Chloe Lefebvre", email: "chloe.l@example.com", password: "Chloe@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Home", phone: "+33-1-4222-3344", address: [{ city: "Paris", country: "France", postalCode: "75001" }] }] },
  { _id: USER_IDS.user16, name: "Liam Nguyen", email: "liam.n@example.com", password: "Liam@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Beach House", phone: "+61-2-9000-1111", address: [{ city: "Sydney", country: "Australia", postalCode: "2000" }] }] },
  { _id: USER_IDS.user17, name: "Jack Thompson", email: "jack.t@example.com", password: "Jack@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Condo", phone: "+1-416-555-0123", address: [{ city: "Toronto", country: "Canada", postalCode: "M5V" }] }] },
  { _id: USER_IDS.user18, name: "Sophie Chen", email: "sophie.chen@example.com", password: "Sophie@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Studio", phone: "+86-21-6000-7777", address: [{ city: "Shanghai", country: "China", postalCode: "200001" }] }] },
  { _id: USER_IDS.user19, name: "Omar Al-Fayed", email: "omar.f@example.com", password: "Omar@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Villa", phone: "+966-11-444-5566", address: [{ city: "Riyadh", country: "Saudi Arabia", postalCode: "11411" }] }] },
  { _id: USER_IDS.user20, name: "Elena Petrova", email: "elena.p@example.com", password: "Elena@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Home", phone: "+7-495-111-2233", address: [{ city: "Moscow", country: "Russia", postalCode: "101000" }] }] },
  { _id: USER_IDS.user21, name: "Noah Smith", email: "noah.s@example.com", password: "Noah@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Home", phone: "+64-9-333-4455", address: [{ city: "Auckland", country: "New Zealand", postalCode: "1010" }] }] },
  { _id: USER_IDS.user22, name: "Fatimah Zahra", email: "fatimah.z@example.com", password: "Fatimah@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Apartment", phone: "+62-21-555-6677", address: [{ city: "Jakarta", country: "Indonesia", postalCode: "10110" }] }] },
  { _id: USER_IDS.user23, name: "Zoe Miller", email: "zoe.m@example.com", password: "Zoe@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Cottage", phone: "+1-604-222-3344", address: [{ city: "Vancouver", country: "Canada", postalCode: "V6B" }] }] },
  { _id: USER_IDS.user24, name: "Jean-Pierre", email: "jp@example.com", password: "JP@2026", confirmedEmail: true, isAdmin: false, delivery: [{ title: "Flat", phone: "+33-4-7222-3344", address: [{ city: "Lyon", country: "France", postalCode: "69001" }] }] },
]

export default users
