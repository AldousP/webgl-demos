"use strict";

function Entity(name) {
  this.ID = ''; // Set by a handler
  this.name = name ? name : "Entity"; // Set by entity
  this.components = {};
}