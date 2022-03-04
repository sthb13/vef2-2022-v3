import dotenv from 'dotenv';
import express from 'express';
import { body, validationResult } from "express-validator";
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import * as users from './lib/users.js';
import * as events from './lib/events.js';
import * as validation from './lib/validation.js'

dotenv.config();

const {
  PORT: port = 3000,
  DATABASE_URL: connectionString,
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 5000
} = process.env;

if (!connectionString || !jwtSecret) {
  console.error('Vantar gögn í env');
  process.exit(1);
}

const app = express();

app.use(express.json());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  // fáum id gegnum data sem geymt er í token
  const user = await users.findById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

app.use(passport.initialize());

app.get('/users/', users.requireAuthentication, async(req, res) => {

  const isAdmin = await users.isAdmin(req.user.username);

  if(isAdmin.isadmin){
     const all = await users.findAllUsers();
     return res.status(201).json(all);
   }
   else{
     return res.status(400).json({ error: "Notandi er ekki stjórnandi" });
   }
});

app.get('/users/me', users.requireAuthentication, async(req, res) => {
  const me = await users.findByUsername(req.user.username);

  if(me) return res.status(201).json({name:me.name, username: me.username});

  return res.status(400).json({error: "Enginn notandi skráður"});
});

app.get('/users/:id', users.requireAuthentication, async(req, res) => {

  const { id } = req.params;
  const isAdmin = await users.isAdmin(req.user.username);

  if(isAdmin.isadmin){
    const user = await users.findById(id);
    return res.status(201).json(user);
  } else {
    return res.status(400).json({ error: "Notandi er ekki stjórnandi" });
  }
});

app.post('/users/login', async (req, res) => {

  const { username, password = '' } = req.body;
  const user = await users.findByUsername(username);

  if (!user) {
    return res.status(401).json({ error: "Notandi er ekki til" });
  }

  const isPasswordCorrect = await users.comparePasswords(password, user.password);

  if (isPasswordCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
   // console.log({ token })
    return res.status(201).json({ token });
  }

  return res.status(401).json({ error: 'Rangt lykilorð' });
});

app.post('/users/register',
         validation.users,
         validation.xssSanitization,
         validation.sanitization,
         async (req, res) => {

  const errors = validationResult(req);
  if(errors.isEmpty()){
    const { name, username, password = '' } = req.body;
    const newUser = await users.createUser(name, username, password);

    if(newUser) return res.status(201).json({"message": "Skráning tókst", "name": newUser.name, "username": newUser.username});
  }
  return res.status(400).json({ error: "Skráning tókst ekki"});
});

app.get('/events/', async (req, res) => {
  const allEvents = await events.listEvents();

  if(allEvents) return res.status(201).json(allEvents);

  return res.status(400).json({ error: "Viðburður er ekki til"});
});


app.post('/events/', users.requireAuthentication, validation.event, validation.xssSanitization, validation.sanitization, async (req, res) => {

  const errors = validationResult(req);
  if(errors.isEmpty()){
    const { name, description = '' } = req.body;
    const id = req.user.id;
    const newEvent = await events.createEvent(id, name, description);

    if(newEvent) return res.status(201).json(newEvent);
  }
  return res.status(400).json({ error: "Skrá viðburð tókt ekki"});
});

app.get('/events/:id', async(req,res) => {

  const { id } = req.params;
  const event = await events.listEventById(id);

  if(event) return res.status(201).json(event);

  return res.status(400).json({ error: "Viðburður er ekki til"});

});

app.patch('/events/:id', users.requireAuthentication, validation.xssSanitization, validation.sanitization, async (req, res) => {

  const { id } = req.params;
  const { description = '' } = req.body;
  const eventId = await events.listEventById(id);
  const userId = req.user.id;
  const userName = req.user.username;
  const isAdmin = await users.isAdmin(userName);

  if(eventId.userid === userId || isAdmin.isadmin){
    const update = await events.updateEvent(id, description);
    return res.status(200).json({update});
  }else{
    return res.status(400).json({error: "Ekki tókst að uppfæru viðburðinn"});
  }
 });

app.delete('/events/:id', users.requireAuthentication, async (req, res) => {

  const { id } = req.params;
  const eventId = await events.listEventById(id);
  const userId = req.user.id;
  const userName = req.user.username;
  const isAdmin = await users.isAdmin(userName);

  if(eventId.userid === userId || isAdmin.isadmin){
    const del = await events.deleteEvent(id);
    return res.status(200).json({del});
  }else{
    return res.status(400).json({error: "Ekki tókst að eyða viðburðinn"});
  }
});

app.post('/events/:id/register', users.requireAuthentication, validation.xssSanitization, validation.sanitization, async (req, res) => {
  const { id } = req.params;
  const { comment = '' } = req.body;
  const user = req.user.id;
  const registration = await events.register(user, comment, id);

  if(registration) return res.status(201).json({message: "Skráning tókst!"});

  return res.status(400).json({error: "Ekki tókst að skŕa á viðburðinn"});
});

app.delete('/events/:id/register', users.requireAuthentication, async (req, res) => {
  const { id } = req.params;
  const user = req.user.id;
  const deleteRegistration = await events.deleteRegistration(id, user);

  if(deleteRegistration) return res.status(201).json({message: "Skráningu eytt!"});

  return res.status(400).json({error: "Ekki tókst að eyða skráningu."});
});

/** Middleware sem sér um 404 villur. */
app.use((req, res) => {
  const title = 'Síða fannst ekki';
  res.status(404).json( { error: title });
});

/** Middleware sem sér um villumeðhöndlun. */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const title = 'Villa kom upp';
  // res.status(500).render('error', { title });
  return res.status(500).json({ error: title });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
