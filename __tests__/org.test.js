const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const Organization = require('../lib/models/Organization');
const Poll = require('../lib/models/Poll');
const Membership = require('../lib/models/Membership');
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

  it('create an organization using POST', () => {
    return request(app)
      .post('/api/v1/Organizations')
      .send({
        title: 'Super Org',
        description: 'Super Cool',
        image: 'placekitten.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Super Org',
          description: 'Super Cool',
          image: 'placekitten.com',
          __v: 0
        });
      });
  });

  it('lists all of the organizations', async() => {
    await Organization.create({
      title: 'Party Time',
      description: 'Partiers',
      image: 'placekitten.com/kitty'
    });
    await Organization.create({
      title: 'Big Time',
      description: 'Bigly',
      image: 'placekitten.com/bigkitty'
    })

      .then(() => request(app).get('/api/v1/organizations'))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'Party Time',
          description: 'Partiers',
          image: 'placekitten.com/kitty',
          __v: 0
        },
        {
          _id: expect.anything(),
          title: 'Big Time',
          description: 'Bigly',
          image: 'placekitten.com/bigkitty',
          __v: 0
        }]);
      });
  });

  it('gets an organization by id with all members in it', async() => {

    const org = await Organization.create({
      title: 'Orgatron 5',
      description: 'Organized'
    });

    const user = await User.create({
      name: 'Ding Ding',
      phone: '6666666666',
      email: 'sickdaddy@ill.com',
      communicationMedium: 'phone'
    });

    const user2 = await User.create({
      name: 'Bing Bing',
      phone: '4206668749',
      email: 'superfun@goodtimes.com',
      communicationMedium: 'phone'
    });

    await Membership.create([
      { organization: org._id, user: user._id },
      { organization: org._id, user: user2._id }
    ]);
    
    return request(app)
      .get(`/api/v1/organizations/${org._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Orgatron 5',
          description: 'Organized',
          memberships: [
            { _id: expect.anything(), organization: org.id, user: user.id },
            { _id: expect.anything(), organization: org.id, user: user2.id }
          ],
          __v: 0
        });
      });    
  });

  it('patches an organization', () => {
    return Organization.create({
      title: 'Organization',
      description: 'Organized'
    })
      .then(organization => {
        return request(app)
          .patch(`/api/v1/organizations/${organization._id}`)
          .send({ title: 'Organization Supreme', description: 'Organized + Sour Cream' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Organization Supreme',
          description: 'Organized + Sour Cream',
          __v: 0
        });
      });
  });

  it('delete an organization and all votes and polls', async() => {

    const organization = await Organization.create({
      title: 'Organization As Heck',
      description: 'Absolutely Organized'
    });

    await Poll.create([
      {
        organization: organization._id,
        title: 'Favorite Color',
        description: 'Choose a Favorite Color',
        options: ['red', 'blue', 'green']
      },
      {
        organization: organization._id,
        title: 'Are You Happy?',
        description: 'No description',
        options: ['no', 'i dont know', 'unknown']
      }
    ]);

    return request(app)
      .delete(`/api/v1/organizations/${organization._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Organization As Heck',
          description: 'Absolutely Organized',
          __v: 0
        });
        return Poll.find({ organization: organization._id });
      })
      .then(polls => {
        expect(polls).toEqual([]);
      });
  });
});

