const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Sample Users (passwords are hashed)
const users = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    password: bcrypt.hashSync('password123', 10), // password123
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    password: bcrypt.hashSync('password123', 10), // password123
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    created_at: '2024-01-02T14:30:00Z',
    updated_at: '2024-01-02T14:30:00Z'
  },
  {
    id: 'user-3',
    email: 'mike.johnson@example.com',
    name: 'Mike Johnson',
    password: bcrypt.hashSync('password123', 10), // password123
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    created_at: '2024-01-03T09:15:00Z',
    updated_at: '2024-01-03T09:15:00Z'
  },
  {
    id: 'user-4',
    email: 'sarah.wilson@example.com',
    name: 'Sarah Wilson',
    password: bcrypt.hashSync('password123', 10), // password123
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    created_at: '2024-01-04T16:45:00Z',
    updated_at: '2024-01-04T16:45:00Z'
  },
  {
    id: 'user-5',
    email: 'alex.brown@example.com',
    name: 'Alex Brown',
    password: bcrypt.hashSync('password123', 10), // password123
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-05T11:20:00Z'
  }
];

// Sample Tickets
const tickets = [
  {
    id: 'ticket-1',
    title: 'World Cup Cricket Final 2024',
    description: 'Experience the ultimate cricket showdown at the World Cup Final. Premium seats with excellent view of the pitch and complimentary refreshments.',
    category: 'cricket',
    type: 'premium',
    price: 299.99,
    expiry_time: '2024-12-31T18:00:00Z',
    seller_id: 'user-1',
    seller_name: 'John Doe',
    image_url: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Melbourne Cricket Ground, Australia',
    available_quantity: 45,
    sold_quantity: 25,
    status: 'active',
    views: 1250,
    inquiries: 45,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 'ticket-2',
    title: 'Taylor Swift Eras Tour - VIP Experience',
    description: 'The most anticipated concert of the year! Join Taylor Swift on her incredible Eras Tour with VIP access, meet & greet, and exclusive merchandise.',
    category: 'concert',
    type: 'vip',
    price: 450.00,
    expiry_time: '2024-11-20T20:00:00Z',
    seller_id: 'user-2',
    seller_name: 'Jane Smith',
    image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Madison Square Garden, New York',
    available_quantity: 15,
    sold_quantity: 85,
    status: 'active',
    views: 2890,
    inquiries: 120,
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-25T09:15:00Z'
  },
  {
    id: 'ticket-3',
    title: 'Broadway Musical - Hamilton',
    description: 'Experience the revolutionary musical that changed Broadway forever. Premium orchestra seats with perfect acoustics and sightlines.',
    category: 'theater',
    type: 'premium',
    price: 180.00,
    expiry_time: '2024-10-15T19:30:00Z',
    seller_id: 'user-3',
    seller_name: 'Mike Johnson',
    image_url: 'https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Richard Rodgers Theatre, New York',
    available_quantity: 20,
    sold_quantity: 15,
    status: 'active',
    views: 890,
    inquiries: 32,
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  },
  {
    id: 'ticket-4',
    title: 'NBA Finals Game 7 - Courtside',
    description: 'Witness history in the making! Game 7 of the NBA Finals with exclusive courtside experience and post-game player meet opportunity.',
    category: 'sports',
    type: 'vip',
    price: 899.99,
    expiry_time: '2024-06-20T21:00:00Z',
    seller_id: 'user-4',
    seller_name: 'Sarah Wilson',
    image_url: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Crypto.com Arena, Los Angeles',
    available_quantity: 2,
    sold_quantity: 18,
    status: 'active',
    views: 3450,
    inquiries: 89,
    created_at: '2024-01-08T16:45:00Z',
    updated_at: '2024-01-22T11:20:00Z'
  },
  {
    id: 'ticket-5',
    title: 'Comedy Night with Dave Chappelle',
    description: 'An evening of stand-up comedy with the legendary Dave Chappelle. Intimate venue with premium seating and complimentary drinks.',
    category: 'comedy',
    type: 'premium',
    price: 125.00,
    expiry_time: '2024-09-10T20:00:00Z',
    seller_id: 'user-5',
    seller_name: 'Alex Brown',
    image_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Comedy Cellar, New York',
    available_quantity: 30,
    sold_quantity: 20,
    status: 'active',
    views: 675,
    inquiries: 28,
    created_at: '2024-01-20T13:00:00Z',
    updated_at: '2024-01-24T10:30:00Z'
  },
  {
    id: 'ticket-6',
    title: 'Coachella Music Festival - Weekend Pass',
    description: 'Three-day weekend pass to the most iconic music festival. Access to all stages, VIP areas, and exclusive artist meet & greets.',
    category: 'concert',
    type: 'vip',
    price: 650.00,
    expiry_time: '2024-04-15T12:00:00Z',
    seller_id: 'user-1',
    seller_name: 'John Doe',
    image_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Empire Polo Club, California',
    available_quantity: 8,
    sold_quantity: 42,
    status: 'active',
    views: 2100,
    inquiries: 78,
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-28T15:20:00Z'
  },
  {
    id: 'ticket-7',
    title: 'Super Bowl LVIII - Lower Bowl',
    description: 'The biggest game in American football! Lower bowl seats with amazing field view and access to exclusive pre-game events.',
    category: 'sports',
    type: 'premium',
    price: 1200.00,
    expiry_time: '2024-02-11T18:30:00Z',
    seller_id: 'user-2',
    seller_name: 'Jane Smith',
    image_url: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Allegiant Stadium, Las Vegas',
    available_quantity: 0,
    sold_quantity: 25,
    status: 'sold_out',
    views: 4200,
    inquiries: 156,
    created_at: '2024-01-01T12:00:00Z',
    updated_at: '2024-01-30T18:45:00Z'
  },
  {
    id: 'ticket-8',
    title: 'Shakespeare in the Park - Hamlet',
    description: 'Classic Shakespeare performed under the stars in Central Park. Bring a blanket and enjoy this timeless tragedy in a magical setting.',
    category: 'theater',
    type: 'general',
    price: 45.00,
    expiry_time: '2024-08-25T19:00:00Z',
    seller_id: 'user-3',
    seller_name: 'Mike Johnson',
    image_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Delacorte Theater, Central Park',
    available_quantity: 75,
    sold_quantity: 125,
    status: 'active',
    views: 420,
    inquiries: 18,
    created_at: '2024-01-18T14:15:00Z',
    updated_at: '2024-01-26T09:30:00Z'
  }
];

