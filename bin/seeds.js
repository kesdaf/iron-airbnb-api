require('../config/db.config')

const {User,USERTYPE} = require('../models/user.model')
const Local = require('../models/local.model')
const LocalOptions = require('../models/local.options.model')

const faker = require('faker')


// User.deleteMany({})
//   .then(() => Local.deleteMany({}))
//   .then(() => {
//     for (let i = 0; i < 100; i++) {
//         const user = new User({
//           name: faker.name.findName(),
//           email: faker.internet.email(),
//           password: '123123123',
//           type: i%5==0?USERTYPE[1]:USERTYPE[0],
//           avatar: faker.image.avatar(),
//           validated: true,
//           createdAt: faker.date.past()
//         });
//         console.log(user);
//         user.save().then().catch(e =>{console.log(e);})
//     }
//   })
  User.find({type:USERTYPE[1]}).then( users =>{
      users.map(user =>{
        console.log(user)
        let imgs=[];
        for(let i=0; i< Math.random()*1000;i++){
            for(let i=0; i< Math.random()*10;i++){
                imgs.push(faker.image.city())
            }
            const local= new Local({
                title: faker.address.streetAddress(),
                owner:user._id,
                image:imgs,
                price:faker.commerce.price(),
                description:faker.lorem.paragraph(),
                location:{
                    type:"Point",
                    coordinates:[
                        faker.address.longitude(),
                        faker.address.latitude()
                        ]
                    }
            })
            console.log(local);
            local.save()
        }    
      })
  }

  )