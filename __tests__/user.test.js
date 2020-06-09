const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const User = require('../lib/models/User');

const request = require('supertest');
const app = require('../lib/app');

describe('voting routes', () => {
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

  it('gets a user by id', () => {
    User.create({
      name: 'Bing Bing',
      phone: '4066666666',
      email: 'sosuperrad@sickness.gov',
      communicationMedium: 'email'
    })
      .then(user => request(app).get(`/api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Bing Bing',
          phone: '4066666666',
          email: 'sosuperrad@sickness.gov',
          communicationMedium: 'email',
          __v: 0
        });
      });
  });

  it('patches a user', () => {
    return User.create({
      name: 'Bing Bing',
      phone: '4066666666',
      email: 'sosuperrad@sickness.gov',
      communicationMedium: 'email'
    })
      .then(user => {
        return request(app)
          .patch(`/api/v1/users/${user._id}`)
          .send({ name: 'Bing Bing Supreme', email: 'sosupersourcreamy@sickness.sourcream' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Bing Bing Supreme',
          phone: '4066666666',
          email: 'sosupersourcreamy@sickness.sourcream',
          communicationMedium: 'email',
          __v: 0
        });
      });
  });

  it('delete a user', () => {
    return User.create({
      name: 'Bing Bing Supreme',
      phone: '4066666666',
      email: 'sosupersourcreamy@sickness.sourcream',
      communicationMedium: 'email',
      __v: 0
    })
      .then(user => request(app).delete(`/api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Bing Bing Supreme',
          phone: '4066666666',
          email: 'sosupersourcreamy@sickness.sourcream',
          communicationMedium: 'email',
          __v: 0
        });
      });
  });




});
