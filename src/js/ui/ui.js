// Maximum amount of web workers that should be run concurrently
const maxWorkers =  navigator.hardwareConcurrency || 8;
// Object with all the gems the user has equipped on any item, including items that are not equipped. Each key is the item's name and the value is an array with the ID of the gems equipped in that item.
var selectedGems = localStorage['selectedGems'] ? JSON.parse(localStorage['selectedGems']) : {};
// Key: Item slot. Value: Equipped item's ID
var selectedItems = localStorage['selectedItems'] ? JSON.parse(localStorage['selectedItems']) : {};
// Key: Talent's name. Value: Talent's point amount
var talents = localStorage['talents'] ? JSON.parse(localStorage['talents']) : {};
// Key: Aura's name. Value: Boolean
var auras = localStorage['auras'] ? JSON.parse(localStorage['auras']) : {};
var rotation = localStorage['rotation'] ? JSON.parse(localStorage['rotation']) : {};
var selectedEnchants = localStorage['selectedEnchants'] ? JSON.parse(localStorage['selectedEnchants']) : {};
// Key: Item ID. Value: Item's saved DPS from previous simulations.
var savedItemDps = localStorage['savedItemDps'] ? JSON.parse(localStorage['savedItemDps']) : {};
var settings = localStorage.settings ? JSON.parse(localStorage.settings) : {};
var sources = localStorage.sources ? JSON.parse(localStorage.sources) : {"phase": {"1": true}};
var profiles = localStorage.profiles ? JSON.parse(localStorage.profiles) : {};
var gemPreferences = localStorage.gemPreferences ? JSON.parse(localStorage.gemPreferences) : {"hidden": [], "favorites": []};

// Buffs, debuffs, consumables, and pet buffs
for (let auraType in _auras) {
	let lowerAuraType = auraType.toLowerCase().split(' ').join('-');
	$("#buffs-and-debuffs-section").append("<h3 id='" + auraType + "-heading'>" + _auras[auraType].heading + "</h3><ul id='" + lowerAuraType + "-list'></ul>");
	for (let aura in _auras[auraType].auras) {
		let a = _auras[auraType].auras[aura];
		$("#" + lowerAuraType + "-list").append("<li data-aura-type='" + auraType + "' data-checked='" + (auras[aura] || false) + "' name='" + aura + "' id='" + aura + "' class='" + (a.stats ? "stats " : "") + (a.potion ? "potion " : "") + (a.battleElixir ? "battle-elixir " : "") + (a.guardianElixir ? "guardian-elixir " : "") + (a.weaponOil ? "weapon-oil " : "") + (a.foodBuff ? "food-buff " : "") + (a.demonicRune ? "demonic-rune " : "") + (a.petOnly ? "petBuff " : "") + (a.forPet ? "petDebuff " : "") + auraType + " aura'><a href='https://tbc.wowhead.com/" + _auras[auraType].type + "=" + a.id + "'><img alt='" + a.name + "' src='img/" + a.iconName + ".jpg'></a></li>");
	}
}

// Spell Selection
for (let type in _spellSelection) {
	let rotationList = $("#rotation-list");
	let str = "<div><h4>" + _spellSelection[type].header + "</h4>";
	for (let spell in _spellSelection[type].spells) {
		rotation[type] = rotation[type] || {};
		str += "<li data-type='" + type + "' data-name='" + spell + "' class='rotation-" + type + "' data-checked='" + (rotation[type][spell] || false) + "' id='" + type + "-" + spell + "'><a href=https://tbc.wowhead.com/spell=" + _spellSelection[type].spells[spell].id + "><img src='img/" + _spellSelection[type].spells[spell].iconName + ".jpg' alt='" + _spellSelection[type].spells[spell].name + "'></a></li>";
	}
	str += "</div>";
	rotationList.append(str);
}

// Talent trees
for (let tree in _talents) {
	if (_talents.hasOwnProperty(tree)) {
		$("#talents-section").append($("<div class='talent-tree-div'><table data-name='" + tree + "' background='img/talent_tree_background_" + tree + ".jpg' id='talent-table-" + tree + "' class='talent-tree-table'></table><div class='talent-tree-name'><h3 style='display: inline-block;' data-name='" + tree + "'>" + tree.charAt(0).toUpperCase() + tree.slice(1) + "</h3><span class='clear-talent-tree'>&#10060;</span></div></div>"));
		$("#talent-table-" + tree).append($("<tbody></tbody>"));
		$("#talent-table-" + tree).data('points', 0);
		$("#talent-table-" + tree + " tbody").append($("<tr class='" + tree + "-tree-row'></tr>"));
		let lastRow = $("#talent-table-" + tree + " tbody tr:last");
		let currentCol = 1;

		for (let talent in _talents[tree]) {
			let t = _talents[tree][talent];
			talents[talent] = talents[talent] || 0;
			talentPointsRemaining -= talents[talent];
			$("#talent-table-" + tree).data('points', $("#talent-table-" + tree).data('points') + talents[talent]);

			// Check if the current talent should be in the next row below and create a new row if true
			if (t.row > $("." + tree + "-tree-row").length) {
				$("#talent-table-" + tree + " tbody").append($("<tr class='" + tree + "-tree-row'></tr>"));
				lastRow = $("#talent-table-" + tree + " tbody tr:last");
				currentCol = 1;
			}

			// Create empty cells between talents if skipping a number (e.g. going from column 1 straight to column 4)
			while (currentCol < t.column) {
				lastRow.append($("<td></td>"));
				currentCol++;
			}

			lastRow.append($("<td><div data-maxpoints='" + t.rankIDs.length + "' data-points='" + talents[talent] + "' class='talent-icon' data-tree='" + tree + "' id='" + talent + "'><a href='https://tbc.wowhead.com/spell=" + t.rankIDs[Math.max(0,talents[talent]-1)] + "'><img src='img/" + t.iconName + ".jpg' alt='" + t.name + "'><span id='" + talent + "-point-amount' class='talent-point-amount'>" + talents[talent] + "</span></a></div></td>"));
			
			// Check if the text displaying the talent point amount should be hidden or colored (for maxed out talents)
			let pointAmount = $("#" + talent + "-point-amount")
			if (pointAmount.text() <= 0) {
				pointAmount.hide();
			} else if (pointAmount.text() == t.rankIDs.length) {
				pointAmount.css("color","#ffcd45");
			} else {
				pointAmount.css("color","#7FFF00")
			}
			currentCol++;
		}

		updateTalentTreeNames();
	}
}

// Add in the pre-requisite talent arrows (todo: find a better way to do this)
/*$("#talent-table-affliction").append("<div data-row='3' data-column='3' class='talent-arrow'><img width='15' height='60' src='img/talent_arrow_down.jpg'></div>"); // Amplify Curse to Curse of Exhaustion
$("#talent-table-affliction").append("<div data-row='5' data-column='2' class='talent-arrow'><img width='15' height='10' src='img/talent_arrow_down.jpg'></div>"); // Siphon Life to Shadow Mastery
$("#talent-table-affliction").append("<div data-row='7' data-column='2' class='talent-arrow'><img width='15' height='60' src='img/talent_arrow_down.jpg'></div>"); // Contagion to Unstable Agony
$("#talent-table-demonology").append("<div data-row='3' data-column='2' class='talent-arrow'><img width='15' height='10' src='img/talent_arrow_down.jpg'></div>");*/ // Fel Domination to Master Summoner

