/**
 * Creates custom dropdown
 * @param {string} element
 * @param {Object} list
 * @param {number} selected
 * @param {string} classPrefix
 * @return {void, boolean}
 */
function createDropdown(
    element, {list, selected, classPrefix = 'component-dropdown'}) {
  if (typeof list !== 'object' || list.length <= 0 || element.length <= 0) {
    console.error('One of required params is empty: element, list');
    return false;
  }

  const container = document.querySelector(element);
  const select = document.createElement('select');
  const dropdown = document.createElement('div');
  const dropdownOptions = document.createElement('div');
  const dropdownHeader = createDropdownHeader();

  select.classList.add('sr-only', `${classPrefix}__select`);
  dropdown.classList.add(classPrefix);
  dropdownOptions.classList.add(`${classPrefix}__body`);

  /**
   * Creating dropdown header
   * @param {string} title
   * @return {{container: HTMLDivElement, current: HTMLDivElement}}
   */
  function createDropdownHeader(title = 'Choose...') {
    const container = document.createElement('div');
    const current = document.createElement('div');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const iconSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path',
    );

    current.textContent = title;
    icon.classList.add(`${classPrefix}__icon`);
    current.classList.add(`${classPrefix}__current`);
    container.classList.add(`${classPrefix}__header`);

    icon.setAttributeNS(null, 'viewBox', '0 0 24 24');
    icon.setAttributeNS(null, 'width', '24px');
    icon.setAttributeNS(null, 'height', '24px');
    iconSvgPath.setAttributeNS(null, 'd', 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z');
    iconSvgPath.style.setProperty('fill', '#ffffff');

    icon.append(iconSvgPath);
    container.append(current);
    container.append(icon);

    return {
      container,
      current,
    };
  }

  /**
   * Hide option
   * @return {void}
   */
  function hideDropdown() {
    dropdown.classList.remove('is-active');
  }

  /**
   * Pushing the changes to the original select
   * @param {string} value
   * @return {boolean}
   */
  function changeSelectOption(value) {
    if (value.length <= 0) return false;

    const selectOptions = select.options;
    for (let i = 0; i < selectOptions.length; i++) {
      const option = selectOptions[i];
      const optionVal = option.getAttribute('value');

      if (optionVal === value) {
        select.selectedIndex = i;
        select.dispatchEvent(new Event('change'));
        return true;
      }
    }

    // Val not founded
    return false;
  }

  // Изменяем значение кастомного select'a
  /**
   * Change custom select option
   * @param {string} value
   * @param {Object} option
   * @return {boolean}
   */
  function changeDropdownOption(value, option) {
    if (value.length <= 0 || option.length <= 0) return false;

    // Ищем опции среди выбранных и снимаем с них отметку
    dropdown.querySelectorAll(`.${classPrefix}__option.selected`).
        forEach((el) => {
          el.removeAttribute('aria-selected');
          el.classList.remove('selected');
        });

    // Помечаем опцию, как выбранную
    option.setAttribute('aria-selected', 'true');
    option.classList.add('selected');

    // Меняем отображаемый текст select'a (шапки)
    dropdownHeader.current.textContent = option.textContent;

    return true;
  }

  // Функция преобразовывает и вызывает все необходимое, чтобы сменить выбор select'a
  /**
   * Call to change custom and original select
   * @param {Object} option
   * @return {void}
   */
  function changeOption(option) {
    const value = option.dataset.value;
    const selectResult = changeSelectOption(value);
    const dropdownResult = changeDropdownOption(value, option);
    // В случае ошибки выдаем ее в консоль
    if (!selectResult || !dropdownResult) {
      console.error('Error while trying to change select or dropdown value');
    }

    // Скрываем пункты в любом случае
    hideDropdown();
  }

  // Создаем опции для кастомного и скрытого (оригинального) select'ов
  for (const i in Object.keys(list)) {
    const option = document.createElement('option');
    const dropdownOption = document.createElement('div');
    const key = Object.keys(list)[i];
    const value = list[Object.keys(list)[i]];

    option.value = key;
    option.textContent = value;

    dropdownOption.classList.add(`${classPrefix}__option`);
    dropdownOption.dataset.value = key;
    dropdownOption.textContent = value;

    dropdownOptions.append(dropdownOption);
    select.append(option);

    // Если передан параметр 'select' и он равен индексу, меняем выбранное значение
    if (typeof selected !== 'undefined') {
      (i === selected.toString()) && changeOption(dropdownOption);
    }

    // Меняем значение при выборе опции
    dropdownOption.onclick = () => changeOption(dropdownOption);
  }

  // Настраиваем события
  // При клике на заголовок select'a
  dropdownHeader.container.onclick = () => dropdown.classList.toggle(
      'is-active');

  // Если был нажат 'Escape', скрываем селект
  document.body.onkeydown = (e) => (e.key === 'Escape') ? hideDropdown() : true;

  // Если фокус с select'a снят
  dropdown.onblur = () => hideDropdown();

  // Вкладываем элементы
  dropdown.prepend(dropdownHeader.container);
  dropdown.append(dropdownOptions);

  container.append(select);
  container.append(dropdown);
}
