//
// mokku
//       your mocked REST API
//                            (づ｡◕‿‿◕｡)づ
//

module.exports = function() {
  //dependencies
  var _     = require("lodash");
  var data  = require("casual");

  //objects
  data.define('image', function(size) {
    var size = size || '240x240';
    //return 'https://source.unsplash.com/'+size+'/?person';
    return 'https://unsplash.it/' + size + '?image=' + data.integer(from=100, to=500);
  });
  data.define('category', function(parent) {
    var id = data.integer(from=0, to=3);
    var categories = ['Concerts', 'Theater', 'Comedy'];
    return {
      id: id + 1,
      parent_id: null,
      name: categories[id]
    };
  });

  //api
  return {

    //events/:id
    events: _.times(100, function(n) {
      var performer = data.first_name + ' ' + data.last_name;
      return {
        id: 100 + n,
        name: performer,
        time: '2016-09-' + data.date(format = 'DD HH:') + '30:00',
        images: {
          small: data.image('160x160'),
          medium: data.image(),
          large: data.image('320x320'),
        },
        categories: [
          data.category()
        ],
        performers: [
          {
            id: 0,
            name: performer
          },
          {
            id: 1,
            name: data.first_name + ' ' + data.last_name
          }
        ],
        venue: {
          id: 1,
          name: data.last_name + ' Theater',
          location: {
            lat: data.latitude,
            lng: data.longitude
          }
        },
        tickets: {
          price_lowest: data.integer(from=0, to=50),
          price_highest: data.integer(from=50, to=100),
          quantity: data.integer(from=0, to=300),
        }
      }
    })
  }
}
