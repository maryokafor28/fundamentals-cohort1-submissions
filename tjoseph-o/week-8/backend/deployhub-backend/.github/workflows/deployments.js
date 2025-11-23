import express from 'express';
import logger from '../config/logger.js';

const router = express.Router();


const deployments = [
  {
    id: '1',
    service: 'deployhub-backend',
    version: '1.0.0',
    status: 'success',
    environment: 'production',
    deployedAt: new Date(Date.now() - 3600000).toISOString(),
    deployedBy: 'GitHub Actions',
    duration: '45s',
    commit: 'abc123'
  },
  {
    id: '2',
    service: 'deployhub-frontend',
    version: '1.0.0',
    status: 'success',
    environment: 'production',
    deployedAt: new Date(Date.now() - 7200000).toISOString(),
    deployedBy: 'GitHub Actions',
    duration: '32s',
    commit: 'def456'
  }
];


router.get('/', (req, res) => {
  logger.info('Fetching all deployments');
  
  const { service, environment, status } = req.query;
  
  let filtered = [...deployments];
  
  if (service) {
    filtered = filtered.filter(d => d.service === service);
  }
  
  if (environment) {
    filtered = filtered.filter(d => d.environment === environment);
  }
  
  if (status) {
    filtered = filtered.filter(d => d.status === status);
  }
  
  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});


router.get('/:id', (req, res) => {
  const { id } = req.params;
  const deployment = deployments.find(d => d.id === id);
  
  if (!deployment) {
    logger.warn(`Deployment not found: ${id}`);
    return res.status(404).json({
      success: false,
      message: 'Deployment not found'
    });
  }
  
  logger.info(`Fetching deployment: ${id}`);
  
  res.status(200).json({
    success: true,
    data: deployment
  });
});


router.post('/', (req, res) => {
  const { service, version, environment, commit, deployedBy } = req.body;
  
  if (!service || !version || !environment) {
    logger.warn('Invalid deployment data received');
    return res.status(400).json({
      success: false,
      message: 'Service, version, and environment are required'
    });
  }
  
  const newDeployment = {
    id: (deployments.length + 1).toString(),
    service,
    version,
    status: 'in_progress',
    environment,
    deployedAt: new Date().toISOString(),
    deployedBy: deployedBy || 'Manual',
    commit: commit || 'unknown',
    duration: 'calculating...'
  };
  
  deployments.unshift(newDeployment);
  
  logger.info('New deployment created', newDeployment);
  
  res.status(201).json({
    success: true,
    data: newDeployment
  });
});


router.get('/latest/:service', (req, res) => {
  const { service } = req.params;
  
  const serviceDeployments = deployments
    .filter(d => d.service === service)
    .sort((a, b) => new Date(b.deployedAt) - new Date(a.deployedAt));
  
  if (serviceDeployments.length === 0) {
    logger.warn(`No deployments found for service: ${service}`);
    return res.status(404).json({
      success: false,
      message: `No deployments found for service: ${service}`
    });
  }
  
  logger.info(`Fetching latest deployment for service: ${service}`);
  
  res.status(200).json({
    success: true,
    data: serviceDeployments[0]
  });
});

export default router;