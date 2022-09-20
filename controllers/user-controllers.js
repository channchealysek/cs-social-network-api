const { User, Thought } = require("../models");
const user404Message = (id) => `User with ID: ${id} not found!`;
const user204Message = (id) => `User with ID: ${id} has been deleted!`;

const userController = {
  // get all users
  async getAllUsers(req, res) {
    try {
      const dataUsers = await User.find({})
        .populate({
          path: "thoughts",
          select: "thoughtText createdAt reactions reactionCount",
        })
        .populate({ path: "friends", select: "-__v" })
        .select("-__v");
      return res.status(200).json(dataUsers);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // get one user by ID
  async getUserById({ params }, res) {
    try {
      const dataUser = await User.findOne({ _id: params.id })
        .populate({ path: "friends", select: "-__v" })
        .populate({
          path: "thoughts",
          select: "-__v",
          populate: { path: "reactions" },
        })
        .select("-__v");
      return dataUser
        ? res.status(200).json(dataUser)
        : res.status(404).json({ message: user404Message(params.id) });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  // add a new user
  async createUser({ body }, res) {
    try {
      const dataUser = await User.create({
        username: body.username,
        email: body.email,
      });
      return res.status(200).json(dataUser);
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  // update user info
  async updateUser({ params, body }, res) {
    try {
      const dataUser = await User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      });
      return dataUser
        ? res.json(dataUser)
        : res.status(404).json({ message: user404Message(params.id) });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  // delete user
  async deleteUser({ params }, res) {
    try {
      const dataUser = await User.findOneAndDelete({ _id: params.id });
      if (!dataUser) {
        return res.status(404).json({ message: user404Message(params.id) });
      }
      Thought.deleteMany({ username: dataUser.username }).then((deletedData) =>
        deletedData
          ? res.json({ message: user204Message(params.id) })
          : res.status(404).json({ message: user404Message(params.id) })
      );
    } catch (err) {
      return res.status(400).json(err);
    }
  },
};

module.exports = userController;
