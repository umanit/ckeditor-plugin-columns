# Column widget for CKEditor 4

Fork from [btgrid](https://github.com/kaido24/btgrid), without row concept, and not attached to bootstrap.

Work with CKEditor >= 4.3, and depends on `dialogs` and `widget` plugins.

## Options

Configured by default to work with bootstrap 3.

You can configure the following options:
```js
{
    rowClass: "row", // CSS class for the div that surround your columns
    columns: [ // Different choices on a 12 column datagrid
        {
            label: "2", // Name in the selector
            cols: 2, // Number of cols to generate
            class: "col col-md-6" // CSS class to apply
        },
        {
            label: "3",
            cols: 3,
            class: "col col-md-4"
        },
        {
            label: "4",
            cols: 4,
            class: "col col-md-3"
        },
        {
            label: "6",
            cols: 6,
            class: "col col-md-2"
        },
        {
            label: "12",
            cols: 12,
            class: "col col-md-1"
        }
    ]
}
```
