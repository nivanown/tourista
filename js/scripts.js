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
        console.warn('На странице отсутствуют блоки constructor-widget.');
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
                '.select, .select-quantity, .date-trip-input, .select-calendar'
            );

            const allSelected = Array.from(previousSelectElements).every(el =>
                el.classList.contains('selected')
            );

            if (allSelected) {
                widget.classList.remove('disabled');
            } else {
                widget.classList.add('disabled');
            }
        });
    };

    widgets.forEach((widget) => {
        const selectElements = widget.querySelectorAll(
            '.select, .select-quantity, .date-trip-input, .select-calendar'
        );

        selectElements.forEach(selectElement => {
            // Добавляем наблюдатель за изменением классов
            const observer = new MutationObserver(() => {
                updateWidgetState();
            });

            observer.observe(selectElement, { attributes: true });

            // Дополнительно обрабатываем клик
            selectElement.addEventListener('click', () => {
                updateWidgetState();
            });
        });
    });

    // Устанавливаем начальное состояние
    updateWidgetState();
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
    const selects = document.querySelectorAll(".select");
    const selectCalendar = document.querySelector(".select-calendar");
    const selectQuantity = document.querySelector(".select-quantity");

    function closeAll(event) {
        selects.forEach(select => {
            const selectDropdown = select.querySelector(".select__dropdown");
            if (!select.contains(event.target)) {
                select.classList.remove("open");
                selectDropdown.classList.remove("show");
            }
        });

        if (selectCalendar && !selectCalendar.contains(event.target)) {
            selectCalendar.classList.remove("open");
            const dropdown = selectCalendar.querySelector(".select-calendar__dropdown");
            dropdown.classList.remove("show");
        }

        if (selectQuantity && !selectQuantity.contains(event.target)) {
            selectQuantity.classList.remove("open");
            const selectTextQuantity = selectQuantity.querySelector(".select-quantity__text");
            const selectDropdownQuantity = selectQuantity.querySelector(".select-quantity__dropdown");
            selectTextQuantity.classList.remove("open");
            selectDropdownQuantity.classList.remove("show");
        }
    }

    selects.forEach(select => {
        const selectText = select.querySelector(".select__text");
        const selectDropdown = select.querySelector(".select__dropdown");
        const listItems = select.querySelectorAll(".select__dropdown li");
        const input = select.querySelector("input[type='text']");
        const placeholderText = select.querySelector(".select__placeholder-text");

        input.value = selectText.textContent;

        selectText.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = select.classList.contains("open");

            closeAll(event);
            if (isOpen) {
                select.classList.remove("open");
                selectDropdown.classList.remove("show");
            } else {
                select.classList.add("open");
                selectDropdown.classList.add("show");
            }
        });

        listItems.forEach(item => {
            item.addEventListener("click", (event) => {
                event.stopPropagation();
                listItems.forEach(li => li.classList.remove("active"));
                item.classList.add("active");

                selectText.textContent = item.textContent;
                input.value = item.textContent;

                // Добавляем класс selected и скрываем placeholder
                if (placeholderText) {
                    placeholderText.classList.add("hidden");
                }
                select.classList.add("selected");

                select.classList.remove("open");
                selectDropdown.classList.remove("show");
            });
        });
    });

    if (selectCalendar) {
        const selectText = selectCalendar.querySelector(".select-calendar__text");
        const dropdown = selectCalendar.querySelector(".select-calendar__dropdown");

        selectText.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = selectCalendar.classList.contains("open");

            closeAll(event);
            if (isOpen) {
                selectCalendar.classList.remove("open");
                dropdown.classList.remove("show");
            } else {
                selectCalendar.classList.add("open");
                dropdown.classList.add("show");
            }
        });
    }

    if (selectQuantity) {
        const selectTextQuantity = selectQuantity.querySelector(".select-quantity__text");
        const selectDropdownQuantity = selectQuantity.querySelector(".select-quantity__dropdown");

        selectTextQuantity.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = selectQuantity.classList.contains("open");

            closeAll(event);
            if (isOpen) {
                selectQuantity.classList.remove("open");
                selectTextQuantity.classList.remove("open");
                selectDropdownQuantity.classList.remove("show");
            } else {
                selectQuantity.classList.add("open");
                selectTextQuantity.classList.add("open");
                selectDropdownQuantity.classList.add("show");
            }
        });
    }

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

        btnAdd.addEventListener("click", () => {
            let value = parseInt(input.value, 10) || 0;
            if (value < 999) {
                updateDisplay(value + 1);
            }
        });

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
            const resultText = hasSelection ? values.join(", ") : "Количество человек";
            textDisplay.textContent = resultText;

            if (fieldInput) {
                fieldInput.value = resultText;
            }

            // Добавляем или убираем классы
            if (hasSelection) {
                selectQuantity.classList.add("selected");
                if (placeholderText) placeholderText.classList.add("hidden");
            } else {
                selectQuantity.classList.remove("selected");
                if (placeholderText) placeholderText.classList.remove("hidden");
            }
        }

        // Следим за изменениями числа в switch-input__number
        inputs.forEach(input => {
            const number = input.querySelector(".switch-input__number");
            const observer = new MutationObserver(updateText);
            observer.observe(number, { childList: true, subtree: true });
        });

        updateText();
    });
});

