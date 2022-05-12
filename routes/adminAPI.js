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
// router.get('/delete/:id', admincon.deleteData);

router.get("/test", admincon.test);

router.get("/taska", adminAPI.listTaska);
router.post("/taska", admincon.addTaska);
// router.post('/taska/add', admincon.commitData);

router.get("/:id/delete/:id2", admincon.deleteData);

router.get("/tadika", adminAPI.listTadika);
// router.post("/tadika", admincon.addTadika);
router.post("/tadika", adminAPI.listTadika);
// router.post('/tadika/add', admincon.commitData);

router.post("/kp", adminAPI.listKp);
// router.post("/kp", admincon.addKp);
// router.post('/kp/add', admincon.commitData);

router.get("/sr", adminAPI.listSr);
router.post("/sr", admincon.addSr);
// router.post('/sr/add', admincon.commitData);

router.get("/sm", adminAPI.listSm);
router.post("/sm", admincon.addSm);
// router.post('/sm/add', admincon.commitData);

router.get("/pg", adminAPI.listPg);
router.post("/pg", admincon.addPg);
// router.post('/pg/add', admincon.commitPg);

router.post("/search", admincon.searchAll);
router.post("/searchpg", admincon.searchPg);

router.get("/details/:id", admincon.showEntrails);
router.get("/update/:id", admincon.updateFac);
router.post("/update/:id", admincon.updateNow);

router.post("/login", adminAPI.loginUser);

router.post("/logout", admincon.logOut);

module.exports = router;
