'use strict'

window.onload = () => {
    const itemsContainer = document.getElementById('items');
    const newElementField = document.getElementById('new_item');
    let globalID = 0;

    // CREATING

    const addButton = document.getElementById('add');
    
    addButton.onclick = addItem;
    newElementField.addEventListener("keydown", (event)=> {
        if (event.key === "Enter") { 
            addItem();
        }
    });

    function addItem() {
        if (newElementField.value == '') {
            alert('Поле не може бути порожнім)');
            return;
        }

        const newItemElement = document.createElement('div');
        newItemElement.classList.add('item');
        newItemElement.id = 'item' + globalID;
        globalID++;

        const itemName = document.createElement('div');
        itemName.innerText = newElementField.value;
        itemName.classList.add('itemName');

        newElementField.value = "";

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete_button');
        deleteButton.innerHTML = 'x';

        deleteButton.onclick = () => {
            newItemElement.remove();
        }

        newItemElement.appendChild(itemName);
        newItemElement.appendChild(deleteButton);
        itemsContainer.appendChild(newItemElement);
    }

    // CHOOSING

    const startButton = document.getElementById('start');
    startButton.onclick = () => {
        const items = document.getElementsByClassName('itemName');

        if (items.length < 2) {
            alert('Має бути мінімум 2 елементи для порівняння)');
            return;
        }

        const options = {};
        
        Array.from(items).forEach(element => {
            options[element.innerText] = 0;
        });

        document.getElementById('prep_container').remove();

        const pairs = createPairs(Object.keys(options));

        const optionsContainer = document.getElementById('options');

        async function processPairs(pairs) {
            for (const pair of pairs) {
                const firstEntry = createOptionElement(pair[0]);
                const secondEntry = createOptionElement(pair[1]);

                const vsElement = document.createElement('div');
                vsElement.classList.add('vs');
                vsElement.innerText = 'VS';

                optionsContainer.appendChild(firstEntry);
                optionsContainer.appendChild(vsElement);
                optionsContainer.appendChild(secondEntry);

                // чекаємо, поки користувач не клікне на один із елементів
                const chosen = await new Promise(resolve => {
                    firstEntry.onclick = () => resolve(pair[0]);
                    secondEntry.onclick = () => resolve(pair[1]);
                });

                options[chosen]++;

                // прибираємо елементи після вибору
                firstEntry.remove();
                secondEntry.remove();
                vsElement.remove();
            }
        }

        showHeader('choosing_header');
        processPairs(pairs).then(() => {
            const results = Object.fromEntries(
                Object.entries(options).sort((a, b) => b[1] - a[1])
            );

            hideHeader('choosing_header');
            showHeader('results_header');

            const resultsContainer = document.getElementById('results'); 
            let position = 1;

            for (let key in results) {
                const entry = document.createElement('div');
                entry.innerText = `${position}. ${key}`;
                entry.classList.add('item');
                entry.classList.add('result');

                position++;

                resultsContainer.appendChild(entry);
            }
        });        
    }

    function createOptionElement(name) {
        let option = document.createElement('div');
        option.classList.add('item');
        option.classList.add('option');
        option.innerText = name;
        option.id = name;

        return option;
    }

    function createPairs(elems) {
        const pairs = [];

        for (let i = 0; i < elems.length; i++) {
            for (let j = i + 1; j < elems.length; j++) {
                pairs.push([elems[i], elems[j]]);
            }
        }

        return pairs;
    }
}

function showHeader(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideHeader(id) {
    document.getElementById(id).classList.add('hidden');
}