// When a buff/debuff/consumable is clicked
$(".aura").click(function() {
	let auraType = $(this).attr('data-aura-type');
	let auraName = $(this).attr('name');
	let checkedVal = $(this).attr('data-checked') === 'true';
	$(this).attr('data-checked', !checkedVal);
	auras[$(this).attr('name')] = !checkedVal;

	if (auraName == "faerieFire" || auraName == "vampiricTouch" || auraName == "exposeArmor" || auraName == "exposeWeakness" || auraName == "totemOfWrath" || auraName == "curseOfTheElements" || auraName == "prayerOfSpirit" || auraName == "powerOfTheGuardianWarlock" || auraName == "powerOfTheGuardianMage" || auraName == "drumsOfBattle" || auraName == "drumsOfWar" || auraName == "drumsOfRestoration" || auraName == "bloodlust") {
		updateSimulationSettingsVisibility();
	}
	if (!$(this).hasClass("petBuff")) {
		modifyStatsFromAura(_auras[auraType].auras[auraName], checkedVal);
		refreshCharacterStats();
	}
	localStorage.auras = JSON.stringify(auras);
	return false;
});

// Array of consumables whose clicks we want to track.
let consumableTypesToTrack = ['.weapon-oil', '.battle-elixir', '.guardian-elixir', '.food-buff', '.potion', '.demonic-rune'];
// When a consumable is clicked, uncheck all other types of that consumable since we can only have one at a time (e.g. disable all other weapon oils if a weapon oil is clicked).
$(consumableTypesToTrack.join(',')).click(function(event) {
	let clickedConsumableName = $(this).attr("name");
	let consumableTypes = [];

	// Loop through the consumable types we're tracking and check if the consumable that got clicked has any of those consumables as a class.
	for (let i = 0; i < consumableTypesToTrack.length; i++) {
		if ($(this).hasClass(consumableTypesToTrack[i].substring(1))) {
			consumableTypes.push(consumableTypesToTrack[i]);
		}
	}

	// Loop through the consumable classes we found in the previous loop and uncheck all childs of those classes aside from the consumable that just got clicked
	$(consumableTypes.join(',')).each(function() {
		let consumableName = $(this).attr('name');

		if (consumableName !== clickedConsumableName) {
			if ($(this).attr('data-checked') === 'true') {
				$(this).attr('data-checked', false);
				auras[consumableName] = false;

				for (let stat in _auras.consumables.auras[consumableName]) {
					if (characterStats.hasOwnProperty(stat)) {
						characterStats[stat] -= _auras.consumables.auras[consumableName][stat];
					}
				}
			}
		}
	});

	localStorage.auras = JSON.stringify(auras);
	refreshCharacterStats();
});

// User clicks on one of the preset item set buttons above the item slot selection menu
$(".preset-item-set").click(function() {
	let name = $(this).data('name');
	if (presetItemSets[name]) {
		for (itemSlot in presetItemSets[name]) {
			if (selectedItems[itemSlot] !== presetItemSets[name][itemSlot]) {
				for (item in items[itemSlot]) {
					if (items[itemSlot][item].id == presetItemSets[name][itemSlot]) {
						modifyStatsFromItem(items[itemSlot][item], 'add');
					} else if (items[itemSlot][item].id == selectedItems[itemSlot]) {
						modifyStatsFromItem(items[itemSlot][item], 'remove');
					}
				}
				if (itemSlot == (localStorage['selectedItemSlot'] + localStorage['selectedItemSubSlot'])) {
					$(".item-row[data-wowhead-id='" + selectedItems[itemSlot] + "']").attr('data-selected', 'false');
					$(".item-row[data-wowhead-id='" + presetItemSets[name][itemSlot] + "']").attr('data-selected', 'true');
				}
				selectedItems[itemSlot] = presetItemSets[name][itemSlot];
			}
		}
		selectedItems = presetItemSets[name];
		localStorage.selectedItems = JSON.stringify(selectedItems);
		refreshCharacterStats();
		updateSetBonuses();
	}
});

// User clicks on one of the item source buttons
$("#source-filters ul li").click(function() {
	// Toggle the source's checked value
	let checked = $(this).attr('data-checked') == 'true';
	let source = $(this).attr('data-source');

	$(this).attr('data-checked', !checked);
	sources[source] = sources[source] || {};
	sources[source][$(this).attr('data-value')] = !checked;
	localStorage.sources = JSON.stringify(sources);
	// Reload the item list
	loadItemsBySlot(localStorage['selectedItemSlot'] || "mainhand", (localStorage['selectedItemSubSlot'] || ""));
});

// User clicks on an item slot in the selection above the item table
$("#item-slot-selection-list li").click(function() {
	loadItemsBySlot($(this).attr('data-slot'), $(this).attr('data-subslot') || null);
});

$("#show-combat-log").click(function() {
	$("#combat-log").toggle();
});

// When the user clicks anywhere on the webpage
$(document).on('click', function(e) {
	// Hide the gem selection table if the user clicks outside of it.
	if (e.target.id !== "gem-selection-table" && !e.target.className.split(' ').includes('gem-info')) {
		$("#gem-selection-table").css('visibility', 'hidden');
	}
});

// User clicks on the "Save New Profile" button
$("#save-profile-button").click(function() {
	let profileName = $("input[name='profileName']").val();
	if (profileName.length <= 0) {
		alert("Missing profile name");
	} else if (profiles[profileName]) {
		alert('The profile "' + profileName + '" already exists');
	} else {
		saveProfile(profileName);
		localStorage.selectedProfile = profileName;
		$("input[name='profileName']").val('');
		updateProfileSelection(profileName);
		drawProfileButtons();
	}
});

// User clicks on the "Save" profile button
$(document).on('click', '#save-profile-button', function() {
	saveProfile(localStorage.selectedProfile);
});

// User clicks on the "Delete" profile button
$("#delete-profile-button").click(function() {
	if (confirm('Are you sure you want to delete "' + localStorage.selectedProfile + "'?")) {
		delete profiles[localStorage.selectedProfile];
		localStorage.removeItem('selectedProfile');
		localStorage.profiles = JSON.stringify(profiles);
		drawProfileButtons();
		$("#update-profile-div").hide();
		if ($(".saved-profile").length == 0) {
			$("#saved-profiles").hide();
		}
	}
});

// User clicks on the "Rename" profile button
$("#rename-profile-button").click(function() {
	let newName = prompt('Enter the new name for profile "' + localStorage.selectedProfile + "'");
	if (newName !== null && newName.length > 0) {
		// Create a copy of the profile with the new name
		profiles[newName] = profiles[localStorage.selectedProfile];
		// Delete the old profile
		delete profiles[localStorage.selectedProfile];
		// Update localStorage
		localStorage.selectedProfile = newName;
		localStorage.profiles = JSON.stringify(profiles);
		drawProfileButtons();
	}
});

