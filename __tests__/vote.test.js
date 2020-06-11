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

  
  let organization;
  let user;
  let poll;

  beforeEach(async() => {
    
    organization = await Organization.create({
      title: 'Poll People',
      description: 'People Who Like Colors',
      image: 'placekitten.com'
    });
    
    user = await User.create({
      name: 'Tom',
      email: 'tom@tom.com'
    });
    
    poll = await Poll.create({
      organization: organization._id,
      title: 'Favorite Color',
      description: 'Choose a Favorite Color',
      options: ['red', 'blue', 'green'],
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  it('creates a new vote', async() => {
    
    
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

  it('gets all votes', async() => {
    
    return request(app)
      .post('/api/v1/votes')
      .send([{
        user: user._id,
        poll: poll._id,
        option: 'green'
      }, {
        user: user._id,
        poll: poll._id,
        option: 'red'
      }])
      .then(res => {
        expect(res.body).toEqual([{
          __v: 0, 
          _id: expect.anything(), 
          option: 'green', 
          poll: expect.anything(), 
          user: expect.anything()
        },
        { __v: 0,
          _id: expect.anything(), 
          option: 'red', 
          poll: expect.anything(), 
          user: expect.anything()
        }]);
      });
  });
});
  
