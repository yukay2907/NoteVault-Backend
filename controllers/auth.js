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

  // const isValid = temporaryData.findIndex((ele) => ele.email === email);

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

    // const isValid = client
    //   .query(`SELECT * FROM users where email = '${email}'`)
    //   .then((data) => {
    //     console.log(data);
    //   });

    // if (isValid !== -1) {
    //   return res.status(400).json({
    //     error: "User already exits.",
    //   });
    // }

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
      [name, email, password],
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

exports.signIn = (req, res) => {
  //TODO: complete signIn
  // Load hash from your password DB.
  // bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
  //     // result == true
  // });
  // bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
  //     // result == false
  // });
};