// User clicks on one of their saved profiles
$(document).on('click', '.saved-profile', function() {
	let profileName = $(this).attr('data-name');
	updateProfileSelection(profileName);
	// Show the buttons to save, delete, and rename the profile
	$("#update-profile-div").show();
	// Load settings from the profile
	auras = profiles[profileName].auras;
	localStorage.auras = JSON.stringify(auras);
	rotation = profiles[profileName].rotation;
	localStorage.rotation = JSON.stringify(rotation);
	settings = profiles[profileName].simSettings;
	localStorage.settings = JSON.stringify(settings);
	talents = profiles[profileName].talents;
	localStorage.talents = JSON.stringify(talents);
	selectedItems = profiles[profileName].items;
	localStorage.selectedItems = JSON.stringify(selectedItems);
	selectedGems = profiles[profileName].gems;
	localStorage.selectedGems = JSON.stringify(selectedGems);
	selectedEnchants = profiles[profileName].enchants;
	localStorage.selectedEnchants = JSON.stringify(selectedEnchants);
	location.reload();
});

// User clicks on a star next to a gem to favorite it
$(document).on('click', '.gem-favorite-star', function() {
	let favorited = $(this).attr('data-favorited') == 'true';
	let gemId = parseInt($(this).closest('tr').attr('data-id'));
	let favoritesArrayIndex = gemPreferences.favorites.indexOf(gemId);
	// Toggle the favorited data value
	$(this).attr('data-favorited', !favorited);

	// Remove or add the gem to the favorite gem array
	if (favorited && favoritesArrayIndex > -1) {
		gemPreferences.favorites.splice(favoritesArrayIndex, 1);
	} else if (!favorited && favoritesArrayIndex < 0) {
		gemPreferences.favorites.push(gemId);
	} 
	localStorage.gemPreferences = JSON.stringify(gemPreferences);
});

// User clicks on the X next to a gem to hide it
$(document).on('click', '.gem-hide', function() {
	let hidden = $(this).attr('data-hidden') == 'true';
	let gemId = parseInt($(this).closest('tr').attr('data-id'));
	let hiddenArrayIndex = gemPreferences.hidden.indexOf(gemId);
	$(this).attr('data-hidden', !hidden);

	if (hidden && hiddenArrayIndex > -1) {
		gemPreferences.hidden.splice(hiddenArrayIndex, 1);
		$(this).closest('tr').attr('data-hidden', 'false');
		if (gemPreferences.hidden.length == 0) {
			$("#show-hidden-gems-button").closest('tr').hide();
			$("#show-hidden-gems-button").attr('data-enabled', 'false');
		}
	} else if (!hidden && hiddenArrayIndex < 0) {
		gemPreferences.hidden.push(gemId);
		$(this).closest('tr').attr('data-hidden', 'true');
		if ($("#show-hidden-gems-button").attr('data-enabled') == 'false') {
			$(this).closest('tr').hide();
		}
		if (gemPreferences.hidden.length > 0) {
			$("#show-hidden-gems-button").closest('tr').show();
		}
	}
	localStorage.gemPreferences = JSON.stringify(gemPreferences);
});

// User clicks on the "Toggle Hidden Gems" button in the gem selection table
$(document).on('click', '#show-hidden-gems-button', function(e) {
	let enabled = $(this).attr('data-enabled') == 'true';
	$(this).attr('data-enabled', !enabled);

	if (enabled) {
		$(".gem-row[data-hidden='true']").hide();
	} else {
		$(".gem-row[data-hidden='true']").show();
	}

	e.stopPropagation();
});

// User clicks on a gem in the gem selection table
$("#gem-selection-table").on('click', '.gem-name', function() {
	let itemId = $("#gem-selection-table").data('itemId');
	let itemSlot = $('tr[data-wowhead-id="' + itemId + '"]').data('slot');
	let gemColor = $(this).closest('tr').data('color');
	let gemIconName = href = null;
	let gemId = $(this).closest('tr').data('id');
	let socket = $('tr[data-wowhead-id="' + itemId + '"]').find('.gem').eq($("#gem-selection-table").data('socketSlot'));
	let socketSlot = $("#gem-selection-table").data('socketSlot');
	selectedGems[itemSlot] = selectedGems[itemSlot] || {};

	if (!selectedGems[itemSlot][itemId]) {
		let socketAmount = $('tr[data-wowhead-id="' + itemId + '"]').find('.gem').last().data('order') + 1; // The amount of sockets in the item

		selectedGems[itemSlot][itemId] = Array(socketAmount).fill(null);
	}

	// Check whether the user chose a gem or the option to remove the current gem
	if (gemId == '0') {
		gemIconName = socketInfo[gemColor].iconName + ".jpg";
		href = '';
	} else {
		gemIconName = gems[gemColor][gemId].iconName + ".jpg";
		href = 'https://tbc.wowhead.com/item=' + gemId;
	}

	// Check if the socket that was changed was on an equipped item
	if (socket.closest('tr').data('wowhead-id') == selectedItems[itemSlot]) {
		// Remove stats from old gem if equipped
		if (selectedGems[itemSlot][itemId][socketSlot]) {
			modifyStatsFromGem(selectedGems[itemSlot][itemId][socketSlot], 'remove');
		}
		// Add stats from new gem
		if (gemId) {
			modifyStatsFromGem(gemId, 'add');
		}
		refreshCharacterStats();
	}

	socket.attr('src', 'img/' + gemIconName);
	socket.closest('a').attr('href', href);
	selectedGems[itemSlot][itemId][socketSlot] = gemId;
	localStorage.selectedGems = JSON.stringify(selectedGems);
	$("#gem-selection-table").css('visibility', 'hidden');
	return false;
});

// Remove gem from item socket if user right clicks on the socket
$("#item-selection-table tbody").on('contextmenu', '.gem', function(event) {
	// Check whether there is a gem in the socket or not
	if ($(this).closest('a').attr('href') !== "") {
		let socketColor = $(this).data('color');
		let itemSlot = $(this).closest('tr').data('slot');
		let itemId = $(this).closest('tr').data('wowhead-id');
		let socketOrder = $(this).data('order');
	
		$(this).attr('src', 'img/' + socketInfo[socketColor].iconName + '.jpg');
		$(this).closest('a').attr('href', '');
		modifyStatsFromGem(selectedGems[itemSlot][itemId][socketOrder], 'remove');
		selectedGems[itemSlot][itemId][socketOrder] = null;
		localStorage.selectedGems = JSON.stringify(selectedGems);
		refreshCharacterStats();
	}

	return false;
});

