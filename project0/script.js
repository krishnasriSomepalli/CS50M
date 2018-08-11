const classNames = {
	TODO_ITEM: 'todo-container',
	TODO_CHECKBOX: 'todo-checkbox',
	TODO_TEXT: 'todo-text',
	TODO_DELETE: 'todo-delete',
}

const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

const trashcanIcon = "http://icons.iconarchive.com/icons/icons8/ios7/512/Industry-Trash-2-icon.png"

function newTodo() {
	let text = prompt("Enter the task:")
	
	let itemCount = parseInt(itemCountSpan.innerHTML)
	let uncheckedCount = parseInt(uncheckedCountSpan.innerHTML)

	let todo_container = document.createElement("div")
	todo_container.setAttribute("class", classNames.TODO_ITEM)

	let todo_checkbox = document.createElement("input")
	todo_checkbox.setAttribute("type", "checkbox")
	todo_checkbox.setAttribute("class", classNames.TODO_CHECKBOX)
	todo_checkbox.setAttribute("onchange", "updateUncheckedCount(event.target)")

	let todo_text = document.createElement("p")
	todo_text.setAttribute("class", classNames.TODO_TEXT)
	todo_text.innerHTML = text
	
	let todo_delete = document.createElement("img")
	todo_delete.setAttribute("class", classNames.TODO_DELETE)
	todo_delete.setAttribute("onclick", "deleteTodo(event.target)")
	todo_delete.setAttribute("src", trashcanIcon)

	todo_container.appendChild(todo_checkbox)
	todo_container.appendChild(todo_text)
	todo_container.appendChild(todo_delete)

	itemCount = itemCount + 1
	uncheckedCount = uncheckedCount + 1
	uncheckedCountSpan.innerHTML = uncheckedCount
	itemCountSpan.innerHTML = itemCount
	list.appendChild(todo_container)
}

function updateUncheckedCount(element) {
	let uncheckedCount = parseInt(uncheckedCountSpan.innerHTML)
	if(element.checked)
		uncheckedCount = uncheckedCount - 1
	else
		uncheckedCount = uncheckedCount + 1
	uncheckedCountSpan.innerHTML = uncheckedCount
}

function deleteTodo(element) {
	let itemCount = parseInt(itemCountSpan.innerHTML)
	let uncheckedCount = parseInt(uncheckedCountSpan.innerHTML)
	
	itemCount = itemCount - 1
	if(element.parentElement.children[0].checked === false) {
		uncheckedCount = uncheckedCount - 1
		uncheckedCountSpan.innerHTML = uncheckedCount
	}
	itemCountSpan.innerHTML = itemCount
	list.removeChild(element.parentElement)
}