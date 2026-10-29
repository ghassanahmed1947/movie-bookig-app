// Demo films, cinemas aur demo user database mein daalta hai.
// Chalane ka tareeqa:  npm run seed
// Dobara chalayen to showtimes aaj se aage ke 21 din ke liye refresh ho jate hain.
import "dotenv/config";
import { connectDB, pool } from "./db.js";
import { seedDemo } from "./demo-data.js";

const run = async () => {
  await connectDB();
  await seedDemo();
};

run()
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