// User left-clicks on one of the item's gem sockets
$("#item-selection-table tbody").on('click', '.gem', function(event) {
	let socketColor = $(this).attr('data-color');
	$("#gem-selection-table").empty();

	for (let color in gems) {
		for (let gem in gems[color]) {
			// Show all gems for normal slots (except for Meta gems) and only show Meta gems for Meta gem slots
			if ((socketColor === "meta" && color == "meta") || (socketColor !== "meta" && color !== "meta")) {
				let g = gems[color][gem];
				let gemRowInfo = "<tr data-hidden='" + (gemPreferences.hidden.indexOf(parseInt(gem)) > -1) + "' data-color='" + color + "' data-id='" + gem + "' class='gem-row'><td title='" + (gemPreferences.favorites.indexOf(parseInt(gem)) > -1 ? 'Remove gem from favorites' : 'Favorite gem') + "' data-favorited='" + (gemPreferences.favorites.indexOf(parseInt(gem)) > -1) + "' class='gem-favorite-star gem-info'>★</td><td class='gem-name gem-info'><img width='20' height='20' src='img/" + g.iconName + ".jpg'><a href='https://tbc.wowhead.com/item=" + gem + "'>" + g.name + "</a></td><td title='" + (gemPreferences.hidden.indexOf(parseInt(gem)) > -1 ? 'Restore ' : 'Hide ') + " Gem' data-hidden='" + (gemPreferences.hidden.indexOf(parseInt(gem)) > -1) + "' class='gem-hide gem-info'>❌</td></tr>";
				if (gemPreferences.favorites.indexOf(parseInt(gem)) > -1) {
					$("#gem-selection-table").prepend(gemRowInfo);
				} else {
					$("#gem-selection-table").append(gemRowInfo);
				} 
				if (gemPreferences.hidden.indexOf(parseInt(gem)) > -1) {
					$('.gem-row[data-id="' + gem + '"]').hide();
				}
			}
		}
	}
	$("#gem-selection-table").prepend('<tr data-color="' + socketColor + '" data-id="0" class="gem-row"><td class="gem-info"></td><td class="gem-name gem-info">Remove Gem From Socket</td></tr>');
	$("#gem-selection-table").prepend('<tr><td></td><td data-enabled="false" id="show-hidden-gems-button">Toggle Hidden Gems</td></tr>');
	if (gemPreferences.hidden.length == 0) {
		$("#show-hidden-gems-button").closest('tr').hide();
	}

	$("#gem-selection-table").css('top', event.pageY - $("#gem-selection-table").height() / 5);
	$("#gem-selection-table").css('left', event.pageX + 50);
	$("#gem-selection-table").css('visibility', 'visible');
	$("#gem-selection-table").data('color', $(this).data('color'));
	$("#gem-selection-table").data('itemId', $(this).closest('tr').data('wowhead-id'));
	$("#gem-selection-table").data('socketSlot', $(this).data('order'));

	// Stop the click from being registered by the .item-row listener as well.
	event.stopPropagation();
	return false;
});

// User clicks on an item in the item table
$("#item-selection-table tbody").on('click', 'tr', function() {
	let itemSlot = $(this).attr('data-slot');
	let itemName = $(this).attr('data-name');
	let itemId = $(this).closest('tr').data('wowhead-id');
	let subSlot = localStorage['selectedItemSubSlot'] || $(this).data('subslot') || ""; // Workaround for having two selections for rings and trinkets but only one selection for the other slots.

	// Toggle the item's data-selected boolean.
	let equipped = $(this).attr('data-selected') == 'true' && selectedItems[itemSlot + subSlot] && selectedItems[itemSlot + subSlot] == itemId;
	$(this).attr('data-selected', !equipped);

	// Check if the user already has an item equipped in this slot and unequip it if so
	if (selectedItems[itemSlot + subSlot]) {
		// Set the old item's data-selected value to false and remove the item's stats from the player.
		$('[data-wowhead-id="' + selectedItems[itemSlot + subSlot] +'"]').attr('data-selected', false);
		itemLoop:
		for (let slot in items) {
			for (let item in items[slot]) {
				if (items[slot][item].id == selectedItems[itemSlot + subSlot]) {
					// Remove the stats from the item
					modifyStatsFromItem(items[slot][item], 'remove');

					// Remove stats from gems equipped in the item
					if (selectedGems[slot] && selectedGems[slot][selectedItems[itemSlot + subSlot]]) {
						for (gemId of selectedGems[slot][selectedItems[itemSlot + subSlot]]) {
							if (gemId !== null) {
								modifyStatsFromGem(gemId, 'remove');
							}
						}
					}

					selectedItems[itemSlot + subSlot] = null;
					break itemLoop;
				}
			}
		}
	}

	// Add the stats from the item
	if (!equipped) {
		modifyStatsFromItem(items[itemSlot][itemName], 'add');
		selectedItems[itemSlot + subSlot] = items[itemSlot][itemName].id;

		// Add stats from the item's equipped gems
		if (selectedGems[itemSlot + subSlot] && selectedGems[itemSlot + subSlot][items[itemSlot][itemName].id]) {
			for (gemId of selectedGems[itemSlot + subSlot][items[itemSlot][itemName].id]) {
				if (gemId !== null) {
					modifyStatsFromGem(gemId, 'add');
				}
			}
		}
	}

	// If the user is equipping a main hand or offhand then unequip their twohander if they have one equipped and vice versa
	if (itemSlot == "mainhand" || itemSlot == "offhand") {
		if (selectedItems['twohand'] !== null) {
			itemSlotLoop:
			for (let slot in items) {
				for (let item in items[slot]) {
					if (items[slot][item].id == selectedItems['twohand']) {
						modifyStatsFromItem(items[slot][item], 'remove');
						selectedItems['twohand'] = null;
						break itemSlotLoop;
					}
				}
			}
		}
	} else if (itemSlot == "twohand") {
		if (selectedItems['mainhand'] !== null) {
			itemSlotLoop:
			for (let slot in items) {
				for (let item in items[slot]) {
					if (items[slot][item].id == selectedItems['mainhand']) {
						modifyStatsFromItem(items[slot][item], 'remove');
						selectedItems['mainhand'] = null;
						break itemSlotLoop;
					}
				}
			}
		}
		if (selectedItems['offhand'] !== null) {
			itemSlotLoop:
			for (let slot in items) {
				for (let item in items[slot]) {
					if (items[slot][item].id == selectedItems['offhand']) {
						modifyStatsFromItem(items[slot][item], 'remove');
						selectedItems['offhand'] = null;
						break itemSlotLoop;
					}
				}
			}
		}
	}

	updateSetBonuses();
	refreshCharacterStats();
	localStorage.selectedItems = JSON.stringify(selectedItems);
	return false;
});

// User clicks on an enchant
$("#enchant-selection-table tbody").on('click', 'tr', function(event) {
	let itemSlot = $(this).attr('data-slot');
	let subSlot = $(this).attr('data-subslot') || "";
	let enchantID = $(this).data('wowhead-id');

	// Toggle the enchant's data-selected boolean.
	let equipped = $(this).attr('data-selected') == 'true' && selectedEnchants[itemSlot + subSlot] && selectedEnchants[itemSlot + subSlot] == enchantID;
	$(this).attr('data-selected', !equipped);

	// Check if the user already has an enchant equipped in this slot and unequip it if so
	if (selectedEnchants[itemSlot + subSlot]) {
		$("#enchant-selection-table tr[data-wowhead-id='" + selectedEnchants[itemSlot + subSlot] + "']").attr('data-selected', 'false');
		modifyStatsFromEnchant(selectedEnchants[itemSlot + subSlot], 'remove');
		selectedEnchants[itemSlot + subSlot] = null;
	}

	if (!equipped) {
		modifyStatsFromEnchant(enchantID, 'add');
		selectedEnchants[itemSlot + subSlot] = enchantID;
	}
	localStorage.selectedEnchants = JSON.stringify(selectedEnchants);
	refreshCharacterStats();
	return false;
});

