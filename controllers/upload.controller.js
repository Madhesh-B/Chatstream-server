import cloudinary from "./../config/cloudinary.js";
import User from "../models/user.model.js";

export const uploadProfile = async (req, res) => {
  if (!req.file) return req.status(404).json({ message: "Image Not Found!" });
  const { userId } = req;
  try {
    const user = await User.findById(userId).select("userName uid -_id").lean();
    if (!user) return res.status(404).json({ message: "User Not Found!" });

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "chatstream/profile",
      public_id: `${user.userName}-${user.uid}`,
      overwrite: true,
    });
    const updatedUser = await User.findByIdAndUpdate(userId, {
      profileURL: upload.secure_url,
      publicId: upload.public_id,
    }, { new: true }).select("profileURL -_id").lean();

    return res.status(200).json({
      message: "File Uploaded Successfully!",
      profileURL: updatedUser.profileURL,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
}

export const deleteProfile = async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findById(userId).select("publicId -_id").lean();
    if (!user) return res.status(404).json({ message: "User Not Found!" });
    
    const upload = await cloudinary.uploader.destroy(user.publicId);
    if (upload.result !== "ok") return res.status(500).json({ message: "Failed To Delete the Image!" });

    const updatedUser = await User.findByIdAndUpdate(userId, {
      profileURL: "",
      publicId: "",
    }).select("profileURL -_id").lean();

    return res.status(200).json({ message: "Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
}