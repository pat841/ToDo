/*
 * ToDo JS
 * Pat Herlihy
*/

// Show success message
function showSuccess (message)
{
	// Set message in div
	$('#successMessage span#message').text(message);

	// Show div
	$('#successMessage').removeClass('hide');

	return false;
}

// Show error message
function showError (message)
{
	// Set message in div
	$('#errorMessage span#message').text(message);

	// Show div
	$('#errorMessage').removeClass('hide');

	return false;
}

// Stores a task locally
function storeTask (task)
{
	var store = localStorage.getItem('toDoTasks');

	// Storage empty
	if (store == null)
	{
		tasks = [];
		tasks.push(task);
		localStorage.setItem('toDoTasks', JSON.stringify(tasks));
	}
	else
	{
		// Append to tasks
		var tasks = JSON.parse(store);
		tasks.push(task);
		localStorage.setItem('toDoTasks', JSON.stringify(tasks));
	}

	return false;
}

// Adds a task to the task list
function addTask (task, store)
{
	var priority = (task.priority == 2) ? ' list-group-item-danger' : ((task.priority == 1) ? ' list-group-item-warning' : '');
	var complete = (task.complete) ? ' checked' : '';

	// Remove no task message if needed
	if ($('#notasks').length)
	{
		$('#notasks').remove();
	}

	$('#tasks').append('<li id="' + task.id + '" class="list-group-item' + priority + '">' + task.title + '<label class="pull-right"><input onclick="completeTask(' + task.id + ');" type="checkbox"' + complete + '></label></li>');

	// Store task locally
	if (store)
	{
		storeTask(task);
	}

	return false;
}

// Gets form data and adds task
function submitTask ()
{
	// Get form data
	var data = $('#newtask').serializeArray();
    var task = {};
    
    // Store in object
    $.each(data, function()
    {
        task[this.name] = this.value || '';
    });

    task.id = new Date().getTime();
    task.complete = false;

    // Validate
    var valid = validateTask(task);

    if (valid === true)
    {
	    addTask(task, true);

	    showSuccess("Task added successfully.");
	}
	else
	{
		showError(valid);
	}

	// Reset form
	$('#newtask')[0].reset();
    
    return false;
}

// Validate task
function validateTask (task)
{
	if (task.title === '')
	{
		return 'You need to enter a task title!';
	}
	if (task.priority === '')
	{
		return 'You need to select a priortiy!';
	}

	return true;
}

// Populate tasks
function populateTasks ()
{
	var store = localStorage.getItem('toDoTasks');

	// Nothing in local store
	if (store == null)
	{
		$('#tasks').append('<li class="list-group-item" id="notasks">There are currently no tasks.</li>');
	}
	else
	{
		var tasks = JSON.parse(store);

		// Display tasks
		$.each(tasks, function()
	    {
	        addTask(this, false);
	    });
	}

	return false;
}

// Resets the stored tasks
function resetTasks ()
{
	// Remove storage
	localStorage.removeItem('toDoTasks');

	// Remove shown tasks
	$('#tasks li').remove();

	populateTasks();

	showSuccess("The tasks have been reset.");

	return false;
}

// Complete task
function completeTask (id)
{
	var store = localStorage.getItem('toDoTasks');

	if (store != null)
	{
		var tasks = JSON.parse(store);

		// Find the task in the store and update complete
		$.each(tasks, function()
	    {
	        if (this.id == id)
	        {
	        	this.complete = (this.complete) ? false : true;
	        }
	    });

		// Update local storage
	    localStorage.setItem('toDoTasks', JSON.stringify(tasks));
	}

	$('#' + id + ' input').attr('checked');

	return false;
}

// Sorts the tasks via priority
function sortTasks (priority)
{
	// Remove sort if active
	var sort = $('#sort_' + priority);
	priority = (sort.attr('active')) ? -1 : priority;

	// Remove attr if needed
	if (sort.attr('active'))
	{
		sort.removeAttr('active');
		sort.css('font-weight', 'normal');
	}
	else
	{
		sort.attr('active', true);
		sort.css('font-weight', 'bold');
	}

	// Hide tasks
	$('#tasks li').each(function()
	{
		var item = $(this);

		// Show all
		if (priority == -1)
		{
			item.show();
		}
		// Only show high
		else if (priority == 2)
		{
			if (!item.hasClass('list-group-item-danger'))
			{
				item.hide();
			}
		}
		// Only show med
		else if (priority == 1)
		{
			if (!item.hasClass('list-group-item-warning'))
			{
				item.hide();
			}
		}
		// Only show normal
		else
		{
			if (item.hasClass('list-group-item-danger') || item.hasClass('list-group-item-warning'))
			{
				item.hide();
			}
		}
	});
}

$(document).on('ready', function()
{
	// Catch form submit
	$("#newtask").submit(function(e)
	{
		// Prevent form from submitting
		e.preventDefault(e);

		// Capture inputs
		submitTask();
	});

	// Populate tasks from storage
	populateTasks();
});