$(".preset-talent-button").click(function() {
	talents = presetTalents[$(this).data('name')];
	talentPointsRemaining = totalTalentPoints;

	$(".talent-tree-table").each(function() {
		$(this).data('points', 0);
	});
	$(".talent-icon").each(function() {
		talents[$(this).attr('id')] = talents[$(this).attr('id')] || 0;
		let pointAmount = talents[$(this).attr('id')];
		let talentTableObj = $(this).closest('table');

		$(this).attr('data-points', pointAmount);
		talentTableObj.data('points', talentTableObj.data('points') + pointAmount);
		talentPointsRemaining -= pointAmount || 0;
		updateTalentInformation($(this));
		updateTalentTreeNames();
	});

	// Disable spells that aren't available anymore with the new talents
	if (talents.siphonLife == 0) {
		rotation.dot.siphonLife = false;
		$("#dot-siphonLife").attr('data-checked', 'false');
	}
	if (talents.unstableAffliction == 0) {
		rotation.dot.unstableAffliction = false;
		$("#dot-unstableAffliction").attr('data-checked', 'false');
	}
	if (talents.shadowburn == 0) {
		rotation.finisher.shadowburn = false;
		$("#finisher-shadowburn").attr('data-checked', 'false');
	}

	localStorage.rotation = JSON.stringify(rotation);
	localStorage.talents = JSON.stringify(talents);
	refreshCharacterStats();
	updateSimulationSettingsVisibility();
});

// Disable the context menu from appearing when the user right clicks a talent
$(".talent-icon").bind("contextmenu", function(event) {
	return false;
});

// Prevents the user from being redirected to the talent's wowhead page when clicking it.
$(".talent-icon").click(function() {
	return false;
});

// Fires when the user left or right clicks a talent
$(".talent-icon").mousedown(function(event) {
	// Check if the click was a left or right click
	if ((event.which === 1 && talentPointsRemaining > 0) || event.which === 3) {
		let icon = $(this);
		let talent = _talents[icon.attr('data-tree')][icon.attr('id')]; // get the talent's object
		let talentName = $(this).attr('id');
		let talentTree = $("#talent-table-" + $(this).data('tree'));

		// left click
		if (event.which === 1) {
			// compare the amount of points in the talent vs the amount of ranks before incrementing
			if (Number(icon.attr('data-points')) < talent.rankIDs.length && talentTree.data('points') >= (talent.row - 1) * 5) {
				// If the talent has another talent that needs to be selected before this one is selectable, then check if the required talent is selected.
				if (talent.requirement && talents[talent.requirement.name] < talent.requirement.points) {
					return;
				}

				icon.attr('data-points', Number(icon.attr('data-points')) + 1);
				talents[talentName] = Number(talents[talentName]) + 1;
				talentPointsRemaining--;
				talentTree.data('points', talentTree.data('points') + 1);
			}
		// right click
		} else if (event.which === 3) {
			// only decrement if the point amount is above 0
			if (icon.attr('data-points') > 0) {
				let talentTreeName = $(this).data('tree');
				// Check if the talent is locked due to a dependency (such as not being able to remove Amplify Curse because Curse of Exhaustion is selected)
				for (let t in _talents[talentTreeName]) {
					if (_talents[talentTreeName][t].requirement && _talents[talentTreeName][t].requirement.name == talentName && talents[t] > 0) {
						return;
					}
				}

				icon.attr('data-points', Number(icon.attr('data-points'))-1);
				talents[talentName] = Number(talents[talentName]) - 1;
				talentPointsRemaining++;
				talentTree.data('points', talentTree.data('points') - 1);
				icon.children('a').children('span').css('color', "#7FFF00");
			}
		}

		updateTalentTreeNames();
		if (talent.name == "Conflagrate" || talent.name == "Master Demonologist" || talent.name == "Demonic Sacrifice" || talent.name == "Summon Felguard" || talent.name == "Dark Pact") {
			updateSimulationSettingsVisibility();
		}
		if (talent.name == "Emberstorm" || talent.name == "Improved Imp" || talent.name == "Demonic Aegis" || talent.name == "Demonic Embrace" || talent.name == "Devastation" || talent.name == "Backlash" || talent.name == "Fel Stamina" || talent.name == "Fel Intellect" || talent.name == "Master Demonologist" || talent.name == "Soul Link" || talent.name == "Demonic Tactics" || talent.name == "Shadow Mastery") {
			refreshCharacterStats();
		}
		updateTalentInformation(icon);
	}

	localStorage.talents = JSON.stringify(talents);
	return false;
});

// User clicks on the red X next to a talent tree's name to clear it
$(".clear-talent-tree").click(function() {
	clearTalentTree($(this).closest('div').find('h3').data('name'));
});

// Listens to any clicks on the "rotation" spells for dots, filler, curse, and finisher.
$("#rotation-list div li").click(function() {
	let clickedSpell = $(this).data('name');
	let refreshStats = false;

	if ($(this).hasClass("rotation-filler")) {
		$(".rotation-filler").each(function() {
			$(this).attr('data-checked', false);
			rotation[$(this).data('type')][$(this).data('name')] = false;
		});

		if ($("#demonicSacrifice").data('points') == 1) {
			refreshStats = true;
		}
	} else if ($(this).hasClass("rotation-curse")) {
		$(".rotation-curse").each(function() {
			if ($(this).data('name') !== clickedSpell) {
				$(this).attr('data-checked', false);
				rotation[$(this).data('type')][$(this).data('name')] = false;
			}
		});
	}

	let checkedVal = $(this).attr('data-checked') === 'true';
	$(this).attr('data-checked', !checkedVal);
	rotation[$(this).data('type')][$(this).data('name')] = !checkedVal;
	localStorage.rotation = JSON.stringify(rotation);
	if (refreshStats) refreshCharacterStats();
	return false;
});

$("#sim-settings select, #sim-settings input").change(function() {
	settings[$(this).attr('name')] = $(this).val();
	localStorage.settings = JSON.stringify(settings);
	refreshCharacterStats();
	updateSimulationSettingsVisibility();
});

// to-do: don't allow people to start multiple simulations
$("#sim-dps").click(function() {
	simDPS([$(".item-row[data-selected='true']").data('wowhead-id')]);
	return false;
});

$("#sim-all-items").click(function() {
	let arr = [];
	$(".item-row").each(function(i) {
		arr.push($(this).data('wowhead-id'));
	});
	$("#damage-breakdown-section").hide();
	simDPS(arr);
	return false;
});

$(".btn").hover(function() {
	$(this).find('a').css('color', '#1a1a1a');
});

$(".btn").mouseout(function() {
	$(this).find('a').css('color', 'white');
});

// User changes races in the simulation settings
$("#race-dropdown-list").change(function() {
	let oldRace = $(this).data("currentRace");
	let newRace = $(this).val();
	$(this).data("currentRace", newRace);

	// Remove the previous race's stats
	for (let stat in raceStats[oldRace]) {
		if (characterStats.hasOwnProperty(stat)) {
			// Check if the buff is a modifier to know whether to add/subtract or multiply/divide the stat
			if (stat.toLowerCase().search("modifier") !== -1) {
				characterStats[stat] /= raceStats[oldRace][stat];
			} else {
				characterStats[stat] -= raceStats[oldRace][stat];
			}
		}
	}

	// Add the new race's stats
	for (let stat in raceStats[newRace]) {
		if (characterStats.hasOwnProperty(stat)) {
			// Check if the buff is a modifier to know whether to add/subtract or multiply/divide the stat
			if (stat.toLowerCase().search("modifier") !== -1) {
				characterStats[stat] *= raceStats[newRace][stat];
			} else {
				characterStats[stat] += raceStats[newRace][stat];
			}
		}
	}

	$("#race").text($("#race-dropdown-list").children("option:selected").text());
	refreshCharacterStats();
});

