let nothingness_state = true;
const menus = {
	"&Arquivo": [
		{
			item: "&Nova Música",
			action: () => {

                const $w = new $Window({ title: "Musicas98 - Nova música", resizable: true });
	const bar = new MenuBar(menus);
	$w.setMenuBar(bar);
	$w.$content.css({
		padding: 0,
		display: "flex",
		flexDirection: "column",
	});

                $w.$content.html("<span>Cadastro da música </span> <br><form> <input type='text'> Nome da música </input><br> </form>");
				
				$w.$Button("OK", () => $w.close()).focus().css({ width: 100 });
				$w.center();
			},
			shortcut: "Ctrl+O",
			description: "Shows a silly dialog box.",
		},
		MENU_DIVIDER,
		{
			item: "&Sair",
			action: () => {
				const $w = $Window({ title: "Sair do Músicas98", resizable: false, maximizeButton: false, minimizeButton: false });
				$w.$content.html("<p>Você está saindo do Músicas98.</p>");
				$w.$Button("OK", () => $w.close()).focus().css({ width: 100 });
				$w.center();
			},
			description: "Shows a stupid dialog box.",
		}
	]
	
	
};
// wait for page load (could alternatively just move the script so it executes after the elements are declared)
$(() => {
	// Create menu bar
	const menubar = new MenuBar(menus);
	$(menubar.element).appendTo("#menubar-example");	

	const $app_window_2 = new $Window({ title: "Musicas98 - Lista de músicas", resizable: true });
    $app_window_2.center();
	const app_window_2_menu_bar = new MenuBar(menus);
	$app_window_2.setMenuBar(app_window_2_menu_bar);
	$app_window_2.$content.css({
		padding: 0,
		display: "flex",
		flexDirection: "column",
	});
	$app_window_2.$content.append(`
		<div class="inset-deep" style="padding: 20px; background: var(--Window); color: var(--WindowText); user-select: text; cursor: text; flex: 1;">
			<p>This is the main application window.</p>
			<p>It has a tool window that belongs to it, as well as a menu bar.</p>
		</div>
	`);
	const $status_bar = $("<div class='status-bar inset-shallow' style='height:1.5em;line-height:1.5em;font-size:12px;margin-top:2px;'>").appendTo($app_window_2.$content);
	$(app_window_2_menu_bar.element).on("info", (event, info) => {
		// info = `event.detail.description: ${event.detail.description}, jQuery second arg: ${info}`; // testing
		info = event.detail.description; // new API
		$status_bar.text(info);
	});
	function showDefaultStatus() {
		$status_bar.text("Lista de músicas cadastradas no mongoDB.");
	}
	showDefaultStatus();
	$(app_window_2_menu_bar.element).on("default-info", (event) => {
		showDefaultStatus();
	});
	fake_closing($app_window_2);
	
	// Position the windows within the demo page, in the flow of text, but freely moveable
	const $windows_and_$positioners = [
		[$app_window_1, $("#app-window-example")],
		[$tool_window_1, $("#tool-window-example")],
		[$app_window_2, $("#app-window-2-positioner")],
		[$tool_window_2, $("#tool-window-2-positioner")],
		[$app_window_3, $("#app-window-3-positioner")],
	];
	function position_windows() {
		for (const [$window, $positioning_el] of $windows_and_$positioners) {
			// in a separate loop to prevent layout thrashing (untested performance optimization)
			$positioning_el._new_offset = $positioning_el.offset();
		}
		for (const [$window, $positioning_el] of $windows_and_$positioners) {
			const { _new_offset, _old_offset } = $positioning_el;
			if (
				_new_offset.top !== _old_offset?.top ||
				_new_offset.left !== _old_offset?.left
			) {
				$window.restore(); // in case it was minimized or maximized
				$window.css({
					left: _new_offset.left,
					top: _new_offset.top,
					width: "",
					height: "",
				});
				$positioning_el._old_offset = _new_offset;
			}
		}
	}
	$(window).on("resize", position_windows);
	position_windows();

	// Fake closing the windows (hide and fade back in), for demo purposes
	function fake_closing($window) {
		$window.on("close", (event) => {
			event.preventDefault();
			$window.triggerHandler("closed");
			$window.closed = true;
			$window.hide();
			setTimeout(() => {
				// Restore position
				const $positioning_el = $windows_and_$positioners.find(([$other_window]) => $window === $other_window)[1];
				$window.restore(); // in case it was minimized or maximized
				$window.css({
					left: $positioning_el.offset().left,
					top: $positioning_el.offset().top,
					width: "",
					height: "",
				});
				// Fade back in
				$window.fadeIn();
				// Ta-da! It was there all along!
				$window.closed = false;
			}, 1000);
		});
	}

	// Handle toggle buttons
	$("button.toggle").on("click", (e) => {
		$(e.target).toggleClass("selected");
		$(e.target).attr("aria-pressed", $(e.target).hasClass("selected"));
	});

	// Load themes on drag and drop (.theme/.themepack files)
	async function loadThemeFile(file) {
		const fileText = await file.text();
		const cssProperties = parseThemeFileString(fileText);
		if (cssProperties) {
			applyCSSProperties(cssProperties, { recurseIntoIframes: true });
			console.log(makeThemeCSSFile(cssProperties));
		}
	}
	$("html").on("dragover", (event) => {
		event.preventDefault();
		event.stopPropagation();
	});
	$("html").on("dragleave", (event) => {
		event.preventDefault();
		event.stopPropagation();
	});
	$("html").on("drop", (event) => {
		event.preventDefault();
		event.stopPropagation();
		const files = [...event.originalEvent.dataTransfer.files];
		for (const file of files) {
			if (file.name.match(/\.theme(pack)?$/i)) {
				loadThemeFile(file);
			}
		}
	});


});
