const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const Vote = require('../lib/models/Vote');
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

  it('updates a vote if it already exists', async() => {

    const vote = await Vote.create({
      user: user._id,
      poll: poll._id,
      option: 'red'
    });
    
    return request(app)
      .post('/api/v1/votes/vote')
      .send({
        user: user._id,
        poll: poll._id,
        option: 'green'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: vote.id,
          user: user.id,
          poll: poll.id,
          option: 'green',
          __v: 0
        });
      });
  });

  it('gets all votes on a poll', async() => {

    const user2 = await User.create({
      name: 'Tom',
      email: 'tom@tom.com'
    });

    await Vote.create([{
      user: user._id,
      poll: poll._id,
      option: 'green'
    }, {
      user: user2._id,
      poll: poll._id,
      option: 'red'
    }]);
    
    return request(app)
      .get(`/api/v1/votes/?poll=${poll._id}`)
      .then(res => {
        expect(res.body).toEqual(expect.arrayContaining([{
          __v: 0, 
          _id: expect.anything(), 
          option: 'green', 
          poll: poll.id, 
          user: user.id
        },
        { __v: 0,
          _id: expect.anything(), 
          option: 'red', 
          poll: poll.id, 
          user: user2.id
        }]));
      });
  });

  it('gets all votes by a user', async() => {

    const poll2 = await Poll.create({
      organization: organization._id,
      title: 'Favorite Color',
      description: 'Choose a Favorite Color',
      options: ['red', 'blue', 'green'],
    });

    await Vote.create([{
      user: user._id,
      poll: poll._id,
      option: 'green'
    }, {
      user: user._id,
      poll: poll2._id,
      option: 'red'
    }]);

    return request(app)
      .get(`/api/v1/votes/?user=${user._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          __v: 0, 
          _id: expect.anything(), 
          option: 'green', 
          poll: poll.id, 
          user: user.id
        },
        { __v: 0,
          _id: expect.anything(), 
          option: 'red', 
          poll: poll2.id, 
          user: user.id
        }]);
      });
  });

  it('updates a vote', () => {
    return Vote.create({
      poll: poll.id,
      user: user.id,
      option: 'green'
    })
      .then(vote => {
        return request(app)
          .patch(`/api/v1/votes/${vote._id}`)
          .send({ option: 'red' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          option: 'red',
          poll: poll.id,
          __v: 0
        });
      });
  });
});
  