// Loads items into the item table
function loadItemsBySlot(itemSlot, subSlot) {
	// Set old item slot's selected value to false
	$("#item-slot-selection-list li[data-selected='true']").attr('data-selected', 'false');
	// Set the new item slot's seleected value to true
	let newItemSlotSelector = "#item-slot-selection-list li[data-slot='" + itemSlot + "']";
	// If the item has a subslot then add a subslot selector to the query
	if (subSlot !== null) {
		newItemSlotSelector += "[data-subslot='" + subSlot + "']";
	} else {
		subSlot = "";
	}
	$(newItemSlotSelector).attr('data-selected', 'true');
	localStorage['selectedItemSlot'] = itemSlot;
	localStorage['selectedItemSubSlot'] = (subSlot || "");
	savedItemDps[itemSlot + subSlot] = savedItemDps[itemSlot + subSlot] || {};

	// Removes all current item rows
	$(".item-row").remove(); 
	let tableBody = $("#item-selection-table tbody");

	for (let item of Object.keys(items[itemSlot])) {
		let i = items[itemSlot][item];

		if (!sources.phase || !sources.phase[i.phase]) {
			continue;
		}

		// If an item is unique and it is already equipped in the other slot then skip it
		if (i.unique && (itemSlot == "ring" || itemSlot == "trinket") && subSlot !== null) {
			let otherSlot = subSlot == '1' ? '2' : '1';
			if (selectedItems[itemSlot + otherSlot] == i.id) continue;
		}

		// Add the item's gem sockets
		let sockets = [];
		let counter = 0;
		for (let socket in socketInfo) {
			if (i.hasOwnProperty(socket)) {
				for(j = 0; j < i[socket]; j++) {
					let gemIcon = socketInfo[socket].iconName;
					let gemHref = '';

					if (selectedGems[itemSlot] && selectedGems[itemSlot][i.id]) {
						for (let color in gems) {
							let gemId = selectedGems[itemSlot][i.id][counter];
							if (gems[color][gemId]) {
								gemIcon = gems[color][gemId].iconName;
								gemHref = 'https://tbc.wowhead.com/item=' + gemId;
							}
						}
					}
					sockets.push("<a href='" + gemHref + "'><img width='16' height='16' class='gem' data-color='" + socket + "' data-order='" + counter + "' src='img/" + gemIcon + ".jpg'></a>");
					counter++;
				}
			}

		}

		tableBody.append("<tr data-subslot='" + localStorage['selectedItemSubSlot'] + "' data-slot='" + itemSlot + "' data-name='" + item + "' data-selected='" + (selectedItems[itemSlot + localStorage['selectedItemSubSlot']] == i.id || 'false') + "' class='item-row' data-wowhead-id='" + i.id + "'><td><a href='https://tbc.wowhead.com/item=" + i.id + "'>" + i.name + "</a></td><td><div>" + sockets.join('') + "</div></td><td>" + i.source + "</td><td>" + (i.stamina || '') + "</td><td>" + (i.intellect || '') + "</td><td>" + (i.spellPower || '') + "</td><td>" + (i.shadowPower || '') + "</td><td>" + (i.firePower || '') + "</td><td>" + (i.critRating || '') + "</td><td>" + (i.hitRating || '') + "</td><td>" + (i.hasteRating || '') + "</td><td class='item-dps'>" + (savedItemDps[itemSlot + subSlot][i.id] || '') + "</td></tr>").trigger("update");
	}

	loadEnchantsBySlot(itemSlot, subSlot);
}

function loadEnchantsBySlot(itemSlot, subSlot = null) {
	if (itemSlot == "mainhand" || itemSlot == "twohand") {
		itemSlot = "weapon";
	}

	if (enchants[itemSlot]) {
		$(".enchant-row").remove();
		let tableBody = $("#enchant-selection-table tbody");

		for (let enchant of Object.keys(enchants[itemSlot])) {
			let e = enchants[itemSlot][enchant];

			tableBody.append("<tr data-slot='" + itemSlot + "' data-subslot='" + (subSlot || "") + "' data-name='" + enchant + "' data-selected='" + (selectedEnchants[itemSlot + (subSlot || "")] == e.id || 'false') + "' class='enchant-row' data-wowhead-id='" + e.id + "'><td><a href='https://tbc.wowhead.com/spell=" + e.id + "'>" + e.name + "</a></td><td>" + (e.spellPower || '') + "</td><td>" + (e.shadowPower || '') + "</td><td>" + (e.firePower || '') + "</td><td>" + (e.stamina || '') + "</td><td>" + (e.intellect || '') + "</td><td>" + (e.mp5 || '') + "</td><td>" + (((e.natureResistance || 0) + (e.allResistance || 0)) || '') + "</td><td>" + (((e.shadowResistance || 0) + (e.allResistance || 0)) || '') + "</td><td>" + (((e.fireResistance || 0) + (e.allResistance || 0)) || '') + "</td><td>" + ((e.threatReduction * 100) || '') + "</td><td>" + (e.threatIncrease * 100 || '') + "</td><td>" + (localStorage[enchant + "Dps"] || '') + "</td></tr>")
		}

		$("#enchant-selection-table").show();
	} else {
		$("#enchant-selection-table").hide();
	}

	refreshCharacterStats();
}

// Adds or removes an item's stats from the player
function modifyStatsFromItem(itemObj, action) {
	// If the user has the item equipped and is not loading the stats from equipped items when loading the website
	if (action == 'remove') {
		// Loop through the stats on the item and add them to/remove them from the character's stats.
		for (let stat in itemObj) {
			// Check if the item property is a character stat such as stamina/spell power.
			if (characterStats.hasOwnProperty(stat)) {
				characterStats[stat] -= itemObj[stat];
			}
		}
	} else if (action == 'add') {
		for (let stat in itemObj) {
			if (characterStats.hasOwnProperty(stat)) {
				characterStats[stat] += itemObj[stat];
			}
		}
	}
}

// Adds or removes an enchant's stats from the player
function modifyStatsFromEnchant(enchantID, action) {
	for (let itemSlot in enchants) {
		for (let enchant in enchants[itemSlot]) {
			if (enchants[itemSlot][enchant].id == enchantID) {
				let enchantObj = enchants[itemSlot][enchant];
				
				if (action == 'remove') {
					for (let stat in enchantObj) {
						if (characterStats.hasOwnProperty(stat)) {
							characterStats[stat] -= enchantObj[stat];
						}
					}
				} else if (action == 'add') {
					for (let stat in enchantObj) {
						if (characterStats.hasOwnProperty(stat)) {
							characterStats[stat] += enchantObj[stat];
						}
					}
				}
				return;
			}
		}
	}
}

function modifyStatsFromGem(gemId, action) {
	for (let color in gems) {
		if (gems[color][gemId]) {
			for (let property in gems[color][gemId]) {
				if (characterStats.hasOwnProperty(property)) {
					if (action == 'add') {
						characterStats[property] += gems[color][gemId][property];
					} else if (action == 'remove') {
						characterStats[property] -= gems[color][gemId][property];
					}
				}
			}
			return;
		}
	}
}

