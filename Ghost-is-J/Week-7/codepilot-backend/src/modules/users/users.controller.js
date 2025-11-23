const userService = require('./users.service');

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
};

exports.getUsers = async (req, res) => {
  const users = await userService.getUsers();
  res.status(200).json(users);
};
