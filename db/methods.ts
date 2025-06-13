export const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

export const createTask = async (day, name, category) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({day: day,name:name, category:category}),
      });

      if (response.ok) {
        const task = await response.json();
        return task
      } else {
        const error = await response.json();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

export  const updateTask = async (name, checked, id) => {
  try {
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        checked:checked
      }),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      return updatedUser
    } else {
      const error = await response.json();
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const deleteTask = async (id) => {

  try {
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return true

    } else {
      const error = await response.json();
      return false
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

