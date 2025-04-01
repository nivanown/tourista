/*- data-theme -*/
const button = document.querySelector(".color-btn");
        
button.addEventListener("click", () => {
    document.documentElement.toggleAttribute("data-theme");
    if (document.documentElement.hasAttribute("data-theme")) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
});

/*- language -*/
const languageFlag = document.querySelector('.language__text');
const languageDropdown = document.querySelector('.language__dropdown');
const languageBlock = document.querySelector('.language');

if (languageFlag && languageDropdown && languageBlock) {
    function toggleLanguageMenu(event) {
        event.stopPropagation();
        languageFlag.classList.toggle('open');
        languageDropdown.classList.toggle('show');
    }

    function closeLanguageMenu() {
        languageFlag.classList.remove('open');
        languageDropdown.classList.remove('show');
    }

    languageFlag.addEventListener('click', toggleLanguageMenu);

    document.addEventListener('click', (event) => {
        if (!languageBlock.contains(event.target)) {
            closeLanguageMenu();
        }
    });
}

/*- constructor-widget -*/
document.addEventListener('DOMContentLoaded', () => {
    const widgets = document.querySelectorAll('.constructor-widget');

    if (widgets.length === 0) {
        return;
    }

    widgets[0].classList.remove('disabled');

    const updateWidgetState = () => {
        widgets.forEach((widget, index) => {
            if (index === 0) {
                widget.classList.remove('disabled');
                return;
            }

            const previousWidget = widgets[index - 1];
            const previousSelectElements = previousWidget.querySelectorAll(
                '.select:not(.constructor-widget__dropdown *), ' +
                '.select-quantity:not(.constructor-widget__dropdown *), ' +
                '.date-trip-input:not(.constructor-widget__dropdown *), ' +
                '.select-calendar:not(.constructor-widget__dropdown *)'
            );

            const allSelected = Array.from(previousSelectElements).every(el =>
                el.classList.contains('selected')
            );

            if (allSelected) {
                widget.classList.remove('disabled');
            }
        });
    };

    widgets.forEach((widget) => {
        const selectElements = widget.querySelectorAll(
            '.select, .select-quantity, .date-trip-input, .select-calendar'
        );

        selectElements.forEach(selectElement => {
            const observer = new MutationObserver(() => {
                updateWidgetState();
            });

            observer.observe(selectElement, { attributes: true, subtree: false, childList: false });

            selectElement.addEventListener('click', () => {
                updateWidgetState();
            });
        });
    });

    updateWidgetState();
});

/*- custom-number -*/
function setupNumberInputs() {
    document.querySelectorAll(".custom-number").forEach(input => {
        input.addEventListener("input", function () {
            let min = parseInt(this.min, 10);
            let max = parseInt(this.max, 10);
            let value = this.value.replace(/\D/g, ""); // Убираем все нечисловые символы

            if (value === "") {
                this.classList.remove("error", "selected");
                return;
            }

            let numericValue = parseInt(value, 10);
            let maxLength = max.toString().length;

            if (value.length > maxLength) {
                value = value.slice(0, maxLength);
                numericValue = parseInt(value, 10);
            }

            if (numericValue < min || numericValue > max) {
                this.classList.add("error");
                this.classList.remove("selected");
            } else {
                this.classList.remove("error");
                this.classList.add("selected");
            }

            this.value = value;
        });
    });
}

document.addEventListener("DOMContentLoaded", setupNumberInputs);

/*- tour-days 
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date-trip");
    const tourDaysText = document.querySelector(".tour-days-text");
    const tourDays = document.querySelector(".tour-days");

    if (!dateInput || !tourDaysText || !tourDays) return;

    const updateVisibility = () => {
        if (dateInput.value.trim() !== "") {
            tourDaysText.classList.add("hidden");
            tourDays.classList.remove("hidden");
        } else {
            tourDaysText.classList.remove("hidden");
            tourDays.classList.add("hidden");
        }
    };

    // Lightpick
    const picker = new Lightpick({
        field: dateInput,
        singleDate: false,
        format: "DD.MM.YYYY",
        onSelect: updateVisibility,
        onClose: updateVisibility,
    });

    // Отслеживание изменения value через setInterval
    let lastValue = dateInput.value;
    setInterval(() => {
        if (dateInput.value !== lastValue) {
            lastValue = dateInput.value;
            updateVisibility();
        }
    }, 500);

    updateVisibility();
});-*/

/*- этот код для автоматического вывода дней -*/
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date-trip");
    const tourDaysText = document.querySelector(".tour-days-text");
    const tourDays = document.querySelector(".tour-days");

    if (!dateInput || !tourDaysText || !tourDays) return;

    const updateVisibility = () => {
        if (dateInput.value.trim() !== "") {
            tourDaysText.classList.add("hidden");
            tourDays.classList.remove("hidden");
            updateTourDays();
        } else {
            tourDaysText.classList.remove("hidden");
            tourDays.classList.add("hidden");
        }
    };

    const updateTourDays = () => {
        tourDays.innerHTML = "";

        const dateRange = dateInput.value.split(" - ");
        if (dateRange.length === 2) {
            const [startDate, endDate] = dateRange.map(date => date.trim());
            const start = new Date(startDate.split(".").reverse().join("-"));
            const end = new Date(endDate.split(".").reverse().join("-"));

            let current = new Date(start);
            let index = 1;

            while (current <= end) {
                const formattedDate = current.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                });

                const dayItem = document.createElement("div");
                dayItem.classList.add("tour-days__item");
                dayItem.innerHTML = `
                    <input id="day-${index}" type="radio" name="tour-days">
                    <label for="day-${index}">${formattedDate}</label>
                `;
                tourDays.appendChild(dayItem);

                current.setDate(current.getDate() + 1);
                index++;
            }
        }
    };

    const picker = new Lightpick({
        field: dateInput,
        singleDate: false,
        format: "DD.MM.YYYY",
        onSelect: updateVisibility,
        onClose: updateVisibility,
    });

    let lastValue = dateInput.value;
    setInterval(() => {
        if (dateInput.value !== lastValue) {
            lastValue = dateInput.value;
            updateVisibility();
        }
    }, 500);

    updateVisibility();
});

/*- transport -*/
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.transport__item');

    document.addEventListener('click', (event) => {
        let selectedItem = null;

        items.forEach(item => {
            if (item.contains(event.target)) {
                selectedItem = item;
            }
        });

        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (item === selectedItem) {
                item.classList.add('selected');
                if (checkbox) checkbox.checked = true;
            } else {
                item.classList.remove('selected');
                if (checkbox) checkbox.checked = false;
            }
        });
    });
});

