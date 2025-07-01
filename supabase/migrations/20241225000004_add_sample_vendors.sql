-- Insert sample vendors for testing
INSERT INTO public.vendors (name, email, description, contact_person, phone, address, api_integration_type, commission_rate, status) VALUES
('Spa Paradise', 'info@spaparadise.com', 'Luxury spa and wellness center', 'Jane Smith', '+1-555-0123', '123 Wellness Street, Spa City', 'manual', 0.15, 'active'),
('Adventure Tours', 'contact@adventuretours.com', 'Outdoor adventure and sports experiences', 'Mike Johnson', '+1-555-0456', '456 Adventure Ave, Mountain View', 'manual', 0.12, 'active'),
('Culinary Delights', 'chef@culinarydelights.com', 'Fine dining and cooking experiences', 'Chef Maria', '+1-555-0789', '789 Gourmet Lane, Food City', 'api', 0.10, 'active'),
('Art Studio Collective', 'hello@artstudio.com', 'Creative workshops and art experiences', 'David Lee', '+1-555-0321', '321 Art Street, Creative District', 'manual', 0.18, 'active'),
('Tech Experience Hub', 'info@techhub.com', 'Technology and gaming experiences', 'Sarah Chen', '+1-555-0654', '654 Innovation Blvd, Tech Valley', 'api', 0.08, 'active'); 