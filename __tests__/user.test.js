require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');


const request = require('supertest');
const app = require('../lib/app');

const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Membership = require('../lib/models/Membership');


describe('user routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let newUser;

  beforeEach(async() => {
    newUser = await User.create({
      name: 'Coolio',
      email: 'coolio@gangstersparadise.com',
      password: 'swag'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('can login a user', async() => {

    return request(app)
      .post('/api/v1/Users/login')
      .send({
        name: 'Coolio',
        email: 'coolio@gangstersparadise.com',
        password: 'swag'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: newUser.id,
          name: 'Coolio',
          email: 'coolio@gangstersparadise.com',
          __v: 0
        });
      });
  });

  it('can signup a new user', async() => {

    return request(app)
      .post('/api/v1/Users/signup')
      .send({
        name: 'Coolio2',
        email: 'coolio@gangstersparadise.com',
        password: 'swag'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Coolio2',
          email: 'coolio@gangstersparadise.com',
          __v: 0
        });
      });
  });

  it.only('can verify if Coolio is logged in', () => {
    const agent = request.agent(app);
    return agent
      .get('/api/v1/Users/verify');
  })
    .then(res => {
      expect(res.body).toEqual({
        _id: newUser.id,
        email: 'coolio@gangstersparadise.com',
        password: 'swag'
      });
    });
});

it('gets a user by id and all the organizations they are members of', async() => {

  const user = await User.create({
    name: 'Bing Bing',
    phone: '4066666666',
    email: 'sosuperrad@sickness.gov',
    communicationMedium: 'email'
  });

  const organization1 = await Organization.create({
    title: 'Orgatron 5',
    description: 'Organized'
  });

  const organization2 = await Organization.create({
    title: 'Orgatron 6',
    description: 'Organized + 1'
  });

  await Membership.create([
    { organization: organization1._id, user: user._id },
    { organization: organization2._id, user: user._id }
  ]);

  return request(app)
    .get(`/api/v1/users/${user._id}`)
    .then(res => {
      expect(res.body).toEqual({
        _id: expect.anything(),
        name: 'Bing Bing',
        phone: '4066666666',
        email: 'sosuperrad@sickness.gov',
        communicationMedium: 'email',
        memberships: [
          { _id: expect.anything(), organization: organization1.id, user: user.id },
          { _id: expect.anything(), organization: organization2.id, user: user.id }
        ],
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

