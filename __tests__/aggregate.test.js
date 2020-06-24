require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const seed = require('../lib/utils/seed');
const User = require('../lib/models/User');
const request = require('supertest');
const app = require('../lib/app');

beforeAll(async() => {
  const uri = await mongod.getUri();
  return connect(uri);
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed({});
});

const agent = request.agent(app);
let user;

beforeEach(async() => {

  user = await User.create({
    name: 'Bing Bing',
    phone: '4066666666',
    email: 'sosuperrad@sickness.gov',
    communicationMedium: 'email',
    password: 'somewords'
  });

  return agent
    .post('/api/v1/Users/login')
    .send({
      name: 'Bing Bing',
      phone: '4066666666',
      email: 'sosuperrad@sickness.gov',
      communicationMedium: 'email',
      password: 'somewords'
    });
});

afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});

describe('aggregate routes', () => {
  it('gets the amount of votes per option', async() => {
    return agent
      .get('/api/v1/Votes/by-vote-amount')
      .then(res => {
        expect(res.body).toEqual([
          { '_id': expect.anything(), 'count': expect.anything() },
          { '_id': expect.anything(), 'count': expect.anything() },
          { '_id': expect.anything(), 'count': expect.anything() }]);
      });
  });
});
