const { initDb,stopDb } = require("../db/database");
const chai=require("chai");
const chaiAsPromised=require("chai-as-promised");
chai.use(chaiAsPromised);
let expect=chai.expect;
const { User } = require("./helper/user");
const create_user = require("../routes/user/create_user");
const { ValidationError } = require("../helper/custom_error");
const { fetchUserById } = require("../model/user_model");

describe('Users', function () {
    ////to initialise db
    beforeEach(async function(){
        await initDb();
    })
    afterEach(async function(){
        await stopDb();
    })

    describe('#createUser()', function () {

      it('should throw Validation Error if name is not present',function () {
          let user=new User();
          return expect( create_user(user.toJson())).to.eventually.be.rejected.and.instanceOf(ValidationError)
        });
      it('should not throw error and return id if name is present',function () {
          let user=new User().setName("myName");
          return expect( create_user(user.toJson())).to.eventually.be.a('number')
        });
    });
    
    describe('#fetchUser()', function () {

      it('should return null if user is not present',function () {
          return expect( fetchUserById(1)).to.eventually.be.null;
        });
      it('should return user data if user exists',async function () {
          let user=new User().setName("myName").setDescription("test user");
          let id=await create_user(user);

          return expect( fetchUserById(id)).to.eventually.include({
              id,
              name:"myName",
              description:"test user"
          })
        });
    });
  });
