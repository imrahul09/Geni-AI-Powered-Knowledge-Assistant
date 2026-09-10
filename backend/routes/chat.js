import express from "express";
import Thread from "../models/Thread.js";
import getGeminiApiResponse from "../utils/openai.js";
import { createPartFromText } from "@google/genai";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/test", async (req, res) => {
//   try {
//     const thread = new Thread({
//       threadId: "abc",
//       title: "Testing number two thread",
//     });
//     const response = await thread.save();
//     res.send(response);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "failed to save in DB" });
//   }
// });

//get all threads
router.get("/thread", protect, async (req, res) => {
  try {
    //descending order of updateAt .. most recent data on top
    const threads = await Thread.find({ user: req.user._id }).sort({
      updateAt: -1,
    });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to detch threads" });
  }
});

router.get("/thread/:threadId", protect, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId, user: req.user._id });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to detch threads" });
  }
});

router.delete("/thread/:threadId", protect, async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      user: req.user._id,
    });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to delete thread" });
  }
});

router.post("/chat", protect, async (req, res) => {
  const { threadId, message } = req.body; //get the threadid and the message coming from frontend

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" }); // if the threadId and message are empty
  }

  try {
    let thread = await Thread.findOne({ threadId, user: req.user._id }); // find the thread
    if (!thread) {
      // if threadId is not in the db create a new thread
      //create a new thread
      thread = new Thread({
        threadId,
        user: req.user._id,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistanceReply = await getGeminiApiResponse(message);
    thread.messages.push({ role: "assistence", content: assistanceReply });
    thread.updateAt = new Date();
    await thread.save();
    res.json({ reply: assistanceReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
