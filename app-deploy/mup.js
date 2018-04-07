module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: 'ec2-52-66-163-110.ap-south-1.compute.amazonaws.com',
      username: 'ubuntu',
       pem: 'C:/Users/lvovj/Desktop/ChatApp17_12/ChatApp/app-deploy/rev.pem'
      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'app',
    path: 'C:/Users/lvovj/Desktop/ChatApp17_12/ChatApp',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      port:3000,
      ROOT_URL: 'http://ec2-52-66-163-110.ap-south-1.compute.amazonaws.com',
      MONGO_URL: 'mongodb://localhost:3000/ChatApp',
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
