const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const temporaryData = [
  {
    name: "kashyap1",
    email: "kashyap1@gmail.com",
    password: "hello1",
  },
  {
    name: "kashyap2",
    email: "kashyap2@gmail.com",
    password: "hello2",
  },
  {
    name: "kashyap3",
    email: "kashyap3@gmail.com",
    password: "hello3",
  },
];

exports.signUp = (req, res) => {
  const { name, email, password } = req.body;

  //Check if the user already exists
  const isValid = temporaryData.findIndex((ele) => ele.email === email);

  if (isValid !== -1) {
    return res.status(400).json({
      error: "User already exits.",
    });
  }

  //Generate token
  const token = jwt.sign(
    {
      email: email,
    },
    process.env.SECRET_KEY,
  );

  //Hash password and save the new user in the database and send response to user along with the token
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: "Internal server error.",
      });
    }
    const user = {
      name,
      email,
      password: hash,
    };

    temporaryData.push(user);
    res.status(200).json({
      message: "User added succesfully to the database.",
      token: token,
    });
  });
};

exports.signIn = (req, res) => {
  //TODO: complete signIn
};
