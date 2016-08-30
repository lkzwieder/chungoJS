module.exports = {
   all: {
      'GET /user/id': {
         handler: 'UserController.getId',
         params: {
            id: '\\d{1,3}'
         }
      },
      '/test/alfa/caca/nume': {
         handler: 'TestController.getDos',
         params: {
            alfa: '[a-z]{1,3}',
            nume: '\\d{6}'
         }
      }
   }
};
