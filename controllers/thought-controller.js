const { Thought, User } = require("../models");
const thought404Message = (id) => `Thought with ID: ${id} not found!`;
const thought200Message = (id) => `Thought with ID: ${id} has been deleted!`;

const thoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dataThought) => res.json(dataThought))
      .catch((err) => res.status(500).json(err));
  },
  // get one thought by ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dataThought) =>
        dataThought
          ? res.json(dataThought)
          : res.status(404).json({ message: thought404Message(params.id) })
      )
      .catch((err) => res.status(404).json(err));
  },
  // add a thought
  async createThought({ body }, res) {
    try {
      Thought.create({
        thoughtText: body.thoughtText,
        username: body.username,
      })
        .then(({ _id }) =>
          User.findOneAndUpdate(
            { username: body.username },
            { $push: { thoughts: _id } },
            { new: true }
          )
        )
        .then((dataThought) => res.status(200).json(dataThought))
        .catch((err) => res.status(400).json(err));
    } catch (err) {
      return res.status(400).json(err);
    }
  },
  // update thought info
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dataThought) =>
        dataThought
          ? res.json(dataThought)
          : res.status(404).json({ message: thought404Message(params.id) })
      )
      .catch((err) => res.status(400).json(err));
  },
  // delete thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dataThought) =>
        dataThought
          ? res.json(thought200Message(dataThought._id))
          : res.status(404).json({ message: thought404Message(params.id) })
      )
      .catch((err) => res.status(404).json(err));
  },
};

module.exports = thoughtController;
