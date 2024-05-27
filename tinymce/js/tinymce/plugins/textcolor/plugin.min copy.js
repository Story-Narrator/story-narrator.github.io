!function () {

	"use strict";

	var pluginManager = tinymce.util.Tools.resolve("tinymce.PluginManager"),

		GetSelectionColour = function (editor, formatName) {

			// if the formatName is "forecolor" set the "color", otherwise set the "background-color"

			var globalColour;
            return editor.dom.getParents(
				editor.selection.getStart(),
				function (domSelectionNode /*dom object passed from getParents*/) {
					var localColourArray;
					(localColourArray = domSelectionNode.style["forecolor" === formatName ? "color" : "background-color"]) && (globalColour = localColourArray)
				}), globalColour /*root node, don't go beyond this point in the returned array*/
		},

		GetColourArray = function (ColourMap) {
			var incrementVar,
				ColourArray = [];
			
			for (incrementVar = 0; incrementVar < ColourMap.length; incrementVar += 2)
				ColourArray.push({ text: ColourMap[incrementVar + 1], color: "#" + ColourMap[incrementVar] });
			
			return ColourArray
		},

		ApplyFormatting = function (editor, formatName, colour) {
			editor.undoManager.transact(function () {
				editor.focus(),
				editor.formatter.apply(formatName, { value: colour }),
				editor.nodeChanged()
			})
		},

		ClearFormatting = function (editor, formatName) {
			editor.undoManager.transact(function () {
				editor.focus(),
				editor.formatter.remove(formatName, { value: null }, null, !0),
				editor.nodeChanged()
			})
        },

        ApplyBodyColour = function (editor, colour) {
            editor.focus(),
            editor.getBody().style.backgroundColor = colour,
            editor.nodeChanged()
        },

        RemoveBodyColour = function (editor) {
            editor.focus(),
            editor.getBody().removeAttribute("style"),
            editor.nodeChanged()
        },

		AddCommandsToEditor = function (editor) {
			editor.addCommand(/* command name to add/override */ "mceApplyTextcolor", /* function to execute when the command occurs */ function (formatName, colour) { ApplyFormatting(editor, formatName, colour) }),
            editor.addCommand("mceRemoveTextcolor", function (formatName) { ClearFormatting(editor, formatName) }),
            editor.addCommand("ApplyBodyColour", function (colour) { ApplyBodyColour(editor, colour) }),
            editor.addCommand("RemoveBodyColour", function() { RemoveBodyColour(editor) })
		},

		tinymceDOMUtils = tinymce.util.Tools.resolve("tinymce.dom.DOMUtils"),

		tinymceTools = tinymce.util.Tools.resolve("tinymce.util.Tools"),

		colourMap = [
			"FBB00F", "Happy",
			"5373B8", "Sad",
			"919904", "Excited",
			"9E4B1E", "Disappointed"
		],

		GetTextColourMap = function (editor) {
			return editor.getParam("textcolor_map", colourMap)
		},

		GetTextColourRows = function (editor) {
			return editor.getParam("textcolor_rows", 5)
		},

		GetTextColourColumns = function (editor) {
			return editor.getParam("textcolor_cols", 8)
		},

		GetColourPickerCallback = function (editor) {
			return editor.getParam("color_picker_callback", null)
		},

		GetForecolourMap = function (editor) {
			return editor.getParam("forecolor_map", GetTextColourMap(editor))
		},

		GetBackcolourMap = function (editor) {
			return editor.getParam("backcolor_map", GetTextColourMap(editor))
		},

		// GetEmotionMap = function (editor) {
		// 	return editor.getParam("emotion_map", GetTextColourMap(editor))
		// },

		GetForecolourRows = function (editor) {
			return editor.getParam("forecolor_rows", GetTextColourRows(editor))
		},

		GetBackcolourRows = function (editor) {
			return editor.getParam("backcolor_rows", GetTextColourRows(editor))
		},

		GetBodycolourRows = function (editor) {
			return editor.getParam("bodycolor_rows", GetTextColourRows(editor))
		},

		GetForecolourColumns = function (editor) {
			return editor.getParam("forecolor_cols", GetTextColourColumns(editor))
		},

		GetBackcolourColumns = function (editor) {
			return editor.getParam("backcolor_cols", GetTextColourColumns(editor))
		},

		GetBodycolourColumns = function (editor) {
			return editor.getParam("bodycolor_cols", GetTextColourColumns(editor))
		},

		ColourPicker = GetColourPickerCallback,

		GetColourPickerCallbackExistsBool = function (editor) {
			return "function" == typeof GetColourPickerCallback(editor) /* if GetColourPuickerCallback returns a function then evaluates to true, if it returns null (the default to return) then this will evaluate to false */
		},

		//the I18n tool handles international translations
		tinymceI18n = tinymce.util.Tools.resolve("tinymce.util.I18n"),

		CreateColourMapTable = function (colourColumns, colourRows, colourMap, colourPickerCallbackExistsBool) {

			var colourMapWithTransparency,
				colourVar,
				colourMapTable,
				colourMapLength,
				incrementVar2,
				incrementVar1,
				colourMapIndex,
				elementIdNumber = 0, // empty variables declared - bar elementIdNumber

				elementId = tinymceDOMUtils.DOM.uniqueId("mcearia"),

				//creates colours in the colour table
				CreateColourTableCell = function (colourCode, colourName) {
					var isColourCodeTransparentBool = "transparent" === colourCode;
					return '<td class="mce-grid-cell' + (isColourCodeTransparentBool ? " mce-colorbtn-trans" : "") + '"><div id="' + elementId + "-" + elementIdNumber++ + '" data-mce-color="' + (colourCode || "") + '" role="option" tabIndex="-1" style="float: left; border-radius: 50%;' + (colourCode ? " background-color: " + colourCode + ";": "") + (isColourCodeTransparentBool ? " line-height: 50%;" : "") + '" title="' + tinymceI18n.translate(colourName) + '">' + (isColourCodeTransparentBool ? "&#215;" : "") + "</div><span style='margin-left: 5px;'>"+tinymceI18n.translate(colourName)+"</span></td>"
				};

			// Parent for loop begins. Add transparent colour to the end of the colour map array. Create the colour map table. For the number of rows in the colour map, run the code enclosed in curley braces.
			for ((colourMapWithTransparency = GetColourArray(colourMap)).push({ text: tinymceI18n.translate("None"), color: "transparent" }/* Adds transparent colour to the colour map */ ), colourMapTable = '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>' /*Creates the table for the colour map */, colourMapLength = colourMapWithTransparency.length - 1 /*Sets colourMapLength to the number of actual colours in the colour map*/, incrementVar1 = 0; incrementVar1 < colourRows; incrementVar1++) {

				//Child for loop begins
				for (colourMapTable += "<tr>" /*add table row to colourMapTable*/, incrementVar2 = 0; incrementVar2 < colourColumns; incrementVar2++) {
					colourMapTable += colourMapLength < (colourMapIndex = incrementVar1 * colourColumns + incrementVar2) ? "<td></td>" /* if true, add blank table cell to the end of the colourMapTable to make up empty space */ : CreateColourTableCell((colourVar = colourMapWithTransparency[colourMapIndex]).color /*set colourVar to the colour at this index no. in the colour map array, then pass the colour code of that var */, colourVar.text /*pass colour name of colourVar*/ );
					// if (incrementVar2 + 1 == colourColumns) {
					// 	colourMapTable += "</tr>";
					// }
					// else {
					// 	colourMapTable += "</tr><tr>";
					// }
					// console.log(colourMapTable);
				} //Child for loop ends
				
				colourMapTable += "</tr>"
			}
			// Parent for loop ends.

			// // if user has set a custom callback for the colour picker, add an additional row to the colour table and fill it with a button to execute the callback function
			// if (colourPickerCallbackExistsBool) {
			// 	for (colourMapTable += '<tr><td colspan="' + colourColumns + '" class="mce-custom-color-btn"><div id="' + elementId + '-c" class="mce-widget mce-btn mce-btn-small mce-btn-flat" role="button" tabindex="-1" aria-labelledby="' + elementId + '-c" style="width: 100%"><button type="button" role="presentation" tabindex="-1">' + tinymceI18n.translate("Custom...") + "</button></div></td></tr>", colourMapTable += "<tr>", incrementVar2 = 0; incrementVar2 < colourColumns; incrementVar2++) {
			// 		colourMapTable += CreateColourTableCell("", "Custom color");
			// 	}
				
			// 	colourMapTable += "</tr>"
			// }

			return colourMapTable += "</tbody></table>"
		},

		SetCustomTableCellColour = function (colourCell, colour) {
			colourCell.style.background = colour, colourCell.setAttribute("data-mce-color", colour)
		},

		ButtonClicked = function (editor, isTextBool) {
			return function (domNode) {
				var senderButton = domNode.control;
				if (isTextBool)
					senderButton._color ? editor.execCommand("mceApplyTextcolor", senderButton.settings.format, senderButton._color) : editor.execCommand("mceRemoveTextcolor", senderButton.settings.format)
				else
                    senderButton._color ? editor.execCommand("ApplyBodyColour", senderButton._color) : editor.execCommand("RemoveBodyColour");
			}
		},

		ColourCellClicked = function (editor, colourColumns, isTextBool) {
			return function (domCustomColourButtonNode) {
				var clickedColour,
					parentButton = this.parent(),

				selectionColour = GetSelectionColour(editor, parentButton.settings.format /*returns the format param of the parent's addButton function, i.e. the format name*/),

				execMceApplyTextColour = function (colour) {
					editor.execCommand("mceApplyTextcolor", parentButton.settings.format, colour),
						parentButton.hidePanel(),
						parentButton.color(colour)
				},
				execMceApplyBodyColour = function (colour) {
					editor.execCommand("ApplyBodyColour", colour),
					parentButton.hidePanel(),
					parentButton.color(colour)
				};

				tinymceDOMUtils.DOM.getParent(domCustomColourButtonNode.target, ".mce-custom-color-btn") /* returns a node that has a target matching ".mce-custom-color-btn". This is what this function returns. */ && (
					parentButton.hidePanel(),
					ColourPicker(editor).call(editor, function (colour) {

						var colourArray,
							colourCell,
							incrementVar,
							colourTable = parentButton.panel.getEl().getElementsByTagName("table")[0]; // three empty variables declared, one variable set to the panel's colour map table

						for (colourArray = tinymceTools.map(colourTable.rows[colourTable.rows.length - 1 /*because index starts at 0*/].childNodes, function (domChildNodes) { return domChildNodes.firstChild }), incrementVar = 0; incrementVar < colourArray.length && (colourCell = colourArray[incrementVar]).getAttribute("data-mce-color") /* also keeps the loop running while getAttribute function returns true, i.e. we are able to get the colour for each cell */; incrementVar++);

						if (incrementVar === colourColumns)
							for (incrementVar = 0; incrementVar < colourColumns - 1; incrementVar++)
								SetCustomTableCellColour(colourArray[incrementVar], colourArray[incrementVar + 1].getAttribute("data-mce-color"));

                        SetCustomTableCellColour(colourCell, colour),

                        isTextBool ? execMceApplyTextColour(colour) : execMceApplyBodyColour(colour)

					}, selectionColour)),

					(clickedColour = domCustomColourButtonNode.target.getAttribute("data-mce-color")) ?

					// if true, i.e. successfully gets the colour of a custom colour button */
					(this.lastId && tinymceDOMUtils.DOM.get(this.lastId).setAttribute("aria-selected", "false"),
					domCustomColourButtonNode.target.setAttribute("aria-selected", !0),
                    this.lastId = domCustomColourButtonNode.target.id,
					// if the custom button's colour is transparent, run the mceRemoveTextColour function, otherwise apply the custom button colour to the text
                        "transparent" === clickedColour && isTextBool ? (editor.execCommand("mceRemoveTextcolor", parentButton.settings.format), parentButton.hidePanel(), parentButton.resetColor()) : isTextBool ? execMceApplyTextColour(clickedColour) : "transparent" === clickedColour ? (editor.execCommand("RemoveBodyColour"), parentButton.hidePanel(), parentButton.resetColor()) : execMceApplyBodyColour(clickedColour)
                    )

					// if false, i.e. there was no custom colour attribute
					: null !== clickedColour && parentButton.hidePanel()
            }
		},

		GetColourTableInfo = function (editor, switchVar) {
			return function () {
				var colourColumns,
					colourRows,
					colourMap,
					colourPickerCallbackExistsBool = GetColourPickerCallbackExistsBool(editor);
				
				switch (switchVar) {
					case 1:
						colourColumns = GetForecolourColumns(editor);
						colourRows = GetForecolourRows(editor);
						colourMap = GetForecolourMap(editor);
						break;
					case 2:
						colourColumns = GetBackcolourColumns(editor);
						colourRows = GetBackcolourRows(editor);
						colourMap = GetBackcolourMap(editor);
						break;
					case 3:
						colourColumns = 1;
						colourRows = 5
						colourMap = GetBackcolourMap(editor);
						break;
				}
				return CreateColourMapTable(colourColumns, colourRows, colourMap, colourPickerCallbackExistsBool)
			}
		},

		AddButtonsToEditor = function (editor) {
			editor.addButton("forecolor", { type: "colorbutton", tooltip: "Text Colour", format: "forecolor", panel: { role: "application", ariaRemember: !0, html: GetColourTableInfo(editor, 1), onclick: ColourCellClicked(editor, GetForecolourColumns(editor), !0)}, onclick: ButtonClicked(editor, !0)}),
			// editor.addButton("backcolor", { type: "colorbutton", tooltip: "Text Background Colour", format: "hilitecolor", panel: { role: "application", ariaRemember: !0, html: GetColourTableInfo(editor, 2), onclick: ColourCellClicked(editor, GetBackcolourColumns(editor), !0) }, onclick: ButtonClicked(editor, !0) })
			editor.addButton("bodycolour", { type: "colorbutton", tooltip: "Emotion", text: "Emotion", style: "padding-left: 23px; background-image: url(\"./assets/Emotion_Small_Icon.png\"); background-repeat: no-repeat; background-position: 6% 50%; background-size: 18px 18px", format: "hilitecolor", panel: { role: "application", ariaRemember: !0, html: GetColourTableInfo(editor, 3), onclick: ColourCellClicked(editor, GetBodycolourColumns(editor), !1) }, onclick: ButtonClicked(editor, !1) })
		};

	pluginManager.add("textcolor",
		function (editor) {
			AddCommandsToEditor(editor),
			AddButtonsToEditor(editor)
		}
	)
}();