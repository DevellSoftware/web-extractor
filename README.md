# Web Extractor

This library is made to make AI agents operate on web easier. It scraps the page of given url, and returns an object oriented structure, that includes key elements, such as links, buttons, and text articles.

# Usage

## Install

`yarn add @devell/web-extractor`

## Use in the code

```
import extractor from "@devell/web-extractor";

const view: extractor.View = extractor.extract("https://example.com");

// to access links

const links = view.links;

for (const link of links) {
    console.log(`There is a link with text ${link.text}, at coordinates ${link.x}, ${link.y}")
}
```

# Upcoming features

There will be probably interaction of navigation between the pages, more content to extract and anything that will pop up while using this library.