function modifyStatsFromAura(auraObject, checked) {
	for (let stat in auraObject) {
		if (characterStats.hasOwnProperty(stat)) {
			// Check if the buff is a modifier to know whether to add/subtract or multiply/divide the stat
			if (stat.toLowerCase().search("modifier") !== -1) {
				if (checked) {
					characterStats[stat] /= auraObject[stat];
				} else {
					characterStats[stat] *= auraObject[stat];
				}
			} else {
				if (checked) {
					characterStats[stat] -= auraObject[stat];
				} else {
					characterStats[stat] += auraObject[stat];
				}
			}
		}
	}
}

function simDPS(items) {
	let item = $("#item-slot-selection-list li[data-selected='true']");
	let itemSlot = item.attr('data-slot');
	let itemSubSlot = item.attr('data-subslot') || '';
	let itemAmount = items.length;
	let simulationsRunning = 0;
	let simulationsFinished = 0;
	let multiSimInfo = [];
	let simulations = [];
	let simIndex = 0;

	for (let i = 0; i < items.length; i++) {
		multiSimInfo.push([items[i],0]);

		simulations.push(new SimWorker(
			(simulationEnd) => {
				simulationsFinished++;
				// DPS information on the sidebar
				let avgDps = Math.round((simulationEnd.totalDamage / simulationEnd.totalDuration) * 100) / 100
				if (itemAmount === 1) {
					localStorage['avgDps'] = avgDps;
					localStorage['minDps'] = simulationEnd.minDps;
					localStorage['maxDps'] = simulationEnd.maxDps;
					localStorage['simulationDuration'] = simulationEnd.length;
					$("#avg-dps").text(avgDps);
					$("#min-dps").text(simulationEnd.minDps);
					$("#max-dps").text(simulationEnd.maxDps);
					$("#sim-length-result").text(simulationEnd.length + "s");
					$("#sim-dps").text("Simulate");

					// Populate the combat log
					$("#combat-log p").remove();
					for(let entry in simulationEnd.combatlog) {
						$("#combat-log").append("<p>" + simulationEnd.combatlog[entry] + "</p>");
					}
				} else if (simulationsFinished == itemAmount) {
					$("#sim-all-items").text("Simulate All Items");
				}
				savedItemDps[itemSlot + itemSubSlot] = savedItemDps[itemSlot + itemSubSlot] || {};
				savedItemDps[itemSlot + itemSubSlot][simulationEnd.itemId] = avgDps;
				localStorage.savedItemDps = JSON.stringify(savedItemDps);

				if (simulationsFinished === itemAmount) {
					// Remove the background coloring (progress bar)
					$(".btn").css('background', '');

					if (itemAmount === 1) {
						// Setup the damage breakdown table (showing avg damage, avg cast etc. for each spell)
						$(".spell-damage-information").remove();
						for (let spell of Object.keys(simulationEnd.damageBreakdown)) {
							let s = simulationEnd.damageBreakdown[spell];
							let percentDamage = (~~(((s.damage / simulationEnd.totalDamage) * 100) * 100) / 100).toFixed(2);
							if (s.damage > 0 || s.casts > 0) $("#damage-breakdown-table tbody").append("<tr class='spell-damage-information'><td>" + s.name + "</td><td><meter value='" + percentDamage + "' min='0' max='100'></meter> " + percentDamage + "%</td><td class='number'>" + Math.ceil(s.casts / simulationEnd.iterations) + "</td><td class='number'>" + ~~(s.damage / s.casts) + (s.dotDamage ? ("(" + ~~(s.dotDamage / s.casts) + ")") : "") + "</td><td class='number'>" + ((~~(((s.crits / s.casts) * 100) * 100)) / 100).toFixed(2) + "</td><td class='number'>" + (~~(((s.misses / s.casts) * 100) * 100) / 100).toFixed(2) + "</td><td class='number'>" + (~~(((s.dodges / s.casts) * 100) * 100) / 100).toFixed(2) + "</td><td class='number'>" + (Math.round((s.damage / simulationEnd.totalDuration) * 100) / 100 || 0) + "</td></tr>").trigger("update");
						}
						$("#damage-breakdown-section").css('display', 'inline-block');
					}
				}
	
				// Start a new simulation that's waiting in the queue if there are any remaining
				if (simulationsRunning - simulationsFinished < maxWorkers && simIndex < simulations.length) {
					simulations[simIndex++].start();
				}
			},
			(simulationUpdate) => {
				if (itemAmount === 1) {
					$("#avg-dps").text(simulationUpdate.averageDamage)
					// Uses the sim button as a progress bar by coloring it based on how many iterations are done with
					$("#sim-dps").css('background', 'linear-gradient(to right, #9482C9 ' + simulationUpdate.percent + '%, transparent ' + simulationUpdate.percent + '%)');
					$("#sim-dps").text(Math.round(simulationUpdate.percent) + "%");
				} else {
					// multiSimInfo tracks the % progress of each simulation and the least progressed simulation's % is used for the multi simulation button/progress bar
					let smallestValue = 100;
					for(let i = 0; i < multiSimInfo.length; i++) {
						if (multiSimInfo[i][0] == simulationUpdate.itemId) {
							multiSimInfo[i][1] = simulationUpdate.percent;
						}
						if (multiSimInfo[i][1] < smallestValue) smallestValue = multiSimInfo[i][1];
					}

					$("#sim-all-items").css('background', 'linear-gradient(to right, #9482C9 ' + smallestValue + '%, transparent ' + smallestValue + '%)');
					$("#sim-all-items").text(smallestValue + "%");
				}
				// Set the DPS value on the item in the item selection list
				$(".item-row[data-wowhead-id='" + simulationUpdate.itemId + "']").find('.item-dps').text(simulationUpdate.averageDamage);
				$("#item-selection-table").trigger("update");
			},
			{
				"player": Player.getSettings(),
				"simulation": Simulation.getSettings(),
				"itemSlot": itemSlot,
				"itemSubSlot": itemSubSlot,
				"itemId": items[i],
				"itemAmount": itemAmount
			}
		));
	}

	// Start as many simulations as 'maxWorkers' says can be run simultaneously.
	while (simulationsRunning < maxWorkers && simIndex < simulations.length) {
		simulations[simIndex++].start();
		simulationsRunning++;
	}
}

function updateTalentTreeNames() {
	$(".talent-tree-table").each(function() {
		let talentTreeName = $(this).data('name');
		talentTreeName = talentTreeName.charAt(0).toUpperCase() + talentTreeName.slice(1);
		if ($(this).data('points') > 0) {
			talentTreeName += " (" + $(this).data('points') + ")";
		}
		$(".talent-tree-name h3[data-name='" + $(this).data('name') + "']").text(talentTreeName);
	});
}

