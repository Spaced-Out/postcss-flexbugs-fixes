# PostCSS Flexbugs Strict
[PostCSS] plugin
This project tries to encourage less ambiguous Flexbox CSS while fixing some of [flexbug's](https://github.com/philipwalton/flexbugs) issues.

## Explanation
This started as a fork of `postcss-flexbugs-fixes` because I was not happy with some of the changes it made to support shorthand `flex` declarations. This is not the fault of that plugin (which is great!); it is an issue with the goal of supporting ambiguous declarations in browsers like IE and Safari. See https://github.com/luisrudge/postcss-flexbugs-fixes/issues/59

My solution was to change the goal. Instead of supporting declarations like `flex: 100% 0;` and `flex: 1`, we force users to declare all three
values explicitly. Furthermore, we do not automatically translate any values from one unit to another. We force users to specify a unit that is compatible with all target browsers.

In my experience, most developers have no idea what the defaults of `flex` are let alone what `flex: 1;` means, and `flex: 1 1 auto;` is actually not much more code. It forces developers to think about exactly what they want.

## Strict Behavior

### `flex` declarations must contain 3 values.
_Okay_
```css
.foo { flex: 1 0 0%; }
```
_Bad_
```css
.foo { flex: 1; }
```

### The `grow` and `shrink` values must be unit-less.
_Bad_
```css
.foo { flex: 100% 1 0%; }
```

### The `basis` value must have a unit, and cannot be `0px`.
_Bad_
```css
.foo { flex: 1 1 0px; }
```
_Also bad_
```css
.foo { flex: 1 0 0; }
```

## Translations
The `calc` check for `flex-basis` is benign so we still do it.

### bug [8.1.a](https://github.com/philipwalton/flexbugs/blob/master/README.md#8-flex-basis-doesnt-support-calc)
#### Input

```css
.foo { flex: 1 0 calc(1vw - 1px); }
```

#### Output

```css
.foo {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: calc(1vw - 1px);
}
```

## Usage

```js
postcss([require('@spaced-out/postcss-flexbugs-strict')]);
```

See [PostCSS] docs for examples for your environment.

[postcss]: https://github.com/postcss/postcss
