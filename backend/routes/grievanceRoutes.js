const router=require("express").Router();
const auth=require("../middleware/authMiddleware");
const admin=require("../middleware/roleMiddleware");
const g=require("../controllers/grievanceController");

const upload=require("../middleware/upload");

router.post("/submit",auth,upload.single("image"),g.submit);

router.get("/all",auth,g.getAll);

router.post("/status",auth,admin,g.updateStatus);

module.exports=router;