/*- user-type-panel -*/
document.addEventListener("DOMContentLoaded", function () {
    const agencyRadio = document.getElementById("agency");
    const touristRadio = document.getElementById("tourist");
    const agencyInput = document.querySelector(".user-type-panel__agency-name");

    if (!agencyRadio || !touristRadio || !agencyInput) {
        return;
    }

    function toggleAgencyInput() {
        agencyInput.disabled = !agencyRadio.checked;
    }

    agencyRadio.addEventListener("change", toggleAgencyInput);
    touristRadio.addEventListener("change", toggleAgencyInput);
});

/*- select -*/
document.addEventListener("DOMContentLoaded", () => {
    const allSelects = document.querySelectorAll(".select, .select-calendar, .select-quantity, .select-rooms, .select-time");

    if (!allSelects.length) return;

    function closeAll(event) {
        allSelects.forEach(select => {
            if (!select.contains(event.target)) {
                select.classList.remove("open");
                const dropdown = select.querySelector(".select__dropdown, .select-calendar__dropdown, .select-quantity__dropdown, .select-rooms__dropdown, .select-time__dropdown");
                const selectText = select.querySelector(".select__text, .select-calendar__text, .select-quantity__text, .select-rooms__text, .select-time__text");
                if (dropdown) dropdown.classList.remove("show");
                if (selectText) selectText.classList.remove("open");
            }
        });
    }

    allSelects.forEach(select => {
        const selectText = select.querySelector(".select__text, .select-calendar__text, .select-quantity__text, .select-rooms__text, .select-time__text");
        const dropdown = select.querySelector(".select__dropdown, .select-calendar__dropdown, .select-quantity__dropdown, .select-rooms__dropdown, .select-time__dropdown");

        if (!selectText || !dropdown) return;

        selectText.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = select.classList.contains("open");
            closeAll(event);
            select.classList.toggle("open", !isOpen);
            selectText.classList.toggle("open", !isOpen);
            dropdown.classList.toggle("show", !isOpen);
        });

        const listItems = select.querySelectorAll(".select__dropdown li");
        const input = select.querySelector("input[type='text']");
        const placeholderText = select.querySelector(".select__placeholder-text");

        if (listItems.length) {
            input.value = selectText.textContent;

            listItems.forEach(item => {
                item.addEventListener("click", (event) => {
                    event.stopPropagation();
                    listItems.forEach(li => li.classList.remove("active"));
                    item.classList.add("active");

                    selectText.textContent = item.textContent;
                    input.value = item.textContent;

                    if (placeholderText) {
                        placeholderText.classList.add("hidden");
                    }
                    select.classList.add("selected");

                    select.classList.remove("open");
                    dropdown.classList.remove("show");
                });
            });
        }
    });

    document.addEventListener("click", closeAll);
});

/*- vertical-scroll -*/
var swiper = new Swiper(".vertical-scroll", {
    direction: "vertical",
    slidesPerView: "auto",
    freeMode: true,
    scrollbar: {
        el: ".swiper-scrollbar",
    },
    mousewheel: true,
});

/*- switch-input -*/
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".switch-input").forEach(switchInput => {
        const input = switchInput.querySelector("input");
        const numberDisplay = switchInput.querySelector(".switch-input__number");
        const btnAdd = switchInput.querySelector(".switch-input__add");
        const btnRemove = switchInput.querySelector(".switch-input__remove");

        const updateDisplay = (value) => {
            input.value = value;
            numberDisplay.textContent = value;
            btnRemove.classList.toggle("disabled", value === 0);
        };

        input.value = 0;
        updateDisplay(0);

        btnAdd.onclick = () => {
            let value = parseInt(input.value, 10) || 0;
            if (value < 999) {
                updateDisplay(value + 1);
            }
        };


        btnRemove.addEventListener("click", () => {
            let value = parseInt(input.value, 10) || 0;
            if (value > 0) {
                updateDisplay(value - 1);
            }
        });
    });
});

/*- select-quantity -*/
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".select-quantity").forEach(selectQuantity => {
        const textDisplay = selectQuantity.querySelector(".select-quantity__text");
        const fieldInput = selectQuantity.closest(".field-list")?.querySelector(".select-quantity__main-input");
        const inputs = selectQuantity.querySelectorAll(".switch-input");
        const placeholderText = selectQuantity.querySelector(".select-quantity__placeholder-text");

        function updateText() {
            const values = [];
            inputs.forEach(input => {
                const number = input.querySelector(".switch-input__number");
                const text = input.querySelector(".switch-input__text").textContent.trim();
                const count = parseInt(number.textContent, 10);
                if (count > 0) {
                    values.push(`(${count}) ${text}`);
                }
            });

            const hasSelection = values.length > 0;
            textDisplay.textContent = hasSelection ? values.join(", ") : "";

            if (fieldInput) {
                fieldInput.value = textDisplay.textContent;
            }

            if (hasSelection) {
                selectQuantity.classList.add("selected");
                if (placeholderText) placeholderText.classList.add("hidden");
            } else {
                selectQuantity.classList.remove("selected");
                if (placeholderText) placeholderText.classList.remove("hidden");
            }
        }

        inputs.forEach(input => {
            const number = input.querySelector(".switch-input__number");
            const observer = new MutationObserver(updateText);
            observer.observe(number, { childList: true, subtree: true });
        });

        updateText();
    });
});

