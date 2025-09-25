const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { tickets, users } = require('../data/sampleData');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all tickets with filtering and pagination
router.get('/', (req, res) => {
  try {
    const {
      category,
      type,
      minPrice,
      maxPrice,
      location,
      search,
      status = 'active',
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    let filteredTickets = [...tickets];

    // Apply filters
    if (category && category !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
    }

    if (type && type !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.type === type);
    }

    if (minPrice) {
      filteredTickets = filteredTickets.filter(ticket => ticket.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredTickets = filteredTickets.filter(ticket => ticket.price <= parseFloat(maxPrice));
    }

    if (location) {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.location.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }

    // Sort tickets
    filteredTickets.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    res.json({
      tickets: paginatedTickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredTickets.length / parseInt(limit)),
        totalItems: filteredTickets.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single ticket by ID
router.get('/:id', (req, res) => {
  try {
    const ticket = tickets.find(t => t.id === req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Increment view count
    ticket.views = (ticket.views || 0) + 1;

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new ticket (authenticated)
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      price,
      expiry_time,
      location,
      available_quantity,
      image_url
    } = req.body;

    // Validation
    if (!title || !description || !category || !type || !price || !expiry_time || !location || !available_quantity) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    if (parseInt(available_quantity) <= 0) {
      return res.status(400).json({ error: 'Available quantity must be greater than 0' });
    }

    // Create new ticket
    const newTicket = {
      id: uuidv4(),
      title,
      description,
      category,
      type,
      price: parseFloat(price),
      expiry_time,
      seller_id: req.user.id,
      seller_name: req.user.name,
      image_url: image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
      location,
      available_quantity: parseInt(available_quantity),
      sold_quantity: 0,
      status: 'active',
      views: 0,
      inquiries: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to tickets array
    tickets.push(newTicket);

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket: newTicket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update ticket (authenticated, only by owner)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if user owns the ticket
    if (tickets[ticketIndex].seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own tickets' });
    }

    const {
      title,
      description,
      price,
      available_quantity,
      image_url,
      status
    } = req.body;

    // Update ticket fields
    if (title) tickets[ticketIndex].title = title;
    if (description) tickets[ticketIndex].description = description;
    if (price) tickets[ticketIndex].price = parseFloat(price);
    if (available_quantity) tickets[ticketIndex].available_quantity = parseInt(available_quantity);
    if (image_url) tickets[ticketIndex].image_url = image_url;
    if (status) tickets[ticketIndex].status = status;
    
    tickets[ticketIndex].updated_at = new Date().toISOString();

    res.json({
      message: 'Ticket updated successfully',
      ticket: tickets[ticketIndex]
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete ticket (authenticated, only by owner)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if user owns the ticket
    if (tickets[ticketIndex].seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own tickets' });
    }

    // Remove ticket from array
    tickets.splice(ticketIndex, 1);

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's tickets (authenticated)
router.get('/user/my-tickets', authenticateToken, (req, res) => {
  try {
    const userTickets = tickets.filter(ticket => ticket.seller_id === req.user.id);
    
    res.json({ tickets: userTickets });
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;