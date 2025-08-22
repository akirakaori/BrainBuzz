const User = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Profile = require("../model/ProfileModel");

async function createUserController(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const encryptPassword = await bcrypt.hash(password, 10);

    const data = {
      name,
      email,
      password: encryptPassword,
      role: role || "professional", // Allow role to be set, default to professional
    };

    const user = new User(data);
    await user.save();

    const profileData = {
      user: user?._id,
      bio: "",
      profilePicture: "",
      skills: [],
      github: "",
      linkedin: "",
      portfolioUrl: "",
    };
    const profile = new Profile(profileData);
    await profile.save();

    res.status(201).json({
      message: "User Created",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

async function createAdminController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const encryptPassword = await bcrypt.hash(password, 10);

    const data = {
      name,
      email,
      password: encryptPassword,
      role: "admin",
    };

    const user = new User(data);
    await user.save();

    const profileData = {
      user: user?._id,
      bio: "Administrator",
      profilePicture: "",
      skills: [],
      github: "",
      linkedin: "",
      portfolioUrl: "",
    };
    const profile = new Profile(profileData);
    await profile.save();

    res.status(201).json({
      message: "Admin User Created Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

async function loginHandleController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    const checkUser = await User.findOne({ email }).select("+password");
    if (!checkUser) {
      return res.status(400).json({
        message: "User with this email does not exist",
      });
    }

    const comparePassword = await bcrypt.compare(password, checkUser.password);
    if (comparePassword) {
      const token = jwt.sign(
        {
          id: checkUser._id,
          role: checkUser.role,
        },
        process.env.AUTH_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        message: "Login Successful",
        accessToken: token,
        user: {
          _id: checkUser._id,
          name: checkUser.name,
          email: checkUser.email,
          role: checkUser.role
        }
      });
    } else {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

async function getUserListController(req, res) {
  const userList = await User.find();

  res.status(200).json({
    message: "User List",
    users: userList,
  });
}

async function updateProfileMeController(req, res) {
  try {
    const { id } = req.user;
    const { name, email, bio, skills } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Check if email is being changed and if it's already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          message: "Email is already taken by another user",
        });
      }
    }

    // Update user basic info (name, email)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Process skills - convert comma-separated string to array of skill objects
    let skillsArray = [];
    if (skills && typeof skills === 'string') {
      skillsArray = skills.split(',').map(skill => ({
        name: skill.trim(),
        level: "Beginner" // Default level
      })).filter(skill => skill.name); // Remove empty skills
    }

    // Update or create profile
    let profile = await Profile.findOne({ user: id });
    
    if (profile) {
      // Update existing profile
      profile.bio = bio || profile.bio;
      profile.skills = skillsArray;
      await profile.save();
    } else {
      // Create new profile if it doesn't exist
      profile = new Profile({
        user: id,
        bio: bio || "",
        skills: skillsArray,
        profilePicture: "",
        github: "",
        linkedin: "",
        portfolioUrl: ""
      });
      await profile.save();
    }

    // Return updated data
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: profile.bio,
        skills: skillsArray.map(skill => skill.name).join(', ') // Convert back to string
      }
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

async function viewMyProfileController(req, res) {
  try {
    const { id } = req.user;

    // Get user basic info
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get user profile
    const profile = await Profile.findOne({ user: id });

    // Format skills as comma-separated string for frontend compatibility
    const skillsString = profile && profile.skills ? 
      profile.skills.map(skill => skill.name).join(', ') : '';

    res.status(200).json({
      message: "Profile retrieved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: profile ? profile.bio : "",
        skills: skillsString
      }
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

async function viewProfileofUserController(req, res) {
  try {
    const { id } = req.params;

    // Get user basic info
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get user profile
    const profile = await Profile.findOne({ user: id });

    // Format skills as comma-separated string for frontend compatibility
    const skillsString = profile && profile.skills ? 
      profile.skills.map(skill => skill.name).join(', ') : '';

    res.status(200).json({
      message: "Profile retrieved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: profile ? profile.bio : "",
        skills: skillsString
      }
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

module.exports = {
  createUserController,
  createAdminController,
  loginHandleController,
  getUserListController,
  updateProfileMeController,
  viewMyProfileController,
  viewProfileofUserController,
};
