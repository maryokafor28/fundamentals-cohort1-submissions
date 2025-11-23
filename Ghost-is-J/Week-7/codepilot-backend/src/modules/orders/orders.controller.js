const service = require('./orders.service');

exports.create = async (req, res) => {
    try {
        const order = await service.createOrder(req.body, req.user.id);
        res.status(201).json(order);
    }   catch (err) {
        res.status(400).json({error: err.message});
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await service.getOrderById(req.params.id);
        res.status(200).json(order);
    }   catch (err) {
        res.status(404).json({error: err.message});
    }
};