let API = "https://6809f5e51f1a52874cde8620.mockapi.io/tasks"
let tasksDiv = document.getElementById("tasks")
let editModal = document.getElementById("editModal")
let overlay = document.getElementById("overlay")
let editForm = document.getElementById("editForm")
let editStatus = document.getElementById("editStatus")
let editTitle = document.getElementById("editTitle")
let currentEditId = null;

// Fetch task
// Fetch tasks using async/await
async function fetchTasks() {
tasksDiv.innerHTML = '<div id="loader">Loading tasks...</div>';
try {
const response = await fetch(API);
const data = await response.json();
tasksDiv.innerHTML = '';
data.forEach(task => {
  const div = document.createElement('div');
  div.className = 'task';
  div.innerHTML = `
    <div class="task-info">
      <strong>${task.title}</strong> - <em>${task.status ? "Completed": "Pending"}</em>
    </div>
    <div class="task-actions">
      <button onclick="openEditModal('${task.id}', '${task.title}', '${task.status}')">Edit</button>
      <button onclick="deleteTask('${task.id}')">Delete</button>
    </div>
  `;
  tasksDiv.appendChild(div);
});
} catch (error) {
tasksDiv.innerHTML = '<div style="text-align:center;color:red;"> Failed to fetch tasks </div>';
}
}

// Open modal for editing task
function openEditModal(id, title, status) {
    currentEditId = id;
    editTitle.value = title;
    editStatus.value = status;
    editModal.classList.add('active');
    overlay.classList.add('active');
    console.log("Editing task ID:", currentEditId); 
}

function closeModal(){
    editModal.classList.remove("active")
    overlay.classList.remove('active');
}

editForm.addEventListener("submit", updateTask)

async function updateTask(e){
    e.preventDefault()
    try{
    let res = await fetch(`${API}/${currentEditId}`, {
        method: "PUT",
        headers:{"Content-Type": "application/json"},
        body : JSON.stringify({
            title:editTitle.value,
            status:editStatus.value
        })
    })

    if(!res.ok) throw new Error('Failed to update task')
        closeModal()
        fetchTasks()
    }catch(err){
       alert(err.message)
    }
}

async function deleteTask(id) {
if (confirm('Are you sure you want to delete this task?')) {
try {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  fetchTasks();
} catch (error) {
  alert(error.message);
}
}
}
fetchTasks()