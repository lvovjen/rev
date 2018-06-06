

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
    _id:'firstName',
    type: 'text',
    displayName: 'First Name',
    required: true,
    minLenght: 1
  },
/*  {
    _id:'Score',
    type: 'text',
    displayName: 'Score',
    required:false,
    minLenght: 1,
  },*/
  {
    _id:'lastName',
    type: 'text',
    displayName: 'Last Name',
    required: true,
    minLenght: 1
  }

])
