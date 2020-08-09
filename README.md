# Screencapz

A simple tool for capturing screenshots for a list of pages in mobile and desktop formats.

Why? Because I hate the task of navigating to a page, opening Chrome DevTools, changing the viewport, and then saving a fullsize screenshot and then repeating a dozen times. If you hate that activity, too, then this tool is for you!

## Installation

```
$ npm i
```

## Provide data

Create the list of web pages you want to capture (e.g. `./pages.json`)

### Input list schema

Screencapz takes an array of page objects describing the `url` to draw from and the `label` to include in the filename.

```
{
  "pages": [
    {
      "url": "https://www.google.com",
      "label": "Google"
    },
    {
      "url": "https://about.google/our-story/",
      "label": "About Google"
    }
  ]
}
```

## Save dem screencapz

Take them 📸 like this:

```
$ node index.js ./pages.json
```

Your screencapz are saved as JPGs into `./captures`.