/*- select-age -*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".select-quantity").forEach(selectQuantityBlock => {
        const totalQuantityText = selectQuantityBlock.querySelector(".select-quantity__text");
        const totalQuantityInput = selectQuantityBlock.querySelector(".select-quantity__main-input");
        const placeholderText = selectQuantityBlock.querySelector(".select-quantity__placeholder-text");
        const selectAgeBlock = selectQuantityBlock.querySelector(".select-age");
        const ageSelectItems = selectQuantityBlock.querySelectorAll(".select-age ul li");

        ageSelectItems.forEach(item => {
            item.addEventListener("click", function () {
                const age = this.getAttribute("data-age");
                const inputBlock = document.getElementById(age);

                if (inputBlock && inputBlock.hasAttribute("id")) {
                    inputBlock.classList.remove("hidden");
                    this.classList.add("active");
                    toggleSelectAgeVisibility(selectQuantityBlock);

                    const inputField = inputBlock.querySelector("input[type='text']");
                    const numberSpan = inputBlock.querySelector(".switch-input__number");
                    const removeButton = inputBlock.querySelector(".switch-input__remove");

                    if (inputField) {
                        inputField.value = "1";
                        if (numberSpan) numberSpan.textContent = "1";
                        if (removeButton) removeButton.classList.remove("disabled");
                    }

                    updateTotalQuantity(selectQuantityBlock);
                }
            });
        });

        selectQuantityBlock.addEventListener("click", function (event) {
            if (!event.target.classList.contains("switch-input__remove")) return;

            const removeButton = event.target;
            const inputBlock = removeButton.closest(".switch-input");

            if (!inputBlock) return;

            if (!inputBlock.hasAttribute("id")) return;

            if (removeButton.classList.contains("disabled")) {
                inputBlock.classList.add("hidden");

                const age = inputBlock.getAttribute("id");
                const relatedLi = selectQuantityBlock.querySelector(`.select-age ul li[data-age="${age}"]`);
                if (relatedLi) relatedLi.classList.remove("active");
            }

            updateTotalQuantity(selectQuantityBlock);
        });

        function updateTotalQuantity(container) {
            let total = 0;
            let ageSummary = [];

            container.querySelectorAll(".switch-input[id]:not(.hidden)").forEach(inputBlock => {
                const inputField = inputBlock.querySelector("input[type='text']");
                const ageCategory = inputBlock.querySelector(".switch-input__text")?.textContent;
                const quantity = parseInt(inputField?.value, 10) || 0;

                if (quantity > 0 && ageCategory) {
                    ageSummary.push(`(${quantity}) ${ageCategory}`);
                    total += quantity;
                }
            });

            totalQuantityText.textContent = ageSummary.length > 0 ? ageSummary.join(", ") : "Количество человек";
            totalQuantityInput.value = total > 0 ? total : "";

            if (placeholderText) {
                placeholderText.classList.toggle("hidden", total > 0);
            }

            toggleSelectAgeVisibility(container);
        }

        function toggleSelectAgeVisibility(container) {
            const allInputs = container.querySelectorAll(".switch-input[id]");
            const hiddenInputs = container.querySelectorAll(".switch-input[id].hidden");

            selectAgeBlock.classList.toggle("hidden", hiddenInputs.length === 0 && allInputs.length > 0);
        }
    });
});

/*- select-rooms -*/
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".select-rooms").forEach(selectRooms => {
        const textDisplay = selectRooms.querySelector(".select-rooms__text");
        const fieldInput = selectRooms.querySelector(".select-rooms__main-input");
        const inputs = selectRooms.querySelectorAll(".switch-input");
        const placeholderText = selectRooms.querySelector(".select-rooms__placeholder-text");

        function updateText() {
            const values = [];
            inputs.forEach(input => {
                const number = input.querySelector(".switch-input__number");
                const text = input.querySelector(".switch-input__text").textContent.trim();
                const count = parseInt(number.textContent, 10) || 0;
                if (count > 0) {
                    values.push(`(${count}) ${text}`);
                }
            });

            const hasSelection = values.length > 0;
            textDisplay.textContent = hasSelection ? values.join(", ") : "";

            if (fieldInput) {
                fieldInput.value = textDisplay.textContent;
            }

            if (hasSelection) {
                selectRooms.classList.add("selected");
                if (placeholderText) placeholderText.classList.add("hidden");
            } else {
                selectRooms.classList.remove("selected");
                if (placeholderText) placeholderText.classList.remove("hidden");
            }
        }

        inputs.forEach(input => {
            const number = input.querySelector(".switch-input__number");
            const observer = new MutationObserver(updateText);
            observer.observe(number, { childList: true, subtree: true });
        });

        updateText();
    });
});

/*- select-quantities -*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".select-rooms").forEach(selectRoomBlock => {
        const roomSelectItems = selectRoomBlock.querySelectorAll(".select-quantities__dropdown ul li");
        const totalRoomsText = selectRoomBlock.querySelector(".select-rooms__text");
        const totalRoomsInput = selectRoomBlock.querySelector(".select-rooms__main-input");
        const placeholderText = selectRoomBlock.querySelector(".select-rooms__placeholder-text");
        const selectQuantitiesBlock = selectRoomBlock.querySelector(".select-quantities");
        const switchInputList = selectRoomBlock.querySelector(".switch-input-list");

        roomSelectItems.forEach(item => {
            item.addEventListener("click", function () {
                const roomId = this.getAttribute("data-room");
                const roomBlock = selectRoomBlock.querySelector(`#${roomId}`);

                if (roomBlock) {
                    roomBlock.classList.remove("hidden");
                    updateActiveState(selectRoomBlock, roomId);
                    
                    const inputField = roomBlock.querySelector("input[type='text']");
                    const numberSpan = roomBlock.querySelector(".switch-input__number");
                    const removeButton = roomBlock.querySelector(".switch-input__remove");

                    if (inputField) inputField.value = "1";
                    if (numberSpan) numberSpan.textContent = "1";
                    if (removeButton) removeButton.classList.remove("disabled");

                    updateTotalRooms(selectRoomBlock);
                }
            });
        });

        selectRoomBlock.querySelectorAll(".switch-input__remove").forEach(removeButton => {
            removeButton.addEventListener("click", function () {
                const roomBlock = this.closest(".switch-input");

                if (roomBlock) {
                    if (removeButton.classList.contains("disabled")) {
                        roomBlock.classList.add("hidden");
                        updateActiveState(selectRoomBlock, roomBlock.id);
                        updateTotalRooms(selectRoomBlock);
                    }
                }
            });
        });

        function updateTotalRooms(container) {
            let total = 0;
            let roomSummary = [];

            container.querySelectorAll(".switch-input[id]:not(.hidden)").forEach(roomBlock => {
                const inputField = roomBlock.querySelector("input[type='text']");
                const roomName = roomBlock.querySelector(".switch-input__text")?.textContent;
                const quantity = parseInt(inputField?.value, 10) || 0;

                if (quantity > 0 && roomName) {
                    roomSummary.push(`(${quantity}) ${roomName}`);
                    total += quantity;
                }
            });

            totalRoomsText.textContent = roomSummary.length > 0 ? roomSummary.join(", ") : "Количество номеров";
            totalRoomsInput.value = total > 0 ? total : "";

            if (placeholderText) {
                placeholderText.classList.toggle("hidden", total > 0);
            }

            const allRooms = switchInputList.querySelectorAll(".switch-input[id]");
            const hiddenRooms = switchInputList.querySelectorAll(".switch-input[id].hidden");

            selectQuantitiesBlock.classList.toggle("hidden", hiddenRooms.length === 0 && allRooms.length > 0);
        }

        function updateActiveState(container, roomId) {
            const roomItem = container.querySelector(`.select-quantities__dropdown ul li[data-room="${roomId}"]`);
            const roomBlock = container.querySelector(`#${roomId}`);

            if (roomItem) {
                roomItem.classList.toggle("active", !roomBlock.classList.contains("hidden"));
            }
        }
    });
});

/*- select-quantity -*/
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".select-quantities").forEach(selectBlock => {
        const selectText = selectBlock.querySelector(".select-quantities__text");
        const dropdown = selectBlock.querySelector(".select-quantities__dropdown");

        if (selectText && dropdown) {
            selectText.addEventListener("click", () => {
                selectText.classList.toggle("open");
                dropdown.classList.toggle("show");
            });
        }
    });
});

