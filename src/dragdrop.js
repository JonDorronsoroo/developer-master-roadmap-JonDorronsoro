export function loadScroller(){

window.addEventListener('load', () => {
    diapositivasScroller();
    
    document.querySelectorAll('.svg-card').forEach(card => {
        let offsetX, offsetY, isDragging = false;

        card.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - card.getBoundingClientRect().left;
            offsetY = e.clientY - card.getBoundingClientRect().top;
            isDragging = true;
            card.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            card.style.left = `${x}px`;
            card.style.top = `${y}px`;

            const text = card.querySelector('text').textContent;
            const item = document.querySelector(`#resource-svg-wrap svg g[data-group-id='${text.split(' ')[1]}]`);
            if (item) {
                item.style.left = `${x + 200}px`;
                item.style.top = `${y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            card.style.cursor = 'grab';
        });
    });
});

function diapositivasScroller() {
    const clickableGroups = document.querySelectorAll('#resource-svg-wrap svg g.clickable-group');
    const filmstripUl = document.getElementById('filmstrip-ul');
    const svgGroups = Array.from(clickableGroups);

    if (svgGroups.length > 0 && filmstripUl) {
        svgGroups.forEach((group, index) => {
            const bbox = group.getBBox();
            const centerX = bbox.x + bbox.width / 2;
            const centerY = bbox.y + bbox.height / 2;
            const viewBoxSize = 400;
            const newViewBoxX = centerX - viewBoxSize / 2;
            const newViewBoxY = centerY - viewBoxSize / 2;

            const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            newSvg.setAttribute("viewBox", `${newViewBoxX} ${newViewBoxY} ${viewBoxSize} ${viewBoxSize}`);
            newSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            newSvg.classList.add("svg-content");

            const clonedGroup = group.cloneNode(true);
            newSvg.appendChild(clonedGroup);

            const svgCardDiv = document.createElement("div");
            svgCardDiv.classList.add("svg-card");
            svgCardDiv.appendChild(newSvg);

            const newLi = document.createElement("li");
            newLi.classList.add("reorder-item");
            newLi.setAttribute("draggable", "true");
            newLi.dataset.index = index;

            const filmstripItemDiv = document.createElement("div");
            filmstripItemDiv.classList.add("filmstrip-item");
            filmstripItemDiv.appendChild(svgCardDiv);

            const cardNumberDiv = document.createElement("div");
            cardNumberDiv.classList.add("card-number");
            cardNumberDiv.textContent = index + 1;

            filmstripItemDiv.appendChild(cardNumberDiv);
            newLi.appendChild(filmstripItemDiv);

            filmstripUl.appendChild(newLi);

            
            addDragAndDropListeners(newLi, filmstripUl, svgGroups);
        });
    } else {
        console.log('No clickable groups or scrollable section found');
    }
}

function addDragAndDropListeners(card, filmstripUl, svgGroups) {
    let draggedItem = null;

    card.addEventListener('dragstart', (e) => {
        draggedItem = card;
        setTimeout(() => card.classList.add('dragging'), 0);
    });

    card.addEventListener('dragend', () => {
        setTimeout(() => {
            card.classList.remove('dragging');
            updateCardNumbers(filmstripUl);
            reorderSvgGroups(filmstripUl, svgGroups);
        }, 0);
        draggedItem = null;
    });

    card.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(filmstripUl, e.clientY);
        const draggingCard = document.querySelector('.dragging');
        if (afterElement == null) {
            filmstripUl.appendChild(draggingCard);
        } else {
            filmstripUl.insertBefore(draggingCard, afterElement);
        }
    });
}

function updateCardNumbers(filmstripUl) {
    const cards = filmstripUl.querySelectorAll('.filmstrip-item');
    cards.forEach((card, index) => {
        const cardNumberDiv = card.querySelector('.card-number');
        if (cardNumberDiv) {
            cardNumberDiv.textContent = index + 1;
        }
    });
}

function reorderSvgGroups(filmstripUl, svgGroups) {
    const reorderedIndexes = Array.from(filmstripUl.querySelectorAll('.reorder-item')).map(card => parseInt(card.dataset.index, 10));
    
    reorderedIndexes.forEach((originalIndex, newIndex) => {
        const group = svgGroups[originalIndex];
        const parent = group.parentNode;

        parent.appendChild(group);
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.reorder-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
}