(function() {
  CKEDITOR.plugins.add("columns", {
    lang: "en,fr",
    requires: "widget,dialog",
    icons: "grid",
    init: function(editor) {
      var lang = editor.lang.columns;
      var maxColumns = 12;
      var defaultConfig = {
        rowClass: "row",
        columns: [
          {
            label: "2",
            cols: 2,
            class: "col col-md-6"
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
      };

      var columnsConfig = CKEDITOR.tools.extend(
        defaultConfig,
        editor.config.columns || {},
        true
      );

      // Dialog window
      CKEDITOR.dialog.add("columns", function(editor) {
        var commonLang = editor.lang.common;
        var colItems = [];
        columnsConfig["columns"].forEach(function(element, index) {
          colItems.push([[element["label"]], element["cols"]]);
        });

        // Whole-positive-integer validator.
        function validatorNum(msg) {
          return function() {
            var value = this.getValue(),
              pass = !!(CKEDITOR.dialog.validate.integer()(value) && value > 0);

            if (!pass) {
              alert(msg);
            }

            return pass;
          };
        }

        return {
          title: lang.editGrid,
          minWidth: 250,
          minHeight: 100,
          onShow: function() {
            // Detect if there's a selected table.
            var selection = editor.getSelection();
            var ranges = selection.getRanges();
            var command = this.getName();

            var colsInput = this.getContentElement("info", "colCount");

            if (command == "columns") {
              var grid = selection.getSelectedElement();

              // Enable or disable row and cols.
              if (grid) {
                this.setupContent(grid);
                colsInput && colsInput.disable();
              }
            }
          },
          contents: [
            {
              id: "info",
              label: lang.info,
              elements: [
                {
                  id: "colCount",
                  type: "select",
                  required: true,
                  label: lang.numCols,
                  items: colItems,
                  validate: validatorNum(lang.numColsError),
                  setup: function(widget) {
                    this.setValue(widget.data.colCount);
                  },

                  // When committing (saving) this field, set its value to the widget data.
                  commit: function(widget) {
                    widget.setData("colCount", this.getValue());
                  }
                }
              ]
            }
          ]
        };
      });

      editor.addContentsCss(this.path + "styles/columns.css");

      // Add widget
      editor.ui.addButton("columns", {
        label: lang.createGrid,
        command: "columns",
        icon: this.path + "icons/grid.png"
      });

      editor.widgets.add("columns", {
        allowedContent:
          "div(!columns);div(!ckeditor__col-*-*);div(!ckeditor__columns-content)",
        requiredContent: "div(columns)",
        parts: {
          columns: "div.columns"
        },
        editables: {
          content: ""
        },
        template: '<div class="columns">' + "</div>",
        //button: lang.createBtGrid,
        dialog: "columns",
        defaults: {},
        // Before init.
        upcast: function(element) {
          return element.name == "div" && element.hasClass("columns");
        },
        // initialize
        // Init function is useful after copy paste rebuild.
        init: function() {
          var rowNumber = 1;
          var rowCount = this.element.getChildCount();
          for (rowNumber; rowNumber <= rowCount; rowNumber++) {
            this.createEditable(maxColumns, rowNumber);
          }
        },
        // Prepare data
        data: function() {
          if (this.data.colCount && this.element.getChildCount() < 1) {
            var colCount = this.data.colCount;
            var row = this.parts["columns"];
            this.createGrid(colCount, row, 1);
          }
        },
        //Helper functions.
        // Create grid
        createGrid: function(colCount, row, rowNumber) {
          var content =
            '<div class="ckeditor__columns-row-' +
            rowNumber +
            " " +
            columnsConfig.rowClass +
            '">';
          for (var i = 1; i <= colCount; i++) {
            cssClass = "";
            columnsConfig["columns"].forEach(function(element, index) {
              if (element["cols"] == colCount) {
                cssClass = element["class"];
                return;
              }
            });

            content =
              content +
              '<div class="ckeditor__col-md-' +
              maxColumns / colCount +
              " " +
              cssClass +
              '">' +
              '  <div class="ckeditor__columns-content">' +
              "    <p>Col " +
              i +
              " content area</p>" +
              "  </div>" +
              "</div>";
          }

          content = content + "</div>";
          row.appendHtml(content);
          this.createEditable(colCount, rowNumber);
        },
        // Create editable.
        createEditable: function(colCount, rowNumber) {
          for (var i = 1; i <= colCount; i++) {
            this.initEditable("content" + rowNumber + i, {
              selector:
                ".ckeditor__columns-row-" +
                rowNumber +
                " > div:nth-child(" +
                i +
                ") div.ckeditor__columns-content"
            });
          }
        }
      });
    }
  });
})();