/*- email-input -*/
document.addEventListener("DOMContentLoaded", function () {
    const emailField = document.querySelector(".email-input");

    if (emailField) {
        
        emailField.addEventListener("keydown", function (event) {
            const regex = /^[a-zA-Z0-9@._-]$/;
            if (!regex.test(event.key) && event.key !== "Backspace") {
                event.preventDefault();
                this.classList.add("error-input");
            }
        });

        emailField.addEventListener("input", function () {
            const oldValue = this.value;
            this.value = this.value.replace(/[а-яА-Я]/g, "");

            if (this.value !== oldValue) {
                this.classList.add("error-input");
            } else {
                this.classList.remove("error-input");
            }
        });
    }
});

/*- phone-input -*/
document.addEventListener('DOMContentLoaded', () => {
    const formatPhoneInput = (phoneInput) => {
        phoneInput.addEventListener('input', () => {
            let value = phoneInput.value.replace(/\D/g, '');
            if (!value.startsWith('998')) {
                value = '998' + value;
            }
            value = value.slice(0, 12);
            phoneInput.value = `+${value.slice(0, 3)} ${value.slice(3, 5)} ${value.slice(5, 8)} ${value.slice(8, 10)} ${value.slice(10, 12)}`.trim();
        });

        phoneInput.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace') {
                const cursorPosition = phoneInput.selectionStart;
                const value = phoneInput.value;
                if (cursorPosition <= 5) {
                    event.preventDefault();
                    return;
                }
                if (/\s/.test(value[cursorPosition - 1])) {
                    event.preventDefault();
                    const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
                    phoneInput.value = newValue;
                    phoneInput.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                }
            }
        });

        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value || phoneInput.value === '+998') {
                phoneInput.value = '+998 ';
            }
        });

        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value === '+998 ') {
                phoneInput.value = '';
            }
        });
    };

    document.querySelectorAll('.phone-input').forEach(formatPhoneInput);
});

/*- input-file -*/
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.input-file').forEach(docFileContainer => {
        const fileInput = docFileContainer.querySelector('.input-file__field');
        const fileText = docFileContainer.querySelector('.input-file__text');
        const errorText = docFileContainer.querySelector('.input-file__error-text');

        if (fileInput && fileText && errorText) {
            const allowedExtensions = ['docx', 'xlsx'];

            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    const fileExtension = fileName.split('.').pop().toLowerCase();

                    if (allowedExtensions.includes(fileExtension)) {
                        fileText.textContent = fileName;
                        fileText.classList.remove('hidden');
                        errorText.classList.remove('show');
                    } else {
                        fileText.classList.add('hidden');
                        errorText.classList.add('show');
                    }
                } else {
                    fileText.textContent = 'Выбрать файл';
                    fileText.classList.remove('hidden');
                    errorText.classList.remove('show');
                }
            });
        }
    });
});

/*- password-field -*/
document.addEventListener("DOMContentLoaded", function () {
    const passwordFields = document.querySelectorAll(".password-field");
    
    if (passwordFields.length === 0) return;
    
    passwordFields.forEach(field => {
        const input = field.querySelector("input");
        const btn = field.querySelector(".password-field__btn");
        
        if (!input || !btn) return;
        
        btn.addEventListener("click", function () {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            field.classList.toggle("show", isPassword);
        });
    });
});

/*- area-field -*/
document.addEventListener("DOMContentLoaded", () => {
    const squareInput = document.querySelector(".area-field input");

    if (!squareInput) return;

    squareInput.addEventListener("input", (e) => {
        let value = e.target.value;

        value = value.replace(/[^0-9.]/g, "");
        value = value.replace(/^(\d*\.\d*)\./g, "$1");

        e.target.value = value;
    });
});

/*- select-age -*/
document.addEventListener("DOMContentLoaded", function () {
    const selectText = document.querySelector(".select-age__text");
    const dropdown = document.querySelector(".select-age__dropdown");

    if (selectText && dropdown) {
        selectText.addEventListener("click", function () {
            selectText.classList.toggle("open");
            dropdown.classList.toggle("show");
        });
    }
});

/*- constructor-tabs -*/
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".constructor-tabs__nav ul li");
    const tabContents = document.querySelectorAll(".constructor-tabs__item");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function () {

            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            this.classList.add("active");
            tabContents[index].classList.add("active");
        });
    });
});

/*- date-trip -*/
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("date-trip");
    const label = document.querySelector(".date-trip-input__text");
    const dateTripInput = document.querySelector(".date-trip-input"); // Контейнер input

    if (!input || !label || !dateTripInput) return; // Проверка на существование элементов

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isCalendarOpen = false;
    let preventToggle = false;

    input.value = "";
    localStorage.removeItem("lightpick-selected-dates");

    function toggleLabel() {
        const hasValue = input.value.trim() !== "";

        if (hasValue) {
            label.classList.add("hidden");
            dateTripInput.classList.add("selected"); // Добавляем класс
        } else {
            label.classList.remove("hidden");
            dateTripInput.classList.remove("selected"); // Убираем класс
        }
    }

    const picker = new Lightpick({
        field: input,
        singleDate: false,
        numberOfMonths: 2,
        footer: false,
        minDate: today,
        onSelect: function (start, end) {
            toggleLabel();
            if (start && end) {
                localStorage.setItem("lightpick-selected-dates", input.value);
            }
        },
        onOpen: function () {
            isCalendarOpen = true;
            preventToggle = false;
            updatePreviousButtonState();
        },
        onClose: function () {
            isCalendarOpen = false;
            preventToggle = true;
            setTimeout(() => {
                preventToggle = false;
            }, 300);
        },
        onMonthChange: function () {
            setTimeout(updatePreviousButtonState, 50);
        }
    });

    function toggleCalendar(event) {
        event.preventDefault();
        if (preventToggle) return;

        isCalendarOpen ? picker.hide() : picker.show();
    }

    input.addEventListener("click", toggleCalendar);
    label.addEventListener("click", toggleCalendar);

    document.addEventListener("click", function (event) {
        if (
            !input.contains(event.target) &&
            !label.contains(event.target) &&
            !document.querySelector(".lightpick")?.contains(event.target)
        ) {
            picker.hide();
        }
    });

    input.addEventListener("change", toggleLabel);

    function updatePreviousButtonState() {
        const previousButton = document.querySelector('.lightpick__previous-action');
        const todayElement = document.querySelector('.lightpick .is-today');

        if (previousButton) {
            previousButton.classList.toggle('disabled', !!todayElement);
        }
    }

    document.addEventListener('click', function (event) {
        if (
            event.target.classList.contains('lightpick__next-action') || 
            event.target.classList.contains('lightpick__previous-action')
        ) {
            setTimeout(updatePreviousButtonState, 50);
        }
    });
});

