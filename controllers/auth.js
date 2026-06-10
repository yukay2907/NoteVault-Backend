const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/db");

// const temporaryData = [
//   {
//     name: "kashyap1",
//     email: "kashyap1@gmail.com",
//     password: "hello1",
//   },
//   {
//     name: "kashyap2",
//     email: "kashyap2@gmail.com",
//     password: "hello2",
//   },
//   {
//     name: "kashyap3",
//     email: "kashyap3@gmail.com",
//     password: "hello3",
//   },
// ];

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //Check if user already exists
    //await just means asking the execution to wait till we get a response from the SQL query
    const existingUser = await client.query(
      "SELECT * FROM users WHERE email = $1", //not using ${email} to avoid SQL injection using cases like email = "' OR 1=1 --"
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists.",
      });
    }
    //Generate token
    const token = jwt.sign(
      {
        email: email,
      },
      process.env.SECRET_KEY,
    );

    //Hash password
    const hash = await bcrypt.hash(password, 10);

    //Save user in database
    await client.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3)",
      [name, email, hash],
    );

    return res.status(201).json({
      message: "User added successfully.",
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length === 0) {
      return res.status(400).json({
        error: "User does not exist. Sign-Up first.",
      });
    }

    const user = existingUser.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        email: email,
      },
      process.env.SECRET_KEY,
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      name: user.name,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
