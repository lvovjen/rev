module.exports = {
  servers:
{
    one:{  // TODO: set host address, username, and authentication method
      host: 'ec2-18-221-49-192.us-east-2.compute.amazonaws.com',
      username: 'ubuntu',
      pem: 'C:/Users/lvovj/Desktop/ChatApp17_12/my-meteor-deployment/chatapp.pem'
      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    }
},

  app: {
    // TODO: change app name and path
    name: "chatapp",
    path: "C:/Users/lvovj/Desktop/ChatApp17_12/ChatApp",
    servers: {
      one: {}
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      PORT:8080,
      ROOT_URL: 'http://ec2-18-221-49-192.us-east-2.compute.amazonaws.com',
      MONGO_URL: 'mongodb://localhost:3000/chatapp'
      //,MAIL_URL: 'smtp://postmaster@sandbox7fbb8738ea5f4f799207cc19b1800eba.mailgun.org:e42a4eb9c59bf4a2495f5159cef923af@smtp.mailgun.org:587'
    },

    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma separated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
  //image: 'abernix/meteord:node-8.4.0-base',
  //image: 'abernix/meteord:base',
  // deployCheckWaitTime: 60

    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
