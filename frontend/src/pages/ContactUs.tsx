import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useOrder } from '../contexts/OrderContext';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useOrder();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-primary-600 max-w-3xl mx-auto">
            Have questions, feedback, or need help? We're here to assist you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Phone Support</h3>
                  <p className="text-primary-600 mb-2">Call us for immediate assistance</p>
                  <p className="font-medium text-orange-600">+91 76966 65371</p>
                  <p className="text-sm text-primary-500">Available 12:00 PM - 10:00 PM</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Email Support</h3>
                  <p className="text-primary-600 mb-2">Send us your queries anytime</p>
                  <p className="font-medium text-blue-600">hello@theskfood.com</p>
                  <p className="text-sm text-primary-500">Response within 2 hours</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">WhatsApp</h3>
                  <p className="text-primary-600 mb-2">Quick chat support</p>
                  <p className="font-medium text-green-600">+91 76966 65371</p>
                  <p className="text-sm text-primary-500">Instant responses</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Visit Us</h3>
                  <p className="text-primary-600 mb-2">SKFood Central Kitchen</p>
                  <p className="text-sm text-primary-600">
                    Lawgate, Phagwara, Phagwara Tahsil <br />
                    Kapurthala, Punjab, India<br />
                    Phagwara - 144400
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Business Hours</h3>
                  <div className="space-y-1 text-sm text-primary-600">
                    <p><strong>Lunch:</strong> 12:00 PM - 3:00 PM</p>
                    <p><strong>Dinner:</strong> 7:00 PM - 10:00 PM</p>
                    <p><strong>Support:</strong> 10:00 AM - 11:00 PM</p>
                    <p className="text-green-600 font-medium">Open 7 days a week</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="+91 76966 65371"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="order-inquiry">Order Inquiry</option>
                      <option value="delivery-issue">Delivery Issue</option>
                      <option value="food-quality">Food Quality</option>
                      <option value="billing">Billing Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full md:w-auto"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* FAQ Section */}
            <Card className="p-8 mt-8">
              <h3 className="text-xl font-bold text-primary-900 mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">How long does delivery take?</h4>
                  <p className="text-primary-600 text-sm">
                    Our standard delivery time is 30-40 minutes from order confirmation. 
                    During peak hours, it might take up to 50 minutes.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">What are your delivery areas?</h4>
                  <p className="text-primary-600 text-sm">
                    We currently deliver in Lawgate, greenw within the university campus. 
                    We're expanding to more areas soon!
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Can I customize my thali?</h4>
                  <p className="text-primary-600 text-sm">
                    Yes! You can choose your sabjis, base (roti/rice), and add extras like 
                    special paneer or extra raita through our meal builder.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Do you offer refunds?</h4>
                  <p className="text-primary-600 text-sm">
                    If you're not satisfied with your order, contact us within 30 minutes of delivery. 
                    We'll either replace your meal or provide a full refund.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};