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

  it('lists all users in an organization', async() => {

    const organization = await Organization.create({
      title: 'Poll People',
      description: 'People Who Like Polls',
      image: 'placekitten.com'
    });

    const user2 = await User.create({
      name: 'Ding Ding',
      phone: '6666666666',
      email: 'sickdaddy@ill.com',
      communicationMedium: 'phone'
    });

    const user = await User.create({
      name: 'Bing Bing',
      phone: '4066666666',
      email: 'sosuperrad@sickness.gov',
      communicationMedium: 'email'
    });

    await Membership.create({
      organization: organization._id,
      user: user._id
    });

    await Membership.create({
      organization: organization._id,
      user: user2._id
    });
      
    return request(app)
      .get(`/api/v1/memberships?organization=${organization._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          __v: 0,
          _id: expect.anything(),
          organization: {
            _id: expect.anything(),
            image: 'placekitten.com',
            title: 'Poll People',
          },
          user: {
            _id: expect.anything(),
            email: 'sosuperrad@sickness.gov',
            name: 'Bing Bing',
          },
        },
        {
          __v: 0,
          _id: expect.anything(),
          organization: {
            _id: expect.anything(),
            image: 'placekitten.com',
            title: 'Poll People',
          },
          user: {
            _id: expect.anything(),
            email: 'sickdaddy@ill.com',
            name: 'Ding Ding',
          }    
        }]);
      });
  });
  
  it('lists all organizations a user is part of', async() => {

    const organization = await Organization.create({
      title: 'Poll People',
      description: 'People Who Like Polls',
      image: 'placekitten.com'
    });

    const organization2 = await Organization.create({
      title: 'Super Crew',
      description: 'People Who Are Super',
      image: 'placekitten.com'
    });

    const user = await User.create({
      name: 'Bing Bing',
      phone: '4066666666',
      email: 'sosuperrad@sickness.gov',
      communicationMedium: 'email'
    });

    await Membership.create({
      organization: organization._id,
      user: user._id
    });

    await Membership.create({
      organization: organization2._id,
      user: user._id
    });
      
    return request(app)
      .get(`/api/v1/memberships?user=${user._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          
          __v: 0,
          _id: expect.anything(),
          organization: {
            _id: expect.anything(),
            image: 'placekitten.com',
            title: 'Poll People',
          },
          user: {
            _id: expect.anything(),
            email: 'sosuperrad@sickness.gov',
            name: 'Bing Bing',
          }, 
        },
        { 
          __v: 0,
          _id: expect.anything(),
          organization: {
            _id: expect.anything(),
            image: 'placekitten.com',
            title: 'Super Crew',
          },
          user: {
            _id: expect.anything(),
            email: 'sosuperrad@sickness.gov',
            name: 'Bing Bing',
          },
        }
        ]);
      });
  });

  it('deletes a membership', async() => {

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

    await Membership.create({
      organization: organization._id,
      user: user._id
    }) 
      .then(member => request(app).delete(`/api/v1/memberships/${member._id}`))
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.anything(),
          organization: expect.anything(),
          user: expect.anything(),
        }
        );
      });
  });
});
