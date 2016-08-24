var faker = require('faker');
var samples = require('../data/cards.json');
var debug = require('debug')('HipConnectTester:generator');
var prettyjson = require('prettyjson');

function Generator () {

/*
 * Cards
 *
 * Cards are generated to comply with following schema.
 * Mandatory fields are always present, but have randomly generated values.
 * Optional fields are present with 50% chance.
 *

ICON_DOC = """
    union {
        string;
        object {
            string {1,} url `The url where the icon is`;
            string {1,} "url@2x"? `The url for the icon in retina`;
        }*
    } icon?;
"""

CARD_DOC = Template("""
  object {
    string {1,16} style $valid_styles `Type of the card`;
    string {1,} id `An id that will help HipChat recognise the same card when it is sent multiple times`;
    string {1,500} title `The title of the card`;
    string {1,500} description? `A description with a limit of 500 characters`;
    string {1,} url? `The url where the card will open`;
    number date? `Unix timestamp in seconds representing when the event occur.`;
    object {
        string {1,250} url `The thumbnail url`;
        string {1,250} "url@2x"? `The thumbnail url in retina`;
        number width? `The original width of the image`;
        number height? `The original height of the image`;
    }* thumbnail?;
    $icon_template
    array [
        object {
            string {1,50} label;
            object {
                $icon_template
                string {1,} label `The text representation of the value`;
                string {1,} style $style_attributes ? `AUI Integrations for now supporting only lozenges`;
                string {1,} url? `Url to be opened when a user clicks on the label`;
            } value;
        }
    ] {1,10} attributes? `List of attributes to show below the card. Sample {label}:{value.icon} {value.label}`;
    object {
        $icon_template
        string {1,} html `Html for the activity to show in one line a summary of the action that happened`;
    } activity?
    `The activity will generate a collapsable card of one line showing the html
    and the ability to maximize to see  all the content.`
  }*
""")

 */

  this.randomCard = function () {
    var icon = {
      url: faker.random.arrayElement(samples.icons)
    };
    if (faker.random.boolean()) {
      icon['url@2x'] = faker.random.arrayElement(samples.icons);
    }
    // mandatory
    var card = {
      style: faker.random.arrayElement(samples.styles),
      id: faker.random.uuid(),
      url: faker.random.arrayElement(samples.images),
      title: faker.lorem.sentence()
    };
    // description
    if (faker.random.boolean() || card.style == 'link') {
      card.description = faker.lorem.paragraph();
    }
    // date
    if (faker.random.boolean()) {
      var d = new Date();
      card.date = d.getTime();
    }
    // thumbnail
    if (faker.random.boolean()) {
      card.thumbnail = {
        url: faker.random.arrayElement(samples.images)
      };
      if (faker.random.boolean()) {
        card.thumbnail['url@2x'] = faker.random.arrayElement(samples.images);
      }
      if (faker.random.boolean()) {
        card.thumbnail.width = faker.random.number({min: 1000, max: 5000});
      }
      if (faker.random.boolean()) {
        card.thumbnail.height = faker.random.number({min: 100, max: 3000});
      }
    }
    // icon
    if (faker.random.boolean()) {
      card.icon = icon;
    }
    // attributes
    if (faker.random.boolean()) {
      card.attributes = [];
      var n = faker.random.number({min: 1, max: 10});
      for (var i = 0; i < n; i++) {
        card.attributes[i] = {
          label: faker.lorem.words()[0],
          value: {
            icon: icon,
            label: faker.lorem.words()[0],
            style: faker.random.arrayElement([
              'lozenge-success',
              'lozenge-error',
              'lozenge-current',
              'lozenge-complete',
              'lozenge-moved'
            ])
          }
        };
        if (faker.random.boolean()) {
          card.attributes[i].value.url = faker.random.arrayElement(samples.images);
        }
      };
    }
    // activity
    if (faker.random.boolean()) {
      card.activity = {
        icon: faker.image.avatar(),
        html: '<strong>' + faker.name.firstName() + '</strong> ' + faker.lorem.sentence()
      };
    }
    return card;
  };

  this.imageCard = function () {
    var card = {
      style: 'image',
      id: faker.random.uuid(),
      url: faker.random.arrayElement(samples.images),
      title: faker.lorem.sentence(),
      thumbnail: {
        url: faker.random.arrayElement(samples.images),
        'url@2x': faker.random.arrayElement(samples.images),
        width: faker.random.number({min: 1000, max: 5000}),
        height: faker.random.number({min: 100, max: 3000})
      }
    };
    return card;
  };

  this.linkCard = function () {
    var d = new Date();
    var card = {
      style: 'link',
      url: faker.random.arrayElement(samples.images),
      id: faker.random.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      icon: {
        url: faker.random.arrayElement(samples.icons)
      },
      date: d.getTime()
    };
    return card;
  };

  this.mediaCard = function () {
    var d = new Date();
    var card = {
      style: 'media',
      url:"https://www.youtube.com/watch?v=X85MSK0SFzs",
          //faker.random.arrayElement(samples.images),
      id: faker.random.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      icon: {
        url: faker.random.arrayElement(samples.icons)
      },
      date: d.getTime()
    };
    return card;
  };

  this.applicationCard = function () {
    var card = {
      style: 'application',
      url: faker.random.arrayElement(samples.images),
      id: faker.random.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      icon: {
        url: faker.random.arrayElement(samples.icons)
      },
      attributes: [
        {
          label: faker.lorem.words()[0],
          value: {
            url: faker.random.arrayElement(samples.images),
            icon: {
              url: faker.random.arrayElement(samples.icons)
            },
            label: faker.lorem.words()[0],
            style: faker.random.arrayElement(['lozenge-success', 'lozenge-error', 'lozenge-current', 'lozenge-complete', 'lozenge-moved'])
          }
        },
        {
          label: faker.lorem.words()[0],
          value: {
            icon: {
              url: faker.random.arrayElement(samples.icons)
            },
            label: faker.lorem.words()[0],
            style: faker.random.arrayElement(['lozenge-success', 'lozenge-error', 'lozenge-current', 'lozenge-complete', 'lozenge-moved'])
          }
        },
        {
          label: faker.lorem.words()[0],
          value: {
            icon: {
              url: faker.random.arrayElement(samples.icons)
            },
            label: faker.lorem.words()[0],
            style: faker.random.arrayElement(['lozenge-success', 'lozenge-error', 'lozenge-current', 'lozenge-complete', 'lozenge-moved'])
          }
        }
      ]
    };
    return card;
  };

  this.activityCard = function () {
    var card = this.applicationCard();
    card.activity = {
      // TODO fix later
      icon: faker.image.avatar(),
      html: '<strong>' + faker.name.firstName() + '</strong> ' + faker.lorem.sentence()
    };
    return card;
  };

  this.cardJSON = function () {
    return JSON.stringify(this.randomCard(), undefined, 2);
  };

  this.glanceJSON = function () {
    var type = faker.random.arrayElement(['lozenge', 'icon']);
    var data = {};
    if (type === 'lozenge') {
      data = {
        label: {
          type: 'html',
          value: '<strong>' + faker.hacker.ingverb() + '</strong> ' + faker.hacker.noun() + ' <em>' + faker.hacker.adjective() + '</em>'
        },
        status: {
          type: 'lozenge',
          value: {
            label: faker.hacker.abbreviation(),
            type: faker.random.arrayElement(['default', 'success', 'error', 'current', 'new', 'moved'])
          }
        }
      }
    } else if (type === 'icon') {
      data = {
        label: {
          type: 'html',
          value: '<strong>' + faker.hacker.ingverb() + '</strong> ' + faker.hacker.noun() + ' <em>' + faker.hacker.adjective() + '</em>'
        },
        status: {
          type: 'icon',
          value: {
            'url': faker.random.arrayElement(samples.icons),
            'url@2x': faker.random.arrayElement(samples.icons)
          }
        }
      }
    }
    return JSON.stringify(data, undefined, 2);
  };

  this.dialogJSON = function () {
    var data = {
      "title": "My Dialog",
      "options": {
        "style": "warning",
        "primaryAction": {
          "name": "Yes",
          "key": "dialog.yes",
          "enabled": false
        },
        "secondaryActions": [
          {
            "name": "No",
            "key": "dialog.no"
          }
        ],
        "size": {
          "width": "500px",
          "height": "300px"
        },
        "hint": "Some hint",
        "filter": {
          "placeholder": "Search..."
        }
      }
    };
    return JSON.stringify(data, undefined, 2);
  };

  return this;

}

module.exports = new Generator();
