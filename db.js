//
// mokku
//       your mocked REST API
//                            (づ｡◕‿‿◕｡)づ
//

module.exports = function() {
  //dependencies
  var _         = require("lodash");
  var data      = require("casual");
  var moment    = require('moment');
  var S         = require('string');
  var request   = require('request');

  //datasets
  var categories = [
    {
      'id': 1,
      'name': 'Concert',
      'categories': [
        {'id':10, 'name': 'Music Festival'},
        {'id':11, 'name': 'Electronic'},
        {'id':12, 'name': 'Dance'},
        {'id':13, 'name': 'Pop'},
        {'id':14, 'name': 'RnB'},
        {'id':15, 'name': 'Rock'},
        {'id':16, 'name': 'Indie'}
      ]
    },
    {
      'id': 2,
      'name': 'Theater',
      'categories': [
        {'id':20, 'name': 'Broadway'},
        {'id':21, 'name': 'Off-Broadway'},
        {'id':22, 'name': 'Musical'},
        {'id':23, 'name': 'Play'},
        {'id':24, 'name': 'Ballet & Dance'}
      ]
    },
    {
      'id': 3,
      'name': 'Comedy',
      'categories': [
        {'id':30, 'name': 'Standup'},
        {'id':31, 'name': 'Live'},
        {'id':32, 'name': 'Comedy Festival'},
        {'id':33, 'name': 'Comedy Show'}
      ]
    }
  ];

  //objects
  data.define('image', function(size, id) {
    var id = id || _.random(100, 500);
    var size = size || '240/180';
    return 'https://unsplash.it/' + size + '?image=' + id;
    // return 'http://loremflickr.com/' + size + '/live?random=' +  _.random(100, 500);
    // request('http://www.splashbase.co/api/v1/images/search?query=people', function(error, response, body) {
    //   if (!error && response.statusCode == 200)
    //     return JSON.parse(body).images[0].url;
    // });
  });
  data.define('category', function() {
    var category = _.sample(categories);
    var subcategory = _.sample(category.categories);
    return [
      {
        id: category.id,
        parent_id: null,
        name: category.name
      },
      {
        id: subcategory.id,
        parent_id: category.id,
        name: subcategory.name
      }
    ];
  });
  data.define('date_future', function() {
    var start = new Date();
    var end = new Date(2018, 0, 1);
    var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return moment(date).format('YYYY-MM-DD HH:00:00');
  });
  data.define('performer', function() {
    return data.first_name + ' ' + data.last_name;
  });
  data.define('performers', function(performer) {
    var performers = [
      {
        'id': performer.id,
        'name': performer.name
      }
    ];
    _.times(_.random(0, 3), function(n) {
      performers.push({
        id: n + 1 + performer.id,
        name: data.performer
      });
    });
    return performers;
  });
  data.define('venue', function() {
    var types = ['Club', 'Theater', 'Center', 'Stadium'];
    return data.last_name + ' ' + _.sample(types);
  });

  //api
  var api = {

    //categories/:id
    categories: _.forEach(categories),

    //performers/:id
    performers: _.times(100, function (n) {
      var performer = data.performer;
      return {
        id: 1000 + n,
        name: performer,
        nickname: '',
        url: '/' + S(performer).slugify().s + '-tickets',
        images: {
          small: data.image('160/100'),
          medium: data.image(),
          large: data.image('320/200')
        },
        categories: data.category
      }
    }),

    //venues/:id
    venues: _.times(100, function (n) {
      var venue = data.venue;
      return {
        id: 1000 + n,
        name: venue,
        url: '/venue/' + S(venue).slugify().s + '-tickets',
        description: venue + ' description',
        address: {
          street: data.address1,
          city: data.city,
          state: data.state_abbr,
          zipcode: data.zip(),
          country: 'United States'
        },
        location: {
          lat: data.latitude,
          lng: data.longitude
        },
        images: {
          small: data.image('160x160'),
          medium: data.image(),
          large: data.image('320x320')
        }
      }
    }),

    //events/:id
    events: _.times(1000, function (n) {
      var performer = (n > 60 && n < 70) ? data.performer + ' & ' + data.performer + ' Live Festival' : data.performer;
      var image_id = _.random(100, 1000);
      var city = n > 50 ? 'New York' : data.city;
      var state = n > 50 ? 'NY' : data.state_abbr;
      return {
        id: 100 + n,
        name: performer,
        date: data.date_future,
        images: {
          small: data.image('320/200', image_id),
          medium: data.image('640/400', image_id),
          large: data.image('1024/640', image_id)
        },
        categories: data.category,
        performers: data.performers({'id': _.random(1000, 9999), 'name': performer}),
        showtimes:[
          {
            id: 1000 + n,
            date: data.date_future,
            performers: data.performers({'id': _.random(1000, 9999), 'name': performer}),
            ticketTypes: [
              {
                id: 10000 + n,
                name: "General Admission",
                description: "Includes open bar - gratuity not included.",
                price: _.random(0, 50),
                quantity: _.random(0, 300),
                status: "On Sale"
              },
              {
                id: 10000 + n,
                name: "Vip",
                description: "Includes open bar - gratuity not included.",
                price: _.random(0, 50),
                quantity: _.random(0, 300),
                status: "On Sale"
              }
            ],
            popularity: data.integer(from = 0, to = 1000),
          },
          {
            id: 2000 + n,
            date: data.date_future,
            performers: data.performers({'id': _.random(1000, 9999), 'name': performer}),

            ticketTypes: [
              {
                id: 11000 + n,
                name: "General Admission",
                description: "Includes open bar - gratuity not included.",
                price: _.random(0, 50),
                quantity: _.random(0, 300),
                status: "On Sale"
              },
              {
                id: 11000 + n,
                name: "Vip",
                description: "Includes open bar - gratuity not included.",
                price: _.random(0, 50),
                quantity: _.random(0, 300),
                status: "On Sale"
              }
            ],
            popularity: data.integer(from = 0, to = 1000)
          }
        ],
        venue: {
          id: 1,
          name: data.venue,
          city: city,
          state: state,
          location: {
            lat: data.latitude,
            lng: data.longitude
          }
        },
        tickets: {
          price_lowest: _.random(0, 50),
          price_highest: _.random(50, 100),
          quantity: _.random(0, 300)
        },
        popularity: data.integer(from = 0, to = 1000)
      }
    }),

    //location/:id
    locations: _.times(1000, function (n) {
      return {
        id: n,
        city: data.city + ', ' + data.state_abbr,
        popularity: data.integer(from = 0, to = 1000)
      }
    }),

    //geoip
    geoip: {
      city: 'New York',
      state: 'NY',
      coordinates : {
        lat: 40.714353,
        lng: -74.005973
      }
    },

    //search
    search: []
  };

  _.each(api.events, function (event) {
    api.search.push ({
      type: 'event',
      id: event.id,
      name: event.name,
      performer: event.performers[0].name,
      date: event.date,
      venue: event.venue.name,
      category: event.categories[1].name,
      image: event.images.small,
      showtimes: event.showtimes
    });
  });
  _.times(100, function(n) {
    var performer = data.performer;

    api.search.push ({
      type: 'performer',
      id: 1000 + n,
      name: data.performer,
      category: data.category[1].name,
      image: data.image()
    });

    api.search.push ({
      type: 'venue',
      id: 1000 + n,
      name: data.venue,
      city: data.city,
      state: data.state_abbr,
      image: data.image()
    });
  });

  return api;
};
