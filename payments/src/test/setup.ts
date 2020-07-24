import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
        signin(id?: string): string[];
        }
    }
}

jest.mock('../nats-wrapper');

let mongo: any;

process.env.STRIPE_KEY='sk_test_51H8CCJL1xxbFjGJqqjVlLoQWa4qfRct31Q86vdXCvFYQlLZ2Ejqn11cvhzZG64C5p54PiEUH3zcUeh5AetwJm4Dv003p1SzKGO';

//hook function
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }

});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    //build a JWT payload. {id, email}
    const payload = {
        id: id || mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };
    //Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //Build session object. {jwt: JWT}
    const session = { jwt: token};

    //Turn session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
};
