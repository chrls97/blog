import User from "../models/userModels.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message })
  }
}
