require('./setup');
const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcrypt');
const {
  getTasks,
  createTask,
  deleteTask,
  searchTasks,
  filterTasks
} = require('../controllers/taskController');

describe('Get Tasks', () => {
  let regularUser, adminUser, regularUserId, adminUserId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    
    regularUser = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });
    regularUserId = regularUser._id;

    adminUser = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    adminUserId = adminUser._id;

    // Create tasks for both users
    await Task.create({
      title: 'User Task 1',
      description: 'Task for regular user',
      userId: regularUserId
    });

    await Task.create({
      title: 'Admin Task 1',
      description: 'Task for admin',
      userId: adminUserId
    });
  });

  test('should return only user tasks for regular user', async () => {
    const req = {
      user: { userId: regularUserId.toString(), role: 'user' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        tasks: expect.any(Array)
      })
    );

    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(1);
    expect(response.tasks[0].title).toBe('User Task 1');
  });

  test('should return all tasks for admin', async () => {
    const req = {
      user: { userId: adminUserId.toString(), role: 'admin' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(2);
  });

  test('should return empty array if user has no tasks', async () => {
    const newUser = await User.create({
      email: 'newuser@example.com',
      password: 'hashed',
      role: 'user'
    });

    const req = {
      user: { userId: newUser._id.toString(), role: 'user' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(0);
  });
});

describe('Create Task', () => {
  let userId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    const user = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });
    userId = user._id;
  });

  test('should create task successfully', async () => {
    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        title: 'New Task',
        description: 'Task description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        task: expect.objectContaining({
          title: 'New Task',
          description: 'Task description'
        })
      })
    );

    const tasks = await Task.find({ userId });
    expect(tasks).toHaveLength(1);
  });

  test('should link task to authenticated user', async () => {
    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        title: 'User Task',
        description: 'Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createTask(req, res);

    const task = await Task.findOne({ title: 'User Task' });
    expect(task.userId.toString()).toBe(userId.toString());
  });

  test('should set default status to pending', async () => {
    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        title: 'Task',
        description: 'Description'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createTask(req, res);

    const task = await Task.findOne({ title: 'Task' });
    expect(task.status).toBe('pending');
  });
});

describe('Delete Task', () => {
  let regularUserId, adminUserId, taskId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    
    const regularUser = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });
    regularUserId = regularUser._id;

    const adminUser = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    adminUserId = adminUser._id;

    const task = await Task.create({
      title: 'Task to delete',
      description: 'Description',
      userId: regularUserId
    });
    taskId = task._id;
  });

  test('should allow admin to delete any task', async () => {
    const req = {
      user: { userId: adminUserId.toString(), role: 'admin' },
      params: { id: taskId.toString() }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining('deleted')
      })
    );

    const task = await Task.findById(taskId);
    expect(task).toBeNull();
  });

  test('should reject regular user from deleting tasks', async () => {
    const req = {
      user: { userId: regularUserId.toString(), role: 'user' },
      params: { id: taskId.toString() }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Forbidden')
      })
    );

    const task = await Task.findById(taskId);
    expect(task).not.toBeNull();
  });

  test('should return 404 if task not found', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    
    const req = {
      user: { userId: adminUserId.toString(), role: 'admin' },
      params: { id: fakeId }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('not found')
      })
    );
  });

  test('should reject invalid task ID', async () => {
    const req = {
      user: { userId: adminUserId.toString(), role: 'admin' },
      params: { id: 'invalid-id' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Invalid')
      })
    );
  });
});

describe('Search Tasks', () => {
  let userId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    const user = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });
    userId = user._id;

    // Create multiple tasks
    await Task.create([
      { title: 'Buy groceries', description: 'Milk and bread', userId },
      { title: 'Clean house', description: 'Living room and kitchen', userId },
      { title: 'Write report', description: 'Monthly sales report', userId },
      { title: 'Call client', description: 'Discuss project requirements', userId }
    ]);
  });

  test('should search tasks by keyword in title', async () => {
    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        keyword: 'Buy',
        page: 1,
        limit: 10
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await searchTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(1);
    expect(response.tasks[0].title).toBe('Buy groceries');
  });

  test('should search tasks by keyword in description', async () => {
    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        keyword: 'report',
        page: 1,
        limit: 10
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await searchTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.tasks.length).toBeGreaterThan(0);
  });

  test('should return paginated results', async () => {
    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        keyword: '',
        page: 1,
        limit: 2
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await searchTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(2);
    expect(response.pagination).toEqual(
      expect.objectContaining({
        currentPage: 1,
        totalPages: 2,
        totalItems: 4,
        limit: 2
      })
    );
  });

  test('should only return user own tasks', async () => {
    const otherUser = await User.create({
      email: 'other@example.com',
      password: 'hashed',
      role: 'user'
    });

    await Task.create({
      title: 'Other user task',
      description: 'Should not appear',
      userId: otherUser._id
    });

    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        keyword: '',
        page: 1,
        limit: 10
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await searchTasks(req, res);

    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(4);
    expect(response.tasks.every(t => t.userId.toString() === userId.toString())).toBe(true);
  });
});

describe('Filter Tasks', () => {
  let userId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    const user = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });
    userId = user._id;

    await Task.create([
      { title: 'Task 1', description: 'Desc 1', status: 'pending', userId },
      { title: 'Task 2', description: 'Desc 2', status: 'in-progress', userId },
      { title: 'Task 3', description: 'Desc 3', status: 'completed', userId },
      { title: 'Task 4', description: 'Desc 4', status: 'pending', userId }
    ]);
  });

  test('should filter tasks by status', async () => {
    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        status: 'pending',
        page: 1,
        limit: 10
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await filterTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(2);
    expect(response.tasks.every(t => t.status === 'pending')).toBe(true);
  });

  test('should return paginated filtered results', async () => {
    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        status: 'pending',
        page: 1,
        limit: 1
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await filterTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(1);
    expect(response.pagination).toEqual(
      expect.objectContaining({
        currentPage: 1,
        totalPages: 2,
        totalItems: 2
      })
    );
  });

  test('should filter only user own tasks', async () => {
    const otherUser = await User.create({
      email: 'other@example.com',
      password: 'hashed',
      role: 'user'
    });

    await Task.create({
      title: 'Other task',
      description: 'Other',
      status: 'pending',
      userId: otherUser._id
    });

    const req = {
      user: { userId: userId.toString(), role: 'user' },
      body: {
        status: 'pending',
        page: 1,
        limit: 10
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await filterTasks(req, res);

    const response = res.json.mock.calls[0][0];
    expect(response.tasks).toHaveLength(2);
    expect(response.tasks.every(t => t.userId.toString() === userId.toString())).toBe(true);
  });
});