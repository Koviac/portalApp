const Course = require('../modules/course');
const Dept = require('../modules/dept');
const { Student, Lecturer /* , Admin */} = require('../modules/users');

module.exports = (app) => {
  app.use('/course', Course);
  app.use('/dept', Dept);
  app.use('/students', Student);
  app.use('/lecturer', Lecturer);
  // app.use('/admin', Admin);

  // Front-End Application: Send all other request to Angular
  app.get('*', (req, res) => {
    // res.sendFile('../../app/index');
    res.render('index', { title: 'Academy' });
  });
};