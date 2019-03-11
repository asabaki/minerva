const express = require('express');
const router  = express.Router();
const path = require('path');

/* ------------------------------------------- GET METHOD ---------------------------------*/
router.get('/', async (req,res) => {
  res.sendFile(path.join(__dirname, '../index', 'index.html'));
});

module.exports = router;
