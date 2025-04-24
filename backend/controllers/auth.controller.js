import { User } from "../models/user.model.js";

export const authCallBack = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    const user = await User.findOne({ clerkID: id });

    if (!user) {
      await User.create({
        clerkID: id,
        fullName: `${firstName || null} ${lastName || null}`.trim(),
        imageURL: imageUrl,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in auth callback", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
