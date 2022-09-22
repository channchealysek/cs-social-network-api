const { Thought, User } = require("../models");
const thought404Message = (id) => `Thought with ID: ${id} not found!`;
const thought200Message = (id) => `Thought with ID: ${id} has been deleted!`;
const user404Message = (user) => `User ${user} do not found! Create one...`;

const thoughtController = {
  // get all thoughts
  async getAllThoughts(req, res) {
    try {
      const dataThought = await Thought.find({})
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v");
      return res.json(dataThought);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // get one thought by ID
  async getThoughtById({ params }, res) {
    try {
      const dataThought = await Thought.findOne({ _id: params.id })
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v");
      return dataThought
        ? res.json(dataThought)
        : res.status(404).json({ message: thought404Message(params.id) });
    } catch (err) {
      return res.status(404).json(err);
    }
  },

  // add a thought
  async createThought({ body }, res) {
    try {
      const dataUser = await User.findOne(
        { username: body.username },
        "username"
      );
      if (!dataUser) {
        return res.status(404).json({ message: user404Message(body.username) });
      }
      const dataThought = await Thought.create({
        thoughtText: body.thoughtText,
        username: body.username,
      });
      await User.findOneAndUpdate(
        { username: body.username },
        { $push: { thoughts: dataThought._id } },
        { new: true }
      );
      return res.status(200).json(dataThought);
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  // update thought info
  async updateThought({ params, body }, res) {
    try {
      const dataThought = await Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
          runValidators: true,
        }
      );
      return dataThought
        ? res.json(dataThought)
        : res.status(404).json({ message: thought404Message(params.id) });
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  // delete thought
  async deleteThought({ params }, res) {
    try {
      const dataThought = await Thought.findOneAndDelete({ _id: params.id });
      if (!dataThought) {
        return res.status(404).json({ message: thought404Message(params.id) });
      }
      await User.updateMany(
        {},
        { $pull: { thoughts: params.id } },
      );
      return res.json(thought200Message(dataThought._id));
      // return dataThought
      //   ? res.json(thought200Message(dataThought._id))
      //   : res.status(404).json({ message: thought404Message(params.id) });
    } catch (err) {
      return res.status(404).json(err);
    }
  },
};

module.exports = thoughtController;
