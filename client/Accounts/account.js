

//Meteor.subscribe('userData');

AccountsTemplates.configure({
  hideSignInLink:true,
  forbidClientAccountCreation: true,
  enablePasswordChange: true,
  sendVerificationEmail: false,
});

AccountsTemplates.addFields([
  {
    _id:'username',
    type: 'text',
    displayName: 'UserName',
    required: true,
    minLenght: 3
  },
  {
    _id:'fisrtName',
    type: 'text',
    displayName: 'First Name',
    required: true,
    minLenght: 2
  },

  {
    _id:'lastName',
    type: 'text',
    displayName: 'Last Name',
    required: true,
    minLenght: 2
  },
  {
    _id: "role",
    type: "select",
    displayName: "Role",
    select: [
        {
            text: "Customer",
            value: "cus",
        },
        {
            text: "Developer",
            value: "dev",
        }
      ]
    },
    {
      _id:'isAdmin',
      type: 'checkbox',
      displayName: 'Admin',
      required: false
    }

])
