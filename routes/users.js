const express = require('express');
const { users, tickets, purchases } = require('../data/sampleData');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user statistics (authenticated)
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's tickets
    const userTickets = tickets.filter(ticket => ticket.seller_id === userId);
    
    // Get user's purchases
    const userPurchases = purchases.filter(purchase => purchase.buyer_id === userId);
    
    // Get sales (purchases of user's tickets)
    const userTicketIds = userTickets.map(ticket => ticket.id);
    const sales = purchases.filter(purchase => userTicketIds.includes(purchase.ticket_id));

    // Calculate statistics
    const stats = {
      // Selling stats
      totalTicketsListed: userTickets.length,
      activeTickets: userTickets.filter(t => t.status === 'active').length,
      soldOutTickets: userTickets.filter(t => t.status === 'sold_out').length,
      totalTicketsSold: userTickets.reduce((sum, ticket) => sum + ticket.sold_quantity, 0),
      totalRevenue: sales.reduce((sum, sale) => sum + sale.total_amount, 0),
      totalViews: userTickets.reduce((sum, ticket) => sum + (ticket.views || 0), 0),
      totalInquiries: userTickets.reduce((sum, ticket) => sum + (ticket.inquiries || 0), 0),
      
      // Buying stats
      totalPurchases: userPurchases.length,
      totalSpent: userPurchases.reduce((sum, purchase) => sum + purchase.total_amount, 0),
      confirmedPurchases: userPurchases.filter(p => p.status === 'confirmed').length,
      pendingPurchases: userPurchases.filter(p => p.status === 'pending').length,
      cancelledPurchases: userPurchases.filter(p => p.status === 'cancelled').length,
      
      // Recent activity
      recentSales: sales
        .sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))
        .slice(0, 5)
        .map(sale => ({
          ...sale,
          ticket: tickets.find(t => t.id === sale.ticket_id)
        })),
      
      recentPurchases: userPurchases
        .sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))
        .slice(0, 5)
        .map(purchase => ({
          ...purchase,
          ticket: tickets.find(t => t.id === purchase.ticket_id)
        }))
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID (public, limited info)
router.get('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return limited public info
    const publicUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      created_at: user.created_at
    };

    // Get user's active tickets count
    const activeTicketsCount = tickets.filter(
      ticket => ticket.seller_id === user.id && ticket.status === 'active'
    ).length;

    res.json({ 
      user: publicUser,
      activeTicketsCount
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search users (public, limited info)
router.get('/', (req, res) => {
  try {
    const { search, limit = 10 } = req.query;

    let filteredUsers = users;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchLower)
      );
    }

    // Return limited public info
    const publicUsers = filteredUsers
      .slice(0, parseInt(limit))
      .map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        created_at: user.created_at
      }));

    res.json({ users: publicUsers });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;