/*- lightpick__day -*/
function updateLightpickDays() {
  const days = document.querySelectorAll(".lightpick__day");

  days.forEach((day, index) => {
    const i = index + 1;

    day.classList.remove("first", "last");

    if ((i - 1) % 7 === 0) {
      day.classList.add("first");
    }

    if (i % 7 === 0) {
      day.classList.add("last");
    }
  });
}

const observer = new MutationObserver(updateLightpickDays);
observer.observe(document.body, { childList: true, subtree: true });

updateLightpickDays();

/*- lightpick__day -*/
document.addEventListener("DOMContentLoaded", function () {
    function updateClasses() {
        document.querySelectorAll(".left-dec").forEach(el => el.classList.remove("left-dec"));
        document.querySelectorAll(".right-dec").forEach(el => el.classList.remove("right-dec"));
        
        const endDate = document.querySelector(".is-end-date");
        const startDate = document.querySelector(".is-start-date");
        
        if (endDate && startDate) {
            if (endDate.compareDocumentPosition(startDate) & Node.DOCUMENT_POSITION_FOLLOWING) {
                endDate.classList.add("left-dec");
                startDate.classList.add("right-dec");
            }
        }
    }
    
    const observer = new MutationObserver(updateClasses);
    observer.observe(document.body, { childList: true, subtree: true });
    
    updateClasses();
});

document.addEventListener("DOMContentLoaded", function () {
    function updateLightpickDays() {
        document.querySelectorAll(".lightpick__month").forEach(month => {
            const days = month.querySelectorAll(".lightpick__day");
            let maxDay = 0;
            let lastDayElement = null;
            
            if (days.length > 0) {
                days.forEach(day => {
                    day.classList.remove("first-day", "last-day");
                    const dayNumber = parseInt(day.textContent, 10);
                    if (!isNaN(dayNumber)) {
                        if (dayNumber === 1) {
                            day.classList.add("first-day");
                        }
                        if (dayNumber > maxDay) {
                            maxDay = dayNumber;
                            lastDayElement = day;
                        }
                    }
                });
                if (lastDayElement) {
                    lastDayElement.classList.add("last-day");
                }
            }
        });
    }
    
    const observer = new MutationObserver(updateLightpickDays);
    observer.observe(document.body, { childList: true, subtree: true });

    updateLightpickDays();
});

/*- select-calendar -*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".calendar").forEach(calendar => {
        const monthEl = calendar.querySelector(".calendar__month");
        const yearEl = calendar.querySelector(".calendar__year");
        const daysContainer = calendar.querySelector(".calendar__days");
        const prevArrow = calendar.querySelector(".calendar__prev-arrow");
        const nextArrow = calendar.querySelector(".calendar__next-arrow");
        const selectCalendar = calendar.closest(".select-calendar");
        const selectText = selectCalendar?.querySelector(".select-calendar__text");
        const selectInput = selectCalendar?.querySelector("input");
        const placeholderText = selectCalendar?.querySelector(".select-calendar__placeholder-text");

        const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        const today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        function updateSelectState() {
            if (selectText && selectText.textContent.trim() !== "") {
                selectCalendar?.classList.add("selected");
                placeholderText?.classList.add("hidden");
            } else {
                selectCalendar?.classList.remove("selected");
                placeholderText?.classList.remove("hidden");
            }
        }

        function renderCalendar() {
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

            monthEl.textContent = months[currentMonth];
            yearEl.textContent = currentYear;
            daysContainer.innerHTML = "";

            let offset = firstDay === 0 ? 6 : firstDay - 1;
            for (let i = 0; i < offset; i++) {
                const emptySpan = document.createElement("span");
                daysContainer.appendChild(emptySpan);
            }

            for (let day = 1; day <= lastDate; day++) {
                const dayEl = document.createElement("span");
                dayEl.classList.add("calendar__day");
                dayEl.textContent = day;
                
                const isPast = new Date(currentYear, currentMonth, day) < today.setHours(0, 0, 0, 0);
                if (isPast) dayEl.classList.add("disabled");
                
                dayEl.addEventListener("click", () => {
                    if (!dayEl.classList.contains("disabled")) {
                        daysContainer.querySelectorAll(".calendar__day.active").forEach(el => el.classList.remove("active"));
                        dayEl.classList.add("active");
                        
                        const formattedDate = `${String(day).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
                        if (selectText) selectText.textContent = formattedDate;
                        if (selectInput) selectInput.value = formattedDate;

                        updateSelectState();
                    }
                });

                daysContainer.appendChild(dayEl);
            }

            prevArrow.classList.toggle("disabled", currentMonth === today.getMonth() && currentYear === today.getFullYear());
        }

        prevArrow.addEventListener("click", () => {
            if (currentMonth > today.getMonth() || currentYear > today.getFullYear()) {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar();
            }
        });

        nextArrow.addEventListener("click", () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });

        renderCalendar();
    });
});

/*- other-field -*/
document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.getElementById("other-input");
    const otherField = document.querySelector(".other-field");

    if (checkbox && otherField) {
        checkbox.addEventListener("change", function () {
            otherField.classList.toggle("show", checkbox.checked);
        });
    }
});

