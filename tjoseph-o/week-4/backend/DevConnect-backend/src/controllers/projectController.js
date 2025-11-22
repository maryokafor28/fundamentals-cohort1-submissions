const Project = require('../models/Project');

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};


const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'userId',
      'username avatar bio'
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};


const createProject = async (req, res, next) => {
  try {
    const { title, description, techStack, githubLink, liveLink } = req.body;

    const project = await Project.create({
      title,
      description,
      techStack,
      githubLink,
      liveLink,
      userId: req.user._id
    });

    const populatedProject = await Project.findById(project._id).populate(
      'userId',
      'username avatar'
    );

    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    next(error);
  }
};


const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('userId', 'username avatar');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};


const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};