module.exports = grunt => {
  grunt.initConfig({
    ts: {
      default: {
        tsconfig: './tsconfig.json'
      }
    },
    exec: {
      pbjs: {
        cmd: 'npx pbjs -t static-module -w commonjs -o src/Registration/compiled.js src/Registration/request.proto'
      },
      pbts: {
        cmd: 'npx pbts -o src/Registration/compiled.d.ts src/Registration/compiled.js'
      }
    },
    copy: {
      main: {
        files: [{ src: 'src/Registration/compiled.js', dest: 'dist/Registration/compiled.js' }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['exec', 'ts']);
};
