"use strict";
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging : false
});

const Page = db.define('page', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        urlTitle: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('open', 'closed')
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        getterMethods: {
            route : function(){ return '/wiki/' + this.urlTitle; }
        }
    }, {
        hooks: {
            beforeValidate: function generateUrlTitle (page, title) {
              if (title) {
                // Removes all non-alphanumeric characters from title
                // And make whitespace underscore
                page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
              } else {
                // Generates random 5 letter string
                page.urlTitle = Math.random().toString(36).substring(2, 7);
              }
            }
        }
    });

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Page.belongsTo(User, { as: 'author' });

Page.hook('beforeValidate', function (page, title) {
    if (title) {
        // Removes all non-alphanumeric characters from title
        // And make whitespace underscore
        page.urlTitle =  page.title.replace(/\s+/g, '_').replace(/\W/g, '');
    } else {
        // Generates random 5 letter string
        page.urlTitle =  Math.random().toString(36).substring(2, 7);
      }
    }
);

module.exports = {
  Page: Page,
  User: User
};
