const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const Membership = require('../lib/models/Membership');
const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');

const request = require('supertest');
const app = require('../lib/app');

describe('membership routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a membership using POST', async() => {

    const organization = await Organization.create({
      title: 'Poll People',
      description: 'People Who Like Polls',
      image: 'placekitten.com'
    });

    const user = await User.create({
      name: 'Bing Bing',
      phone: '4066666666',
      email: 'sosuperrad@sickness.gov',
      communicationMedium: 'email'
    });
      
    return request(app)
      .post('/api/v1/memberships')
      .send({
        organization: organization._id,
        user: user._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          user: user.id,
          __v: 0
        });
      });
  });

});
