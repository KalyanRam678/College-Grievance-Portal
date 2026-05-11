const Grievance = require("../models/Grievance");

exports.submit = async (req, res) => {
  try {
    console.log("SUBMIT BODY =", req.body);
    console.log("CONNECTED DB =", req.app ? "app running" : "unknown");

    const g = await Grievance.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      userMongoId: req.user.id,
      userId: req.body.userId,
      userName: req.body.userName,
      image: req.file ? req.file.filename : null,
      status: "Pending",
      updates: [
        {
          date: new Date().toISOString().split("T")[0],
          note: "Grievance Submitted",
          updatedBy: req.body.userName
        }
      ]
    });

    console.log("CREATED GRIEVANCE =", g);

    res.json(g);
  } catch (err) {
    console.log("SUBMIT ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    let data;

    if (req.user.role === "admin") {
      data = await Grievance.find().sort({ createdAt: -1 });
    } else {
      data = await Grievance.find({ userMongoId: req.user.id }).sort({ createdAt: -1 });
    }

    res.json(data);
  } catch (err) {
    console.log("GET ALL ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const g = await Grievance.findById(id);

    if (!g) {
      return res.status(404).json({ msg: "Not found" });
    }

    if (g.status === status) {
      return res.json(g);
    }

    g.status = status;

    g.updates.push({
      note: "Status changed to " + status,
      date: new Date().toLocaleDateString(),
      updatedBy: req.user.name || "Admin"
    });

    await g.save();

    res.json(g);
  } catch (err) {
    console.log("UPDATE STATUS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};