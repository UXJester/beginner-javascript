const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// we need an array to hold our state
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  // if empty don't submit
  if (!name) return;
  const item = {
    name,
    id: Date.now(),
    complete: false,
  };
  // push items into state
  items.push(item);
  // clear the form
  e.target.reset();
  // fire custom event that listens for updates
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
  const html = items
    .map(
      (item) => `<li class="shopping-item">
      <input
        value="${item.id}"
        type="checkbox"
        ${item.complete && 'checked'}
      />
        <span className="itemName">${item.name}</span>
        <button
          aria-label=Remove ${item.name}"
          value="${item.id}"
        >&times;</button>
      </li>`
    )
    .join('');
  list.innerHTML = html;
}

function mirrorToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
  console.info('Checking LS');
  // pull items from LS
  const lsItems = JSON.parse(localStorage.getItem('items'));
  if (lsItems !== null) {
    console.info('Restoring items found in LS');
    // items = lsItems;
    // lsItems.forEach(item => items.push(item));
    // items.push(lsItems[0], lsItems[1]);
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  console.log('Deleting', id);
  // update items array without deleted item
  items = items.filter((item) => item.id !== id);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
  console.log('Marking as complete', id);
  const itemRef = items.find((item) => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// Event Delegation: Listen for click on list, delegate the click to button
list.addEventListener('click', function (e) {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(parseInt(id));
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(parseInt(id));
  }
});

restoreFromLocalStorage();
