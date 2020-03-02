var postcss = require('postcss');
var bug81a = require('./bugs/bug81a');

var doNothingValues = [
  'none',
  'auto',
  'content',
  'inherit',
  'initial',
  'unset'
];

module.exports = postcss.plugin('postcss-flexbugs-fixes', function() {
  return function(css) {
    css.walkDecls(function(d) {
      if (d.value.indexOf('var(') > -1) {
        return;
      }
      if (d.value === 'none') {
        return;
      }
      var values = postcss.list.space(d.value);
      if (doNothingValues.indexOf(d.value) > 0 && values.length === 1) {
        return;
      }

      if (d.prop === 'flex') {
        if (values.length !== 3) {
          throw d.error('Must provide 3 values.', {word: d.value});
        }

        const [flexGrow, flexShrink, flexBasis] = values;

        const regex = /^\d+$/;
        if (!regex.exec(flexGrow)) {
          throw d.error(`Invalid shorthand \`flex-grow\` value: ${flexGrow}. Value must be a unitless number.`, {word: flexGrow});
        }
        if (!regex.exec(flexShrink)) {
          throw d.error(`Invalid shorthand \`flex-shrink\` value: ${flexShrink}. Value must be a unitless number.`, {word: flexShrink,
            index: d.prop.length + flexGrow.length + ':  '.length,
          });
        }

        checkFlexBasis(d, flexBasis);
        bug81a(d);
      }

      if (d.prop === 'flex-basis') {
        checkFlexBasis(d, d.value);
      }
    });
  };
});

function checkFlexBasis(d, flexBasis) {
  if (!flexBasis || ['0', '0px'].includes(flexBasis)) {
    throw d.error('Invalid flex-basis value. Please specify `0%` or `1px`.', {word: flexBasis,
      index: d.toString().length - flexBasis.length,
    });
  }
}