function updateTalentInformation(talentUiObj) {
	// Update the point amount on the talent icon
	talentUiObj.children('a').children('.talent-point-amount').text(talentUiObj.attr('data-points'));
	// if the point amount is 0 then we hide the amount
	if (talentUiObj.children('a').children('.talent-point-amount').text() > 0) {
		talentUiObj.children('a').children('.talent-point-amount').show();
	} else {
		talentUiObj.children('a').children('.talent-point-amount').hide();
	}
	talentUiObj.children('a').attr('href', 'https://tbc.wowhead.com/spell=' + _talents[talentUiObj.data('tree')][talentUiObj.attr('id')].rankIDs[Math.max(0,talents[talentUiObj.attr('id')]-1)]);
	//$WowheadPower.refreshLinks();

	// todo: move these JS css changes to the css file
	if (Number(talentUiObj.attr('data-points')) == Number(talentUiObj.attr('data-maxpoints'))) {
		talentUiObj.children('a').children('span').css('color', "#ffcd45");	
	} else {
		talentUiObj.children('a').children('span').css('color', "#7FFF00");
	}
}

function clearTalentTree(talentTreeName) {
	if ($("#talent-table-" + talentTreeName).data('points') > 0) {
		for (let talent in _talents[talentTreeName]) {
			talentPointsRemaining += talents[talent];
			talents[talent] = 0;
			$("#" + talent).attr('data-points', 0);
			$("#talent-table-" + talentTreeName).data('points', 0);
			updateTalentInformation($("#" + talent));
		}
		updateTalentTreeNames();
		localStorage.talents = JSON.stringify(talents);
	}

	refreshCharacterStats();
	updateSimulationSettingsVisibility();
}

function updateSetBonuses() {
	$(".sidebar-set-bonus").remove();
	let setBonusCounter = {};

	for (let itemSlot in selectedItems) {
		let itemId = selectedItems[itemSlot];
		if (itemId) {
			if (itemSlot == "ring1" || itemSlot == "ring2" || itemSlot == "trinket1" || itemSlot == "trinket2") {
				itemSlot = itemSlot.substring(0,itemSlot.length-1);
			}
			for (let item in items[itemSlot]) {
				if (items[itemSlot][item].id === itemId) {
					let setID = items[itemSlot][item].setId;
					if (setID) {
						setBonusCounter[setID] = setBonusCounter[setID] + 1 || 1;
						break;
					}
				}
			}
		}
	}

	for (set in setBonusCounter) {
		// Check if the item's set has actually been implemented
		if (sets[set]) {
			for (let i = sets[set].bonuses.length-1; i >= 0; i--) {
				if (sets[set].bonuses[i] <= setBonusCounter[set]) {
					$("#sidebar-sets").append("<li class='sidebar-set-bonus'><a href='https://tbc.wowhead.com/item-set=" + set + "'>" + sets[set].name + " (" + setBonusCounter[set] + ")</a></li>")
					break;
				}
			}
		}
	}

	localStorage.setBonuses = JSON.stringify(setBonusCounter);
}

function drawProfileButtons() {
	$(".saved-profile").remove();
	for (let profile in profiles) {
		$("#saved-profiles ul").append("<li class='saved-profile' data-checked='" + (localStorage.selectedProfile == profile || false) + "' data-name='" + profile + "'>" + profile + "</li>");
	}
	// Show the profile fieldset if there are any profiles
	if ($(".saved-profile").length > 0) {
		$("#saved-profiles").show();
	}
}

function saveProfile(profileName) {
	profiles[profileName] = {
		"auras": auras,
		"rotation": rotation,
		"simSettings": settings,
		"talents": talents,
		"items": selectedItems,
		"gems": selectedGems, // unsure if gems should be saved but it could be useful in case the different profiles want to use different gems
		"enchants": selectedEnchants
	}
	localStorage.profiles = JSON.stringify(profiles);
}

// Called when the user creates a new profile or clicks on an existing one. It updates the 'selected' attribute for the profiles and displays the profile update buttons
function updateProfileSelection(profileName) {
	// De-select the previous profile
	if (localStorage.selectedProfile) {
		$(".saved-profile[data-name='" + localStorage.selectedProfile + "']").attr('data-checked', false);
	}
	localStorage.selectedProfile = profileName;
	$(".saved-profile[data-name='" + profileName + "']").attr('data-selected', true);
	$("#update-profile-div").show();
}

function updateSimulationSettingsVisibility() {
	if ($("#sacrificePet").children('select').val() == 'no') {
		$("#petBuffs-heading").show();
		$(".petBuffs").show();
		if ($("#petMode").children('select').val() == PetMode.AGGRESSIVE) {
			$("#enemyArmor").show();
			$("#enemy-armor-val").closest('li').show();
			$(".petDebuff").show();
		} else {
			$("#enemyArmor").hide();
			$("#enemy-armor-val").closest('li').hide();
			$(".petDebuff").hide();
		}
	} else {
		$("#petBuffs-heading").hide();
		$(".petBuffs").hide();
		$("#enemyArmor").hide();
		$("#enemy-armor-val").closest('li').hide();
		$(".petDebuff").hide();
	}

	if (talents.summonFelguard === 0) {
		$("#petChoice option[value='felguard']").hide();
	} else {
		$("#petChoice option[value='felguard']").show();
	}

	if (auras.curseOfTheElements) {
		$("#improvedCurseOfTheElements").show();
	} else {
		$("#improvedCurseOfTheElements").hide();
	}

	if (auras.prayerOfSpirit) {
		$("#improvedDivineSpirit").show();
	} else {
		$("#improvedDivineSpirit").hide();
	}

	if (talents.conflagrate > 0) {
		$("#conflagrateUse").show();
	} else {
		$("#conflagrateUse").hide();
	}

	if (auras.powerOfTheGuardianMage) {
		$("#mageAtieshAmount").show();
	} else {
		$("#mageAtieshAmount").hide();
	}

	if (auras.powerOfTheGuardianWarlock) {
		$("#warlockAtieshAmount").show();
	} else {
		$("#warlockAtieshAmount").hide();
	}

	if (auras.drumsOfBattle) {
		$("#drumsOfBattleAmount").show();
	} else {
		$("#drumsOfBattleAmount").hide();
	}

	if (auras.drumsOfWar) {
		$("#drumsOfWarAmount").show();
	} else {
		$("#drumsOfWarAmount").hide();
	}

	if (auras.drumsOfRestoration) {
		$("#drumsOfRestorationAmount").show();
	} else {
		$("#drumsOfRestorationAmount").hide();
	}

	if (auras.bloodlust) {
		$("#bloodlustAmount").show();
	} else {
		$("#bloodlustAmount").hide();
	}

	if (auras.totemOfWrath) {
		$("#totemOfWrathAmount").show();
	} else {
		$("#totemOfWrathAmount").hide();
	}

	if (auras.vampiricTouch) {
		$("#shadowPriestDps").show();
	} else {
		$("#shadowPriestDps").hide();
	}

	if ($("#faerieFire").is(":visible") && auras.faerieFire) {
		$("#improvedFaerieFire").show();
	} else {
		$("#improvedFaerieFire").hide();
	}

	if ($("#exposeArmor").is(":visible") && auras.exposeArmor) {
		$("#improvedExposeArmor").show();
	} else {
		$("#improvedExposeArmor").hide();
	}

	if ($("#exposeWeakness").is(":visible") && auras.exposeWeakness) {
		$("#survivalHunterAgility").show();
		$("#exposeWeaknessUptime").show();
	} else {
		$("#survivalHunterAgility").hide();
		$("#exposeWeaknessUptime").hide();
	}
}