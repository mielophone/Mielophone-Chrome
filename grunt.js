/*global module:false*/
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        concat: {
            m: {
                src: ['coffee/*.js'],
                dest: 'coffee/Mielophone-concat.js'
            }
        },
        min: {
            m: {
                src: ['coffee/Mielophone-concat.js'],
                dest: 'coffee/Mielophone.js'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', 'concat min');

};