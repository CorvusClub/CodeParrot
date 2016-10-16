import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

import nodeResolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');

export default {
  entry: './index.js',
  plugins: [
    babel(babelrc()),
    nodeResolve({
      jsnext: true
    })
  ],
  targets: [
    {
      dest: './dist/index.js',
      format: 'iife',
      sourceMaps: true
    }
  ]
}
