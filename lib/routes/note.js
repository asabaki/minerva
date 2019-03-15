const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/users'),
  Note = require('../models/note');
const credential = require('../config/CREDENTIAL');
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const auth = new google.auth.JWT(credential.analytic.client_email, null, credential.analytic.private_key, scopes);
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), key: key.toString('hex') };
}

function decrypt(text) {
  let iv = Buffer.from(text.iv.toString(), 'hex');
  let key = Buffer.from(text.key.toString(), 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// var hw = encrypt("Some serious stuff")
// console.log(hw)
// console.log(decrypt(hw))

/* ------------------------------------------- GET METHOD ---------------------------------*/
router.get('/', async (req, res) => {
  try {
    const hw = encrypt('<p>fasdass</p>');
    console.log(typeof hw);
    res.json({
      hw,
      dc: decrypt(hw)
    })
    // res.json('So far so good');
  } catch (e) {
    res.json(e);
  }
});

router.get('/all', async (req,res) => {
  try {
    const allNotes = await Note.find({privacy: false});
    // console.log(allNotes);
    const users = [];
    const response = await auth.authorize();
    const view_id = '191379801';
    const result = await google.analytics('v3').data.ga.get({
      'auth': auth,
      'ids': 'ga:' + view_id,
      'metrics': 'ga:uniquePageviews',
      'dimensions': 'ga:pagePath',
      'start-date': '2daysAgo',
      'end-date': 'today',
      'sort': '-ga:uniquePageviews',
      'max-results': 100,
    });

    const views = result.data.rows
      .map(data => {
        return {
          web: data[0],
          count: data[1]
        }
      })
      .filter(data => data.web.substring(1, 6) === 'note/');
    for (let note of allNotes) {
      const user = await User.findById(note.user_id).select('name');
      users.push(user.name);
      views.map(vc => {
        if (vc.web.includes(String(note._id))) {
          note.views = vc.count;
        }
      })
    }
    // console.log(allNotes);
    if (allNotes && users) {
      res.status(200).json({
        notes: allNotes,
        users: users
      })
    }
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.get('/get/:id', async (req,res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      const user = await User.findById(note.user_id).select('name');
      const response = await auth.authorize();
      const view_id = '191379801';
      const result = await google.analytics('v3').data.ga.get({
        'auth': auth,
        'ids': 'ga:' + view_id,
        'metrics': 'ga:uniquePageviews',
        'dimensions': 'ga:pagePath',
        'start-date': '2daysAgo',
        'end-date': 'today',
        'sort': '-ga:uniquePageviews',
        'max-results': 100,
      });

      const data = result.data.rows
        .map(data => {
          return {
            web: data[0],
            count: data[1]
          }
        })
        .filter(data => data.web.substring(1, 6) === 'note/');
      data.map(vc => {
        if (vc.web.includes(String(note._id))) {
          note.views = vc.count;
        }
      });
      const decryptData = decrypt(note.data);
      note['data'] = decryptData;
      res.status(200).json({note, user, decryptData});
    } else {
      throw new Error('Note not found');
    }
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/create', passport.authenticate('jwt'), async (req, res) => {
  try {
    // console.log(req.body);
    const data = encrypt(req.body.note.data);
    const note = new Note({
      title: req.body.note.title,
      description: req.body.note.description,
      privacy: req.body.note.privacy,
      user_id: req.user._id,
      data: data,
      rating: 0,
      lastUpdated: Date.now()
    });

    const savedNote = await note.save();
    if (savedNote) {
      res.status(200).json(savedNote);
    }

  } catch (e) {
    console.log(e);
    res.json(e);
  }
});
/* ------------------------------------------- DELETE METHOD ---------------------------------*/


module.exports = router;