/*- notification -*/
document.addEventListener("DOMContentLoaded", () => {
    const notificationIcon = document.querySelector(".notification__icon");
    const notificationDesc = document.querySelector(".notification__description");

    if (!notificationIcon || !notificationDesc) return;

    const toggleNotification = (event) => {
        event.stopPropagation();
        notificationDesc.classList.toggle("show");
    };

    const hideNotification = (event) => {
        if (!notificationDesc.contains(event.target) && event.target !== notificationIcon) {
            notificationDesc.classList.remove("show");
        }
    };

    notificationIcon.addEventListener("click", toggleNotification);
    document.addEventListener("click", hideNotification);
});

/*- other-city -*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".city-field").forEach(field => {
        const checkbox = field.querySelector("input[type='checkbox']");
        const cityInput = field.querySelector(".city-input");

        if (checkbox && cityInput) {
            checkbox.addEventListener("change", function () {
                cityInput.disabled = !checkbox.checked;
            });
        }
    });
});

/*- modal -*/
document.addEventListener("DOMContentLoaded", () => {
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function openModal(modal) {
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.classList.add("modal-scroll-none");
        modal.classList.add("show");
    }

    function closeModal(modal) {
        document.body.style.paddingRight = "";
        document.body.classList.remove("modal-scroll-none");
        modal.classList.remove("show");
    }

    document.querySelectorAll("[data-modal]").forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            if (trigger.tagName.toLowerCase() === "a") {
                e.preventDefault();
            }
            const modalId = trigger.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            const modalIn = modal.querySelector(".modal__in");
            if (
                e.target.classList.contains("modal__close-btn") || 
                e.target.classList.contains("modal__overlay") || 
                (modalIn && !modalIn.contains(e.target))
            ) {
                closeModal(modal);
            }
        });
    });
});

/*- share -*/
document.addEventListener("DOMContentLoaded", () => {
    const icon = document.querySelector(".share__icon");
    const dropdown = document.querySelector(".share__dropdown");

    if (icon && dropdown) {

        function toggleDropdown(event) {
            event.stopPropagation();
            dropdown.classList.toggle("show");
            icon.classList.toggle("active");
        }

        function closeDropdown(event) {
            if (!dropdown.contains(event.target) && !icon.contains(event.target)) {
                dropdown.classList.remove("show");
                icon.classList.remove("active");
            }
        }

        icon.addEventListener("click", toggleDropdown);
        document.addEventListener("click", closeDropdown);
    }
});

/*- accordion -*/
const accordions = document.querySelectorAll('.tour-accordion__top-panel');

accordions.forEach(accordion => {
    accordion.addEventListener('click', function () {

        this.classList.toggle('active');

        const accordionItem = this.closest('.tour-accordion__item');
        if (accordionItem) {
            accordionItem.classList.toggle('open');
        }

        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
});

/*- gallery-slider -*/
var swiper = new Swiper(".gallery-slider", {
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 20,
    pagination: {
    el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
    0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        },
    430: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 20,
        },
    799: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 20,
        },
    1079: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 20,
        },
    },
});

/*- map -*/
if (document.getElementById('map')) {
    ymaps.ready(init);
}

function init() {
    // Координаты для центра карты и маркера
    const centerCoords = [41.296404, 69.275002];

    // Создаём карту
    const myMap = new ymaps.Map("map", {
        center: centerCoords, // Центр карты совпадает с координатами маркера
        zoom: 17,
        controls: ['zoomControl'] // Оставляем только кнопки управления масштабом
    });

    // Отключаем все интерактивные возможности навигации
    myMap.behaviors.disable(['scrollZoom', 'multiTouch', 'dblClickZoom', 'ruler']);

    // Добавляем кастомный маркер по центру
    const customPlacemark = new ymaps.Placemark(centerCoords, {
        hintContent: 'Tourista',
        balloonContent: 'Tourista: Турагентство в Ташкенте'
    }, {
        // Опции для кастомного изображения
        iconLayout: 'default#image',
        iconImageHref: 'img/icons/map-location.svg', // Путь к вашему изображению маркера
        iconImageSize: [60, 68], // Размер изображения
        iconImageOffset: [-30, -70] // Смещение изображения
    });

    // Добавляем маркер на карту
    myMap.geoObjects.add(customPlacemark);
}

