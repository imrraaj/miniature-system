if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const db = require("./db");
const e = require("express");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.delete("/logout", (req, res) => {
  res.clearCookie("Authorization");
  res.end();
});

app.get("/", ValidateUser, async (req, res) => {
  try {
    const data = await db.query(
      `select * from jwt_birthdays where owner = (select id from jwt_users where username=$1) ORDER BY date ASC ;`,
      [req.user]
    );

    res.render("dashboard", { data: data.rows });
  } catch (e) {
    console.log(e);
    res.render("dashboard", { data: null });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) {
    res.json({ status: false, data: "Please Provide credentials" });
    return;
  }

  const d = await db.query(`select * from jwt_users where username=$1;`, [
    username,
  ]);
  if (d.rowCount === 0) {
    res.json({ status: false, data: "Please Provide credentials" });
    return;
  }

  const hashed = d.rows[0].password;
  const isPasswordCorrect = await bcrypt.compare(password, hashed);
  if (isPasswordCorrect) {
    const payload = { username, id: d.rows[0].id };
    const token = await jwt.sign(payload, JWT_SECRET);

    res.cookie("Authorization", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 30,
    });
    res.json({ status: true });
  } else {
    res.json({ status: false, data: "Please Provide credentials" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password, name } = req.body;
  if (!username && !password && !name) {
    res.json({ status: false, data: "Please Provide credentials" });
    return;
  }

  const d = await db.query(`select * from jwt_users where username=$1;`, [
    username,
  ]);
  if (d.rowCount !== 0) {
    res.json({ status: false, data: "Please Login in existing account" });
    return;
  }

  const hashedPasswrd = await bcrypt.hash(password, 10);
  const q = await db.query(
    `insert into jwt_users(username,password,name) values($1,$2,$3)`,
    [username, hashedPasswrd, name]
  );

  const payload = { username, name };
  const token = await jwt.sign(payload, JWT_SECRET);

  res.cookie("Authorization", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 30,
  });
  res.json({ status: true });
});

app.post("/add", ValidateUser, async (req, res) => {
  const { name, date, priority } = req.body;
  if (!name && !date && !priority) {
    res.json({ status: false, data: "Please Provide credentials" });
    return;
  }
  try {
    const q = await db.query(
      `insert into jwt_birthdays(name,date,priority,owner) values($1,$2,$3,(select id from jwt_users where username = $4));`,
      [name, date, priority, req.user]
    );
    res.json({ status: true });
  } catch (e) {
    console.log(e);
    res.json({ status: false, data: "Internal server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

/* MIDDLEWARE */

async function ValidateUser(req, res, next) {
  if (req.cookies.Authorization === undefined) {
    res.redirect("/login");
    return;
  }
  const token = req.cookies.Authorization;
  try {
    const isValid = jwt.verify(token, JWT_SECRET);
    if (!isValid) {
      res.redirect("/login");
      return;
    }
    req.user = isValid.username;
    next();
  } catch {
    res.redirect("/login");
  }
}
