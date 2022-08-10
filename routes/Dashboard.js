const jwt = require("jsonwebtoken");
const { Router } = require("express");
const db = require("../db");
const app = Router();
const JWT_SECRET = process.env.JWT_SECRET;

app.get("/login", (req, res) => {
  res.render("login");
});

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username && !password) {
//     res.json({ status: false, data: "Please Provide credentials" });
//     return;
//   }

//   const d = await db.query(`select * from jwt_users where username=$1;`, [
//     username,
//   ]);
//   if (d.rowCount === 0) {
//     res.json({ status: false, data: "Please Provide credentials" });
//     return;
//   }
//   const hashed = d.rows[0].password;
//   if (hashed === password) {
//     const payload = { username };
//     const token = await jwt.sign(payload, JWT_SECRET);

//     res.cookie("Authorization", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 1000 * 60 * 2,
//     });
//     res.json({ status: true });
//   } else {
//     res.json({ status: false, data: "Please Provide credentials" });
//   }
// });

// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username && !password) {
//     res.json({ status: false, data: "Please Provide credentials" });
//     return;
//   }

//   const d = await db.query(`select * from jwt_users where username=$1;`, [
//     username,
//   ]);
//   if (d.rowCount !== 0) {
//     res.json({ status: false, data: "Please Login in existing account" });
//     return;
//   }

//   const q = await db.query(
//     `insert into jwt_users(username,password) values($1,$2)`,
//     [username, password]
//   );

//   const payload = { username };
//   const token = await jwt.sign(payload, JWT_SECRET);

//   res.cookie("Authorization", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     maxAge: 1000 * 60 * 2,
//   });
//   res.json({ status: true });
// });

// app.delete("/logout", (req, res) => {
//   res.clearCookie("Authorization");
//   res.end();
// });

module.exports = Router;
