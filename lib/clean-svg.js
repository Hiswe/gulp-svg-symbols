'use strict';

exports.removeTags = function ($, tags) {
  tags.forEach(function (tag) {
    $(tag).remove();
  });
  return $;
};

// copy from
// https://github.com/FWeinb/grunt-svgstore/blob/master/tasks/svgstore.js#L112
exports.removeEmptyGroup = function ($) {
  $('g').each(function () {
    var $elem = $(this);
    if (!$elem.children().length) {
      $elem.remove();
    }
  });
  return $;
};

exports.removeAttributes = function ($, attributes) {
  attributes.forEach(function (attribute) {
    $('[' + attribute + ']').removeAttr(attribute);
  });
  return $;
};
