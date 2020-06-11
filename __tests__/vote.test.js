const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

// const Vote = require('../lib/models/Vote');
const Poll = require('../lib/models/Poll');
const User = require('../lib/models/User');
const Organization = require('../lib/models/Organization');

const request = require('supertest');
const app = require('../lib/app');

describe('vote routes', () => {
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
  
  it.only('creates a new vote', async() => {
    
    const organization = await Organization.create({
      title: 'Poll People',
      description: 'People Who Like Colors',
      image: 'placekitten.com'
    });
    
    const user = await User.create({
      name: 'Tom',
      email: 'tom@tom.com'
    });
    
    const poll = await Poll.create({
      organization: organization._id,
      title: 'Favorite Color',
      description: 'Choose a Favorite Color',
      options: ['red', 'blue', 'green'],
    });
    
    return request(app)
      .post('/api/v1/votes')
      .send({
        user: user._id,
        poll: poll._id,
        option: 'green'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          poll: poll.id,
          option: 'green',
          __v: 0
        });
      });
  });
});
  