/*- select-quantity -*/
document.addEventListener("DOMContentLoaded", function () {
    const ageSelectItems = document.querySelectorAll(".select-age ul li");
    const selectAgeBlock = document.querySelector(".select-age");
    const totalQuantityText = document.querySelector(".select-quantity__text");
    const totalQuantityInput = document.querySelector(".select-quantity__main-input");
    
    ageSelectItems.forEach(item => {
        item.addEventListener("click", function () {
            const age = this.getAttribute("data-age");
            const inputBlock = document.getElementById(age);
            
            if (inputBlock && inputBlock.hasAttribute("id")) {
                inputBlock.classList.remove("hidden");
                this.classList.add("active");
                
                const inputField = inputBlock.querySelector("input[type='text']");
                const numberSpan = inputBlock.querySelector(".switch-input__number");
                const removeButton = inputBlock.querySelector(".switch-input__remove");
                
                if (inputField) {
                    inputField.value = "1";
                    if (numberSpan) numberSpan.textContent = "1";
                    if (removeButton) removeButton.classList.remove("disabled");
                }
                
                updateTotalQuantity();
                toggleSelectAgeVisibility();
            }
        });
    });
    
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("switch-input__add")) {
            const inputBlock = event.target.closest(".switch-input");
            if (inputBlock && inputBlock.hasAttribute("id")) {
                const inputField = inputBlock.querySelector("input[type='text']");
                const numberSpan = inputBlock.querySelector(".switch-input__number");
                const removeButton = inputBlock.querySelector(".switch-input__remove");
                if (inputField) {
                    let value = parseInt(inputField.value, 10) || 0;
                    inputField.value = value + 1;
                    if (numberSpan) numberSpan.textContent = inputField.value;
                    if (removeButton) removeButton.classList.remove("disabled");
                }
                updateTotalQuantity();
            }
        }
        
        if (event.target.classList.contains("switch-input__remove")) {
            const inputBlock = event.target.closest(".switch-input");
            if (inputBlock && inputBlock.hasAttribute("id")) {
                const inputField = inputBlock.querySelector("input[type='text']");
                const numberSpan = inputBlock.querySelector(".switch-input__number");
                const removeButton = inputBlock.querySelector(".switch-input__remove");
                if (inputField) {
                    let value = parseInt(inputField.value, 10) || 0;
                    if (value > 0) {
                        inputField.value = value - 1;
                        if (numberSpan) numberSpan.textContent = inputField.value;
                    }
                    if (parseInt(inputField.value, 10) === 0) {
                        inputBlock.classList.add("hidden");
                        if (removeButton) removeButton.classList.add("disabled");
                        
                        const age = inputBlock.getAttribute("id");
                        const listItem = document.querySelector(`.select-age ul li[data-age='${age}']`);
                        if (listItem) {
                            listItem.classList.remove("active");
                        }
                    }
                }
                updateTotalQuantity();
                toggleSelectAgeVisibility();
            }
        }
    });
    
    function updateTotalQuantity() {
        let total = 0;
        document.querySelectorAll(".switch-input[id]:not(.hidden) input[type='text']").forEach(input => {
            total += parseInt(input.value, 10) || 0;
        });
        if (totalQuantityText && total > 0) {
            totalQuantityText.textContent = `Количество человек: ${total}`;
        } else {
            totalQuantityText.textContent = "Количество человек";
        }
        if (totalQuantityInput) totalQuantityInput.value = total > 0 ? total : "";
    }
    
    function toggleSelectAgeVisibility() {
        const hiddenInputs = document.querySelectorAll(".switch-input[id].hidden");
        const allInputs = document.querySelectorAll(".switch-input[id]");
        if (hiddenInputs.length === 0 && allInputs.length > 0) {
            selectAgeBlock.classList.add("hidden");
        } else {
            selectAgeBlock.classList.remove("hidden");
        }
    }
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
    const calendar = document.querySelector(".calendar");
    if (!calendar) return;

    const monthEl = calendar.querySelector(".calendar__month");
    const yearEl = calendar.querySelector(".calendar__year");
    const daysContainer = calendar.querySelector(".calendar__days");
    const prevArrow = calendar.querySelector(".calendar__prev-arrow");
    const nextArrow = calendar.querySelector(".calendar__next-arrow");
    const selectCalendar = document.querySelector(".select-calendar");
    const selectText = document.querySelector(".select-calendar__text");
    const selectInput = document.querySelector(".select-calendar input");
    const placeholderText = document.querySelector(".select-calendar__placeholder-text");

    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function updateSelectState() {
        if (selectText.textContent.trim() !== "") {
            selectCalendar.classList.add("selected");
            placeholderText?.classList.add("hidden");
        } else {
            selectCalendar.classList.remove("selected");
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
                    document.querySelectorAll(".calendar__day.active").forEach(el => el.classList.remove("active"));
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
    const checkbox = document.getElementById("other-city");
    const cityInput = document.querySelector(".city-input");

    if (checkbox && cityInput) {
        checkbox.addEventListener("change", function () {
            cityInput.disabled = !checkbox.checked;
        });
    }
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