/*- form tabs -*/
document.addEventListener("DOMContentLoaded", function () {
    /*- Transfer Block -*/
    const transferBtn = document.getElementById("transfer-nav");
    const transferDropdown = document.getElementById("transfer");
    const needTransfer = document.getElementById("need-transfer");
    const cancelTransfer = document.getElementById("cancel-transfer");

    if (transferDropdown && needTransfer && cancelTransfer) {
        needTransfer.checked = false;
        cancelTransfer.checked = true;
        transferDropdown.classList.remove("show");
    }

    if (transferBtn && transferDropdown && needTransfer && cancelTransfer) {
        transferBtn.addEventListener("click", function (event) {
            const target = event.target;
            if (target === needTransfer) {
                transferDropdown.classList.add("show");
            } else if (target === cancelTransfer) {
                transferDropdown.classList.remove("show");
            }
        });
    }

    /*- Transportation City Block -*/
    const cityNav = document.getElementById("transfer-city-nav");
    const cityDropdown = document.getElementById("transfer-city");
    const needTransport = document.getElementById("need-transport-2");
    const cancelTransport = document.getElementById("cancel-transfer-2");

    if (cityDropdown && needTransport && cancelTransport) {
        needTransport.checked = false;
        cancelTransport.checked = true;
        cityDropdown.classList.remove("show");
    }

    if (cityNav && cityDropdown && needTransport && cancelTransport) {
        cityNav.addEventListener("click", function (event) {
            const target = event.target;
            if (target === needTransport) {
                cityDropdown.classList.add("show");
            } else if (target === cancelTransport) {
                cityDropdown.classList.remove("show");
            }
        });
    }

    /*- Hotel Block -*/
    const hotelNav = document.getElementById("n-hotel-nav");
    const hotelDropdown = document.getElementById("n-hotel");
    const needHotel = document.getElementById("need-hotel");
    const cancelHotel = document.getElementById("cancel-hotel");

    if (hotelDropdown && needHotel && cancelHotel) {
        needHotel.checked = false;
        cancelHotel.checked = true;
        hotelDropdown.classList.remove("show");
    }

    if (hotelNav && hotelDropdown && needHotel && cancelHotel) {
        hotelNav.addEventListener("click", function (event) {
            const target = event.target;
            if (target === needHotel) {
                hotelDropdown.classList.add("show");
            } else if (target === cancelHotel) {
                hotelDropdown.classList.remove("show");
            }
        });
    }

    /*- Transportation Transfers Block -*/
    const transportationNav = document.getElementById("transportation-transfers-nav");
    const transportationDropdown = document.getElementById("transportation-transfers");
    const needTransportation = document.getElementById("need-transport-5");
    const cancelTransportation = document.getElementById("cancel-transfer-5");

    if (transportationDropdown && needTransportation && cancelTransportation) {
        needTransportation.checked = false;
        cancelTransportation.checked = true;
        transportationDropdown.classList.remove("show");
    }

    if (transportationNav && transportationDropdown && needTransportation && cancelTransportation) {
        transportationNav.addEventListener("click", function (event) {
            const target = event.target;
            if (target === needTransportation) {
                transportationDropdown.classList.add("show");
            } else if (target === cancelTransportation) {
                transportationDropdown.classList.remove("show");
            }
        });
    }

    /*- Specify Hotel Block -*/
    const specifyHotelNav = document.getElementById("specify-hotel-nav");
    const specifyHotelDropdown = document.getElementById("specify-hotel");
    const needHotel2 = document.getElementById("need-hotel-2");
    const cancelHotel2 = document.getElementById("cancel-hotel-2");

    if (specifyHotelDropdown && needHotel2 && cancelHotel2) {
        needHotel2.checked = false;
        cancelHotel2.checked = true;
        specifyHotelDropdown.classList.remove("show");
    }

    if (specifyHotelNav && specifyHotelDropdown && needHotel2 && cancelHotel2) {
        specifyHotelNav.addEventListener("click", function (event) {
            const target = event.target;
            if (target === needHotel2) {
                specifyHotelDropdown.classList.add("show");
            } else if (target === cancelHotel2) {
                specifyHotelDropdown.classList.remove("show");
            }
        });
    }

    /*- need-transpor -*/
    const checkbox = document.getElementById("need-transport-3");
    const dropdown = document.getElementById("add-transportation");
    
    if (checkbox && dropdown) {
        checkbox.checked = false;
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                dropdown.classList.add("show");
            } else {
                dropdown.classList.remove("show");
            }
        });
    }

    /*- need-transport 2 -*/
    const checkboxTransport = document.getElementById("need-transport-4");
    const dropdownTransport = document.getElementById("add-transportation-2");

    if (checkboxTransport && dropdownTransport) {
        checkboxTransport.checked = false;
        checkboxTransport.addEventListener("change", function () {
            if (checkboxTransport.checked) {
                dropdownTransport.classList.add("show");
            } else {
                dropdownTransport.classList.remove("show");
            }
        });
    }
});

/*- support-block -*/
document.addEventListener("DOMContentLoaded", function () {
    /*- support-block 1 -*/
    const supportBlock1 = document.getElementById("support-block");
    if (supportBlock1) {
        const checkboxBlock1 = supportBlock1.querySelector(".checkbox");
        const radios1 = document.querySelectorAll("input[name='support']");

        radios1.forEach(radio => {
            radio.addEventListener("change", function () {
                if (this.id === "support-1" || this.id === "support-2") {
                    supportBlock1.classList.add("show");
                } else {
                    supportBlock1.classList.remove("show");
                }

                if (this.id === "support-1") {
                    checkboxBlock1.classList.remove("hidden");
                } else {
                    checkboxBlock1.classList.add("hidden");
                }
            });
        });
    }

    /*- support-block 2 -*/
    const supportBlock2 = document.getElementById("support-block-2");
    if (supportBlock2) {
        const checkboxBlock2 = supportBlock2.querySelector(".checkbox");
        const radios2 = document.querySelectorAll("input[name='support-2']");

        radios2.forEach(radio => {
            radio.addEventListener("change", function () {
                if (this.id === "support-v-1" || this.id === "support-v-2") {
                    supportBlock2.classList.add("show");
                } else {
                    supportBlock2.classList.remove("show");
                }

                if (this.id === "support-v-1") {
                    checkboxBlock2.classList.remove("hidden");
                } else {
                    checkboxBlock2.classList.add("hidden");
                }
            });
        });
    }

    /*- support-block 3 -*/
    const supportBlock3 = document.getElementById("support-block-3");
    if (supportBlock3) {
        const checkboxBlock3 = supportBlock3.querySelector(".checkbox");
        const radios3 = document.querySelectorAll("input[name='support-3']");

        radios3.forEach(radio => {
            radio.addEventListener("change", function () {
                if (this.id === "support-vr-1" || this.id === "support-vr-2") {
                    supportBlock3.classList.add("show");
                } else {
                    supportBlock3.classList.remove("show");
                }

                if (this.id === "support-vr-1") {
                    checkboxBlock3.classList.remove("hidden");
                } else {
                    checkboxBlock3.classList.add("hidden");
                }
            });
        });
    }
});

/*- type-trip -*/
document.addEventListener("DOMContentLoaded", () => {
    const typeTripNav = document.getElementById("type-trip-nav");
    if (!typeTripNav) return;

    const inputs = {
        "excursions": document.getElementById("excursions"),
        "trip-countryside": document.getElementById("trip-countryside"),
        "trip-another-city": document.getElementById("trip-another-city")
    };

    const infoBlocks = {
        "excursions": document.getElementById("type-trip-1"),
        "trip-countryside": document.getElementById("type-trip-2"),
        "trip-another-city": document.getElementById("type-trip-3")
    };

    Object.values(inputs).forEach(input => {
        if (input) input.checked = false;
    });

    function toggleInfo(event) {
        Object.values(infoBlocks).forEach(block => {
            if (block) block.classList.remove("show");
        });
        
        const selectedInput = event.target.id;
        if (infoBlocks[selectedInput]) {
            infoBlocks[selectedInput].classList.add("show");
        }
    }
    
    Object.values(inputs).forEach(input => {
        if (input) input.addEventListener("change", toggleInfo);
    });
});

/*- type-recreation -*/
document.addEventListener("DOMContentLoaded", () => {
    const typeRecreationNav = document.getElementById("type-recreation-nav");
    if (!typeRecreationNav) return;

    const inputs = {
        "excursions-2": document.getElementById("excursions-2"),
        "trip-countryside-2": document.getElementById("trip-countryside-2")
    };

    const infoBlocks = {
        "excursions-2": document.getElementById("type-recreation-1"),
        "trip-countryside-2": document.getElementById("type-recreation-2")
    };

    Object.values(inputs).forEach(input => {
        if (input) input.checked = false;
    });

    function toggleInfo(event) {
        Object.values(infoBlocks).forEach(block => {
            if (block) block.classList.remove("show");
        });
        
        const selectedInput = event.target.id;
        if (infoBlocks[selectedInput]) {
            infoBlocks[selectedInput].classList.add("show");
        }
    }
    
    Object.values(inputs).forEach(input => {
        if (input) input.addEventListener("change", toggleInfo);
    });
});

