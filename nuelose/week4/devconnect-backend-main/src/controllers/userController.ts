import { Request,Response } from "express";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

const getUserProfile = async(req:Request, res:Response) => {
    try {
      const userId = req.params.id;
      if (!userId) return res.status(400).json({ message: "Missing UserId" });

      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "User doesn't exist" });

      return res.status(200).json(user);
    } catch (error:any) {
      console.error("Error in getUserProfile:", error);
      res.status(500).json({
        message: "Server side error",
        error: error.message || error,
      });
    }
}

const updateUserProfile = async (req:AuthRequest, res:Response) => {
    try {
      const userId = req.params.id;
      if (userId !== req.body.id) {
        return res.status(404).json({ message: "Unauthorized!" });
      }

      const update = {
        bio: req.body.bio,
        github: req.body.bio,
        twitter: req.body.bio,
        avatar: req.body.avatar,
        location: req.body.location,
        name: req.body.name,
      };

      const updatedUser = await User.findByIdAndUpdate(userId, update, {
        new: true,
        runValidators: true,
      }).select("-password");

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(500).json({
        message: "Server side error",
        error: error.message || error,
      });
    }
}

export {getUserProfile, updateUserProfile}
