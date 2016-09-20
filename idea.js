var chart = require('chart')

// 
// (function() {
//   var element = document.querySelector('body')
//   
//   element.innerHTML = "Hello world"
// })()

var render = function( selector ) {
  var element = document.querySelector( selector )
  
  element.innerHTML = "Hello World"
}

export default { render }
module.exports = { render: render }

import aDefaultThing from 'dependency'
var aDefaultThing = require('dependency')

import { many, named, things } from 'dependency'
var theThing = 'dependency'
var many = theThing.many

import bothDefault, { named, things } from 'dependency'
