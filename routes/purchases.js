const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { purchases, tickets } = require('../data/sampleData');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's purchases (authenticated)
router.get('/my-purchases', authenticateToken, (req, res) => {
  try {
    const userPurchases = purchases
      .filter(purchase => purchase.buyer_id === req.user.id)
      .map(purchase => {
        const ticket = tickets.find(t => t.id === purchase.ticket_id);
        return {
          ...purchase,
          ticket: ticket || null
        };
      });

    res.json({ purchases: userPurchases });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new purchase (authenticated)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { ticket_id, quantity } = req.body;

    // Validation
    if (!ticket_id || !quantity) {
      return res.status(400).json({ error: 'Ticket ID and quantity are required' });
    }

    if (parseInt(quantity) <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    // Find ticket
    const ticketIndex = tickets.findIndex(t => t.id === ticket_id);
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = tickets[ticketIndex];

    // Check if ticket is available
    if (ticket.status !== 'active') {
      return res.status(400).json({ error: 'Ticket is not available for purchase' });
    }

    // Check if enough tickets are available
    if (ticket.available_quantity < parseInt(quantity)) {
      return res.status(400).json({ 
        error: `Only ${ticket.available_quantity} tickets available` 
      });
    }

    // Check if user is not buying their own ticket
    if (ticket.seller_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot purchase your own tickets' });
    }

    // Calculate total amount
    const totalAmount = ticket.price * parseInt(quantity);

    // Create purchase
    const newPurchase = {
      id: uuidv4(),
      ticket_id,
      buyer_id: req.user.id,
      quantity: parseInt(quantity),
      total_amount: totalAmount,
      purchase_date: new Date().toISOString(),
      status: 'confirmed'
    };

    // Update ticket quantities
    tickets[ticketIndex].available_quantity -= parseInt(quantity);
    tickets[ticketIndex].sold_quantity += parseInt(quantity);
    
    // Update ticket status if sold out
    if (tickets[ticketIndex].available_quantity === 0) {
      tickets[ticketIndex].status = 'sold_out';
    }

    tickets[ticketIndex].updated_at = new Date().toISOString();

    // Add purchase to array
    purchases.push(newPurchase);

    // Return purchase with ticket details
    const purchaseWithTicket = {
      ...newPurchase,
      ticket: tickets[ticketIndex]
    };

    res.status(201).json({
      message: 'Purchase completed successfully',
      purchase: purchaseWithTicket
    });
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get purchase by ID (authenticated)
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const purchase = purchases.find(p => p.id === req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Check if user owns the purchase
    if (purchase.buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only view your own purchases' });
    }

    // Get ticket details
    const ticket = tickets.find(t => t.id === purchase.ticket_id);
    const purchaseWithTicket = {
      ...purchase,
      ticket: ticket || null
    };

    res.json({ purchase: purchaseWithTicket });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel purchase (authenticated, within 24 hours)
router.put('/:id/cancel', authenticateToken, (req, res) => {
  try {
    const purchaseId = req.params.id;
    const purchaseIndex = purchases.findIndex(p => p.id === purchaseId);

    if (purchaseIndex === -1) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const purchase = purchases[purchaseIndex];

    // Check if user owns the purchase
    if (purchase.buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only cancel your own purchases' });
    }

    // Check if purchase can be cancelled (within 24 hours and not already cancelled)
    const purchaseDate = new Date(purchase.purchase_date);
    const now = new Date();
    const hoursDiff = (now - purchaseDate) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return res.status(400).json({ error: 'Purchase can only be cancelled within 24 hours' });
    }

    if (purchase.status === 'cancelled') {
      return res.status(400).json({ error: 'Purchase is already cancelled' });
    }

    // Update purchase status
    purchases[purchaseIndex].status = 'cancelled';

    // Restore ticket quantities
    const ticketIndex = tickets.findIndex(t => t.id === purchase.ticket_id);
    if (ticketIndex !== -1) {
      tickets[ticketIndex].available_quantity += purchase.quantity;
      tickets[ticketIndex].sold_quantity -= purchase.quantity;
      
      // Update ticket status if it was sold out
      if (tickets[ticketIndex].status === 'sold_out') {
        tickets[ticketIndex].status = 'active';
      }
      
      tickets[ticketIndex].updated_at = new Date().toISOString();
    }

    res.json({
      message: 'Purchase cancelled successfully',
      purchase: purchases[purchaseIndex]
    });
  } catch (error) {
    console.error('Cancel purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales for seller (authenticated)
router.get('/sales/my-sales', authenticateToken, (req, res) => {
  try {
    // Get user's tickets
    const userTickets = tickets.filter(ticket => ticket.seller_id === req.user.id);
    const userTicketIds = userTickets.map(ticket => ticket.id);

    // Get purchases for user's tickets
    const sales = purchases
      .filter(purchase => userTicketIds.includes(purchase.ticket_id))
      .map(purchase => {
        const ticket = tickets.find(t => t.id === purchase.ticket_id);
        return {
          ...purchase,
          ticket: ticket || null
        };
      });

    res.json({ sales });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;