// so can do presses.max() to get max in array
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
