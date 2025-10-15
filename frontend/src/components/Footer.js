import React from 'react';
import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16" data-testid="site-footer">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Pill className="h-5 w-5 text-primary" />
              <span className="font-display font-semibold">Wellnest Pharmacy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted online pharmacy for medicines, wellness, and rapid prescription refills.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog?category=rx-medicines" className="text-muted-foreground hover:text-foreground">Rx Medicines</Link></li>
              <li><Link to="/catalog?category=wellness" className="text-muted-foreground hover:text-foreground">Wellness</Link></li>
              <li><Link to="/catalog?category=devices" className="text-muted-foreground hover:text-foreground">Medical Devices</Link></li>
              <li><Link to="/catalog?category=baby-care" className="text-muted-foreground hover:text-foreground">Baby Care</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Shipping Info</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Returns</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Wellnest Pharmacy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;