// Sample Purchases
const purchases = [
  {
    id: 'purchase-1',
    ticket_id: 'ticket-1',
    buyer_id: 'user-2',
    quantity: 2,
    total_amount: 599.98,
    purchase_date: '2024-01-20T10:30:00Z',
    status: 'confirmed'
  },
  {
    id: 'purchase-2',
    ticket_id: 'ticket-2',
    buyer_id: 'user-3',
    quantity: 1,
    total_amount: 450.00,
    purchase_date: '2024-01-18T14:15:00Z',
    status: 'confirmed'
  },
  {
    id: 'purchase-3',
    ticket_id: 'ticket-3',
    buyer_id: 'user-4',
    quantity: 3,
    total_amount: 540.00,
    purchase_date: '2024-01-15T09:45:00Z',
    status: 'confirmed'
  },
  {
    id: 'purchase-4',
    ticket_id: 'ticket-4',
    buyer_id: 'user-5',
    quantity: 1,
    total_amount: 899.99,
    purchase_date: '2024-01-22T16:20:00Z',
    status: 'pending'
  },
  {
    id: 'purchase-5',
    ticket_id: 'ticket-5',
    buyer_id: 'user-1',
    quantity: 2,
    total_amount: 250.00,
    purchase_date: '2024-01-25T11:10:00Z',
    status: 'confirmed'
  }
];

module.exports = {
  users,
  tickets,
  purchases
};