/*- name-input -*/
document.addEventListener("DOMContentLoaded", () => {
  const nameInputs = document.querySelectorAll(".name-input");

  if (!nameInputs.length) return;

  nameInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const prevValue = input.value;
      input.value = prevValue.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "");

      if (prevValue !== input.value) {
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });
  });
});

/*- email-input -*/
document.addEventListener("DOMContentLoaded", () => {
  const emailInputs = document.querySelectorAll(".email-input");

  if (!emailInputs.length) return;

  emailInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const prevValue = input.value;
      input.value = prevValue.replace(/[а-яА-ЯёЁ]/g, "");

      if (prevValue !== input.value) {
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });
  });
});

/*- field-date -*/
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date-trip");
    const fieldDateInput = document.querySelector(".field-date input");
    const fieldDateText = document.querySelector(".field-date__text");

    if (!dateInput || !fieldDateInput || !fieldDateText) return;

    fieldDateInput.value = "";
    fieldDateText.classList.remove("hidden");

    const updateFieldDate = () => {
        if (dateInput.value.trim() !== "") {
            const dateRange = dateInput.value.split(" - ");
            if (dateRange.length > 0) {
                const startDate = dateRange[0].trim();
                fieldDateInput.value = startDate;
                fieldDateText.classList.add("hidden");
            }
        } else {
            fieldDateInput.value = "";
            fieldDateText.classList.remove("hidden");
        }
    };

    const picker = new Lightpick({
        field: dateInput,
        singleDate: false,
        format: "DD.MM.YYYY",
        onSelect: updateFieldDate,
        onClose: updateFieldDate,
    });

    let lastValue = dateInput.value;
    setInterval(() => {
        if (dateInput.value !== lastValue) {
            lastValue = dateInput.value;
            updateFieldDate();
        }
    }, 500);
});

/*- select-time -*/
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".select-time").forEach(selectTime => {
        const hourInput = selectTime.querySelector(".select-time__hour");
        const minuteInput = selectTime.querySelector(".select-time__minute");
        const saveBtn = selectTime.querySelector(".btn");
        const selectTimeText = selectTime.querySelector(".select-time__text");
        const placeholderText = selectTime.querySelector(".select-time__placeholder-text");
        const selectTimeInput = selectTime.querySelector(".select-time__input");
        const dropdown = selectTime.querySelector(".select-time__dropdown");

        if (!hourInput || !minuteInput || !saveBtn || !selectTimeText || !placeholderText || !selectTimeInput || !dropdown) return;

        function validateInput(input, max) {
            input.value = input.value.replace(/\D/g, "").slice(0, 2);
            
            if (input.value.length === 2) {
                let num = parseInt(input.value, 10);
                if (isNaN(num) || num > max) {
                    input.value = "";
                }
            }
            checkFields();
        }

        function checkFields() {
            if (hourInput.value.length === 2 && minuteInput.value.length === 2) {
                saveBtn.classList.remove("disabled");
            } else {
                saveBtn.classList.add("disabled");
            }
        }

        function updateSelectTimeText() {
            if (!saveBtn.classList.contains("disabled")) {
                let formattedTime = `${hourInput.value.padStart(2, '0')}:${minuteInput.value.padStart(2, '0')}`;
                selectTimeText.textContent = formattedTime;
                selectTimeInput.value = formattedTime;
                placeholderText.classList.add("hidden");
                dropdown.classList.remove("show");
            }
        }

        function resetInputs() {
            hourInput.value = "";
            minuteInput.value = "";
            selectTimeText.textContent = "";
            selectTimeInput.value = "";
            placeholderText.classList.remove("hidden");
            saveBtn.classList.add("disabled");
        }

        hourInput.addEventListener("input", () => validateInput(hourInput, 23));
        minuteInput.addEventListener("input", () => validateInput(minuteInput, 59));
        saveBtn.addEventListener("click", updateSelectTimeText);
    });

    window.addEventListener("beforeunload", () => {
        document.querySelectorAll(".select-time").forEach(selectTime => {
            const hourInput = selectTime.querySelector(".select-time__hour");
            const minuteInput = selectTime.querySelector(".select-time__minute");
            const selectTimeText = selectTime.querySelector(".select-time__text");
            const selectTimeInput = selectTime.querySelector(".select-time__input");
            const placeholderText = selectTime.querySelector(".select-time__placeholder-text");
            const saveBtn = selectTime.querySelector(".btn");

            if (hourInput) hourInput.value = "";
            if (minuteInput) minuteInput.value = "";
            if (selectTimeText) selectTimeText.textContent = "";
            if (selectTimeInput) selectTimeInput.value = "";
            if (placeholderText) placeholderText.classList.remove("hidden");
            if (saveBtn) saveBtn.classList.add("disabled");
        });
    });
});

/*- hotels selects -*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("ul").forEach(ul => {
        const parent = ul.closest(".field-list");
        if (!parent) return;

        const roomLinks = ul.querySelectorAll(".room-link");
        const hostelLinks = ul.querySelectorAll(".hostel-link");
        const roomFields = parent.querySelectorAll(".room-field");
        const hostelFields = parent.querySelectorAll(".hostel-field");

        roomLinks.forEach(link => {
            link.addEventListener("click", function () {
                roomFields.forEach(field => field.classList.remove("disabled", "hidden"));
                hostelFields.forEach(field => field.classList.remove("show"));
            });
        });

        hostelLinks.forEach(link => {
            link.addEventListener("click", function () {
                hostelFields.forEach(field => field.classList.remove("disabled"));
                hostelFields.forEach(field => field.classList.add("show"));
                roomFields.forEach(field => field.classList.add("disabled", "hidden"));
            });
        });
    });
});

/*- mobile menu -*/
document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.querySelector(".menu-btn");
    const menuCol = document.querySelector(".header__md-col");

    if (menuBtn && menuCol) {
        menuBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            menuBtn.classList.toggle("open");
            menuCol.classList.toggle("show");
        });

        document.addEventListener("click", function (event) {
            if (!menuCol.contains(event.target) && !menuBtn.contains(event.target)) {
                menuBtn.classList.remove("open");
                menuCol.classList.remove("show");
            }
        });
    }
});













