const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ✅ GET ALL STUDENTS (search + pagination)
const getStudents = async (req, res) => {
  try {
    const { search = "", status, page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    const query = { role: "student" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      const normalized = String(status).toLowerCase();
      if (normalized === "active") {
        query.onboardingCompleted = true;
      } else if (normalized === "inactive") {
        query.onboardingCompleted = false;
      }
    }

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select("-password")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.json({ data: students, total, page: pageNumber, limit: pageSize });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch students" });
  }
};

// ✅ CREATE STUDENT
const createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain uppercase, number, symbol, and be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
      onboardingCompleted: false,
    });

    const responseStudent = {
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      onboardingCompleted: student.onboardingCompleted,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };

    res.status(201).json(responseStudent);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to create student" });
  }
};

// ✅ GET SINGLE STUDENT
const getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" }).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch student" });
  }
};

// ✅ UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const { name, email, onboardingCompleted } = req.body;

    const student = await User.findOne({ _id: req.params.id, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (email && email.toLowerCase() !== student.email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      student.email = email.toLowerCase();
    }

    student.name = name || student.name;
    if (typeof onboardingCompleted !== "undefined") {
      student.onboardingCompleted = Boolean(onboardingCompleted);
    }

    await student.save();

    const responseStudent = {
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      onboardingCompleted: student.onboardingCompleted,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };

    res.json(responseStudent);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to update student" });
  }
};

// ✅ DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.deleteOne();
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to delete student" });
  }
};

// ✅ UPDATE STATUS ONLY
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const student = await User.findOne({ _id: req.params.id, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const normalized = String(status).toLowerCase();
    if (normalized === "active") {
      student.onboardingCompleted = true;
    } else if (normalized === "inactive") {
      student.onboardingCompleted = false;
    } else {
      return res.status(400).json({ message: "Status must be active or inactive" });
    }

    await student.save();

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      onboardingCompleted: student.onboardingCompleted,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to update status" });
  }
};

module.exports= { getStudents,
                  createStudent,
                  getStudentById,
                  updateStudent,
                  deleteStudent,
                  updateStatus

}