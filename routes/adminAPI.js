// Base
const express = require("express");
const router = express.Router();

// Controller
const admincon = require("../controllers/adminController");
const adminAPI = require("../controllers/adminAPI");

// Routes
router.get("/", adminAPI.helloUser);
router.post("/", admincon.isItOk);
router.get("/home", admincon.test);
router.post("/add", admincon.commitData);
router.get("/:id/delete/:id2", admincon.deleteData);
router.get("/details/:id", admincon.showEntrails);
router.get("/update/:id", admincon.updateFac);
router.post("/update/:id", admincon.updateNow);
// router.get('/delete/:id', admincon.deleteData);
router.get("/adduser", adminAPI.helloUser);
router.post("/adduser", adminAPI.addAdmin);
router.post("/getuser", adminAPI.getCurrentUser);

router.get("/test", admincon.test);

router.post("/kp", adminAPI.listKp);
router.post("/kp/add", adminAPI.addKp);

router.post("/pg", adminAPI.listPg);
router.post("/pg/add");
// router.post("/pg", admincon.addPg);
// router.post('/pg/add', admincon.commitPg);

router.post("/taska", adminAPI.listTaska);
// router.post("/taska", admincon.addTaska);
// router.post("/taska", admincon.addTaska);
// router.post('/taska/add', admincon.commitData);

router.post("/tadika", adminAPI.listTadika);
// router.post("/tadika", admincon.addTadika);
// router.post("/tadika", adminAPI.listTadika);
// router.post('/tadika/add', admincon.commitData);

router.post("/sr", adminAPI.listSr);
// router.post("/sr", admincon.addSr);
// router.post('/sr/add', admincon.commitData);

router.post("/sm", adminAPI.listSm);
// router.post("/sm", admincon.addSm);
// router.post('/sm/add', admincon.commitData);

router.post("/ins", adminAPI.listInstitusi);
// router.post("/ins", admincon.addSm);

router.post("/facilitytype", adminAPI.listFacilityType);

router.post("/search", admincon.searchAll);
router.post("/searchpg", admincon.searchPg);

router.post("/login", adminAPI.loginUser);
router.post("/logout", admincon.logOut);

module.exports = router;
